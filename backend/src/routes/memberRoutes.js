const express = require('express');
const router = express.Router();
const { getMembers, getMember, updateMember } = require('../controllers/memberController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// All member paths require authentication
router.use(protect);

// Require 'Admin' or 'Sales Staff' type permissions
// Exact string depends on how we build the permission set
router.route('/')
    .get(getMembers)
// .post(authorize(['members.create']), createMember); // Normally handled by Registration app

router.route('/:id')
    .get(getMember)
    .put(authorize(['members.update']), updateMember);

module.exports = router;
