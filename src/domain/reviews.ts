import { Schema } from "mongoose";

interface Reviews{
    name:string,
    userId: Schema.Types.ObjectId;
    roomId:Schema.Types.ObjectId;
    rating:number,
    review:string,
    createdAt:Date

}

export default Reviews;
