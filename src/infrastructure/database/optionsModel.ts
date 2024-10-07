import Options from "../../domain/options";
import mongoose, { Model, Schema } from "mongoose";

const optionsSchema: Schema<Options> = new Schema({
    securityDeposit : {
       type:[String],
       required:true
    },
    genders:{
        type:[String],
       required:true
    },
    roomType:{
        type:[String],
       required:true
    },
    noticePeriod:{
        type:[String],
        required:true
    },
    AdditionalOptions:{
        type:[String],
    }
    
});

const optionsModel: Model<Options> = mongoose.model<Options>("Options", optionsSchema);

export default optionsModel;
