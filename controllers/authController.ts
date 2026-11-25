import { Request,Response } from "express"
import { StatusCodes } from "http-status-codes"
import { User } from "../models/User"
import * as  CustomError from '../errors'
import { createJWT,attachCookiesToReponse,createTokenUser } from "../utils"


export const register=async(req:Request,res:Response)=>{
    const{email,name,password}=req.body
    const existEmail=await User.findOne({email});
    if(existEmail){
        throw new CustomError.BadRequestError('cant have double/duplicate emails')
    }

    // making first user adim automatically
    const isFirstAccount=await User.countDocuments({})===0;
     const role =  isFirstAccount ?'admin':'user'

     const user= await User.create({name,email,password,role});
     
    // const tokenUser={
    //     name:user.name,
    //     userId:user._id.toString(),
    //     role:user.role
    // }
    // OR

    const tokenUser=createTokenUser(user)
    // const token=createJWT({payload:tokenUser})
    //  const token=jwt.sign(tokenUser,'jwtSceret',{expiresIn:'1d'})

    // const oneDay=1000*60*60*24;
    // res.cookie('token',token,{
    //     httpOnly:true,
    //     expires:new Date(Date.now() + oneDay )
    // })
    attachCookiesToReponse({res,user:tokenUser})
    res.status(StatusCodes.CREATED).json({user:tokenUser})
}

export const login=async (req:Request,res:Response)=>{
    const{email,password}=req.body
    if(!email || !password){
        throw new CustomError.BadRequestError('email and password is needed')
    }
    const user=await User.findOne({email})

    if(!user){
        throw new CustomError.UnauthenticatedError('Invalid Credentials')
    }
   
    const  isPasswordCorrect=await user.comparedPassword(password)
    if(!isPasswordCorrect){
        throw new CustomError.UnauthenticatedError('Invalid Credential')
    }
     
    const tokenUser=createTokenUser(user)
    // const tokenUser={
    //     name:user.name,
    //     userId:user._id.toString(),
    //     role:user.role
    // }
    attachCookiesToReponse({res,user:tokenUser})
    res.status(StatusCodes.OK).json({user:tokenUser})
}

export const logout=async (req:Request,res:Response)=>{
    res.cookie('token','loggedOut',{
        httpOnly:true,
        expires:new Date(Date.now())
    })
  res.status(StatusCodes.OK).json({msg:'user logged out'})
}