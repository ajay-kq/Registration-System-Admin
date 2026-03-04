const mongoose = require('mongoose');

// This schema bridges the existing 'users' collection used by the current Registration App.
// We add 'whatsapp_number' and 'status' which won't break the existing stateless registration flow.
const memberSchema = new mongoose.Schema({
    registrationNumber: { type: Number },         // sNo from sequence
    registrationId: { type: String },             // FMUID:01
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    location: { type: String, default: "" },
    address: { type: String, default: "" },
    pincode: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
    // --- New Admin Specific Fields below ---
    whatsapp_number: { type: String, default: "" },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active'
    },
}, {
    collection: 'users', // CRITICAL: Maps to the existing Registration App collection
    timestamps: true
});

module.exports = mongoose.model('Member', memberSchema);
