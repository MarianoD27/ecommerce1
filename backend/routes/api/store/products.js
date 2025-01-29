const express = require('express')
const router = express.Router()
const storeController = require('../../../controllers/storeController')


router.route('/')
  .post(storeController.addProduct)
  .get(storeController.getProducts)
router.route('/:id')
  .get(storeController.getProductById)

module.exports = router