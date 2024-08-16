import express, { Request, Response, NextFunction } from "express";
import UserController from "../../adaptors/userController";
import UserUseCase from "../../usecase/userUsecase";
import UserRepo from "../repository/userRepo";
import GenerateOtp from "../services/generateOtp";
import EncryptPassword from "../services/encriptPassword";
import GenerateEmail from "../services/generateEmail";

let generateOtp = new GenerateOtp();
let encryptPassword = new EncryptPassword();
let generateEmail = new GenerateEmail();

let userRepo = new UserRepo();
let userUseCase = new UserUseCase(
  userRepo,
  generateOtp,
  encryptPassword,
  generateEmail
);
let userController = new UserController(userUseCase);

export const userRoute = express.Router();

userRoute.post(
  "/register",
  (req: Request, res: Response, next: NextFunction) => {
    userController.signUp(req, res, next);
  }
);

userRoute.post("/verify-otp",
    (req:Request,res:Response,next: NextFunction) => {
      
        userController.verify_otp(req,res,next)
    }
)

userRoute.post("/resend-otp",
  (req:Request,res:Response,next:NextFunction)=>{
    console.log(' in router Resnd');
    
       userController.resent_otp(req,res,next)
  }
)
