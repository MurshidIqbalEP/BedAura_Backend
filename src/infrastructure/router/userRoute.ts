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

userRoute.post("/logOut",
  (req: Request, res: Response, next: NextFunction) => {
    userController.logOut(req, res, next);
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
  "/addRoom",
  userAuth,
  upload.none(),
  (req: Request, res: Response, next: NextFunction) => {
    userController.addRoom(req, res, next);
  }
);

userRoute.patch(
  "/editRoom",
  userAuth,
  upload.none(),
  (req: Request, res: Response, next: NextFunction) => {
    userController.editRoom(req, res, next);
  }
);

userRoute.get(
  "/myRooms",
  userAuth,
  (req: Request, res: Response, next: NextFunction) => {
    userController.fetchRoomById(req, res, next);
  }
);

userRoute.get(
  "/Room",
  userAuth,
  (req: Request, res: Response, next: NextFunction) => {
    userController.fetchRoom(req, res, next);
  }
);

userRoute.get(
  "/fetchAllRooms",
  (req: Request, res: Response, next: NextFunction) => {
    userController.fetchAllRooms(req, res, next);
  }
);

userRoute.get(
  "/refresh-token",
  (req: Request, res: Response, next: NextFunction) => {
    userController.refreshToken(req, res, next);
  }
);

userRoute.put(
  "/editUser",
  userAuth,
  (req: Request, res: Response, next: NextFunction) => {
    userController.editUser(req, res, next);
  }
);

userRoute.get(
  "/fetchNearestRooms",
  (req: Request, res: Response, next: NextFunction) => {
    userController.fetchNearestRooms(req, res, next);
  }
);

userRoute.post(
  "/bookRoom",
  userAuth,
  (req: Request, res: Response, next: NextFunction) => {
    userController.bookRoom(req, res, next);
  }
)

userRoute.get(
  "/getbookings/:userId",
  userAuth,
  (req: Request, res: Response, next: NextFunction) => {
    userController.fetchBookings(req, res, next);
  }
)

userRoute.post(
  "/changePassword",
  userAuth,
  (req: Request, res: Response, next: NextFunction) => {  
    userController.changePassword(req, res, next);
  }
)

userRoute.get(
  "/fetchWallet/:userId",
  userAuth,
  (req: Request, res: Response, next: NextFunction) => {  
    userController.fetchWallet(req, res, next);
  }
)

userRoute.get(
  "/fetchReviews/:roomId",
  userAuth,
  (req: Request, res: Response, next: NextFunction) => {  
    userController.fetchReviews(req, res, next);
  }
)

userRoute.post(
  "/postReview",
  userAuth,
  (req: Request, res: Response, next: NextFunction) => {  
    userController.postReview(req, res, next);
  }
)

userRoute.post(
  "/addMessage",
  userAuth,
  (req: Request, res: Response, next: NextFunction) => {  
    
    
    userController.addMessage(req, res, next);
  }
)

userRoute.get(
  "/fetchMessages",
  userAuth,
  (req: Request, res: Response, next: NextFunction) => {  
    userController.fetchMessages(req, res, next);
  }
)

userRoute.get(
  "/fetchContacts",
  userAuth,
  (req: Request, res: Response, next: NextFunction) => {  
    userController.fetchContacts(req, res, next);
  }
)

userRoute.get(
  "/fetchOwnerDetails",
  userAuth,
  (req: Request, res: Response, next: NextFunction) => {  
    userController.fetchOwnerDetails(req, res, next);
  }
)

userRoute.post("/cancelBooking",
  userAuth,
  (req: Request, res: Response, next: NextFunction) => {  
    userController.cancelBooking(req, res, next);
  }
)

userRoute.get("/checkBookingValid",
  userAuth,
  (req: Request, res: Response, next: NextFunction) => {  
    userController.checkBookingValid(req, res, next);
  }
)


