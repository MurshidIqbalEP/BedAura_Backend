import UserRepo from "../infrastructure/repository/userRepo";
import GenerateOtp from "../infrastructure/services/generateOtp";
import EncriptPassword from "../infrastructure/services/encriptPassword";
import GenerateEmail from "../infrastructure/services/generateEmail";
import JwtToken from "../infrastructure/services/generateToken";
import Room, { IRoom } from "../domain/room";
import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";
import WalletModel from "../infrastructure/database/walletModel";
import IWallet from "../domain/wallet";
import BookingWithRoom from "../domain/bookingWithRoom";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

class UserUseCase {
  private UserRepo: UserRepo;
  private GenerateOtp: GenerateOtp;
  private EncriptPassword: EncriptPassword;
  private GenerateEmail: GenerateEmail;
  private JwtToken: JwtToken;

  constructor(
    UserRepo: UserRepo,
    GenerateOtp: GenerateOtp,
    EncriptPassword: EncriptPassword,
    GenerateEmail: GenerateEmail,
    JwtToken: JwtToken
  ) {
    this.UserRepo = UserRepo;
    this.GenerateOtp = GenerateOtp;
    this.EncriptPassword = EncriptPassword;
    this.GenerateEmail = GenerateEmail;
    this.JwtToken = JwtToken;
  }

  async checkExist(email: string) {
    const userExist = await this.UserRepo.findByEmail(email);
    if (userExist) {
      return {
        status: 400,
        data: {
          status: false,
          message: "User already exists",
          user: userExist,
        },
      };
    } else {
      return {
        status: 200,
        data: {
          status: true,
          message: "User does not exist",
        },
      };
    }
  }

  async signup(name: string, email: string, number: string, password: string) {
    let otp = await this.GenerateOtp.createOtp();
    const hashedPassword = await this.EncriptPassword.encryptPassword(password);

    await this.UserRepo.saveOtp(email, otp, name, number, hashedPassword);

    console.log(otp);

    await this.GenerateEmail.sendMail(email, otp);

    return {
      status: 200,
      data: {
        status: true,
        message: "Verification otp sent to your email",
      },
    };
  }

  async Gsignup(
    name: string,
    email: string,
    password: string,
    isGoogle: boolean,
    image: string
  ) {
    const hashedPassword = await this.EncriptPassword.encryptPassword(password);

    let newUser = await this.UserRepo.Gsignup(
      name,
      email,
      hashedPassword,
      isGoogle,
      image
    );
    const token = this.JwtToken.generateToken(newUser._id.toString(), "user");
    return { status: 200, data: { user: newUser, token: token } };
  }

  async generateTokenForG(id: string, admin: boolean) {
    let a;
    if (admin) {
      a = "admin";
    } else {
      a = "user";
    }
    const token = this.JwtToken.generateToken(id, a);

    return token;
  }

  async verifyOTP(email: string, otp: string): Promise<any> {
    const otpRecord = await this.UserRepo.findOtpByEmail(email);

    if (!otpRecord) {
      return { status: 400, message: "Invalid or expired OTP" };
    }

    if (otpRecord.otp !== parseInt(otp)) {
      return { status: 400, message: "Invalid OTP" };
    }

    await this.UserRepo.deleteOtpByEmail(email);
    const data = await this.UserRepo.verifyUser(email);
    console.log("User Verified:", data);

    return { status: 200, message: "OTP verified successfully", data };
  }

  async verifyForgetOTP(email: string, otp: string): Promise<any> {
    const otpRecord = await this.UserRepo.findOtpByEmail(email);

    if (!otpRecord) {
      return { status: 400, message: "Invalid or expired OTP" };
    }

    if (otpRecord.otp !== parseInt(otp)) {
      return { status: 400, message: "Invalid OTP" };
    }

    await this.UserRepo.deleteOtpByEmail(email);

    return { status: 200, message: "ForgetOTP verified successfully" };
  }

  async resend_otp(email: string): Promise<any> {
    let otp = await this.GenerateOtp.createOtp();
    await this.UserRepo.updateOtp(email, otp);
    this.GenerateEmail.sendMail(email, otp);

    return {
      status: 200,
      data: {
        status: true,
        message: "Resend otp sent to your email",
      },
    };
  }

  async login(email: string, password: string) {
    const user = await this.UserRepo.findUser(email);

    let token = "";

    if (user) {
      let data = {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.number,
        isBlocked: user.isBlocked,
        isAdmin: user.isAdmin,
      };

      if (user.isBlocked) {
        return {
          status: 400,
          data: {
            status: false,
            message: "You have been blocked by admin!",
            token: "",
          },
        };
      }

      const passwordMatch = await this.EncriptPassword.compare(
        password,
        user.password
      );

      if (passwordMatch && user.isAdmin) {
        token = this.JwtToken.generateToken(user._id.toString(), "admin");
        const refreshToken = this.JwtToken.generateRefreshToken(
          user._id.toString(),
          "admin"
        );
        return {
          status: 200,
          refreshToken,
          data: {
            status: true,
            message: data,
            token,
            isAdmin: true,
          },
        };
      }

      if (passwordMatch) {
        token = this.JwtToken.generateToken(user._id.toString(), "user");
        const refreshToken = this.JwtToken.generateRefreshToken(
          user._id.toString(),
          "user"
        );
        return {
          status: 200,
          refreshToken,
          data: {
            status: true,
            message: data,
            token,
          },
        };
      } else {
        return {
          status: 400,
          data: {
            status: false,
            message: "Invalid email or password",
            token: "",
          },
        };
      }
    } else {
      return {
        status: 400,
        data: {
          status: false,
          message: "Invalid email or password",
          token: "",
        },
      };
    }
  }

  async refreshTokenUseCase(refreshToken: string) {
    const { valid, user } = await this.JwtToken.verifyRefreshToken(
      refreshToken
    );

    if (valid) {
      let role = user.isAdmin == true ? "admin" : "user";
      const newAccessToken = this.JwtToken.generateToken(user.userId, role);
      return { status: 200, newAccessToken };
    } else {
      return { status: 401, message: "Invalid refresh token" };
    }
  }

  async forgetPass(email: string) {
    let exist = await this.UserRepo.findByEmail(email);
    if (exist) {
      let otp = await this.GenerateOtp.createOtp();

      let otpSave = await this.UserRepo.saveOtpForforgetPass(email, otp);
      let sendEmail = await this.GenerateEmail.sendMail(email, otp);

      if (otpSave) {
        return {
          status: 200,
          data: {
            message: "OTP sented",
            email: otpSave.email,
          },
        };
      } else {
        return {
          status: 400,
          data: {
            message: "OTP send failed",
          },
        };
      }
    } else {
      return {
        status: 400,
        data: {
          message: "Wrong Email",
        },
      };
    }
  }

  async changePass(email: string, password: string) {
    const hashedPassword = await this.EncriptPassword.encryptPassword(password);
    let changed = await this.UserRepo.changePass(email, hashedPassword);
    return true;
  }

  async addNewRoom(roomData: IRoom) {
    let newRoom = await this.UserRepo.addRoom(roomData);
    if (newRoom) {
      return {
        status: 200,
        message: "New Room Request added",
      };
    } else {
      return {
        status: 400,
        message: "some thing happened",
      };
    }
  }

  async editRoom(roomData: any) {
    let edited = await this.UserRepo.editRoom(roomData);
    if (edited) {
      return {
        status: 200,
        message: "Room Edited",
      };
    } else {
      return {
        status: 400,
        message: "some thing happened",
      };
    }
  }

  async fetchRoomById(id: string) {
    let rooms = await this.UserRepo.fetchAllRoomsById(id);
    if (rooms) {
      return {
        status: 200,
        data: rooms,
      };
    } else {
      return {
        status: 400,
        message: " no rooms found",
      };
    }
  }

  async fetchRoom(id: string) {
    let room = await this.UserRepo.fetchRoom(id);
    if (room) {
      return {
        status: 200,
        data: room,
      };
    } else {
      return {
        status: 400,
        message: " no room found",
      };
    }
  }

  async fetchAllRooms(
    page: number,
    limit: number,
    skip: number,
    search: string,
    filters: any,
    sort: string
  ) {
    const query: any = {
      isListed: true,
      isEdited: false,
      isApproved: true,
    };

    // Search functionality
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // Filter functionality
    if (filters.roomType && filters.roomType.length > 0) {
      query.roomType = { $in: filters.roomType };
    }

    // Fetch rooms with search, filter, pagination, and sorting
    try {
      let rooms = await this.UserRepo.fetchAllRooms(
        query,
        page,
        limit,
        skip,
        sort
      );
      let total = await this.UserRepo.totalRooms(query);

      const totalRooms = total ?? 0;

      return {
        status: 200,
        data: {
          message: "Rooms fetched successfully",
          rooms,
          total: totalRooms,
          page,
          totalPages: Math.ceil(totalRooms / limit),
        },
      };
    } catch (error) {
      console.error(error);
      return { status: 500, data: { message: "Error fetching rooms" } };
    }
  }

  async editUser(_id: string, name: string, email: string, phone: string) {
    let editedUser = await this.UserRepo.editUser(_id, name, email, phone);
    if (editedUser) {
      return {
        status: 200,
        data: editedUser,
      };
    } else {
      return {
        status: 400,
        message: "failed to update User",
      };
    }
  }

  async fetchNearestRooms(
    latitude: number,
    longitude: number,
    page: number,
    limit: number,
    skip: number
  ) {
    let rooms = await this.UserRepo.fetchNearestRooms(
      latitude,
      longitude,
      page,
      limit,
      skip
    );
    let total = await this.UserRepo.totalNearRooms(latitude, longitude);
    const totalRooms = total ?? 0;
    if (rooms) {
      return {
        status: 200,
        data: {
          rooms,
          total,
          page,
          totalPages: Math.ceil(totalRooms / limit),
        },
      };
    } else {
      return {
        status: 400,
        message: "failed to fetchnearest rooms",
      };
    }
  }

  async bookRoom(
    token: any,
    roomId: string,
    userId: string,
    formData: { numberOfSlots: number; checkInDate: Date; checkOutDate: Date }
  ): Promise<{ status: number; message: string }> {
    try {
      // Fetch room details
      const room = await this.UserRepo.fetchRoom(roomId);
      if (!room) {
        return { status: 404, message: "Room not found" };
      }

      const customer = await stripe.customers.create({
        email: token.email,
        source: token.id,
      });

      const securityDeposit = room?.securityDeposit
        ? parseInt(room.securityDeposit, 10)
        : 0;
      const total = securityDeposit;

      const idempotencyKey = uuidv4();
      const payment = await stripe.charges.create(
        {
          amount: total * 100,
          customer: customer.id,
          currency: "inr",
          receipt_email: token.email,
        },
        {
          idempotencyKey: idempotencyKey,
        }
      );

      let amount = total;
      if (payment) {
        const booked = await this.UserRepo.roomBooking(
          userId,
          roomId,
          amount,
          payment.id,
          room?.name as string,
          formData.checkInDate,
          formData.checkOutDate
        );

        await this.UserRepo.addBookingMoneyWallet(
          room.userId as string,
          amount,
          room.name
        );

        if (booked) {
          return {
            status: 200,
            message: "Room booked",
          };
        } else {
          return {
            status: 400,
            message: "Failed to book room",
          };
        }
      } else {
        return {
          status: 500,
          message: "Payment failed",
        };
      }
    } catch (error) {
      console.error(error);
      return {
        status: 500,
        message: "An error occurred while processing your request",
      };
    }
  }

  async fetchBookings(userId: string) {
    let bookings = await this.UserRepo.fetchBookings(userId);
    if (bookings) {
      return {
        status: 200,
        data: bookings,
      };
    } else {
      return {
        status: 400,
      };
    }
  }

  async changePassword(
    oldPassword: string,
    newPassword: string,
    email: string
  ) {
    console.log("in usecase");

    const user = await this.UserRepo.findUser(email);

    if (!user) {
      return {
        status: 400,
        message: "User not found",
      };
    }

    const passwordMatch = await this.EncriptPassword.compare(
      oldPassword,
      user.password
    );

    if (!passwordMatch) {
      return {
        status: 400,
        message: "Old password is incorrect",
      };
    }

    const hashedPassword = await this.EncriptPassword.encryptPassword(
      newPassword
    );

    const passwordUpdated = await this.UserRepo.changePass(
      email,
      hashedPassword
    );

    if (passwordUpdated) {
      return {
        status: 200,
        message: "Password change successful",
      };
    } else {
      return {
        status: 500,
        message: "Password update failed",
      };
    }
  }

  async fetchWallet(userId: string) {
    const wallet = await this.UserRepo.fetchWallet(userId);

    if (wallet) {
      return {
        status: 200,
        data: wallet,
      };
    } else {
      const newWallet = await this.UserRepo.createWallet(userId);
      console.log(newWallet);

      return {
        status: 200,
        data: newWallet,
      };
    }
  }

  async fetchReviews(roomId: string) {
    const reviews = await this.UserRepo.fetchReviews(roomId);
    if (reviews) {
      return {
        status: 200,
        reviews,
      };
    } else {
      return {
        status: 400,
        message: "failed to fetch reviews",
      };
    }
  }

  async postReview(
    roomId: string,
    userId: string,
    rating: number,
    review: string
  ) {
    const posted = await this.UserRepo.postReview(
      roomId,
      userId,
      rating,
      review
    );
    if (posted) {
      return {
        status: 200,
        message: "review posted",
      };
    } else {
      return {
        status: 400,
        message: "failed to post review",
      };
    }
  }

  async addMessage(sender: string, reciever: string, message: string) {
    const added = await this.UserRepo.addMessage(sender, reciever, message);
    const setConversation = await this.UserRepo.setConversation(
      sender,
      reciever,
      message
    );
    if (added && setConversation) {
      return {
        status: 200,
        message: "msg added",
      };
    } else {
      return {
        status: 400,
        message: "failed to add message",
      };
    }
  }

  async fetchMessages(sender: string, reciever: string) {
    const messages = await this.UserRepo.fetchMessages(sender, reciever);
    if (messages) {
      return {
        status: 200,
        data: messages,
      };
    } else {
      return {
        status: 400,
        message: "failed to fetch message",
      };
    }
  }

  async fetchContacts(currentUserId: string) {
    const messages = await this.UserRepo.fetchContacts(currentUserId);
    console.log(messages);

    if (messages) {
      return {
        status: 200,
        data: messages,
      };
    } else {
      return {
        status: 400,
        message: "failed to fetch message",
      };
    }
  }

  async fetchOwnerDetails(ownerUserId: string) {
    const owner = await this.UserRepo.fetchOwnerDetails(ownerUserId);
    if (owner) {
      return {
        status: 200,
        owner,
      };
    } else {
      return {
        status: 400,
        message: "failed to fetch owner",
      };
    }
  }

  async checkBookingDateValid(roomId: string, checkIn: Date, checkOut: Date) {
    const validBookingDate = await this.UserRepo.checkBookingDateValid(
      roomId,
      checkIn,
      checkOut
    );
    if (validBookingDate === false) {
      return {
        status: 200,
        result: true,
        message: "Valid booking Date",
      };
    } else {
      return {
        status: 200,
        result: false,
        message: "InValid booking Date",
      };
    }
  }

  async cancelBooking(room: any) {
    const booking = await this.UserRepo.fetchBooking(room._id);

    if (!booking) {
      return {
        status: 400,
        message: `Cannot cancel the booking. booking is not existing`,
      };
    }

    const noticePeriodDays = parseInt(
      room.roomId.noticePeriod.split(" ")[0],
      10
    );
    const bookingDate = new Date(room.createdAt);
    const currentDate = new Date();

    // Calculate the last cancellation date (bookingDate + noticePeriod)
    const lastCancellationDate = new Date(bookingDate);
    lastCancellationDate.setDate(
      lastCancellationDate.getDate() + noticePeriodDays
    );
    if (currentDate > lastCancellationDate) {
      return {
        status: 400,
        message: `Cannot cancel the booking. The notice period of ${noticePeriodDays} days has expired.`,
      };
    }

    // if (room.paymentId) {
    //   await stripe.refunds.create({
    //     payment_intent: room.paymentId,
    //   });
    // }

    const refundAmount = room.amount;

    //Update the wallet of the room owner and user
    await this.UserRepo.decreaseWallet(
      room.roomId.userId,
      refundAmount,
      booking.roomName
    );
    await this.UserRepo.addMoneyWallet(
      room.userId,
      refundAmount,
      booking.roomName
    );

    await this.UserRepo.RemoveBooking(booking._id as string);

    return {
      status: 200,
      message: "booking canceled, check your Wallet",
    };
  }

  async walletRoomBooking(roomId: string, userId: string, formData: any) {
    const room = await this.UserRepo.fetchRoom(roomId);
    const wallet = await this.UserRepo.fetchWallet(userId);

    if (wallet!.balance < parseInt(room!.securityDeposit)) {
      return {
        status: 400,
        message: "insufficient wallet amount",
      };
    } else {
      const booked = await this.UserRepo.roomBooking(
        userId,
        roomId,
        parseInt(room!.securityDeposit),
        wallet!._id.toString(),
        room?.name as string,
        formData.checkInDate,
        formData.checkOutDate
      );
      if (booked) {
        await this.UserRepo.addBookingMoneyWallet(
          room!.userId as string,
          parseInt(room!.securityDeposit),
          room!.name
        );
        await this.UserRepo.decreaseBookingWallet(
          userId,
          parseInt(room!.securityDeposit),
          room!.name
        );

        return {
          status: 200,
          message: "room booking using wallet success",
        };
      } else {
        return {
          status: 400,
          message: "room booking using wallet failed",
        };
      }
    }
  }

  async fetchUserPieChartData(userId:string){
      let data = await this.UserRepo.fetchUserPieChartData(userId)
      if(data){
        return {
          status:200,
          data:data
        }
      }else{
        return {
          status:400,
          message:"failed to fetch data"
        }
      }
  }

  async fetchUsersRoomBookings(userId:string){
    let data = await this.UserRepo.fetchUsersRoomBookings(userId)
    if(data){
      return {
        status:200,
        data:data
      }
    }else{
      return {
        status:400,
        message:"failed to fetch data"
      }
    }
}
}

export default UserUseCase;
