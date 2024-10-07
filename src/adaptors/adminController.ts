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
      if (users.status == 200) {
        return res.status(users.status).json(users);
      } else {
        return res.status(users.status).json(users.message);
      }
    } catch (error) {
      next(error);
    }
  }

  async fetchAllRooms(req: Request, res: Response, next: NextFunction) {
    try {
      const rooms = await this.adminUsecase.fetchAllRooms();
      if (rooms.status == 200) {
        return res.status(rooms.status).json(rooms);
      } else {
        return res.status(rooms.status).json(rooms.message);
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

  async approveEdit(req: Request, res: Response, next: NextFunction) {
    try {
      const { roomId } = req.body;
      const response = await this.adminUsecase.approveEdit(roomId);

      res.status(response.status).json(response.message);
    } catch (error) {
      next(error);
    }
  }

  async approveRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const { roomId } = req.body;
      const response = await this.adminUsecase.approveRoom(roomId);

      res.status(response.status).json(response.message);
    } catch (error) {
      next(error);
    }
  }

  async fetchNewRequests(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.adminUsecase.fetchNewRequests();
      res.status(response.status).json(response.data);
    } catch (error) {
      next(error);
    }
  }

  async unlistRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.body;
      const response = await this.adminUsecase.unlistRoom(id);
      return res.status(response.status).json(response.message);
    } catch (error) {
      next(error);
    }
  }

  async listRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.body;
      const response = await this.adminUsecase.listRoom(id);
      return res.status(response.status).json(response.message);
    } catch (error) {
      next(error);
    }
  }

  async fetchOptions(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.adminUsecase.fetchOptions();
      return res.status(response.status).json(response.data);
    } catch (error) {
      next(error);
    }
  }

  async addOption(req: Request, res: Response, next: NextFunction) {
    try {
      const { category, newValue } = req.body;
      const response = await this.adminUsecase.addOption(category, newValue);
      return res.status(response.status).json(response.message);
    } catch (error) {
      next(error);
    }
  }

  async removeOption(req: Request, res: Response, next: NextFunction) {
    try {
      const { category, newValue } = req.body;

      const response = await this.adminUsecase.removeOption(category, newValue);
      return res.status(response.status).json(response.message);
    } catch (error) {
      next(error);
    }
  }

  async fetchBookingPerMounth(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.adminUsecase.fetchBookingPerMounth();
      return res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  }

  async fetchPieChartData(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.adminUsecase.fetchPieChartData();
      return res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  }
  async fetchBookingDataByCity(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.adminUsecase.fetchBookingDataByCity();
      return res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  }
  async rejectRoom(req: Request, res: Response, next: NextFunction){
    try {
      const {roomId,reason} = req.body;
      
      const response = await this.adminUsecase.rejectRoom(roomId,reason);
      return res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export default AdminController;
