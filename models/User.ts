import mongoose, { model,Schema} from "mongoose";
import validator from 'validator'
import { IUser } from "../interfaces/userInterface";
import bcrpyt from 'bcrypt'

const UserSchema=new Schema<IUser>({
name:{
  type:String,
  required:[true,'name needs to be provided'],
  maxlength:50,
  minlength:3
},
email:{
  type:String,
   unique:true,
  required:[true,'email needs to be provided '],
  validate:{
    validator:(value:string)=>validator.isEmail(value),
    message:'Please provide a valid email'
  },
},
password:{
  type:String,
  required:[true,'password needs to be provided'],
  minlength:6
},
role:{
    type:String,
    enum:['admin','user'],
    default:'user'
}
})

UserSchema.pre('save' , async function(){
  // console.log(this.modifiedPaths());
  // console.log(this.isModified('name'))

  if(!this.isModified('password')) return;

const salt=await bcrpyt.genSalt(10)
this.password=await bcrpyt.hash(this.password,salt)
})

UserSchema.methods.comparedPassword=async function(userPassword:string):Promise<boolean>{
const isMatch=await bcrpyt.compare(userPassword,this.password)
return isMatch
}

export const User=model<IUser>('User',UserSchema) 