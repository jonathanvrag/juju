import { Request, Response, NextFunction } from 'express';
import { ReservationExpirationJob } from '../../../infrastructure/cron/ReservationExpirationJob';
import { Logger } from '../../../infrastructure/logging/Logger';

export class AdminController {
  async expireReservations(req: Request, res: Response, next: NextFunction) {
    try {
      Logger.info('[Admin] Manual reservation expiration triggered');

      const job = new ReservationExpirationJob();
      const expiredCount = await job.execute();

      res.status(200).json({
        status: 'success',
        data: {
          expiredCount,
          message: `${expiredCount} reservation(s) expired`,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async healthCheck(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json({
        status: 'success',
        data: {
          server: 'running',
          database: 'connected',
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
