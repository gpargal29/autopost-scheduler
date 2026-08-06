const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const initCronJobs = require('./jobs/cronJobs');

dotenv.config();

// Connect to MongoDB Database
connectDB();

// Initialize Node Cron Background Scheduler
initCronJobs();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/health', require('./routes/health'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/quotes', require('./routes/quoteRoutes'));
app.use('/api/social-accounts', require('./routes/socialRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
