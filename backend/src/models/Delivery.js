const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, unique: true },
    delivery_status: {
        type: String,
        enum: ['pending', 'dispatched', 'in_transit', 'delivered', 'returned'],
        default: 'pending'
    },
    tracking_number: { type: String },
    courier_name: { type: String },
    address: { type: String, required: true },
    updated_at: { type: Date, default: Date.now }
});

const deliveryStatusHistorySchema = new mongoose.Schema({
    delivery_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Delivery', required: true },
    previous_status: { type: String },
    new_status: { type: String, required: true },
    updated_by: { type: mongoose.Schema.Types.ObjectId, refPath: 'user_type' },
    user_type: { type: String, enum: ['AdminUser', 'StaffUser'] },
    updated_at: { type: Date, default: Date.now }
});

const Delivery = mongoose.model('Delivery', deliverySchema);
const DeliveryStatusHistory = mongoose.model('DeliveryStatusHistory', deliveryStatusHistorySchema);

module.exports = { Delivery, DeliveryStatusHistory };
