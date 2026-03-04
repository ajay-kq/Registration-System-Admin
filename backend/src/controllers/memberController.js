const Member = require('../models/Member');

// @desc    Get all members
// @route   GET /api/v1/members
// @access  Private / Admins
const getMembers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;

        const query = {};
        if (req.query.search) {
            query.$or = [
                { name: { $regex: req.query.search, $options: 'i' } },
                { registrationId: { $regex: req.query.search, $options: 'i' } },
                { email: { $regex: req.query.search, $options: 'i' } },
                { phone: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        const members = await Member.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
        const total = await Member.countDocuments(query);

        res.status(200).json({
            success: true,
            count: members.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: members
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single member
// @route   GET /api/v1/members/:id
// @access  Private / Admins
const getMember = async (req, res) => {
    try {
        const member = await Member.findById(req.params.id);
        if (!member) {
            return res.status(404).json({ success: false, message: 'Member not found' });
        }
        res.status(200).json({ success: true, data: member });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update member
// @route   PUT /api/v1/members/:id
// @access  Private / Admins
const updateMember = async (req, res) => {
    try {
        let member = await Member.findById(req.params.id);
        if (!member) {
            return res.status(404).json({ success: false, message: 'Member not found' });
        }

        // Admins can update status, whatsapp_number, and manual corrections
        member = await Member.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: member });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getMembers,
    getMember,
    updateMember
};
