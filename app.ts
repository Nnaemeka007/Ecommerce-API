import 'dotenv/config'
import  'morgan'
import express,{Request,Response} from 'express'
import mongoose from 'mongoose'
import { notFound as notFoundMiddleware } from './middleware/not-found'
import { errorHandler as errorHandlerMiddleware } from './middleware/error-handler'
import morgan from 'morgan'
import cookieParser from "cookie-parser"
import fileUpload from "express-fileupload"

// router
import { router as authRouter } from './routes/authRoute'
import { router as userRouter } from './routes/userRoute'
import { router as productRouter } from './routes/productRoute'
import { router as reviewRouter } from './routes/reviewRoute'
import { router as orderRouter } from './routes/orderRoute'
const app=express()


// built-in middleware
app.use(morgan('tiny'))
app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))

app.use(express.static('./public'))
app.use(fileUpload())
// routes


app.get('/',(req:Request,res:Response)=>{
  res.send('E-commerce-API')
})

app.get('/api/v1',(req:Request,res:Response)=>{
    // console.log(req.cookies)
    console.log(req.signedCookies)
  res.send('E-commerce-API')
})

app.get('/',(req:Request,res:Response)=>{
  res.send('E-commerce-API')
})

app.use('/api/v1/auth',authRouter)
app.use('/api/v1/users',userRouter)
app.use('/api/v1/products',productRouter)
app.use('/api/v1/reviews',reviewRouter)
app.use('/api/v1/orders',orderRouter)


// middleware
app.use(errorHandlerMiddleware)
app.use(notFoundMiddleware)


// database
const port=process.env.PORT
const start=async()=>{
    if(!process.env.DATABASE_URL){
    throw new Error('URL not seen in the env variable')
}
try{
    await mongoose.connect(process.env.DATABASE_URL)
    app.listen(port,()=>{
    console.log(`Server is hosted at ${port}...`)
})
}catch(error){
  console.log(error)
}
}
start()