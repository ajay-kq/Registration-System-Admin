const mongoose = require('mongoose');

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
    } catch (error) {
        console.error(`=> Error connecting to MongoDB: ${error.message}`);
        // DO NOT process.exit(1) in a serverless function, just throw to be caught by the middleware
        throw error;
    }
};

module.exports = connectDB;
