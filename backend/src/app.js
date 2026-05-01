const express = require('express');
const cors = require('cors');
const rateLimiter = require('./middlewares/ratelimiter');
const dotenv = require('dotenv');
const database = require('./config/db');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// DATABASE CONNECTION 
// Connect to MongoDB before starting server
(async () => {
  await database.connect();
})();

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

// RATE LIMITING - Apply globally
app.use(rateLimiter);

// Serve static files
app.use(express.static('public'));

// HEALTH CHECK
app.get('/health', (req, res) => {
  // Include database status in health check
  const dbStatus = database.getStatus();
  
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'ZooSync Backend',
    database: {
      connected: dbStatus.isConnected,
      state: dbStatus.readyStateText,
      name: dbStatus.name,
      host: dbStatus.host
    }
  });
});


// ========== API ROUTES (to be added later) ==========
// app.use('/api/auth', authRoutes);
// app.use('/api/animals', animalRoutes);
// etc...

// TEST ROUTE
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'ZooSync API is working!',
    database: database.getStatus().isConnected ? 'Connected ✅' : 'Disconnected ❌'
  });
});

// 404 HANDLER
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.originalUrl
  });
});

// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.stack);
  
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

module.exports = app;