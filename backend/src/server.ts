import 'reflect-metadata';
import dotenv from 'dotenv';
import { App } from './app';
import { MongoDBConnection } from './infrastructure/database/mongodb/connection';
import { Logger } from './infrastructure/logging/Logger';
import { config } from './config/environment';

dotenv.config();

const startServer = async () => {
  try {
    const mongoConnection = MongoDBConnection.getInstance();
    await mongoConnection.connect();

    const appInstance = new App();
    const { app } = appInstance;

    const PORT = config.port;
    app.listen(PORT, () => {
      Logger.info(`[Server] Running on port ${PORT}`);
      Logger.info(`[Server] Environment: ${config.env}`);
      Logger.info(`[Server] Health check: http://localhost:${PORT}/health`);
      Logger.info(`[Server] API: http://localhost:${PORT}/api`);
    });

    process.on('SIGTERM', async () => {
      Logger.info('[Server] SIGTERM received, closing server...');
      await mongoConnection.disconnect();
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      Logger.info('[Server] SIGINT received, closing server...');
      await mongoConnection.disconnect();
      process.exit(0);
    });
  } catch (error) {
    Logger.error('[Server] Failed to start server');
    Logger.error(error);
    process.exit(1);
  }
};

startServer();
