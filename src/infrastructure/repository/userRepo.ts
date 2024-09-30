import UserModel from "../database/userModel";
import otpModel from "../database/otpModel";
import RoomModel from "../database/roomModel";
import BookingModel from "../database/bookingModel";
import Room, { IRoom } from "../../domain/room";
import walletModel from "../database/walletModel";
import WalletModel from "../database/walletModel";
import ReviewModel from "../database/reviewModel";
import MessageModel from "../database/messageModel";
import ConversationModel from "../database/conversationModal";

class UserRepo {
  constructor() {}

  async findByEmail(email: string) {
    let user = await UserModel.findOne({ email: email });
    return user;
  }

  async saveOtp(
    email: string,
    otp: number,
    name?: string,
    number?: string,
    password?: string
  ): Promise<any> {
    const otpDoc = new otpModel({
      name: name,
      email: email,
      number: number,
      password: password,
      otp: otp,
      otpGeneratedAt: new Date(),
      expiresAt: new Date(Date.now() + 2 * 60 * 1000),
    });

    const savedDoc = await otpDoc.save();

    const userDoc = new UserModel({
      name: name,
      email: email,
      number: number,
      password: password,
    });

    const userSave = await userDoc.save();

    return savedDoc;
  }

  async saveOtpForforgetPass(
    email: string,
    otp: number,
    name?: string,
    number?: string,
    password?: string
  ): Promise<any> {
    const otpDoc = new otpModel({
      email: email,
      otp: otp,
      otpGeneratedAt: new Date(),
      expiresAt: new Date(Date.now() + 2 * 60 * 1000),
    });

    const savedDoc = await otpDoc.save();

    return savedDoc;
  }

  async Gsignup(
    name: string,
    email: string,
    password: string,
    isGoogle: boolean,
    image: string
  ): Promise<any> {
    const GUser = new UserModel({
      name: name,
      email: email,
      password: password,
      isGoogle: isGoogle,
      isVerified: true,
      image: image,
    });

    const newGUser = await GUser.save();
    return newGUser;
  }

  async findOtpByEmail(email: string): Promise<any> {
    return otpModel.findOne({ email }).sort({ otpGeneratedAt: -1 });
  }

  async deleteOtpByEmail(email: string): Promise<any> {
    return otpModel.deleteOne({ email });
  }

  async verifyUser(email: string): Promise<any> {
    try {
      const updatedUser = await UserModel.findOneAndUpdate(
        { email: email },
        { $set: { isVerified: true } },
        { new: true }
      );

      if (!updatedUser) {
        throw new Error("User not found");
      }
      console.log(updatedUser);

      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  async updateOtp(email: string, otp: number) {
    try {
      const updateOtp = await otpModel.findOneAndUpdate(
        { email: email },
        { $set: { otp: otp, otpGeneratedAt: new Date() } },
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  }

  async findUser(email: string) {
    try {
      let user = await UserModel.findOne({ email: email });
      return user;
    } catch (error) {
      console.log(error);
    }
  }

  async changePass(email: string, password: string) {
    try {
      let user = await UserModel.updateOne(
        { email },
        { password: password }
      ).exec();
      return user;
    } catch (error) {
      console.log(error);
    }
  }

  async addRoom(roomData: IRoom) {
    
    try {
      const Room = new RoomModel({
        name: roomData.name,
        userId: roomData.userId,
        mobile: roomData.mobile,
        slots: roomData.slots,
        maintenanceCharge: roomData.maintenanceCharge,
        securityDeposit: roomData.securityDeposit,
        gender: roomData.gender,
        roomType: roomData.roomType,
        noticePeriod: roomData.noticePeriod,
        location: roomData.location,
        description: roomData.description,
        additionalOptions:roomData.additionalOptions,
        coordinates: {
          type: "Point",
          coordinates: [roomData.coordinates.lng, roomData.coordinates.lat],
        },
        images: roomData.images,
      });
      let newRoom = await Room.save();
      if (newRoom) {
        return newRoom;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async editRoom(roomData: any) {
    try {
      const edited = await RoomModel.findByIdAndUpdate(roomData.roomId, {
        $set: {
          name: roomData.name,
          slots: roomData.slots,
          mobile: roomData.mobile,
          maintenanceCharge: roomData.maintenanceCharge,
          securityDeposit: roomData.securityDeposit,
          gender: roomData.gender,
          roomType: roomData.roomType,
          noticePeriod: roomData.noticePeriod,
          location: roomData.location,
          description: roomData.description,
          additionalOptions:roomData.additionalOptions,
          coordinates: {
            type: "Point",
            coordinates: [roomData.coordinates.lng, roomData.coordinates.lat],
          },
          images: roomData.images,
          isAproved: false,
          isEdited: true,
        },
      });

      return edited;
    } catch (error) {
      console.log(error);
    }
  }

  async fetchAllRoomsById(id: string) {
    try {
      let rooms = RoomModel.find({ userId: id });
      return rooms;
    } catch (error) {
      console.log(error);
    }
  }

  async fetchAllRooms(page: number, limit: number, skip: number) {
    try {
      let rooms = RoomModel.find({ isListed: true, isEdited: false,isApproved:true })
        .skip(skip)
        .limit(limit);
      return rooms;
    } catch (error) {
      console.log(error);
    }
  }

  async totalRooms() {
    try {
      const total = await RoomModel.countDocuments({
        isListed: true,
        isEdited: false,
        isApproved:true 
      });
      return total;
    } catch (error) {
      console.log(error);
    }
  }

  async fetchRoom(id: string) {
    try {
      let rooms = RoomModel.findById(id);
      return rooms;
    } catch (error) {
      console.log(error);
    }
  }

  async editUser(_id: string, name: string, email: string, phone: string) {
    try {
      let edited = await UserModel.findByIdAndUpdate(
        _id,
        { name, email, number: phone },
        { new: true }
      );
      return edited;
    } catch (error) {
      console.log(error);
    }
  }

  async fetchNearestRooms(
    latitude: number,
    longitude: number,
    page: number,
    limit: number,
    skip: number
  ) {
    try {
      let rooms = await RoomModel.aggregate([
        {
          $geoNear: {
            near: { type: "Point", coordinates: [longitude, latitude] },
            distanceField: "distance",
            spherical: true,
            maxDistance: 5000000,
          },
        },
        {
          $match: {
            isListed: true,
            isEdited: false,
          },
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
      ]);

      return rooms;
    } catch (error) {
      console.log(error);
    }
  }

  async totalNearRooms(latitude: number, longitude: number) {
    try {
      let roomCount = await RoomModel.aggregate([
        {
          $geoNear: {
            near: { type: "Point", coordinates: [longitude, latitude] },
            distanceField: "distance",
            spherical: true,
            maxDistance: 5000000,
          },
        },
        {
          $match: {
            isListed: true,
            isEdited: false,
          },
        },
        {
          $count: "roomCount",
        },
      ]);
      let count = roomCount.length > 0 ? roomCount[0].roomCount : 0;
      return count;
    } catch (error) {
      console.log(error);
    }
  }

  async roomBooking(
    userId: string,
    roomId: string,
    amount: number,
    paymentId: string,
    roomName: string,
    checkInDate:Date,
    checkOutDate:Date
  ) {
    try {
      const newBooking = new BookingModel({
        userId: userId,
        roomName: roomName,
        roomId: roomId,
        amount,
        checkIn:checkInDate,
        checkOut:checkOutDate,
        paymentId: paymentId,
      });
      const booked = await newBooking.save();

      return booked;
    } catch (error) {
      console.log(error);
    }
  }

  async fetchBookings(userId: string) {
    try {
      const bookings = await BookingModel.find({ userId: userId })
        .populate("roomId")
        .exec();

      return bookings;
    } catch (error) {
      console.log(error);
    }
  }

  async fetchBooking(bookingId: string) {
    try {
      const booking = await BookingModel.findById(bookingId)
        .populate("roomId")
        .exec()

      return booking;
    } catch (error) {
      console.log(error);
    }
  }

  async fetchWallet(userId: string) {
    try {
      const wallet = await walletModel.findOne({ userId: userId }).lean().exec();
      if (wallet && wallet.transactions) {
        wallet.transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      }
      return wallet;
    } catch (error) {
      console.log(error);
    }
  }

  async createWallet(userId: string) {
    try {
      const newWallet = new WalletModel({
        userId,
        balance: 0,
        transactions: [],
      });
      await newWallet.save();
      return newWallet;
    } catch (error) {
      console.log(error);
    }
  }

  async decreaseWallet(userId:string,refundAmount:number,roomName:string){
    try {
      const wallet = await WalletModel.findOne({ userId: userId });
     if (wallet) {
       wallet.balance -= refundAmount; // Deduct the refunded amount
       wallet.transactions.push({
         amount: refundAmount,
         description: `Refund for booking cancellation: ${roomName}`,
         transactionType: "debit",
         date: new Date(),
       });
       await wallet.save();
     }
    } catch (error) {
      console.log(error);
    }
  }

  async addMoneyWallet(userId:string,refundAmount:number,roomName:string){
    try {
      const wallet = await WalletModel.findOne({ userId: userId });
     if (wallet) {
       wallet.balance += refundAmount; // add the refunded amount
       wallet.transactions.push({
         amount: refundAmount,
         description: `Refund for booking cancellation: ${roomName}`,
         transactionType: "credit",
         date: new Date(),
       });
       await wallet.save();
     }
    } catch (error) {
      console.log(error);
    }
  }

  async RemoveBooking(bookingId:string){
    try {
      const deleted = await BookingModel.findByIdAndDelete(bookingId);
      return deleted ?true : false;
    } catch (error) {
      console.log(error);
    }
  }

  async postReview(roomId:string,userId:string,rating:number,review:string){
    try {
      const newReview = new ReviewModel({
        userId,
        roomId,
        rating,
        review
      })
      await newReview.save()
      return newReview
    } catch (error) {
      console.log(error);
    }
  }

  async fetchReviews(roomId:string){
    try {
      const reviews = await ReviewModel.find({ roomId: roomId }).populate("userId")
      .exec();

      return reviews;
    } catch (error) {
      console.log(error);
    }
  }

  async addMessage(sender:string,reciever:string,message:string){
    try {
      
       const newMessage = new MessageModel({
        senderId:sender,
        users:[sender,reciever],
        message:message
       })
       await newMessage.save()
       return newMessage;
    } catch (error) {
      console.log(error);
    }
  }

  async setConversation(sender: string, receiver: string, message: string) {
    try {
      const exist = await ConversationModel.findOne({
        $or: [
          { senderId: sender, receiverId: receiver }, 
          { senderId: receiver, receiverId: sender }
        ]
      });
      if (exist) {
        exist.message = message;
        await exist.save();
      } else {
        const newConversation = new ConversationModel({
          senderId: sender,
          receiverId: receiver,
          message: message
        });
        await newConversation.save();
      }
      return true
    } catch (error) {
      console.error('Error in setConversation:', error);
    }
  }
  

  async fetchMessages(sender:string,reciever:string){
    try {
      const msgs = await MessageModel.find({
        users:{
          $all:[sender,reciever]
        }
      }).sort({updatedAt:1})

      const projectedMessages = msgs.map((msg)=>{
        return {
          fromSelf: msg.senderId.toString() === sender,
          message: msg.message,
          timestamp: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        }
      });

      return projectedMessages
    } catch (error) {
      console.log(error);
      
    }
  }

  async fetchContacts (currentUserId:string){
    try {
      
      const conversations = await ConversationModel.find({
        $or: [{ senderId: currentUserId }, { receiverId: currentUserId }]
      }).populate('senderId receiverId');

      console.log(conversations);
      
      
      if (!conversations || conversations.length === 0) {
        return []; 
      }
      
      const otherPersonsData = conversations.map((conversation) => {
        // Check if currentUserId is the sender, if so, return the receiver's data
        if (conversation.senderId._id.toString() === currentUserId) {
          return {
            id: conversation.receiverId._id,
            name: conversation.receiverId.name,
            image: conversation.receiverId.image,
            message: conversation.message,
            updatedAt: conversation.updatedAt, 
          };
        } else {
          // If currentUserId is the receiver, return the sender's data
          return {
            id: conversation.senderId._id,
            name: conversation.senderId.name,
            image: conversation.senderId.image,
            message: conversation.message, 
            updatedAt: conversation.updatedAt, 
          };
        }
      });
       
      
       return otherPersonsData;
      
    } catch (error) {
      console.log(error);
    }
  }

  async fetchOwnerDetails (ownerUserId:string){
    const owner = await UserModel.findById(ownerUserId,{name:1,image:1})
    return owner
  }

  async checkBookingDateValid(roomId:string,checkInISO:Date,checkOutISO:Date){
     const bookings = await BookingModel.find({
      roomId: roomId,
      $or: [
        { checkIn: { $lt: checkOutISO, $gte: checkInISO } }, // Condition 1
        { checkOut: { $gt: checkInISO, $lte: checkOutISO } }, // Condition 2
        { $and: [ // Condition 3
            { checkIn: { $lte: checkInISO } },
            { checkOut: { $gte: checkOutISO } }
          ]
        }
      ]
     })

     return bookings.length > 0;
     
  }
}

export default UserRepo;
