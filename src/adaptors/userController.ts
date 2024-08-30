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

      res.cookie("refreshtoken", refreshToken, {
        httpOnly: true,
        maxAge: MAX_AGE, // 7 days
        secure: false,
        // secure: process.env.NODE_ENV !== "development",
        sameSite:"none",
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
      console.log(req.cookies.refreshtoken);
      const refreshToken = req.cookies.refreshtoken;
      if (!refreshToken) {
        console.log("senindg 4000");
        return res.sendStatus(400); // Unauthorized
      }
      const result = await this.UserUseCase.refreshTokenUseCase(refreshToken);
      return res
        .status(result.status)
        .json({ accessToken: result.newAccessToken });
    } catch (error) {
      next(error);
    }
  }

  async Gsignup(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password, isGoogle,image } = req.body;
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

      const coordinates = JSON.parse(req.body.coordinates);

      if (Array.isArray(req.files)) {
        const images: string[] = req.files.map((file) => file.filename);

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
          images,
        };

        let response = await this.UserUseCase.addNewRoom(roomData);
        
        if (response.status == 200) {
          return res
            .status(response.status)
            .json({ message: "New Room Request Added" });
        } else {
          return res
            .status(response.status)
            .json({ message: "something happened" });
        }
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

      // Handling file uploads and existing images
      let images: string[] = [];
      if (Array.isArray(req.files)) {
        images = req.files.map((file) => file.filename);
      }

      // Combining new and existing images
      const allImages = [
        ...images,
        ...(Array.isArray(ExistingImg) ? ExistingImg : []),
      ];

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
        images: allImages, // using combined images
      };

      let response = await this.UserUseCase.editRoom(roomData);

      res.status(response.status).json(response.message);
    } catch (error) {
      next(error); // Forward error to middleware
    }
  }

  async fetchRoomById(req: Request, res: Response, next: NextFunction) {
    try {
     console.log(req.cookies);
     

      const id = req.query.id as string;

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

      const skip = (page - 1) * limit;

      let response = await this.UserUseCase.fetchAllRooms(page, limit, skip);
      return res.status(response?.status ?? 500).json(response?.data);
    } catch (error) {
      next(error);
    }
  }

  async editUser(req: Request, res: Response, next: NextFunction){
    try {
      const { _id, name, email, phone } = req.body;
      console.log(phone);
      
      let response = await this.UserUseCase.editUser(_id, name, email, phone);
      return res.status(response.status).json(response.data);
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
