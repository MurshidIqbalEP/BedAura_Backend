import UserModel from "../database/userModel";
import otpModel from "../database/otpModel";

class UserRepo {
  constructor() {}

  async findByEmail(email: string) {
    let user = await UserModel.findOne({ email: email });
    return user;
  }

  async saveOtp(
    email: string,
    otp: number,
    name?: string,
    number?: string,
    password?: string
  ): Promise<any> {
    const otpDoc = new otpModel({
      name: name,
      email: email,
      number: number,
      password: password,
      otp: otp,
      otpGeneratedAt: new Date(),
    });

    const savedDoc = await otpDoc.save();

    const userDoc = new UserModel({
      name: name,
      email: email,
      number: number,
      password: password,
    });

    const userSave = await userDoc.save();

    return savedDoc;
  }

  async Gsignup(name:string,email:string,password:string,isGoogle:boolean): Promise<any>{
      const GUser  = new UserModel({
        name:name,
        email:email,
        password:password,
        isGoogle:isGoogle,
        isVerified:true
      })

      const newGUser = await GUser.save()
      return newGUser
  }

  async findOtpByEmail(email:string) : Promise<any>{
    return otpModel.findOne({ email }).sort({ otpGeneratedAt: -1 });
  }

  async deleteOtpByEmail(email:string): Promise<any>{
    return otpModel.deleteOne({ email });
  }

  async verifyUser(email:string):Promise<any>{
    try {
      const updatedUser = await UserModel.findOneAndUpdate(
        { email: email }, 
        { $set: { isVerified: true } }, 
        {new:true}
      );
  
      if (!updatedUser) {
        throw new Error('User not found');
      }
      console.log(updatedUser)
  
      return updatedUser; 
    } catch (error) {
      
      throw error;
    }
  }

  async updateOtp(email:string,otp:number){
    try {
      const updateOtp = await otpModel.findOneAndUpdate(
        { email: email }, 
        { $set: { otp: otp  , otpGeneratedAt : new Date()} }, 
        {new:true}
      );
    } catch (error) {
      throw error;
    }
  }

  async findUser(email:string){
    try {
      console.log('in repo');     
      let user = await UserModel.findOne({email:email})
      return user
    } catch (error) {
      console.log(error);
      
    }
  }
}

export default UserRepo;
