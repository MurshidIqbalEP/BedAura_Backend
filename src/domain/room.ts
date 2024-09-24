 
 interface Room{
    name:string,
    mobile:string,
    userId:String,
    maintenanceCharge:string,
    securityDeposit:string,
    gender:string,
    slots:Number,
    roomType:string,
    noticePeriod:string,
    electricityCharge:string,
    location:string,
    description:string,
    isApproved:boolean,
    isEdited:boolean,
    isListed:boolean,
    coordinates: {
        type: 'Point'; 
        coordinates: [number, number]; // [longitude, latitude]
    };
    additionalOptions:string[];
    images: string[];
}


 export interface IRoom{
    name:string,
    mobile:string,
    userId:String,
    maintenanceCharge:string,
    securityDeposit:string,
    gender:string,
    slots:Number,
    roomType:string,
    noticePeriod:string,
    location:string,
    description:string,
    additionalOptions:string[]
    coordinates: { lat: number, lng: number }
    images: string[];
}

export default Room;