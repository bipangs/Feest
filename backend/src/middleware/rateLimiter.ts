import { Request, Response, NextFunction } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { AppError } from './errorHandler';

const rateLimiter = new RateLimiterMemory({
  keyPrefix: 'middleware',
  points: parseInt(process.env['RATE_LIMIT_MAX_REQUESTS'] || '100'), // Number of requests
  duration: parseInt(process.env['RATE_LIMIT_WINDOW_MS'] || '900'), // Per 15 minutes (in seconds)
});

export const rateLimiterMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const key = req.ip || 'unknown';
    await rateLimiter.consume(key);
    next();
  } catch (rejRes: any) {
    const remainingPoints = rejRes?.remainingPoints || 0;
    const msBeforeNext = rejRes?.msBeforeNext || 0;
    
    res.set('Retry-After', Math.round(msBeforeNext / 1000).toString());
    res.set('X-RateLimit-Limit', process.env['RATE_LIMIT_MAX_REQUESTS'] || '100');
    res.set('X-RateLimit-Remaining', remainingPoints.toString());
    res.set('X-RateLimit-Reset', new Date(Date.now() + msBeforeNext).toISOString());
    
    throw new AppError('Too many requests, please try again later', 429);
  }
};

export { rateLimiterMiddleware as rateLimiter };
