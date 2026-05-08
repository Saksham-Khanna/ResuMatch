require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const path = require('path');

const analysisRoutes = require('./routes/analysisRoutes');
const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');



const app = express();

// Security
app.use(helmet());
app.use(morgan('dev'));

// Rate limiting - Relaxed for production stability
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Increased from 100 to 500
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:8080',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      const isAllowed = allowedOrigins.some((allowed) => origin.startsWith(allowed)) || 
                        origin.includes('vercel.app') ||
                        origin.includes('onrender.com');
                        
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(null, true); // Fallback to allow during deployment troubleshooting
      }
    },
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Specific route for Stripe webhook (needs raw body)
// IMPORTANT: This must be before express.json()
app.use('/api/payment', paymentRoutes);

app.use(express.json({ limit: '10mb' }));

app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/analysis', analysisRoutes);
app.use('/api/auth', authRoutes);



// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

// Database connection
const connectDB = async () => {
  try {
    if (process.env.MONGODB_URI && !process.env.MONGODB_URI.includes('<username>')) {
      await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000, // Timeout after 5s
      });
      console.log('✅ MongoDB connected');
    } else {
      throw new Error('No valid URI');
    }
  } catch (err) {
    console.warn('❌ Primary MongoDB connection failed:', err.message);
    console.log('⏳ Setting up local Memory Server fallback...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      console.log('✅ Connected to Local Memory Server (Data will reset on restart)');
    } catch (fallbackErr) {
      console.error('❌ Fallback MongoDB failed:', fallbackErr.message);
    }
  }
};

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
