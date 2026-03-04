const express = require('express');
const router = express.Router();
const { createOrder, getOrderById, updateOrderStatus } = require('../controllers/orderController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/')
    .post(authorize(['orders.create', 'Sales Staff']), createOrder);

router.route('/:id')
    .get(authorize(['orders.read', 'Sales Staff', 'Admin']), getOrderById);

router.route('/:id/status')
    .post(authorize(['orders.update', 'Admin']), updateOrderStatus);

module.exports = router;
