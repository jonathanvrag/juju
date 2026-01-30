import mongoose from 'mongoose';
import { config } from '../../../config/environment';

export class MongoDBConnection {
  private static instance: MongoDBConnection;

  private constructor() {}

  public static getInstance(): MongoDBConnection {
    if (!MongoDBConnection.instance) {
      MongoDBConnection.instance = new MongoDBConnection();
    }
    return MongoDBConnection.instance;
  }

  async connect(): Promise<void> {
    try {
      await mongoose.connect(config.mongodb.uri);
      console.log('[MongoDB] Connected successfully');
    } catch (error) {
      console.error('[MongoDB] Connection error:', error);
      process.exit(1);
    }
  }

  async disconnect(): Promise<void> {
    await mongoose.disconnect();
    console.log('[MongoDB] Disconnected successfully');
  }
}
