import AdminRepo from "../infrastructure/repository/adminRepo";

class AdminUsecase{
    private AdminRepo: AdminRepo;

  
    constructor(
      AdminRepo: AdminRepo,
     
    ) {
      this.AdminRepo = AdminRepo;
    }
  
  async getUsers(){

    const data = await this.AdminRepo.fetchUsers()

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

  async blockUser(email:string){

    const data = await this.AdminRepo.blockUser(email)

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

  

  async UnBlockUser(email:string){

    const data = await this.AdminRepo.unBlockUser(email)

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





}  

export default AdminUsecase;