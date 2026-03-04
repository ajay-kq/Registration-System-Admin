const mongoose = require('mongoose');

const staffUserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password_hash: { type: String, required: true },
    role_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
    status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
    created_at: { type: Date, default: Date.now },
}, {
    collection: 'staff_users'
});

module.exports = mongoose.model('StaffUser', staffUserSchema);
