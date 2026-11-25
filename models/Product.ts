
import mongoose,{model,Types,HydratedDocument} from "mongoose";

const ProductSchema=new mongoose.Schema({
    name:{
    type:String,
    required:[true,'pls provide product name'],
    trim:true,
    maxlength:[100,'name cannot be more then 100 chars']
},
price:{
    type:Number,
    required:[true,'pls provide product price'],
    default:0
},
description:{
    type:String,  
    required:[true,'pls provide product description'],
    trim:true,
    maxlength:[1000,'description cannot be more then 1000 chars']
},
image:{
    type:String,
    default:'/uploads/example.jpg'
},
category:{
    type:String,
    required:[true,'pls provide product category'],
    enum:['office','kitchen','bedroom']
},
company:{
     type:String,
    required:[true,'pls provide product company'],
    enum:{
        values:['ikea','liddy','marcos'],
        message:'values is not found'
    }
},
colors:{
    type:[String],
    required:true,
},
featured:{
    type:Boolean,
    default:false,
},    
freeShipping:{
   type:Boolean,
   default:false 
},
inventory:{
    type:Number,
    required:true,
    default:15
},
averageRating:{
    type:Number,
    default:0
},
numOfReviews:{
    type:Number,
    default:0
},
 user:{
    type:mongoose.Types.ObjectId,
    ref:"User",
    required:true
 },

},{timestamps:true,toJSON:{virtuals:true},toObject:{virtuals:true}})


ProductSchema.virtual('reviews',{
    ref:'Review',
    localField:'_id',
    foreignField:'product',
    justOne:false,
    // match:{rating:5}
})


// remove review once product is deleted
ProductSchema.pre('deleteOne',{document:true,query:true},
    async function(this: HydratedDocument<{ _id: mongoose.Types.ObjectId }>){
      await mongoose.model('Review').deleteMany({
        product:this._id
      })
})

export const Product=model('Product',ProductSchema)



