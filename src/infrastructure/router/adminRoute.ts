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
  
