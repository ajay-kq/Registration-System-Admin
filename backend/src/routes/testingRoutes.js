const express = require('express');
const router = express.Router();
const AdminUser = require('../models/AdminUser');
const StaffUser = require('../models/StaffUser');
const { Order, OrderHistory } = require('../models/Order');
const { Delivery, DeliveryStatusHistory } = require('../models/Delivery');
const Payment = require('../models/Payment');
const { Template, TemplateVersion, MessageLog } = require('../models/Template');
const { Notification, AuditLog } = require('../models/Notification');
const Role = require('../models/Role');

// @desc    RESET DATABASE (ADMIN COLLECTIONS ONLY)
// @route   POST /api/v1/testing/reset-db
// @access  Public (TEMPORARY FOR TESTING)
router.post('/reset-db', async (req, res) => {
    try {
        // IMPORTANT: We do NOT drop the 'Member' ('users') collection here to ensure 
        // the core registration application data remains safe. We only wipe Admin app data.

        await AdminUser.deleteMany({});
        await StaffUser.deleteMany({});
        await Order.deleteMany({});
        await OrderHistory.deleteMany({});
        await Delivery.deleteMany({});
        await DeliveryStatusHistory.deleteMany({});
        await Payment.deleteMany({});
        await Template.deleteMany({});
        await TemplateVersion.deleteMany({});
        await MessageLog.deleteMany({});
        await Notification.deleteMany({});
        await AuditLog.deleteMany({});
        await Role.deleteMany({});

        return res.status(200).json({
            success: true,
            message: 'Admin Database Collections Successfully Wiped for Testing! (Core member registrations were untouched)'
        });
    } catch (error) {
        console.error('Error resetting DB:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
