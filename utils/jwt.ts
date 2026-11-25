import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import type { Response as ExpressResponse } from "express";
import { StatusCodes } from "http-status-codes"


interface TokenPayload extends JwtPayload {
  userId: string;
  name: string;
  role: string;
}

 interface AttachCookiesParams{
    res:ExpressResponse;
    user:TokenPayload
}


const getSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET not found in env");
  }
  return secret;
};

export const createJWT = ({ payload }: { payload: TokenPayload }): string => {
  return jwt.sign(payload, getSecret(), {
    expiresIn: (process.env.JWT_LIFETIME ?? "1d") as SignOptions["expiresIn"],
  });
};

export const isTokenValid = ({ token }: { token: string }): TokenPayload => {
  return jwt.verify(token, getSecret()) as TokenPayload;
};

export const attachCookiesToReponse=({res,user}:AttachCookiesParams)=>{
    const token=createJWT({payload:user});

     const oneDay=1000*60*60*24;

      res.cookie('token',token,{
          httpOnly:true,
          expires:new Date(Date.now() + oneDay ),
          secure:process.env.NODE_ENV==='production',
          signed:true
      })  
res.status(StatusCodes.CREATED).json({user})
}

// import jwt,{JwtPayload,SignOptions} from "jsonwebtoken"

// interface TokenPayload extends JwtPayload{
//     userId:string;
//     name:string;
//     role:string
// }



// export const createJWT=({payload}:{payload:TokenPayload}):string=>{

//     if(!process.env.JWT_SECRET){
//         throw new Error('JWT_SECRET not founf in env')
//     }
//     const token=jwt.sign(payload,process.env.JWT_SECRET,{
//         expiresIn:process.env.JWT_LIFETIME  as SignOptions['expiresIn']
//     })
//     return token;
// }


//  if(!process.env.JWT_SECRET){
//         throw new Error('JWT_SECRET not founf in env')
//     }
// export const isTokenValid=({token}:{token:string}):TokenPayload=>jwt.verify(token,process.env.JWT_SECRET) as TokenPayload

