import Room from "./room";

interface BookingWithRoom{
    userId: string;
    roomName: string;
    roomId: Room;
    slots: number;
    amount:number;
    paymentId: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    createdAt?: Date; 
    updatedAt?: Date; 
 }

 export default BookingWithRoom;