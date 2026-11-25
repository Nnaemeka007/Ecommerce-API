import { Request,Response } from "express";
import { User } from "../models/User";
import { StatusCodes } from "http-status-codes";
import * as CustomError from "../errors"
import { createTokenUser,attachCookiesToReponse, checkPermissions } from "../utils";


export const getAllUsers=async(req:Request,res:Response)=>{
    console.log(req.user)
    const users=await User.find({role:'user'}).select('-password')
    res.status(StatusCodes.OK).json({users,count:users.length})
}

export const getSingleUser=async(req:Request,res:Response)=>{
  const user=await User.findOne({_id:req.params.id}).select('-password')

  if(!user){
    throw new CustomError.NotFoundError(`No user with id:${req.params.id}`)
  }
  checkPermissions(req.user,user._id)
  res.status(StatusCodes.OK).json({user})
}

export const showCurrentUser=async(req:Request,res:Response)=>{
  res.status(StatusCodes.OK).json({user:req.user})
}

// update user with user.save()
export const updateUser=async(req:Request,res:Response)=>{
    const{name,email}=req.body;
    if(!name || !email){
       throw new CustomError.BadRequestError('both name and email are needed')
    }
   
     const user=await User.findOne({_id:req.user.userId})
       
    if(!user){
     throw new CustomError.NotFoundError(`No user with id:${req.params.id}`)
    }
     user.name=name;
     user.email=email
      
     await user.save()

    const tokenUser=createTokenUser(user)
    attachCookiesToReponse({res,user:tokenUser})
    res.status(StatusCodes.OK).json({user:tokenUser})
}

export const updateUserPassword=async(req:Request,res:Response)=>{
    const{oldPassword,newPassword}=req.body;
    if(!oldPassword || !newPassword){
        throw new CustomError.BadRequestError('both passwords are needed')
    }
    const user=await User.findOne({_id:req.user.userId})
    if (!user) {
    throw new CustomError.NotFoundError('User not found');
  }


    const isPasswordCorrect=await user?.comparedPassword(oldPassword)
    if(!isPasswordCorrect){
        throw new CustomError.UnauthenticatedError('Invalid Credentials__P')
    }
    user.password=newPassword
    await user?.save()
    res.status(StatusCodes.OK).json({msg:"Password updated successfully"})
}

// update user with findOneAndUpdate
// export const updateUser=async(req:Request,res:Response)=>{
//     const{name,email}=req.body;
//     if(!name || !email){
//        throw new CustomError.BadRequestError('both name and email are needed')
//     }
   
//     const user=await User.findOneAndUpdate(
//         {_id:req.user.userId},
//         {name,email},
//         {new:true,runValidators:true}
//     )
     
//     if(!user){
//      throw new CustomError.NotFoundError(`No user with id:${req.params.id}`)
//   }
//     const tokenUser=createTokenUser(user)
//     attachCookiesToReponse({res,user:tokenUser})
//     res.status(StatusCodes.OK).json({user:tokenUser})
// }
