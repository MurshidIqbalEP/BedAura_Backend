interface Otp{
    name:string,
    email:string,
    number:string,
    password:string,
    otp:number,
    otpGeneratedAt:Date
    expiresAt:Date
}

export default Otp;


export  const MAX_AGE = 7 * 24 * 60 * 60 * 1000;
