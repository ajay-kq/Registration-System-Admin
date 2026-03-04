const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    amount: { type: Number, required: true },
    method: {
        type: String,
        enum: ['upi', 'bank_transfer', 'cash', 'card'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    transaction_ref: { type: String },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);
