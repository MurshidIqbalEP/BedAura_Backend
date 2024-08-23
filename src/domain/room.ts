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
    isAproved:boolean,
    coordinates: {
        type: 'Point'; 
        coordinates: [number, number]; // [longitude, latitude]
    };
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
    electricityCharge:string,
    location:string,
    description:string,
    coordinates: { lat: number, lng: number }
    images: string[];
}

export default Room;