import 
{ getAllUsers,getSingleUser,
    showCurrentUser,updateUser,
    updateUserPassword }
     from "../controllers/userController";

import express from 'express'
import { authUser,authorizePerimission } from "../middleware/authentication";


export const router=express.Router()

router.route('/').get(authUser,authorizePerimission('admin'),getAllUsers)

router.route('/showMe').get(authUser,showCurrentUser)
router.route('/updatedUser').patch(authUser,updateUser)
router.route('/updateUserPassword').patch(authUser,updateUserPassword)

router.route('/:id').get(authUser,getSingleUser)
