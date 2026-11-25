import { Types,Model } from "mongoose";

export interface IUser{
    _id:Types.ObjectId;
    name:string;
    email:string;
    password:string;
    role:string;
    comparedPassword(password:string):Promise<boolean>
}


export interface IReview {
  rating: number;
  title: string;
  comment: string;
  user: Types.ObjectId;
  product: Types.ObjectId;
}

// Declares the custom static so TS knows it exists
export interface ReviewModel extends Model<IReview> {
  calculateAverageRating(productId: Types.ObjectId): Promise<void>;
}

export interface ISingleOrder{
   name:string;
   image:string;
   price:number;
   amount:number;
   product:Types.ObjectId
}

export interface IOrder{
    tax:number;
    shippingFee:number;
    subtotal:number;
    total:number;
    clientSecret:string;
    paymentId:string;
    orderItems:string[];
    user:Types.ObjectId,
    status:string;
    paymentIntentId?: string;
}

export interface FakeStripeParams {
  amount: number;
  currency: string;
}

export interface FakeStripeResponse {
  client_secret: string;
  amount: number;
}