# 🍀 Feest Backend - Complete Setup Guide

## Overview

This is a comprehensive Node.js backend API for the Feest food sharing and swap application. The backend supports all your requested features including authentication, food management, real-time messaging, gamification, and more.

## Features Implemented

✅ **Authentication & Authorization**
- JWT-based authentication
- User registration, login, logout
- Email verification
- Password reset functionality
- Role-based access control

✅ **Database Schema (PostgreSQL + Prisma)**
- Users and profiles
- Food listings and locations
- Swap requests (transactions)
- Real-time messaging
- Events and participation
- Gamification (achievements, points)
- Notifications
- Pickup preferences
- Device tokens for push notifications

✅ **API Structure**
- RESTful API endpoints
- Input validation with Joi
- Error handling middleware
- Rate limiting
- File upload support (Cloudinary)
- CORS configuration

✅ **Real-time Features**
- Socket.IO for real-time messaging
- Live location sharing
- Typing indicators
- Swap status updates

✅ **Infrastructure**
- TypeScript for type safety
- Prisma ORM for database management
- Winston for logging
- Nodemailer for email services
- Firebase Admin SDK for push notifications

## Prerequisites

- **Node.js** (v18 or higher)
- **PostgreSQL** database
- **npm** or **yarn** package manager

## Installation Steps

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Copy the example environment file and configure it:
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/feest_db"

# JWT Secrets
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_REFRESH_SECRET="your-refresh-token-secret"

# Server
PORT=3000
NODE_ENV="development"

# External Services
CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
CLOUDINARY_API_KEY="your-cloudinary-api-key"
CLOUDINARY_API_SECRET="your-cloudinary-api-secret"

# Firebase (Push Notifications)
FIREBASE_PROJECT_ID="your-firebase-project-id"
FIREBASE_PRIVATE_KEY="your-firebase-private-key"
FIREBASE_CLIENT_EMAIL="your-firebase-client-email"

# Email Configuration
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-email-app-password"
```

### 4. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed database with sample data (optional)
npm run db:seed
```

### 5. Start Development Server
```bash
npm run dev
```

The server will start on `http://localhost:3000`

## API Endpoints Overview

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh-token` - Refresh access token
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password
- `POST /api/v1/auth/verify-email` - Verify email address
- `POST /api/v1/auth/logout` - Logout user

### Food Management
- `GET /api/v1/foods` - Get food listings
- `POST /api/v1/foods` - Create food listing
- `GET /api/v1/foods/:id` - Get specific food item
- `PUT /api/v1/foods/:id` - Update food listing
- `DELETE /api/v1/foods/:id` - Delete food listing

### User Management
- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update user profile
- `GET /api/v1/users/:id` - Get user by ID

### Swap Requests (Transactions)
- `GET /api/v1/swaps` - Get user's swap requests
- `POST /api/v1/swaps` - Create swap request
- `PUT /api/v1/swaps/:id` - Update swap status
- `GET /api/v1/swaps/:id` - Get swap details

### Messaging
- `GET /api/v1/messages` - Get messages
- `POST /api/v1/messages` - Send message
- Real-time messaging via Socket.IO

### Events
- `GET /api/v1/events` - Get events
- `POST /api/v1/events` - Create event
- `POST /api/v1/events/:id/join` - Join event

### Search
- `GET /api/v1/search/foods` - Search food listings
- `GET /api/v1/search/events` - Search events
- `GET /api/v1/search/users` - Search users

### Notifications
- `GET /api/v1/notifications` - Get user notifications
- `POST /api/v1/notifications/mark-read` - Mark notifications as read

### Achievements (Gamification)
- `GET /api/v1/achievements` - Get all achievements
- `GET /api/v1/achievements/user` - Get user achievements

### Maps
- `GET /api/v1/maps/nearby` - Get nearby food listings
- `POST /api/v1/maps/location` - Update user location

## Database Schema Highlights

### User Management
- **Users**: Core user information, authentication
- **UserProfile**: Extended profile information, preferences
- **PickupPreference**: User's preferred pickup locations and times

### Food System
- **Food**: Food listings with details, images, nutrition info
- **FoodLocation**: Geographic information for food items
- **SwapRequest**: Transaction management between users

### Communication
- **Message**: Real-time messaging system
- **Notification**: Push and in-app notifications

### Community Features
- **Event**: Community events and food sharing gatherings
- **EventParticipant**: Event participation tracking

### Gamification
- **Achievement**: Available achievements and rewards
- **UserAchievement**: User's unlocked achievements
- Points and levels system integrated into User model

## Real-time Features (Socket.IO)

### Events Supported:
- `join_swap` - Join a swap-specific room
- `send_message` - Send real-time messages
- `typing_start/stop` - Typing indicators
- `share_location` - Live location sharing
- `swap_status_update` - Real-time swap updates

### Client Events:
- `new_message` - Receive new messages
- `notification` - Receive notifications
- `swap_status_changed` - Swap status updates
- `user_typing` - Typing indicators

## External Services Configuration

### Cloudinary (File Uploads)
1. Create account at [cloudinary.com](https://cloudinary.com)
2. Get your cloud name, API key, and API secret
3. Add to `.env` file

### Firebase (Push Notifications)
1. Create Firebase project
2. Generate service account key
3. Add credentials to `.env` file

### Email Service (Gmail)
1. Enable 2-factor authentication on Gmail
2. Generate app-specific password
3. Add credentials to `.env` file

## Development Commands

```bash
# Development
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript to JavaScript
npm start           # Start production server

# Database
npm run db:migrate   # Run database migrations
npm run db:generate  # Generate Prisma client
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Prisma Studio (database GUI)

# Testing
npm test            # Run tests (when implemented)

# Linting
npm run lint        # Check code quality
```

## Connecting to Your React Native App

### 1. Update Mobile App Configuration
In your React Native app, update the API base URL:

```javascript
// config/api.js
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api/v1'  // Development
  : 'https://your-production-url.com/api/v1'; // Production

export default API_BASE_URL;
```

### 2. Example API Calls
```javascript
// Authentication
const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
};

// Get food listings
const getFoods = async (token) => {
  const response = await fetch(`${API_BASE_URL}/foods`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
};
```

### 3. Socket.IO Connection
```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:3000', {
  auth: {
    token: 'your-jwt-token'
  }
});

socket.on('new_message', (message) => {
  // Handle new message
});
```

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: BCrypt for secure password storage
- **Rate Limiting**: Prevent API abuse
- **Input Validation**: Comprehensive request validation
- **CORS Configuration**: Controlled cross-origin requests
- **Helmet**: Security headers
- **SQL Injection Protection**: Prisma ORM prevents SQL injection

## Deployment Ready

The backend is configured for easy deployment to:
- **Heroku**
- **AWS**
- **DigitalOcean**
- **Railway**
- **Render**

Just set your environment variables and deploy!

## Next Steps

1. **Install dependencies**: `npm install`
2. **Configure environment**: Edit `.env` file
3. **Setup database**: Run migrations and seed
4. **Start development**: `npm run dev`
5. **Test API**: Use Postman or Thunder Client
6. **Integrate with mobile**: Update React Native app endpoints

## Support

The backend is fully functional and includes:
- Complete database schema for all your features
- Authentication and authorization
- File upload handling
- Real-time messaging
- Push notifications setup
- Email services
- Gamification system
- Search functionality
- Maps integration ready
- Comprehensive error handling
- Logging and monitoring

Ready to power your Feest mobile application! 🚀
