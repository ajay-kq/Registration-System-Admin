const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, refPath: 'user_type', required: true },
    user_type: { type: String, enum: ['AdminUser', 'StaffUser'], required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    read_status: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now }
});

const auditLogSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, refPath: 'user_type', required: true },
    user_type: { type: String, enum: ['AdminUser', 'StaffUser'], required: true },
    action: { type: String, required: true },
    module: { type: String, required: true },
    before: { type: Object },
    after: { type: Object },
    ip_address: { type: String },
    timestamp: { type: Date, default: Date.now }
});

const Notification = mongoose.model('Notification', notificationSchema);
const AuditLog = mongoose.model('AuditLog', auditLogSchema);

module.exports = { Notification, AuditLog };
