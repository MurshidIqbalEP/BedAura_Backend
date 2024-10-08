import { MAX_AGE } from "../domain/otp";
import Room from "../domain/room";
import UserUseCase from "../usecase/userUsecase";
import { NextFunction, Request, Response } from "express";

class UserController {
  private UserUseCase: UserUseCase;

  constructor(UserUseCase: UserUseCase) {
    this.UserUseCase = UserUseCase;
  }

  async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const verifyUser = await this.UserUseCase.checkExist(req.body.email);

      if (verifyUser.data.status === true) {
        const sendOtp = await this.UserUseCase.signup(
          req.body.name,
          req.body.email,
          req.body.number,
          req.body.password
        );

        return res.status(sendOtp.status).json(sendOtp.data);
      } else {
        return res.status(verifyUser.status).json(verifyUser.data);
      }
    } catch (error) {
      next(error); // Properly pass errors to the next function
    }
  }

  async logOut(req: Request, res: Response, next: NextFunction) {
    try {
      res.clearCookie("refreshtoken", {
        httpOnly: true,
        secure: false,
      });
      res.json({ message: "cookie cleared" });
    } catch (error) {
      next(error);
    }
  }

  async verify_otp(req: Request, res: Response, next: NextFunction) {
    try {
      const verfyOTP = await this.UserUseCase.verifyOTP(
        req.body.email,
        req.body.otp
      );

      console.log(verfyOTP.status);
      console.log(verfyOTP.message);
      return res.status(verfyOTP.status).json(verfyOTP.message);
    } catch (error) {
      next(error);
    }
  }

  async verify_ForgetOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const verfyOTP = await this.UserUseCase.verifyForgetOTP(
        req.body.email,
        req.body.otp
      );

      return res.status(verfyOTP.status).json(verfyOTP.message);
    } catch (error) {
      next(error);
    }
  }

  async resent_otp(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("in controller ");

      const resend = await this.UserUseCase.resend_otp(req.body.email);

      if (resend) {
        return res.status(resend.status).json({ message: "otp sentt" });
      }
    } catch (error) {
      console.log(error);

      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const user = await this.UserUseCase.login(email, password);
      const refreshToken = user.refreshToken;
      console.log("refresh token" + "-----" + refreshToken);
      console.log(user.data);

      res.cookie("hy", "testig");

      res.cookie("refreshtoken", refreshToken, {
        httpOnly: true,
        // maxAge: MAX_AGE, // 7 days
        secure: true,
        // secure: process.env.NODE_ENV !== "development",
        // sameSite:process.env.NODE_ENV !== "development" ? "none" : "strict",
      });

      return res.status(user.status).json(user.data);
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("refresh token ethi");
      console.log(req);
      const refreshToken = req.cookies.refreshtoken;
      console.log(req.cookies.refreshtoken);
      if (!refreshToken) {
        console.log("senindg 400");
        return res.sendStatus(400); // Unauthorized
      }
      const result = await this.UserUseCase.refreshTokenUseCase(refreshToken);
      console.log("new AccessToken----" + result.newAccessToken);

      return res
        .status(result.status)
        .json({ accessToken: result.newAccessToken });
    } catch (error) {
      next(error);
    }
  }

  async Gsignup(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password, isGoogle, image } = req.body;
      const userExist = await this.UserUseCase.checkExist(req.body.email);

      console.log(image);

      if (
        userExist.data.status === false &&
        userExist.data.user?.isGoogle === true
      ) {
        let token = await this.UserUseCase.generateTokenForG(
          userExist.data.user?._id.toString(),
          userExist.data.user.isAdmin
        );
        return res
          .status(200)
          .json({ data: userExist.data.user, token: token });
      } else {
        let user = await this.UserUseCase.Gsignup(
          name,
          email,
          password,
          isGoogle,
          image
        );

        return res.status(user.status).json(user.data);
      }
    } catch (error) {
      next(error);
    }
  }

  async forgetPass(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      let response = await this.UserUseCase.forgetPass(email);
      console.log(response.status, response.data);

      return res.status(response.status).json(response.data);
    } catch (error) {
      next(error);
    }
  }

  async changePass(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      let response = await this.UserUseCase.changePass(email, password);
      if (response) {
        return res.status(200).json({ message: "password changed" });
      }
    } catch (error) {
      next(error);
    }
  }

  async addRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        name,
        mobile,
        slots,
        maintenanceCharge,
        securityDeposit,
        gender,
        roomType,
        noticePeriod,
        location,
        description,
        userId,
      } = req.body;
      console.log(userId);

      const coordinates = JSON.parse(req.body.coordinates);
      const additionalOptions = JSON.parse(req.body.additionalOptions || "[]");

      const images = req.body.images;
      // If the images come in as a single item, ensure it's treated as an array
      const imagesArray = Array.isArray(images) ? images : [images];
      const roomData = {
        name,
        userId,
        slots,
        mobile,
        maintenanceCharge,
        securityDeposit,
        gender,
        roomType,
        noticePeriod,
        location,
        description,
        coordinates,
        additionalOptions,
        images: imagesArray,
      };

      let response = await this.UserUseCase.addNewRoom(roomData);

      if (response.status === 200) {
        return res.status(200).json({ message: "New Room Request Added" });
      } else {
        return res
          .status(response.status)
          .json({ message: "Something happened" });
      }
    } catch (error) {
      next(error);
    }
  }

  async editRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        roomId,
        name,
        mobile,
        slots,
        maintenanceCharge,
        securityDeposit,
        gender,
        roomType,
        noticePeriod,
        location,
        description,
        ExistingImg,
      } = req.body;

      // Parsing coordinates with error handling
      let coordinates;
      try {
        coordinates = JSON.parse(req.body.coordinates);
      } catch (parseError) {
        return res.status(400).json({ error: "Invalid coordinates format" });
      }
      const additionalOptions = JSON.parse(req.body.additionalOptions || "[]");
      const images = req.body.images; // Multer will handle this as an array automatically

      // If the images come in as a single item, ensure it's treated as an array
      const imagesArray = Array.isArray(images) ? images : [images];
      console.log(imagesArray);

      // Construct room data
      const roomData = {
        name,
        roomId,
        slots,
        mobile,
        maintenanceCharge,
        securityDeposit,
        gender,
        roomType,
        noticePeriod,
        location,
        description,
        coordinates,
        additionalOptions,
        images: imagesArray, // using combined images
      };

      let response = await this.UserUseCase.editRoom(roomData);

      res.status(response.status).json(response.message);
    } catch (error) {
      next(error); // Forward error to middleware
    }
  }

  async fetchRoomById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.query.id as string;
      console.log(id);

      if (id) {
        let response = await this.UserUseCase.fetchRoomById(id);
        if (response) {
          return res.status(response.status).json({ data: response.data });
        }
      } else {
        console.error("ID is undefined");
      }
    } catch (error) {
      next(error);
    }
  }

  async fetchRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.query.id as string;

      if (id) {
        let response = await this.UserUseCase.fetchRoom(id);
        if (response) {
          return res.status(response.status).json({ data: response.data });
        }
      } else {
        console.error("ID is undefined");
      }
    } catch (error) {
      next(error);
    }
  }

  async fetchAllRooms(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(
        typeof req.query.page === "string" ? req.query.page : "1",
        10
      );
      const limit = parseInt(
        typeof req.query.limit === "string" ? req.query.limit : "10",
        10
      );

      const search = req.query.search || "";
      const filters = req.query.filters
        ? JSON.parse(req.query.filters as string)
        : {};
      const sort = req.query.sort || "";

      const skip = (page - 1) * limit;

      let response = await this.UserUseCase.fetchAllRooms(
        page,
        limit,
        skip,
        search as string,
        filters,
        sort as string
      );
      return res.status(response?.status ?? 500).json(response?.data);
    } catch (error) {
      next(error);
    }
  }

  async editUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { _id, name, email, phone } = req.body;

      let response = await this.UserUseCase.editUser(_id, name, email, phone);
      return res.status(response.status).json(response.data);
    } catch (error) {
      next(error);
    }
  }

  async fetchNearestRooms(req: Request, res: Response, next: NextFunction) {
    try {
      const latitude = parseFloat(req.query.lat as string);
      const longitude = parseFloat(req.query.lon as string);

      const page = parseInt(
        typeof req.query.page === "string" ? req.query.page : "1",
        10
      );
      const limit = parseInt(
        typeof req.query.limit === "string" ? req.query.limit : "10",
        10
      );

      const skip = (page - 1) * limit;

      let response = await this.UserUseCase.fetchNearestRooms(
        latitude,
        longitude,
        page,
        limit,
        skip
      );

      return res.status(response.status).json(response.data);
    } catch (error) {
      next(error);
    }
  }

  async bookRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, roomId, userId, formData } = req.body;
      console.log(token, roomId, userId, formData);

      let response = await this.UserUseCase.bookRoom(
        token,
        roomId,
        userId,
        formData
      );
      return res.status(response?.status).json(response?.message);
    } catch (error) {
      next(error);
    }
  }

  async fetchBookings(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;

      let response = await this.UserUseCase.fetchBookings(userId);
      return res.status(response.status).json(response.data);
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { oldPassword, newPassword, email } = req.body;

      let response = await this.UserUseCase.changePassword(
        oldPassword,
        newPassword,
        email
      );
      return res.status(response.status).json({ message: response?.message });
    } catch (error) {
      next(error);
    }
  }

  async fetchWallet(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;

      let response = await this.UserUseCase.fetchWallet(userId);
      return res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  }

  async fetchReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const { roomId } = req.params;
      let response = await this.UserUseCase.fetchReviews(roomId);
      return res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  }

  async postReview(req: Request, res: Response, next: NextFunction) {
    try {
      const { roomId, userId, rating, review } = req.body;
      let response = await this.UserUseCase.postReview(
        roomId,
        userId,
        rating,
        review
      );
      return res.status(response.status).json(response.message);
    } catch (error) {
      next(error);
    }
  }

  async addMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { sender, reciever, message } = req.body;

      let response = await this.UserUseCase.addMessage(
        sender,
        reciever,
        message
      );
      return res.status(response.status).json(response.message);
    } catch (error) {
      next(error);
    }
  }

  async fetchMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const { sender, receiver } = req.query;
      let response = await this.UserUseCase.fetchMessages(
        sender as string,
        receiver as string
      );

      return res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  }

  async fetchContacts(req: Request, res: Response, next: NextFunction) {
    try {
      const { currentUserId } = req.query;
      console.log(currentUserId);

      let response = await this.UserUseCase.fetchContacts(
        currentUserId as string
      );

      return res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  }

  async fetchOwnerDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { ownerUserId } = req.query;

      let response = await this.UserUseCase.fetchOwnerDetails(
        ownerUserId as string
      );

      return res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  }

  async cancelBooking(req: Request, res: Response, next: NextFunction) {
    try {
      const { room } = req.body;
      let response = await this.UserUseCase.cancelBooking(room);
      return res.status(response.status).json(response.message);
    } catch (error) {
      next(error);
    }
  }

  async checkBookingValid(req: Request, res: Response, next: NextFunction) {
    try {
      const { roomId, checkIn, checkOut } = req.query;
      const checkInDate = new Date(checkIn as string);
      const checkOutDate = new Date(checkOut as string);

      let response = await this.UserUseCase.checkBookingDateValid(
        roomId as string,
        checkInDate,
        checkOutDate
      );

      return res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  }

  async walletRoomBooking(req: Request, res: Response, next: NextFunction) {
    try {
      const { roomId, userId, formData } = req.body;
      let response = await this.UserUseCase.walletRoomBooking(
        roomId,
        userId,
        formData
      );
      return res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  }

  async fetchUserPieChartData(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.query;
      let response = await this.UserUseCase.fetchUserPieChartData(
        userId as string
      );
      return res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  }

  async fetchUsersRoomBookings(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId } = req.query;
      let response = await this.UserUseCase.fetchUsersRoomBookings(
        userId as string
      );
      return res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
