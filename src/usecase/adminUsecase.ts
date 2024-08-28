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

  async fetchEditRequests(){
    const rooms  = await this.AdminRepo.fetchEditRequests();
    
    if(rooms){
      return {
        status: 200,
        data: rooms,
      };
    }else{
      return {
        status: 400,
        message: "Failed to update user",
      };
    }
  }

  async approveEdit(roomId:string){
     const approved = await this.AdminRepo.approveEdit(roomId)
     if(approved){
      return {
        status: 200,
        message:'Room edited'
      };
     }else{
      return {
        status: 400,
        message:'Failed to edited Room'
      };
     }
  }

  async approveRoom(roomId:string){
    const approved = await this.AdminRepo.approveRoom(roomId)
    if(approved){
     return {
       status: 200,
       message:'Room Approved'
     };
    }else{
     return {
       status: 400,
       message:'Failed to edited Room'
     };
    }
 }

  async fetchNewRequests(){
    const rooms = await this.AdminRepo.fetchNewRoomRequests()
    if(rooms){
      return {
        status:200,
        data:rooms
      }
    }else{
      return {
        status:400,
        message:"failed to fetch new Requests"
      }
    }
  }
}

export default AdminUsecase;
