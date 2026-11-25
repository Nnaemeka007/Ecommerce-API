import express from 'express'
import { register,login,logout } from "../controllers/authController";


export const router=express.Router()

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/logout').get(logout)
