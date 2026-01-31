import cron from 'node-cron';
import { ExpireReservations } from '../../application/use-cases/reservations/ExpireReservations';
import { MongoReservationRepository } from '../database/mongodb/repositories/MongoRerservationRepository';
import { MongoBookRepository } from '../database/mongodb/repositories/MongoBookRepository';
import { Logger } from '../logging/Logger';

export class ReservationExpirationJob {
  private isRunning = false;

  start(): void {
    cron.schedule('*/30 * * * *', async () => {
      await this.execute();
    });

    Logger.info(
      '[Cron] Reservation expiration job scheduled (every 30 minutes)'
    );
  }

  async execute(): Promise<number> {
    if (this.isRunning) {
      Logger.warn(
        '[Cron] Reservation expiration job already running, skipping...'
      );
      return 0;
    }

    try {
      this.isRunning = true;
      Logger.info('[Cron] Starting reservation expiration job...');

      const reservationRepository = new MongoReservationRepository();
      const bookRepository = new MongoBookRepository();
      const expireReservations = new ExpireReservations(
        reservationRepository,
        bookRepository
      );

      const expiredCount = await expireReservations.execute();

      if (expiredCount > 0) {
        Logger.info(`[Cron] Expired ${expiredCount} reservation(s)`);
      } else {
        Logger.info('[Cron] No expired reservations found');
      }

      return expiredCount;
    } catch (error) {
      Logger.error('[Cron] Error in reservation expiration job:', error);
      return 0;
    } finally {
      this.isRunning = false;
    }
  }
}
