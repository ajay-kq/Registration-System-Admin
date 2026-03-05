const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const AdminUser = require('../models/AdminUser');
const Role = require('../models/Role');

let isConnected = false; // Cache connection state for Serverless environments

const connectDB = async () => {
    if (isConnected) {
        console.log('=> Using cached database connection');
        return;
    }

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        });

        isConnected = !!conn.connections[0].readyState;
        console.log(`=> MongoDB Connected: ${conn.connection.host} (New Connection)`);

        // --- AUTO-SEED DEFAULT ADMIN ---
        try {
            let adminRole = await Role.findOne({ name: 'Admin' });
            if (!adminRole) {
                adminRole = await Role.create({
                    name: 'Admin',
                    permissions: ['all']
                });
                console.log('=> Created Admin Role');
            }

            const adminEmail = 'admin';
            let defaultAdmin = await AdminUser.findOne({ email: adminEmail });

            if (!defaultAdmin) {
                const salt = await bcrypt.genSalt(10);
                const password_hash = await bcrypt.hash('admin', salt);

                await AdminUser.create({
                    email: adminEmail,
                    password_hash,
                    role_id: adminRole._id,
                    status: 'active'
                });
                console.log('=> Seeded Default Admin Account (admin/admin)');
            }
        } catch (seedErr) {
            console.error('=> Seed Error (Non-Fatal):', seedErr.message);
        }
        // -------------------------------

    } catch (error) {
        console.error(`=> Error connecting to MongoDB: ${error.message}`);
        // DO NOT process.exit(1) in a serverless function, just throw to be caught by the middleware
        throw error;
    }
};

module.exports = connectDB;
