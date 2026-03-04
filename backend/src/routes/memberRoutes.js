const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { protect, authorize } = require('../middlewares/authMiddleware');

// The system's Members are stored in the 'users' collection. 
// We create a temporary schema strictly for querying since the primary app manages it.
const UserQuerySchema = new mongoose.Schema({}, { strict: false, collection: 'users' });
const Member = mongoose.models.User || mongoose.model('User', UserQuerySchema);

router.use(protect); // Ensure only logged-in Admin/Staff can access member data

// @desc    Get all registered members (Users collection)
// @route   GET /api/v1/members
// @access  Private (Admin/Staff)
router.get('/', async (req, res) => {
    try {
        // Sort by newest registration first
        const members = await Member.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: members.length,
            data: members
        });
    } catch (error) {
        console.error('Error fetching members:', error);
        res.status(500).json({ success: false, message: 'Server error fetching members' });
    }
});

// @desc    Get single member details
// @route   GET /api/v1/members/:id
// @access  Private (Admin/Staff)
router.get('/:id', async (req, res) => {
    try {
        const member = await Member.findById(req.params.id);
        if (!member) {
            return res.status(404).json({ success: false, message: 'Member not found' });
        }

        res.status(200).json({
            success: true,
            data: member
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error fetching single member' });
    }
});

module.exports = router;
