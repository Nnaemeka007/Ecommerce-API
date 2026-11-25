import {Request,Response} from "express"
import { Product } from "../models/Product"
import { StatusCodes } from "http-status-codes"
import * as CustomError from "../errors"
import { UploadedFile } from "express-fileupload"
import path from "path"


export const createProduct=async(req:Request,res:Response)=>{
    req.body.user=req.user.userId
  const product=await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({product})
}

export const getAllProduct=async(req:Request,res:Response)=>{
    const products=await Product.find({})
    res.status(StatusCodes.OK).json({products,count:products.length})
}


export const getSingleProduct=async(req:Request,res:Response)=>{
    const{id:productId}=req.params
    const product=await Product.findOne({_id:productId}).populate('reviews')
    if(!product){
        throw new CustomError.NotFoundError(`No product with id:${productId}`)
    }
     res.status(StatusCodes.OK).json({product})
}


export const updateProduct=async(req:Request,res:Response)=>{
    const{id:productId}=req.params
    const product=await Product.findOneAndUpdate({_id:productId},req.body,
        {new:true,runValidators:true})
       
    if(!product){
        throw new CustomError.NotFoundError(`No product with id:${productId}`)
    }  
        
  res.status(StatusCodes.OK).json({product})
}


export const deleteProduct=async(req:Request,res:Response)=>{
      const{id:productId}=req.params
       const product=await Product.findOne({_id:productId})
        if(!product){
        throw new CustomError.NotFoundError(`No product with id:${productId}`)
    }  
    await product.deleteOne()
  res.status(StatusCodes.OK).json({msg:'product deleted successfully'})
}


export const uploadImage=async(req:Request,res:Response)=>{
    // console.log(req.files)
    if(!req.files){
        throw new CustomError.BadRequestError('no File Uploaded')
    }
    
     const productImage=req.files?.image as UploadedFile
     if(!productImage.mimetype.startsWith('image')){
        throw new CustomError.BadRequestError('pls upload image')
     }
  
     const maxSize=124*1024;
     if(productImage.size>maxSize){
          throw new CustomError.BadRequestError('Pls upload image smaller than 1MB')
     }
     const imagePath=path.join(__dirname,'../public/uploads.'+`${productImage.name}`)
     await productImage.mv(imagePath)
     res.status(StatusCodes.OK).json({image:`/uploads/${productImage}`})
}