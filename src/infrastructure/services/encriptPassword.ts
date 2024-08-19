import bcrypt from 'bcrypt'

class EncriptPassword{
    async encryptPassword(password:string){
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt);
        return hash
    }

    async compare(password: string, hashedPassword: string): Promise<boolean> {
       
        return await bcrypt.compare(password, hashedPassword)
   }
}

export default EncriptPassword