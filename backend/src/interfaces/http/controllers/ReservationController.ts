import { Request, Response, NextFunction } from 'express';
import { CreateReservation } from '../../../application/use-cases/reservations/CreateReservation';
import { CancelReservation } from '../../../application/use-cases/reservations/CancelReservation';
import { FulfillReservation } from '../../../application/use-cases/reservations/FulfillReservation';
import { GetUserReservations } from '../../../application/use-cases/reservations/GetUserReservations';
import { MongoReservationRepository } from '../../../infrastructure/database/mongodb/repositories/MongoRerservationRepository';
import { MongoBookRepository } from '../../../infrastructure/database/mongodb/repositories/MongoBookRepository';
import { MongoLoanRepository } from '../../../infrastructure/database/mongodb/repositories/MongoLoanRepository';
import { Logger } from '../../../infrastructure/logging/Logger';

export class ReservationController {
  private reservationRepository = new MongoReservationRepository();
  private bookRepository = new MongoBookRepository();
  private loanRepository = new MongoLoanRepository();

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user || !req.user.userId) {
        return res.status(401).json({
          status: 'error',
          message: 'Usuario no autenticado',
        });
      }

      const createReservation = new CreateReservation(
        this.reservationRepository,
        this.bookRepository
      );

      const dto = {
        ...req.body,
        userId: req.user.userId,
      };

      const reservation = await createReservation.execute(dto);

      Logger.info(
        `[Reservations] Reservation created for book ${reservation.bookId} by user ${req.user.userId}`
      );

      res.status(201).json({
        status: 'success',
        data: { reservation },
      });
    } catch (error) {
      next(error);
    }
  }

  async cancel(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user || !req.user.userId) {
        return res.status(401).json({
          status: 'error',
          message: 'Usuario no autenticado',
        });
      }

      const cancelReservation = new CancelReservation(
        this.reservationRepository,
        this.bookRepository
      );

      const reservationId = req.params.id as string;
      const userId = req.user.userId;

      const reservation = await cancelReservation.execute(
        reservationId,
        userId
      );

      Logger.info(
        `[Reservations] Reservation ${reservationId} cancelled by user ${userId}`
      );

      res.status(200).json({
        status: 'success',
        data: { reservation },
      });
    } catch (error) {
      next(error);
    }
  }

  async fulfill(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user || !req.user.userId) {
        return res.status(401).json({
          status: 'error',
          message: 'Usuario no autenticado',
        });
      }

      const fulfillReservation = new FulfillReservation(
        this.reservationRepository,
        this.loanRepository,
        this.bookRepository
      );

      const reservationId = req.params.id as string;
      const userId = req.user.userId;
      const { loanDueDate } = req.body;

      const loan = await fulfillReservation.execute(
        reservationId,
        userId,
        loanDueDate
      );

      Logger.info(
        `[Reservations] Reservation ${reservationId} fulfilled, loan created ${loan.id}`
      );

      res.status(201).json({
        status: 'success',
        data: { loan },
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserReservations(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user || !req.user.userId) {
        return res.status(401).json({
          status: 'error',
          message: 'Usuario no autenticado',
        });
      }

      const getUserReservations = new GetUserReservations(
        this.reservationRepository
      );

      const reservations = await getUserReservations.execute(req.user.userId);

      res.status(200).json({
        status: 'success',
        data: { reservations },
      });
    } catch (error) {
      next(error);
    }
  }
}
