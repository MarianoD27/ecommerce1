const express = require('express')
const router = express.Router()
const storeController = require('../../../controllers/ordersController')


router.route('/')
  .post(storeController.addOrder)
  .get(storeController.getOrders)
  .put(storeController.markOrderAsDone)

module.exports = router