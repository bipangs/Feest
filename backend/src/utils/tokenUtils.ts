import jwt from 'jsonwebtoken';
import { AppError } from '../middleware/errorHandler';

export const generateTokens = (userId: string) => {
  const jwtSecret = process.env['JWT_SECRET'];
  const jwtRefreshSecret = process.env['JWT_REFRESH_SECRET'];
  
  if (!jwtSecret || !jwtRefreshSecret) {
    throw new AppError('JWT secrets not configured', 500);
  }

  const accessToken = jwt.sign(
    { userId, type: 'access' },
    jwtSecret,
    { expiresIn: process.env['JWT_EXPIRES_IN'] || '15m' } as any
  );

  const refreshToken = jwt.sign(
    { userId, type: 'refresh' },
    jwtRefreshSecret,
    { expiresIn: process.env['JWT_REFRESH_EXPIRES_IN'] || '7d' } as any
  );

  return { accessToken, refreshToken };
};

export const verifyRefreshToken = (token: string) => {
  const jwtRefreshSecret = process.env['JWT_REFRESH_SECRET'];
  
  if (!jwtRefreshSecret) {
    throw new AppError('JWT refresh secret not configured', 500);
  }

  try {
    const decoded = jwt.verify(token, jwtRefreshSecret) as any;
    
    if (decoded.type !== 'refresh') {
      throw new AppError('Invalid token type', 401);
    }

    return decoded;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError('Invalid refresh token', 401);
    }
    throw error;
  }
};

export const generateEmailVerificationToken = (userId: string) => {
  const jwtSecret = process.env['JWT_SECRET'];
  
  if (!jwtSecret) {
    throw new AppError('JWT secret not configured', 500);
  }

  return jwt.sign(
    { userId, type: 'email-verification' },
    jwtSecret,
    { expiresIn: '24h' } as any
  );
};
