import jwt from 'jsonwebtoken';
import { Server as SocketIOServer } from 'socket.io';
import { logger } from '../utils/logger';

export const setupSocketIO = (io: SocketIOServer): void => {
  // Authentication middleware for socket connections
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth['token'];
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const jwtSecret = process.env['JWT_SECRET'] as string;
      if (!jwtSecret) {
        return next(new Error('JWT secret not configured'));
      }

      const decoded = jwt.verify(token, jwtSecret) as any;
      socket.data.userId = decoded.userId;
      
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.data.userId;
    logger.info(`User ${userId} connected via WebSocket`);

    // Join user to their personal room
    socket.join(`user_${userId}`);

    // Handle joining swap request rooms
    socket.on('join_swap', (swapId: string) => {
      socket.join(`swap_${swapId}`);
      logger.info(`User ${userId} joined swap room: ${swapId}`);
    });

    // Handle leaving swap request rooms
    socket.on('leave_swap', (swapId: string) => {
      socket.leave(`swap_${swapId}`);
      logger.info(`User ${userId} left swap room: ${swapId}`);
    });

    // Handle real-time messaging
    socket.on('send_message', (data) => {
      const { receiverId, swapId, message } = data;
      
      // Emit to receiver
      socket.to(`user_${receiverId}`).emit('new_message', {
        senderId: userId,
        message,
        swapId,
        timestamp: new Date().toISOString()
      });

      // Emit to swap room if it's swap-related
      if (swapId) {
        socket.to(`swap_${swapId}`).emit('swap_message', {
          senderId: userId,
          message,
          timestamp: new Date().toISOString()
        });
      }
    });

    // Handle typing indicators
    socket.on('typing_start', (data) => {
      const { receiverId, swapId } = data;
      socket.to(`user_${receiverId}`).emit('user_typing', { userId, swapId });
    });

    socket.on('typing_stop', (data) => {
      const { receiverId, swapId } = data;
      socket.to(`user_${receiverId}`).emit('user_stopped_typing', { userId, swapId });
    });

    // Handle location sharing for pickup
    socket.on('share_location', (data) => {
      const { swapId, latitude, longitude } = data;
      socket.to(`swap_${swapId}`).emit('location_shared', {
        userId,
        latitude,
        longitude,
        timestamp: new Date().toISOString()
      });
    });

    // Handle swap status updates
    socket.on('swap_status_update', (data) => {
      const { swapId, status } = data;
      socket.to(`swap_${swapId}`).emit('swap_status_changed', {
        swapId,
        status,
        timestamp: new Date().toISOString()
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      logger.info(`User ${userId} disconnected from WebSocket`);
    });
  });

  logger.info('Socket.IO server configured successfully');
};

// Helper functions to emit events from other parts of the application
export const emitToUser = (io: SocketIOServer, userId: string, event: string, data: any) => {
  io.to(`user_${userId}`).emit(event, data);
};

export const emitToSwap = (io: SocketIOServer, swapId: string, event: string, data: any) => {
  io.to(`swap_${swapId}`).emit(event, data);
};

export const emitNotification = (io: SocketIOServer, userId: string, notification: any) => {
  io.to(`user_${userId}`).emit('notification', notification);
};
