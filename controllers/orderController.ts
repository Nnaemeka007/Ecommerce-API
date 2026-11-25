import express,{Request,Response} from 'express';
import { Order } from '../models/Orders';
import { Product } from '../models/Product';
import { StatusCodes } from 'http-status-codes';
import { checkPermissions } from '../utils';
import * as CustomError from '../errors'
import { FakeStripeParams,FakeStripeResponse } from '../interfaces/userInterface';


const fakeStripeAPI=async ({amount,currency}:FakeStripeParams):Promise<FakeStripeResponse> =>{
     const client_secret='someRandomValue'
     return {client_secret,amount}
}


export const getAllOrders=async(req:Request,res:Response)=>{
     const orders=await Order.find({})
     res.status(StatusCodes.OK).json({orders,count:orders.length})
}

export const getSingleOrder=async(req:Request,res:Response)=>{
    const {id:orderId}=req.params;
    const order=await Order.findOne({_id:orderId})
     if(!order){
        throw new CustomError.NotFoundError(
            'No order with id :${order}'
        )
     }
    checkPermissions(req.user,order?.user)
     res.status(StatusCodes.OK).json({order})
}

export const getCurrentUserOrders=async(req:Request,res:Response)=>{
     const orders=await Order.find({user:req.user.userId})
     res.status(StatusCodes.OK).json({orders,count:orders.length})
}

export const createOrders=async(req:Request,res:Response)=>{
    const {items:cartItems,tax,shippingFee}=req.body;

     if(!cartItems || cartItems.length < 1){
        throw new CustomError.BadRequestError('No cart item provided')
     }

     if(!tax || !shippingFee){
        throw new CustomError.BadRequestError('tax and shippingFee needed')
        
     }
      
     let orderItems:any[]=[];
     let subtotal=0;

     for(const item of cartItems){
        const dbProduct=await Product.findOne({_id:item.product})
        if(!dbProduct){
           throw new CustomError.NotFoundError(`No product with id: ${item.product}`)  
        }

        const{name,price,image,_id}=dbProduct
        // console.log(name,price,image)
        const singleOrderItem={
             amount:item.amount,
             name,
             price,
             image,
            product:_id 
        }
        // add item to order
        orderItems=[...orderItems,singleOrderItem];
        // calculate subtotal
         subtotal += item.amount * price
         }
    //     console.log(orderItems)
    //     console.log(subtotal)

        //calculate total 
        const total:number=tax+shippingFee+subtotal

        const paymentIntent=await fakeStripeAPI({
            amount:total,
            currency:'usd'
        })

       const order=await Order.create({
         orderItems,
         total,
         subtotal,
         tax,
         shippingFee,
         clientSecret:paymentIntent.client_secret,
         user:req.user.userId
       }) 
       res.status(StatusCodes.CREATED).json({order,clientSecret:order.clientSecret})
}

export const updateOrder=async(req:Request,res:Response)=>{
         const{id:orderId}=req.params;
         const{paymentIntentId}=req.body;
          
      

         const order=await Order.findOne({_id:orderId})
          if(!order){
             throw new CustomError.NotFoundError(`No order with id:${orderId}`)
         }
           
         checkPermissions(req.user,order.user)
            
          order.paymentIntentId=paymentIntentId
          order.status='paid'
         await order.save()
         res.status(StatusCodes.OK).json({order})
         
}