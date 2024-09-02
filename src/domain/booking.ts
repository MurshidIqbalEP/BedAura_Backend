interface Booking{
    userId: string;
    roomName: string;
    roomId: string;
    slots: number;
    paymentId: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    createdAt?: Date; 
    updatedAt?: Date; 
 }
 
 export default Booking;