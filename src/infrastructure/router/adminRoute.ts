import express, { Request, Response, NextFunction } from "express";
import AdminController from "../../adaptors/adminController";
import AdminUsecase from "../../usecase/adminUsecase";
import AdminRepo from "../repository/adminRepo";

let adminRepo = new AdminRepo();
let adminUsecase = new AdminUsecase(adminRepo);

let adminController = new AdminController(adminUsecase);

export const adminRoute = express.Router();

adminRoute.get(
  "/allUsers",
  (req: Request, res: Response, next: NextFunction) => {
    adminController.getAllUsers(req, res, next);
  }
);

adminRoute.patch(
  "/blockUser",
  (req: Request, res: Response, next: NextFunction) => {
    adminController.blockUser(req, res, next);
  }
);

adminRoute.patch(
    "/unBlockUser",
    (req: Request, res: Response, next: NextFunction) => {
      adminController.unBlockUser(req, res, next);
    }
  );

  adminRoute.get(
    "/fetchEditRequests",
    (req: Request, res: Response, next: NextFunction) => {
      adminController.fetchEditRequests(req, res, next);
    }
  );

  adminRoute.patch(
    "/approveEdit",
    (req: Request, res: Response, next: NextFunction) => {
      adminController.approveEdit(req, res, next);
    }
  );

  adminRoute.patch(
    "/approveRoom",
    (req: Request, res: Response, next: NextFunction) => {
      adminController.approveRoom(req, res, next);
    }
  );

  adminRoute.get(
    "/newRoomRequest",
    (req: Request, res: Response, next: NextFunction) => {
      adminController.fetchNewRequests(req, res, next);
    }
  );

  adminRoute.get(
    "/fetchAllRooms",
    (req: Request, res: Response, next: NextFunction) => {
      adminController.fetchAllRooms(req, res, next);
    }
  );

  adminRoute.patch(
    "/unlistRoom",
    (req:Request,res:Response,next:NextFunction)=>{
      adminController.unlistRoom(req, res, next);
    }
  )

  adminRoute.patch(
    "/listRoom",
    (req:Request,res:Response,next:NextFunction)=>{
      adminController.listRoom(req, res, next);
    }
  )

  adminRoute.get(
    "/fetchOptions",
    (req:Request,res:Response,next:NextFunction)=>{
      adminController.fetchOptions(req,res,next)
    }
  )

  adminRoute.patch(
    "/addOption",
    (req:Request,res:Response,next:NextFunction)=>{
      adminController.addOption(req,res,next)
    }
  )

  adminRoute.patch(
    "/removeOption",
    (req:Request,res:Response,next:NextFunction)=>{
      
      adminController.removeOption(req,res,next)
    }
  )

  adminRoute.get(
    "/fetchBookingPerMounth",
    (req:Request,res:Response,next:NextFunction)=>{
      
      adminController.fetchBookingPerMounth(req,res,next)
    }
  )

  adminRoute.get(
    "/fetchPieChartData",
    (req:Request,res:Response,next:NextFunction)=>{
      
      adminController.fetchPieChartData(req,res,next)
    }
  )

  adminRoute.get(
    "/fetchBookingDataByCity",
    (req:Request,res:Response,next:NextFunction)=>{
      
      adminController.fetchBookingDataByCity(req,res,next)
    }
  )
 
  
