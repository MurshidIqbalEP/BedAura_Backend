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