import RoomModel from "../database/roomModel";
import UserModel from "../database/userModel";

class AdminRepo {
    constructor() {}
  
    async fetchUsers(){
        let users = await UserModel.find({isAdmin:false})

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
    
    async fetchEditRequests(){
        let rooms = await RoomModel.find({ isEdited: true, isApproved: true });
        
        return rooms;
    }

    async approveEdit(roomId:string){
        let room = await RoomModel.findByIdAndUpdate( roomId,
            { isEdited: false }, 
            { new: true }
        );
        return room;
    }

    async approveRoom(roomId:string){
        let room = await RoomModel.findByIdAndUpdate( roomId,
            { isApproved: true }, 
            { new: true }
        );
        return room;
    }

    async fetchNewRoomRequests(){
        let rooms = await RoomModel.find({isApproved:false})
        return rooms;
    }

}

export default AdminRepo;
  