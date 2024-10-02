import RoomModel from "../database/roomModel";
import UserModel from "../database/userModel";
import optionsModel from "../database/optionsModel";
import BookingModel from "../database/bookingModel";

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

    async fetchBookingPerMounth(){
        const data = await BookingModel.aggregate([
            {
              $group: {
                _id: { $month: "$createdAt" }, // Group by the month of the booking's creation date
                rooms: { $sum: 1 }, // Count the number of bookings (assuming each booking is tied to a room)
                bookings: { $sum: 1 }, // Count the number of bookings
              },
            },
            {
              $project: {
                month: '$_id', // Project the month
                rooms: 1, // Keep rooms
                bookings: 1, // Keep bookings
                _id: 0, // Exclude the _id field from the result
              },
            },
            { $sort: { month: 1 } }, // Sort by month in ascending order
          ]);

          return data
    }

    async fetchPieChartData(){
        const roomTypeData = await RoomModel.aggregate([
            {
              $group: {
                _id: "$roomType",
                count: { $sum: 1 },
              },
            },
          ]);
        
          return roomTypeData
    }

    async fetchBookingDataByCity(){
        const bookingsByCity = await BookingModel.aggregate([
            {
              $group: {
                _id: '$roomId', // Assuming roomId contains city info
                totalBookings: { $sum: 1 },
                roomName: { $first: '$roomName' },
              },
            },
            {
              $lookup: {
                from: 'rooms', // Assuming 'rooms' is the collection name for your room model
                localField: '_id',
                foreignField: '_id',
                as: 'roomDetails',
              },
            },
            {
              $unwind: '$roomDetails',
            },
            {
              $project: {
                city: '$roomDetails.location', // Adjust based on how you're storing the city
                totalBookings: 1,
              },
            },
          ]);
        
          return bookingsByCity
    }



}

export default AdminRepo;
  