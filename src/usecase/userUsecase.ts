import UserRepo from "../infrastructure/repository/userRepo";
import GenerateOtp from "../infrastructure/services/generateOtp";
import EncriptPassword from "../infrastructure/services/encriptPassword";
import GenerateEmail from "../infrastructure/services/generateEmail";
import JwtToken from "../infrastructure/services/generateToken";
import Room, { IRoom } from "../domain/room";

class UserUseCase {
  private UserRepo: UserRepo;
  private GenerateOtp: GenerateOtp;
  private EncriptPassword: EncriptPassword;
  private GenerateEmail: GenerateEmail;
  private JwtToken: JwtToken;

  constructor(
    UserRepo: UserRepo,
    GenerateOtp: GenerateOtp,
    EncriptPassword: EncriptPassword,
    GenerateEmail: GenerateEmail,
    JwtToken: JwtToken
  ) {
    this.UserRepo = UserRepo;
    this.GenerateOtp = GenerateOtp;
    this.EncriptPassword = EncriptPassword;
    this.GenerateEmail = GenerateEmail;
    this.JwtToken = JwtToken;
  }

  async checkExist(email: string) {
    const userExist = await this.UserRepo.findByEmail(email);
    if (userExist) {
      return {
        status: 400,
        data: {
          status: false,
          message: "User already exists",
          user: userExist
        },
      };
    } else {
      return {
        status: 200,
        data: {
          status: true,
          message: "User does not exist",
        },
      };
    }
  }

  async signup(name: string, email: string, number: string, password: string) {
    let otp = await this.GenerateOtp.createOtp();
    const hashedPassword = await this.EncriptPassword.encryptPassword(password);

    await this.UserRepo.saveOtp(email, otp, name, number, hashedPassword);

    console.log(otp);

     await this.GenerateEmail.sendMail(email, otp);

    return {
      status: 200,
      data: {
        status: true,
        message: "Verification otp sent to your email",
      },
    };
  }

  async Gsignup(name:string,email:string,password:string,isGoogle:boolean){
    const hashedPassword = await this.EncriptPassword.encryptPassword(password);
     

    let newUser = await this.UserRepo.Gsignup(name,email,hashedPassword,isGoogle)
    const token = this.JwtToken.generateToken(newUser._id.toString(), "user");
    return {status:200, data:{user:newUser,token:token}}
  }

  async generateTokenForG(id:string,admin:boolean){
    let a
    if(admin){
       a ="admin"
    }else{
      a = "user"
    }
    const token = this.JwtToken.generateToken(id, a);

    return token;
  }

  async verifyOTP(email: string, otp: string): Promise<any> {
    const otpRecord = await this.UserRepo.findOtpByEmail(email);

    if (!otpRecord) {
      return { status: 400, message: "Invalid or expired OTP" };
    }


    if (otpRecord.otp !== parseInt(otp)) {
      return { status: 400, message: "Invalid OTP" };
    }

    await this.UserRepo.deleteOtpByEmail(email);
    const data = await this.UserRepo.verifyUser(email);
    console.log("User Verified:", data);

    return { status: 200, message: "OTP verified successfully", data };
  }
  
  async verifyForgetOTP(email: string, otp: string): Promise<any> {
    const otpRecord = await this.UserRepo.findOtpByEmail(email);

    if (!otpRecord) {
      return { status: 400, message: "Invalid or expired OTP" };
    }


    if (otpRecord.otp !== parseInt(otp)) {
      return { status: 400, message: "Invalid OTP" };
    }

    await this.UserRepo.deleteOtpByEmail(email);
    

    return { status: 200, message: "ForgetOTP verified successfully" };
  }


  async resend_otp(email: string): Promise<any> {
    let otp = await this.GenerateOtp.createOtp();
    await this.UserRepo.updateOtp(email, otp);
    this.GenerateEmail.sendMail(email, otp);

    return {
      status: 200,
      data: {
        status: true,
        message: "Resend otp sent to your email",
      },
    };
  }

  async login(email: string, password: string) {


    const user = await this.UserRepo.findUser(email);

    let token = "";

    if (user) {
      let data = {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.number,
        isBlocked: user.isBlocked,
      };

      if (user.isBlocked) {
        return {
          status: 400,
          data: {
            status: false,
            message: "You have been blocked by admin!",
            token: "",
          },
        };
      }

      

      const passwordMatch = await this.EncriptPassword.compare(
        password,
        user.password
      );

      console.log(passwordMatch);

      if (passwordMatch && user.isAdmin) {
        token = this.JwtToken.generateToken(user._id.toString(), "admin");

        return {
          status: 200,
          data: {
            status: true,
            message: data,
            token,
            isAdmin: true,
          },
        };
      }

      if (passwordMatch) {
        token = this.JwtToken.generateToken(user._id.toString(), "user");

        return {
          status: 200,
          data: {
            status: true,
            message: data,
            token,
          },
        };
      } else {
        return {
          status: 400,
          data: {
            status: false,
            message: "Invalid email or password",
            token: "",
          },
        };
      }
    } else {
      return {
        status: 400,
        data: {
          status: false,
          message: "Invalid email or password",
          token: "",
        },
      };
    }
  }

  async forgetPass(email: string) {

    let exist = await this.UserRepo.findByEmail(email)
    if(exist){
      let otp = await this.GenerateOtp.createOtp();
    
      let otpSave = await this.UserRepo.saveOtpForforgetPass(email, otp);
      let sendEmail = await   this.GenerateEmail.sendMail(email, otp);
      
      if (otpSave) {
        return {
          status: 200,
          data: {
            message: "OTP sented",
            email: otpSave.email,
          },
        };
      } else {
        return {
          status: 400,
          data: {
            message: "OTP send failed",
          },
        };
      }

    }else{
      return {
        status: 400,
        data: {
          message: "Wrong Email",
        },
      };
    }
    
}

async changePass(email:string,password:string){
  const hashedPassword = await this.EncriptPassword.encryptPassword(password);
  let changed = await this.UserRepo.changePass(email,hashedPassword)
  return true
  
}

async addNewRoom(roomData:IRoom){

  let newRoom = await this.UserRepo.addRoom(roomData)
  if(newRoom){
    return {
      status: 200,
      message: "New Room Request added",
    }
  }else{
    return {
      status: 400,
      message: "some thing happened",
    }
  }
}

async fetchRoomById(id:string){
  let rooms = await this.UserRepo.fetchAllRoomsById(id);
  if(rooms){
    return {
      status:200,
      data:rooms
    }
  }else{
    return {
      status:400,
      message:" no rooms found"
    }
  }
}



  }

  


export default UserUseCase;
