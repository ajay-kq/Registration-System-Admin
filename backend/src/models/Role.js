const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true, // e.g., 'Super Admin', 'Admin', 'Sales Staff'
    },
    permissions: [{
        type: String, // e.g., 'orders.create', 'reports.view'
    }]
});

module.exports = mongoose.model('Role', roleSchema);
