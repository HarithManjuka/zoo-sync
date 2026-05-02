import mongoose from 'mongoose';

//MongoDB Connection Configuration Professional setup with events and error handling
 
class Database {
  constructor() {
    this.isConnected = false;
  }

  // Connect to MongoDB Atlas
   
  async connect() {
    // If already connected, return
    if (this.isConnected) {
      console.log('✅ MongoDB already connected');
      return;
    }

    // Get URI from environment
    const mongoURI = process.env.MONGO_URI;
    
    if (!mongoURI) {
      console.error('❌ MONGO_URI is not defined in .env file');
      process.exit(1);
    }

    // MongoDB connection options (best practices)
    const options = {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds
      family: 4, // Use IPv4, skip trying IPv6
      maxPoolSize: 10, // Maintain up to 10 socket connections
      minPoolSize: 2, // Maintain at least 2 connections
      retryWrites: true,
      retryReads: true,
    };

    try {
      // Connect to MongoDB
      await mongoose.connect(mongoURI, options);
      
      this.isConnected = true;
      
      // Log successful connection
      console.log('✅ MongoDB connected successfully');
      console.log(`📊 Database: ${mongoose.connection.name}`);
      console.log(`🔗 Host: ${mongoose.connection.host}`);
      console.log(`🎯 Port: ${mongoose.connection.port}`);
      
      // Setup connection event handlers
      this.setupEventHandlers();
      
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error.message);
      
      // More detailed error messages for common issues
      if (error.message.includes('bad auth')) {
        console.error('🔐 Authentication failed! Check username/password in MONGO_URI');
      } else if (error.message.includes('ENOTFOUND')) {
        console.error('🌐 Network error! Check cluster address or internet connection');
      } else if (error.message.includes('whitelist')) {
        console.error('🛡️ IP whitelist issue! Add your IP to MongoDB Atlas network access');
      }
      
      process.exit(1);
    }
  }

  //  Setup MongoDB connection event handlers
   
  setupEventHandlers() {
    // Connection successful
    mongoose.connection.on('connected', () => {
      console.log('🔌 MongoDB event: Connected');
    });

    // Connection error
    mongoose.connection.on('error', (err) => {
      console.error('🔌 MongoDB event: Error -', err.message);
      this.isConnected = false;
    });

    // Disconnected
    mongoose.connection.on('disconnected', () => {
      console.log('🔌 MongoDB event: Disconnected');
      this.isConnected = false;
    });

    // Reconnected
    mongoose.connection.on('reconnected', () => {
      console.log('🔌 MongoDB event: Reconnected');
      this.isConnected = true;
    });

    // Application termination - close connection gracefully
    process.on('SIGINT', async () => {
      await this.disconnect();
      process.exit(0);
    });
  }

  //  Disconnect from MongoDB gracefully
   
  async disconnect() {
    if (!this.isConnected) {
      return;
    }
    
    try {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log('✅ MongoDB disconnected gracefully');
    } catch (error) {
      console.error('❌ Error disconnecting from MongoDB:', error.message);
    }
  }

  //  Get connection status
   
  getStatus() {
    return {
      isConnected: this.isConnected,
      readyState: mongoose.connection.readyState,
      readyStateText: this.getReadyStateText(),
      host: mongoose.connection.host,
      name: mongoose.connection.name,
    };
  }

  //  Convert mongoose readyState to readable text
   
  getReadyStateText() {
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
      99: 'uninitialized',
    };
    return states[mongoose.connection.readyState] || 'unknown';
  }
}

// Create and export singleton instance
const database = new Database();
export default database;