import * as CustomError from "../errors"
import { isTokenValid } from "../utils"
import { Request,Response,NextFunction } from "express"


export const authUser=async(req:Request,res:Response,next:NextFunction)=>{
 const token=req.signedCookies.token

 if(!token){
    throw new CustomError.UnauthenticatedError('Authentication Invalid')
 }
 try {
    // const payload=isTokenValid ({token})
    // req.user={ name:payload.name,
    //     userId:payload._id.toString(),
    //     role:payload.role}

    // OR

    const{name,userId,role}=isTokenValid({token})
    req.user={name,userId,role}

    next()
 } catch (error) {
    throw new CustomError.UnauthenticatedError('Authentication Invalid')
  } 
}


// export const authorizePerimission=async(req:Request,res:Response,next:NextFunction)=>{
//    if(req.user.role !=='admin'){
//      throw new CustomError.UnauthorizedError('unauthorized to access data')
//    }
//    next()
// }


export const authorizePerimission=(...roles:string[])=>{
    return (req:Request,res:Response,next:NextFunction)=>{
       if(!roles.includes(req.user.role)){
         throw new CustomError.UnauthorizedError('unauthorized to access data')
       }
       next()
    } 
}