import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

/**
 * MongoService class to manage MongoDB connection.
 */
export class MongoService {
  
  /**
   * Connects to MongoDB using the connection string from environment variables.
   * Ensures that the connection is only established if not already connected.
   * The 'strictQuery' option is set to false to suppress warnings related to MongoDB query options.
   * @returns {Promise<void>} A promise that resolves when the connection is successfully established, or throws an error if connection fails.
   * @throws {Error} Throws an error if the MongoDB connection fails.
   */
  static async connect(): Promise<void> {
    try {
      // Ensure connection is not already established
      if (mongoose.connection.readyState === 0) {
        console.log('Connecting to MongoDB...');
        
        // Set the 'strictQuery' option to false to prevent the warning
        await mongoose.set('strictQuery', false);

        // Fetch the MongoDB URI from environment variables
        const mongoURI = process.env.MONGO_URI;

        if (!mongoURI) {
          throw new Error("MongoDB URI is missing in environment variables");
        }

        // Attempt to connect to MongoDB using the URI from environment variables
        await mongoose.connect(mongoURI, {
        });
        
        console.log('MongoDB Connected');
      } else {
        console.log('MongoDB already connected');
      }
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw new Error('Error connecting to MongoDB');
    }
  }
}
