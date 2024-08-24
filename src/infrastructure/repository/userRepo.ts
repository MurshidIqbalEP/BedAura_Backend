import UserModel from "../database/userModel";
import otpModel from "../database/otpModel";
import RoomModel from "../database/roomModel";
import Room, { IRoom } from "../../domain/room";

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
    isGoogle: boolean
  ): Promise<any> {
    const GUser = new UserModel({
      name: name,
      email: email,
      password: password,
      isGoogle: isGoogle,
      isVerified: true,
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
      console.log("in repo");
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
        coordinates: {
          type: "Point",
          coordinates: [roomData.coordinates.lat, roomData.coordinates.lng],
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
          securityDeposit:roomData.securityDeposit,
          gender:roomData.gender,
          roomType:roomData.roomType,
          noticePeriod:roomData.noticePeriod,
          location:roomData.location,
          description:roomData.description,
          coordinates: {
            type: "Point",
            coordinates: [roomData.coordinates.lat, roomData.coordinates.lng],
          },
          images:roomData.images
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

  async fetchRoom(id: string) {
    try {
      let rooms = RoomModel.findById(id);
      return rooms;
    } catch (error) {
      console.log(error);
    }
  }
}

export default UserRepo;
