const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.use(protect);

// @desc    Add Payment
// @route   POST /api/v1/payments
router.post('/', authorize(['payments.add', 'Accounts Staff']), async (req, res) => {
    try {
        const payment = await Payment.create(req.body);
        res.status(201).json({ success: true, data: payment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @desc    Get Payments by Order ID
// @route   GET /api/v1/payments/order/:orderId
router.get('/order/:orderId', authorize(['payments.read', 'Accounts Staff', 'Admin']), async (req, res) => {
    try {
        const payments = await Payment.find({ order_id: req.params.orderId });
        res.status(200).json({ success: true, data: payments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
