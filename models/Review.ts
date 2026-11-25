import mongoose, { model,Types,Model,Schema } from "mongoose";
import { IReview,ReviewModel } from "../interfaces/userInterface";

const ReviewSchema=new Schema<IReview, ReviewModel>({
   
    rating:{
        type:Number,
        min:1,
        max:5,
        required:[true,'Pls provide rating']
    },
    title:{
        type:String,
        trim:true,
        required:[true,'Pls provide review title'],
        maxlength:100
    },
    comment:{
        type:String,
         required:[true,'Pls provide review text'],
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true

    },
    product:{
        type:mongoose.Schema.ObjectId,
        ref:"Product",
        required:true
    }

},{timestamps:true})


// one user can leave one review per product
ReviewSchema.index({product:1,user:1},{unique:true})

ReviewSchema.statics.calculateAverageRating=async function(this:ReviewModel,productId:Types.ObjectId){
   const result=await this.aggregate([
    {$match:{product:productId}},
    {$group : {
        _id:null,
        averageRating:{$avg:'$rating'},
        numOfReviews:{$sum:1}
    }}
   ])
    console.log(result)
  try {
     await mongoose.model('Product').findOneAndUpdate({_id:productId},{
          averageRating:Math.ceil(result[0]?.averageRating || 0),
          numOfReviews:result[0]?.averageRating || 0

     })
  } catch (error) {
      console.log(error)
  }
}

ReviewSchema.post('save',async function(){
    await (this.constructor as ReviewModel).calculateAverageRating(this.product)
})

ReviewSchema.post('deleteOne',{ document: true, query: false },
    async function(){
    await (this.constructor as ReviewModel).calculateAverageRating(this.product)
})

export const Review=model('Review',ReviewSchema)