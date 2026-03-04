const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');
const StaffUser = require('../models/StaffUser');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

            let user;
            if (decoded.user_type === 'AdminUser') {
                user = await AdminUser.findById(decoded.id).select('-password_hash').populate('role_id');
            } else if (decoded.user_type === 'StaffUser') {
                user = await StaffUser.findById(decoded.id).select('-password_hash').populate('role_id');
            }

            if (!user || user.status !== 'active') {
                return res.status(401).json({ success: false, message: 'Not authorized, invalid user status' });
            }

            // Attach to req object for controllers to use
            req.user = user;
            req.user.user_type = decoded.user_type; // Important for polymorphic saves!

            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
};

const authorize = (permissions) => {
    return (req, res, next) => {
        const userPermissions = req.user.role_id.permissions || [];

        // Super Admins bypass checks
        if (req.user.role_id.name === 'Super Admin') {
            return next();
        }

        const hasPermission = permissions.some(p => userPermissions.includes(p));

        if (!hasPermission) {
            return res.status(403).json({ success: false, message: 'Forbidden. You do not have required permissions.' });
        }

        next();
    };
};

module.exports = { protect, authorize };
