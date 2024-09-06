import jwt from 'jsonwebtoken'

class JWTToken  {
    generateToken(userId: string, role: string): string {
        
        const SECRETKEY=process.env.JWT_SECRET_KEY;
        if(SECRETKEY){
            const token=jwt.sign({userId,role},SECRETKEY,{
                expiresIn:'10d'
            })
            return token
        }
        throw new Error('JWT key is not defined!')
    }

   generateRefreshToken = (userId:string,role: string) => {
        const RefreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as string
        const RefreshToken =  jwt.sign({userId,role },RefreshTokenSecret, { expiresIn: '70d' }); 
        return RefreshToken;
    };

    verifyRefreshToken = (refreshToken: string): Promise<{ valid: boolean, user?: any }> => {
        return new Promise((resolve) => {
            const RefreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as string;
            jwt.verify(refreshToken, RefreshTokenSecret, (err, user) => {
                if (err) {
                    resolve({ valid: false });
                } else {
                    resolve({ valid: true, user });
                }
            });
        });
    }
}

export default JWTToken