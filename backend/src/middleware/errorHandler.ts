import { logger } from '@/utils/logger';
import { NextFunction, Request, Response } from 'express';

export interface ApiError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export class AppError extends Error implements ApiError {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const { statusCode = 500, message, stack } = err;

  // Log error
  logger.error({
    message,
    statusCode,
    stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Don't expose error details in production
  const isDevelopment = process.env['NODE_ENV'] === 'development';

  const response = {
    success: false,
    message: isDevelopment ? message : 'Internal Server Error',
    ...(isDevelopment && { stack })
  };

  res.status(statusCode).json(response);
};
