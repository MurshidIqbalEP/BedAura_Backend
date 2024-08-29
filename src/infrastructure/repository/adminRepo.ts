import RoomModel from "../database/roomModel";
import UserModel from "../database/userModel";
import optionsModel from "../database/optionsModel";

class AdminRepo {
    constructor() {}
  
    async fetchUsers(){
        let users = await UserModel.find({isAdmin:false})

        return users
    }

    async fetchAllRoops(){
        let rooms = await RoomModel.find({ isApproved: true, isEdited: false });
        return rooms
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

    async unlistRoom(id:string){
        let room = await RoomModel.findByIdAndUpdate(id,{isListed:false},{ new: true });
        return room;
    }

    async listRoom(id:string){
        let room = await RoomModel.findByIdAndUpdate(id,{isListed:true},{ new: true });
        return room;
    }

    async fetchOptions(){
        let options = await optionsModel.findOne()
        return options;
    }

    async addOption(category:string,newValue:string){
        let added = await optionsModel.findOneAndUpdate(
            {}, 
            {
              $addToSet: { [category]: newValue }, 
            },
            { new: true } 
          );

          return added;
    }

    async removeOption(category:string,newValue:string){
        let removed = await optionsModel.updateOne(
            {  },
            { $pull: { [category]: newValue } }
        );
        return removed;
    }

}

export default AdminRepo;
  