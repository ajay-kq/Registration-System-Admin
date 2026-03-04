const express = require('express');
const router = express.Router();
const { MessageLog } = require('../models/Template'); // defined in same file
const { protect, authorize } = require('../middlewares/authMiddleware');

router.use(protect);

// @desc    Log a generated message (WhatsApp sent)
// @route   POST /api/v1/messages/log
router.post('/log', authorize(['messages.generate', 'Sales Staff', 'Admin']), async (req, res) => {
    try {
        const { member_id, order_id, message_content } = req.body;
        const log = await MessageLog.create({
            member_id,
            order_id,
            message_content,
            sent_by: req.user._id
        });
        res.status(201).json({ success: true, data: log });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
