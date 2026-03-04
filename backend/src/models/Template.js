const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    version: { type: Number, default: 1 },
    created_by: { type: mongoose.Schema.Types.ObjectId, refPath: 'user_type' },
    user_type: { type: String, enum: ['AdminUser', 'StaffUser'] },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

const templateVersionSchema = new mongoose.Schema({
    template_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Template', required: true },
    old_content: { type: String, required: true },
    version: { type: Number, required: true },
    modified_by: { type: mongoose.Schema.Types.ObjectId, refPath: 'user_type' },
    user_type: { type: String, enum: ['AdminUser', 'StaffUser'] },
    modified_at: { type: Date, default: Date.now }
});

const messageLogSchema = new mongoose.Schema({
    member_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    message_content: { type: String, required: true },
    sent_by: { type: mongoose.Schema.Types.ObjectId, refPath: 'user_type', required: true },
    user_type: { type: String, enum: ['AdminUser', 'StaffUser'], required: true },
    sent_at: { type: Date, default: Date.now }
});

const Template = mongoose.model('Template', templateSchema);
const TemplateVersion = mongoose.model('TemplateVersion', templateVersionSchema);
const MessageLog = mongoose.model('MessageLog', messageLogSchema);

module.exports = { Template, TemplateVersion, MessageLog };
