const { Order, OrderHistory } = require('../models/Order');

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Private
const createOrder = async (req, res) => {
    try {
        const { order_number, member_id, order_type, items, total_amount } = req.body;

        const order = new Order({
            order_number,
            member_id,
            order_type,
            items,
            total_amount,
            created_by: req.user._id
        });

        const createdOrder = await order.save();
        res.status(201).json({ success: true, data: createdOrder });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get order by ID
// @route   GET /api/v1/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('member_id', 'name email phone');
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        res.status(200).json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update order status
// @route   POST /api/v1/orders/:id/status
// @access  Private
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        let order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Save snapshot to OrderHistory
        await OrderHistory.create({
            order_id: order._id,
            previous_data_snapshot: order.toObject(),
            modified_by: req.user._id
        });

        order.status = status;
        const updatedOrder = await order.save();

        res.status(200).json({ success: true, data: updatedOrder });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { createOrder, getOrderById, updateOrderStatus };
