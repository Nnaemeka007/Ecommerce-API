
import { IUser } from "../interfaces/userInterface";

export const createTokenUser=(user:IUser)=>{
 return { 
        name:user.name,
        userId:user._id.toString(),
        role:user.role
    }
}