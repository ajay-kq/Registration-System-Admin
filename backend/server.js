const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const connectDB = require('./src/config/db');

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));

// Request parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('dev'));

// Vercel Serverless DB Connection Hook
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error('Middleware DB Error.');
        res.status(500).json({ success: false, message: 'Database connecting issue.' });
    }
});

// Basic health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Setup API Routes
app.use('/api/v1/auth', require('./src/routes/authRoutes'));
app.use('/api/v1/members', require('./src/routes/memberRoutes'));
app.use('/api/v1/orders', require('./src/routes/orderRoutes'));
app.use('/api/v1/payments', require('./src/routes/paymentRoutes'));
app.use('/api/v1/deliveries', require('./src/routes/deliveryRoutes'));
app.use('/api/v1/templates', require('./src/routes/templateRoutes'));
app.use('/api/v1/messages', require('./src/routes/messageRoutes'));
app.use('/api/v1/system', require('./src/routes/systemRoutes'));

// TEMPORARY TESTING ROUTES
app.use('/api/v1/testing', require('./src/routes/testingRoutes'));

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
});

// When running locally under Nodemon, NOT via Vercel CLI
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Development Server running on http://localhost:${PORT}`);
    });
}

// Export for Vercel Serverless build processor
module.exports = app;
