const AdminUser = require('../models/AdminUser');
const StaffUser = require('../models/StaffUser');
const Role = require('../models/Role');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id, user_type) => {
    return jwt.sign({ id, user_type }, process.env.JWT_SECRET || 'fallback_secret', {
        expiresIn: process.env.JWT_EXPIRE || '1h', // Updated to 1h for better security
    });
};

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public (for initial setup) / Private (production)
const registerUser = async (req, res) => {
    const { email, password, role_name, type } = req.body;
    const user_type = type === 'staff' ? 'StaffUser' : 'AdminUser';

    try {
        const Model = user_type === 'AdminUser' ? AdminUser : StaffUser;

        // Cross-collection uniqueness check
        const adminExists = await AdminUser.findOne({ email });
        const staffExists = await StaffUser.findOne({ email });

        if (adminExists || staffExists) {
            return res.status(400).json({ success: false, message: 'Email already registered in the system' });
        }

        let role = await Role.findOne({ name: role_name || 'Admin' });
        if (!role) {
            role = await Role.create({ name: role_name || 'Admin', permissions: [] });
        }

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const user = await Model.create({
            email,
            password_hash,
            role_id: role._id
        });

        if (user) {
            res.status(201).json({
                success: true,
                user: { _id: user._id, email: user.email, role: role.name, user_type },
                token: generateToken(user._id, user_type),
            });
        } else {
            res.status(400).json({ success: false, message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Authenticate a user
// @route   POST /api/v1/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await AdminUser.findOne({ email }).populate('role_id');
        let user_type = 'AdminUser';

        if (!user) {
            user = await StaffUser.findOne({ email }).populate('role_id');
            user_type = 'StaffUser';
        }

        if (user && user.status === 'active' && (await bcrypt.compare(password, user.password_hash))) {
            res.json({
                success: true,
                user: {
                    _id: user._id,
                    email: user.email,
                    role: user.role_id.name,
                    user_type,
                    permissions: user.role_id.permissions,
                },
                token: generateToken(user._id, user_type),
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials or inactive account' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
const getMe = async (req, res) => {
    res.status(200).json({
        success: true,
        user: {
            _id: req.user._id,
            email: req.user.email,
            role: req.user.role_id.name,
            user_type: req.user.user_type,
            permissions: req.user.role_id.permissions,
        }
    });
};

module.exports = { registerUser, loginUser, getMe };
