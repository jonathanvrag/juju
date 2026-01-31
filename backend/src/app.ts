import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import routes from './interfaces/http/routes';
import { errorHandler } from './interfaces/http/middlewares/errorHandler';
import { Logger } from './infrastructure/logging/Logger';

export class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.configureMiddlewares();
    this.configureRoutes();
    this.configureErrorHandling();
  }

  private configureMiddlewares(): void {
    this.app.use(helmet());

    this.app.use(
      cors({
        origin: process.env.CORS_ORIGIN || '*',
        credentials: true,
      })
    );

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      message: 'Too many requests from this IP, please try again later',
    });
    this.app.use('/api/', limiter);

    this.app.use((req, res, next) => {
      Logger.http(`${req.method} ${req.path}`);
      next();
    });
  }

  private configureRoutes(): void {
    this.app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'success',
        message: 'Server is running',
        timestamp: new Date().toISOString(),
      });
    });

    this.app.use('/api', routes);

    this.app.use((req, res) => {
      res.status(404).json({
        status: 'error',
        message: `Route ${req.originalUrl} not found`,
      });
    });
  }

  private configureErrorHandling(): void {
    this.app.use(errorHandler);
  }
}
