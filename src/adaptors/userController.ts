import { log } from "console";
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
      
      console.log(verfyOTP.status)
      console.log(verfyOTP.message)
      return res.status(verfyOTP.status).json(verfyOTP.message);
    } catch (error) {
      next(error);
    }
  }

  async resent_otp(req:Request,res:Response,next:NextFunction){
    try {
      console.log("in controller ");
      
      const resend = await this.UserUseCase.resend_otp(req.body.email)
      
      if(resend){
        return res.status(resend.status).json({message:'otp sentt'})
      }
    } catch (error) {
      console.log(error);
      
      next(error);
    }
  }

  async login(req:Request,res:Response,next:NextFunction){
    try {
      const { email, password } = req.body;
      
      const user = await this.UserUseCase.login(email, password);
      console.log(user.status , user.data);
     
      

      return res.status(user.status).json(user.data);
    } catch (error) {
      next(error);
    }
  }

  async Gsignup(req:Request,res:Response,next:NextFunction){
    try {
      const {name,email,password,isGoogle} = req.body
      const userExist = await this.UserUseCase.checkExist(req.body.email);
       
      if(userExist.data.status === false && userExist.data.user?.isGoogle === true){
            let token = await this.UserUseCase.generateTokenForG(userExist.data.user?._id.toString(),userExist.data.user.isAdmin)
            return res.status(200).json({data:userExist.data.user,token:token})
        // return res.status(userExist.status).json(userExist.data);
      }else{
         let user =  await this.UserUseCase.Gsignup(
          name,
          email,
          password,
          isGoogle
        );
      
        console.log(user.data);
        console.log(user.status);
        
       return res.status(user.status).json(user.data)
      }
 

    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
