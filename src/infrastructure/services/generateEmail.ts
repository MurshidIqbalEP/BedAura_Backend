import nodemailer from "nodemailer";
import dotenv from 'dotenv'
dotenv.config()


class sendMail{
    private transporter : nodemailer.Transporter
    constructor(){
        this.transporter = nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:'murshidm2x@gmail.com',
                pass:process.env.MAILER,
            },
        }) 
    }

    sendMail(email:string,otp:number):void{
        console.log(email);
        
        const mailOptions :nodemailer.SendMailOptions = {
            from:'murshidm2x@gmail.com',
            to:email,
            subject:'BedAura Email Verification',
            text: `${email},your verification code is: ${otp}`
        }
        this.transporter.sendMail(mailOptions,(err)=>{
            if(err){
                console.log(err)
            }else{
                console.log('verification code sent successfully')
            }
        })
    }

}

export default sendMail

