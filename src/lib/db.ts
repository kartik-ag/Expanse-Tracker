import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/finance-tracker';

let cachedConnection: typeof mongoose | null = null;

export async function connectToDatabase() {
  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    const connection = await mongoose.connect(MONGODB_URI);
    
    // Handle connection events
    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected successfully');
    });
    
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
    
    // Add cleanup for app termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      process.exit(0);
    });
    
    cachedConnection = connection;
    return connection;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
} 