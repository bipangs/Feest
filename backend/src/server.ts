import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import { createServer } from 'http';
import morgan from 'morgan';
import { Server as SocketIOServer } from 'socket.io';

import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFoundHandler';
import { rateLimiter } from './middleware/rateLimiter';
import { setupSocketIO } from './services/socketService';
import { logger } from './utils/logger';

// Import routes
import achievementRoutes from './routes/achievementRoutes';
import authRoutes from './routes/authRoutes';
import eventRoutes from './routes/eventRoutes';
import foodRoutes from './routes/foodRoutes';
import mapRoutes from './routes/mapRoutes';
import messageRoutes from './routes/messageRoutes';
import notificationRoutes from './routes/notificationRoutes';
import searchRoutes from './routes/searchRoutes';
import swapRoutes from './routes/swapRoutes';
import userRoutes from './routes/userRoutes';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const io = new SocketIOServer(server, {  cors: {
    origin: process.env['FRONTEND_URL'] || "http://localhost:8081",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env['PORT'] || 3000;
const API_VERSION = process.env['API_VERSION'] || 'v1';

// Security middleware
app.use(helmet());
app.use(cors({
  origin: [
    process.env['FRONTEND_URL'] || "http://localhost:8081",
    process.env['MOBILE_DEEP_LINK'] || "feest://"
  ],
  credentials: true
}));

// General middleware
app.use(compression());
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use(rateLimiter);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: API_VERSION,
    environment: process.env['NODE_ENV']
  });
});

// API routes
const apiRouter = express.Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/users', userRoutes);
apiRouter.use('/foods', foodRoutes);
apiRouter.use('/swaps', swapRoutes);
apiRouter.use('/messages', messageRoutes);
apiRouter.use('/events', eventRoutes);
apiRouter.use('/notifications', notificationRoutes);
apiRouter.use('/achievements', achievementRoutes);
apiRouter.use('/maps', mapRoutes);
apiRouter.use('/search', searchRoutes);

app.use(`/api/${API_VERSION}`, apiRouter);

// Setup Socket.IO
setupSocketIO(io);

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
server.listen(PORT, () => {
  logger.info(`🚀 Feest Backend API is running on port ${PORT}`);
  logger.info(`📖 API Documentation: http://localhost:${PORT}/api/${API_VERSION}`);
  logger.info(`🌍 Environment: ${process.env['NODE_ENV']}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

export default app;
