import app from './app.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configuration
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Function to start server
const startServer = () => {
  try {
    const server = app.listen(PORT, () => {
      console.log(`
🚀 ZooSync Backend Server Started
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📡 Environment: ${NODE_ENV}
🔗 Port: ${PORT}
📍 URL: http://localhost:${PORT}
❤️  Health Check: http://localhost:${PORT}/health
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      `);
    });

    // Graceful shutdown handling
    const shutdown = (signal) => {
      console.log(`\n⚠️  ${signal} received. Closing server...`);
      server.close(() => {
        console.log('✅ Server closed gracefully');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Start the server
startServer();