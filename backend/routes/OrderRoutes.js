const express = require('express');
const router = express.Router();
const orderController = require('../controllers/OrderController');

router.post('/place', orderController.placeOrder);
router.delete('/delete/:orderId', orderController.deleteOrder);
router.get('/get-by-user/:uid', orderController.getOrdersByUser);
router.post('/mark-completed/:orderId', orderController.markOrderCompleted);
router.get('/all', orderController.getAllOrders);

module.exports = router;
