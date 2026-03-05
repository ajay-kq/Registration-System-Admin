const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '../.env' }); // Load backend .env

const AdminUser = require('../src/models/AdminUser');
const Role = require('../src/models/Role');
const connectDB = require('../src/config/db');

const seedAdmin = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await connectDB();

        console.log('Checking for existing Admin role...');
        let adminRole = await Role.findOne({ name: 'Admin' });

        if (!adminRole) {
            console.log('Admin role not found. Creating...');
            adminRole = await Role.create({
                name: 'Admin',
                permissions: ['all'] // Simplified full access for now
            });
            console.log('Admin role created successfully.');
        } else {
            console.log('Admin role already exists.');
        }

        console.log('Checking for default admin account (admin)...');
        const adminEmail = 'admin'; // Note: email field acts as the username here
        let defaultAdmin = await AdminUser.findOne({ email: adminEmail });

        if (!defaultAdmin) {
            console.log(`Default admin account not found. Creating with password 'admin'...`);

            const salt = await bcrypt.genSalt(10);
            const password_hash = await bcrypt.hash('admin', salt);

            defaultAdmin = await AdminUser.create({
                email: adminEmail,
                password_hash,
                role_id: adminRole._id,
                status: 'active'
            });
            console.log('Default admin account created successfully!');
        } else {
            console.log('Default admin account already exists. Updating password to "admin"...');
            const salt = await bcrypt.genSalt(10);
            const password_hash = await bcrypt.hash('admin', salt);
            defaultAdmin.password_hash = password_hash;
            await defaultAdmin.save();
            console.log('Password updated.');
        }

        console.log('\n--- Seeding Complete ---');
        console.log('Login Email/Username: admin');
        console.log('Login Password: admin');
        console.log('------------------------\n');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedAdmin();
