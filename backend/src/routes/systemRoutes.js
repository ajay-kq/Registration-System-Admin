const express = require('express');
const router = express.Router();
const { Notification, AuditLog } = require('../models/Notification');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.use(protect);

// --- NOTIFICATIONS ---
router.get('/notifications', async (req, res) => {
    try {
        const notifications = await Notification.find({ user_id: req.user._id }).sort({ created_at: -1 });
        res.status(200).json({ success: true, data: notifications });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.put('/notifications/:id/read', async (req, res) => {
    try {
        const notif = await Notification.findOneAndUpdate(
            { _id: req.params.id, user_id: req.user._id },
            { read_status: true },
            { new: true }
        );
        res.status(200).json({ success: true, data: notif });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// --- AUDIT LOGS ---
// @route GET /api/v1/audit-logs
// @access Super Admin / Admin
router.get('/audit-logs', authorize(['audit.read', 'Super Admin', 'Admin']), async (req, res) => {
    try {
        const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(100).populate('user_id', 'email');
        res.status(200).json({ success: true, data: logs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
