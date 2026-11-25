import * as CustomError from "../errors"

export const checkPermissions=(requestUser:any,resourceUserId:any)=>{
    // console.log(requestUser);
    // console.log(resourceUserId)
    // console.log(typeof resourceUserId)

    if(requestUser.role==='admin') return;
    if(requestUser.userId.toString()===resourceUserId.toString()) return;

    throw new CustomError.UnauthorizedError(
        'Not authorized to access this route'
    )

}