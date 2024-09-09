import mongoose, { Model, Schema } from 'mongoose';
import IReview from '../../domain/reviews';


const ReviewSchema : Schema<IReview> = new Schema({
    name: {type:String},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const ReviewModel:Model<IReview> =mongoose.model<IReview>(
    "Review",
    ReviewSchema
)

export default ReviewModel;
