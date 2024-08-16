import bcrypt from 'bcrypt'

class EncriptPassword{
    async encryptPassword(password:string){
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt);
        return hash
    }
}

export default EncriptPassword