import express, { Request, Response, NextFunction } from "express";
import UserController from "../../adaptors/userController";
import UserUseCase from "../../usecase/userUsecase";
import UserRepo from "../repository/userRepo";
import GenerateOtp from "../services/generateOtp";
import EncryptPassword from "../services/encriptPassword";
import GenerateEmail from "../services/generateEmail";
import JWTToken from "../services/generateToken";
import { userAuth } from "../middleware/userAuth";
import upload from "../middleware/multer";

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
  "/verifyForgetOtp",
  (req: Request, res: Response, next: NextFunction) => {
    userController.verify_ForgetOtp(req, res, next);
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

userRoute.post(
  "/Gsignup",
  (req: Request, res: Response, next: NextFunction) => {
    userController.Gsignup(req, res, next);
  }
);

userRoute.post(
  "/forgetPass",
  (req: Request, res: Response, next: NextFunction) => {
    console.log("in router");

    userController.forgetPass(req, res, next);
  }
);

userRoute.post(
  "/changePass",
  (req: Request, res: Response, next: NextFunction) => {
    userController.changePass(req, res, next);
  }
);

userRoute.post(
  "/addRoom",userAuth,
  upload.array("images", 3),
  (req: Request, res: Response, next: NextFunction) => {
    userController.addRoom(req, res, next);
  }
);

userRoute.patch(
  "/editRoom",userAuth,
  upload.array("images", 3),
  (req: Request, res: Response, next: NextFunction) => {
    userController.editRoom(req, res, next);
  }
);

userRoute.get("/myRooms",userAuth, (req: Request, res: Response, next: NextFunction) => {
  userController.fetchRoomById(req, res, next);
});

userRoute.get("/Room",userAuth, (req: Request, res: Response, next: NextFunction) => {
  userController.fetchRoom(req, res, next);
});


userRoute.get("/fetchAllRooms",(req: Request, res: Response, next: NextFunction)=>{
   userController.fetchAllRooms(req,res,next)
});

userRoute.get("/refresh-token",(req: Request, res: Response, next: NextFunction)=>{
  
  userController.refreshToken(req,res,next)
});

userRoute.put("/editUser",(req: Request, res: Response, next: NextFunction)=>{
  
  userController.editUser(req,res,next)
});