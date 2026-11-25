import express from 'express'
import { authUser,authorizePerimission } from '../middleware/authentication'
import { createProduct,getAllProduct,getSingleProduct,
    updateProduct,deleteProduct,uploadImage
 } from '../controllers/productController'

import { getSingleProductReviews } from '../controllers/reviewController'




export const router=express.Router()

router.route('/').post([authUser,authorizePerimission('admin')],createProduct).get(getAllProduct)

router.route('/uploadimage').post(authUser,uploadImage)

router.route('/:id')
.get(getSingleProduct)
.patch([authUser,authorizePerimission('admin')],updateProduct)
.delete([authUser,authorizePerimission('admin')],deleteProduct)


router.route('/:id/reviews').get(getSingleProductReviews)