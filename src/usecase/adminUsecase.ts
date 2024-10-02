import AdminRepo from "../infrastructure/repository/adminRepo";

class AdminUsecase {
  private AdminRepo: AdminRepo;

  constructor(AdminRepo: AdminRepo) {
    this.AdminRepo = AdminRepo;
  }

  async getUsers() {
    const data = await this.AdminRepo.fetchUsers();

    if (data) {
      return {
        status: 200,
        data: data,
      };
    } else {
      return {
        status: 400,
        message: "Failed to fetch data! Please try again",
      };
    }
  }

  async fetchAllRooms() {
    const rooms = await this.AdminRepo.fetchAllRoops();
    if (rooms) {
      return {
        status: 200,
        data: rooms,
      };
    } else {
      return {
        status: 400,
        message: " Fail to fetch Rooms",
      };
    }
  }

  async blockUser(email: string) {
    const data = await this.AdminRepo.blockUser(email);

    if (data) {
      return {
        status: 200,
        data: data,
      };
    } else {
      return {
        status: 400,
        message: "Failed to update user",
      };
    }
  }

  async UnBlockUser(email: string) {
    const data = await this.AdminRepo.unBlockUser(email);

    if (data) {
      return {
        status: 200,
        data: data,
      };
    } else {
      return {
        status: 400,
        message: "Failed to update user",
      };
    }
  }

  async fetchEditRequests() {
    const rooms = await this.AdminRepo.fetchEditRequests();

    if (rooms) {
      return {
        status: 200,
        data: rooms,
      };
    } else {
      return {
        status: 400,
        message: "Failed to update user",
      };
    }
  }

  async approveEdit(roomId: string) {
    const approved = await this.AdminRepo.approveEdit(roomId);
    if (approved) {
      return {
        status: 200,
        message: "Room edited",
      };
    } else {
      return {
        status: 400,
        message: "Failed to edited Room",
      };
    }
  }

  async approveRoom(roomId: string) {
    const approved = await this.AdminRepo.approveRoom(roomId);
    if (approved) {
      return {
        status: 200,
        message: "Room Approved",
      };
    } else {
      return {
        status: 400,
        message: "Failed to edited Room",
      };
    }
  }

  async fetchNewRequests() {
    const rooms = await this.AdminRepo.fetchNewRoomRequests();
    if (rooms) {
      return {
        status: 200,
        data: rooms,
      };
    } else {
      return {
        status: 400,
        message: "failed to fetch new Requests",
      };
    }
  }

  async unlistRoom(id: string) {
    const room = await this.AdminRepo.unlistRoom(id);
    if (room) {
      return {
        status: 200,
        message: "room unlisted",
      };
    } else {
      return {
        status: 400,
        message: " failed to unlist room ",
      };
    }
  }

  async listRoom(id: string) {
    const room = await this.AdminRepo.listRoom(id);
    if (room) {
      return {
        status: 200,
        message: "room listed",
      };
    } else {
      return {
        status: 400,
        message: " failed to list room ",
      };
    }
  }

  async fetchOptions() {
    const options = await this.AdminRepo.fetchOptions();
    if (options) {
      return {
        status: 200,
        data: options,
      };
    } else {
      return {
        status: 400,
        message: "failed to fetch options",
      };
    }
  }

  async addOption(category: string, newValue: string) {
    const added = await this.AdminRepo.addOption(category, newValue);
    if (added) {
      return {
        status: 200,
        message: "option added",
      };
    } else {
      return {
        status: 400,
        message: "failed add option",
      };
    }
  }

  async removeOption(category: string, newValue: string) {
    const removed = await this.AdminRepo.removeOption(category, newValue);

    if (removed) {
      return {
        status: 200,
        message: "option removed",
      };
    } else {
      return {
        status: 400,
        message: "failed remove option",
      };
    }
  }

  async fetchBookingPerMounth() {
    const data = await this.AdminRepo.fetchBookingPerMounth();

    if (data) {
      return {
        status: 200,
        data,
      };
    } else {
      return {
        status: 400,
        message: "failed remove option",
      };
    }
  }

  async fetchPieChartData(){
    const data = await this.AdminRepo.fetchPieChartData();

    if (data) {
      return {
        status: 200,
        data,
      };
    } else {
      return {
        status: 400,
        message: "failed remove option",
      };
    }
  }

  async fetchBookingDataByCity(){
    const data = await this.AdminRepo.fetchBookingDataByCity();

    if (data) {
      return {
        status: 200,
        data,
      };
    } else {
      return {
        status: 400,
        message: "failed remove option",
      };
    }
  }
}

export default AdminUsecase;
