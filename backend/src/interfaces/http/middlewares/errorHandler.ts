import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../../shared/errors/AppError';
import { Logger } from '../../../infrastructure/logging/Logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    Logger.warn(
      `[${err.statusCode}] ${err.message} - ${req.method} ${req.path}`
    );

    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  Logger.error(`[500] ${err.message} - ${req.method} ${req.path}`);
  Logger.error(err.stack || 'No stack trace available');

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
};
