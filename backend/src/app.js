import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimiter from './middlewares/ratelimiter.js';
import database from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import enclosureRoutes from './routes/enclosureRoutes.js';


// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// DATABASE CONNECTION 
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

// ========== API ROUTES ==========
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/enclosures', enclosureRoutes);


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

export default app;