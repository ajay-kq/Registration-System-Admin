const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product_name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
    order_number: { type: String, required: true, unique: true },
    member_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
    order_type: { type: String, enum: ['sales', 'auction', 'ld'], required: true },
    items: [orderItemSchema],
    total_amount: { type: Number, required: true },
    status: {
        type: String,
        enum: ['draft', 'confirmed', 'processing', 'completed', 'cancelled'],
        default: 'draft'
    },
    payment_status: {
        type: String,
        enum: ['pending', 'partial', 'paid', 'refunded'],
        default: 'pending'
    },
    created_by: { type: mongoose.Schema.Types.ObjectId, refPath: 'user_type' },
    user_type: { type: String, enum: ['AdminUser', 'StaffUser'] },
    created_at: { type: Date, default: Date.now },
});

// Order History Snapshot Schema
const orderHistorySchema = new mongoose.Schema({
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    previous_data_snapshot: { type: Object, required: true },
    modified_by: { type: mongoose.Schema.Types.ObjectId, refPath: 'user_type', required: true },
    user_type: { type: String, enum: ['AdminUser', 'StaffUser'], required: true },
    modified_at: { type: Date, default: Date.now },
});

const Order = mongoose.model('Order', orderSchema);
const OrderHistory = mongoose.model('OrderHistory', orderHistorySchema);

module.exports = { Order, OrderHistory };
