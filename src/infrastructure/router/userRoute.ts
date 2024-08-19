import express, { Request, Response, NextFunction } from "express";
import UserController from "../../adaptors/userController";
import UserUseCase from "../../usecase/userUsecase";
import UserRepo from "../repository/userRepo";
import GenerateOtp from "../services/generateOtp";
import EncryptPassword from "../services/encriptPassword";
import GenerateEmail from "../services/generateEmail";
import JWTToken from "../services/generateToken";

let generateOtp = new GenerateOtp();
let encryptPassword = new EncryptPassword();
let generateEmail = new GenerateEmail();
let JwtToken = new JWTToken();

let userRepo = new UserRepo();
let userUseCase = new UserUseCase(
  userRepo,
  generateOtp,
  encryptPassword,
  generateEmail,
  JwtToken
);
let userController = new UserController(userUseCase);

export const userRoute = express.Router();

userRoute.post(
  "/register",
  (req: Request, res: Response, next: NextFunction) => {
    
    userController.signUp(req, res, next);
  }
);

userRoute.post(
  "/verify-otp",
  (req: Request, res: Response, next: NextFunction) => {
    userController.verify_otp(req, res, next);
  }
);

userRoute.post(
  "/resend-otp",
  (req: Request, res: Response, next: NextFunction) => {
    userController.resent_otp(req, res, next);
  }
);

userRoute.post("/login", (req: Request, res: Response, next: NextFunction) => {


  userController.login(req, res, next);
});

userRoute.post("/Gsignup",(req,res,next)=>{
  console.log("in router");
  userController.Gsignup(req,res,next)
})
