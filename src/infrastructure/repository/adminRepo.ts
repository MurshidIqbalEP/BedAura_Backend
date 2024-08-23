import UserModel from "../database/userModel";

class AdminRepo {
    constructor() {}
  
    async fetchUsers(){
        let users = await UserModel.find()

        return users
    }

    async blockUser(email:string){
        let user = await UserModel.findOneAndUpdate({email:email},{isBlocked:true},{ new: true } )
        return user
    }

    
    async unBlockUser(email:string){
        let user = await UserModel.findOneAndUpdate({email:email},{isBlocked:false},{ new: true } )
        return user
    }


}

export default AdminRepo;
  