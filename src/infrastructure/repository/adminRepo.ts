import RoomModel from "../database/roomModel";
import UserModel from "../database/userModel";
import optionsModel from "../database/optionsModel";
import BookingModel from "../database/bookingModel";

class AdminRepo {
  constructor() {}

  // Fetch all users who are not admin
  async fetchUsers() {
    let users = await UserModel.find({ isAdmin: false });
    return users;
  }

  // Fetch all rooms that are approved and not marked as edited
  async fetchAllRoops() {
    let rooms = await RoomModel.find({ isApproved: true, isEdited: false });
    return rooms;
  }

  // Block a user based on their email
  async blockUser(email: string) {
    let user = await UserModel.findOneAndUpdate(
      { email: email },
      { isBlocked: true },
      { new: true }
    );
    return user;
  }

  // Unblock a user based on their email
  async unBlockUser(email: string) {
    let user = await UserModel.findOneAndUpdate(
      { email: email },
      { isBlocked: false },
      { new: true }
    );
    return user;
  }

  // Fetch rooms that are marked as edited and approved
  async fetchEditRequests() {
    let rooms = await RoomModel.find({ isEdited: true, isApproved: true });
    return rooms;
  }

  // Approve the edits of a room based on its room ID
  async approveEdit(roomId: string) {
    let room = await RoomModel.findByIdAndUpdate(
      roomId,
      { isEdited: false },
      { new: true }
    );
    return room;
  }

  // Approve a new room based on its room ID
  async approveRoom(roomId: string) {
    let room = await RoomModel.findByIdAndUpdate(
      roomId,
      { isApproved: true },
      { new: true }
    );
    return room;
  }

  // Fetch rooms that are awaiting approval and haven't been rejected
  async fetchNewRoomRequests() {
    let rooms = await RoomModel.find({
      isApproved: false,
      $or: [
        { rejectionReason: { $exists: false } },
        { rejectionReason: { $eq: "" } },
        { rejectionReason: { $eq: null } },
      ],
    });
    return rooms;
  }

  // Unlist a room based on its room ID
  async unlistRoom(id: string) {
    let room = await RoomModel.findByIdAndUpdate(
      id,
      { isListed: false },
      { new: true }
    );
    return room;
  }

  // Relist a room based on its room ID
  async listRoom(id: string) {
    let room = await RoomModel.findByIdAndUpdate(
      id,
      { isListed: true },
      { new: true }
    );
    return room;
  }

  // Fetch the current options for categories, like amenities, room types, etc.
  async fetchOptions() {
    let options = await optionsModel.findOne();
    return options;
  }

  // Add a new option to a specified category
  async addOption(category: string, newValue: string) {
    let added = await optionsModel.findOneAndUpdate(
      {},
      {
        $addToSet: { [category]: newValue },
      },
      { new: true }
    );
    return added;
  }

  // Remove an option from a specified category
  async removeOption(category: string, newValue: string) {
    let removed = await optionsModel.updateOne(
      {},
      { $pull: { [category]: newValue } }
    );
    return removed;
  }

  // Fetch booking statistics grouped by month
  async fetchBookingPerMounth() {
    const data = await BookingModel.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" }, // Group bookings by month
          rooms: { $sum: 1 }, // Count the total number of rooms booked
          bookings: { $sum: 1 }, // Count the total number of bookings
        },
      },
      {
        $project: {
          month: "$_id", // Keep the month value
          rooms: 1, // Keep the room count
          bookings: 1, // Keep the booking count
          _id: 0, // Exclude the _id field
        },
      },
      { $sort: { month: 1 } }, // Sort by month in ascending order
    ]);
    return data;
  }

  // Fetch data for generating a pie chart based on room types
  async fetchPieChartData() {
    const roomTypeData = await RoomModel.aggregate([
      {
        $group: {
          _id: "$roomType", // Group by room type
          count: { $sum: 1 }, // Count the number of rooms of each type
        },
      },
    ]);
    return roomTypeData;
  }

  // Fetch booking data grouped by city
  async fetchBookingDataByCity() {
    const bookingsByCity = await BookingModel.aggregate([
      {
        $group: {
          _id: "$roomId", // Group by room ID (assuming roomId contains city info)
          totalBookings: { $sum: 1 }, // Count total bookings per room
          roomName: { $first: "$roomName" }, // Get room name
        },
      },
      {
        $lookup: {
          from: "rooms", // Join with the 'rooms' collection
          localField: "_id", // Match room IDs
          foreignField: "_id",
          as: "roomDetails",
        },
      },
      {
        $unwind: "$roomDetails", // Unwind room details to get city info
      },
      {
        $project: {
          city: "$roomDetails.location", // Keep the city value from room details
          totalBookings: 1, // Keep the total bookings count
        },
      },
    ]);
    return bookingsByCity;
  }

  // Reject a room with a specified reason based on its room ID
  async rejectRoom(roomId: string, reason: string) {
    const rejected = await RoomModel.findByIdAndUpdate(
      roomId,
      { rejectionReason: reason },
      { new: true }
    );
    return rejected;
  }
}

export default AdminRepo;
