import adminUsecase from "../usecase/adminUsecase";
import { NextFunction, Request, Response } from "express";

class AdminController {
  private adminUsecase: adminUsecase;

  constructor(adminUsecase: adminUsecase) {
    this.adminUsecase = adminUsecase;
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await this.adminUsecase.getUsers();
      console.log(users);
      if (users.status == 200) {
        return res.status(users.status).json(users);
      } else {
        return res.status(users.status).json(users.message);
      }
    } catch (error) {
      next(error);
    }
  }

  async blockUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const user = await this.adminUsecase.blockUser(email);

      if (user.status == 200) {
        return res.status(user.status).json(user);
      } else {
        return res.status(user.status).json(user.message);
      }
    } catch (error) {
      next(error);
    }
  }

  async unBlockUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const user = await this.adminUsecase.UnBlockUser(email);

      if (user.status == 200) {
        return res.status(user.status).json(user);
      } else {
        return res.status(user.status).json(user.message);
      }
    } catch (error) {
      next(error);
    }
  }

  async fetchEditRequests(req: Request, res: Response, next: NextFunction) {
    try {
      const rooms = await this.adminUsecase.fetchEditRequests();
      if (rooms.status == 200) {
        return res.status(rooms.status).json(rooms);
      } else {
        return res.status(rooms.status).json(rooms.message);
      }
    } catch (error) {
      next(error);
    }
  }

  async approveEdit(req:Request,res:Response,next:NextFunction){
    try {
      const { roomId } = req.body;
    const response =  await this.adminUsecase.approveEdit(roomId);
    

    res.status(response.status).json(response.message);
    } catch (error) {
      next(error);
    }
  }

  async approveRoom(req:Request,res:Response,next:NextFunction){
    try {
      const { roomId } = req.body;
    const response =  await this.adminUsecase.approveRoom(roomId);
    
    res.status(response.status).json(response.message);
    } catch (error) {
      next(error);
    }
  }

  async fetchNewRequests(req:Request,res:Response,next:NextFunction){
    try {
    
    const response =  await this.adminUsecase.fetchNewRequests();
    res.status(response.status).json(response.data);
    } catch (error) {
      next(error);
    }
  }
}

export default AdminController;
