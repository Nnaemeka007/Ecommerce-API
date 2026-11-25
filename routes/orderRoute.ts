import express from "express";
import { getAllOrders,getSingleOrder,getCurrentUserOrders,
    createOrders,updateOrder
 } from "../controllers/orderController";
import { authUser,authorizePerimission } from "../middleware/authentication";



 export const router=express.Router()

 router.route('/').get([authUser,authorizePerimission('admin')],getAllOrders).post(authUser,createOrders)
 router.route('/showAllMyOrders').get(authUser,getCurrentUserOrders)
 router.route('/:id').get(authUser,getSingleOrder).patch(authUser,updateOrder) 