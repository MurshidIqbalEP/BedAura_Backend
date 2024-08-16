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

      // if (verifyUser.data.status === true && req.body.isGoogle) {
      //     const user = await this.UserUseCase.verifyOtpUser(req.body);
      //     return res.status(user.status).json(user);
      // }

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

      return res.status(verfyOTP.status).json(verfyOTP.message);
    } catch (error) {
      next(error);
    }
  }

  async resent_otp(req:Request,res:Response,next:NextFunction){
    try {
      console.log("in controller ");
      
      const resend = await this.UserUseCase.resend_otp(req.body.email)
      console.log(resend);
      
      if(resend){
        return res.status(resend.status).json({message:'otp sentt'})
      }
    } catch (error) {
      console.log(error);
      
      next(error);
    }
  }
}

export default UserController;
