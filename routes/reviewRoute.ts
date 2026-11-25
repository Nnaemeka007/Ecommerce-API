import express from "express"
import { createReview,getAllReview,getSingleReview,
    updateReview,deleteReview
 } from "../controllers/reviewController"
import { authUser } from "../middleware/authentication"


 export const router=express.Router()

 router.route('/')
       .post(authUser,createReview)
       .get(getAllReview)

 router.route('/:id')
       .get(getSingleReview)
       .patch(authUser,updateReview)
       .delete(authUser,deleteReview)