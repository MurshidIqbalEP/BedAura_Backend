import jwt from 'jsonwebtoken'

class JWTToken  {
    generateToken(userId: string, role: string): string {
        
        const SECRETKEY=process.env.JWT_SECRET_KEY;
        if(SECRETKEY){
            const token=jwt.sign({userId,role},SECRETKEY,{
                expiresIn:'30d'
            })
            return token
        }
        throw new Error('JWT key is not defined!')
    }
}

export default JWTToken