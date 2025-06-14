# Feest Backend API

A comprehensive Node.js backend API for the Feest food sharing and swap application.

## Features

- **Authentication & Authorization** - JWT-based auth with role management
- **Profile Management** - User profiles with preferences and settings
- **Food Information** - Comprehensive food data management
- **Food Listing** - Create, read, update, delete food listings
- **Pickup Preferences** - Location and time-based pickup management
- **Search** - Advanced search functionality with filters
- **Events** - Food sharing events and community gatherings
- **Maps Integration** - Location services and mapping
- **Swap Requests** - Transaction management system
- **In-App Messaging** - Real-time messaging between users
- **Gamification** - Achievement and points system
- **Notifications** - Push notifications and in-app alerts

## Technology Stack

- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT
- **Real-time:** Socket.io
- **File Storage:** Cloudinary
- **Push Notifications:** Firebase Admin SDK

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Set up the database:
```bash
npm run db:migrate
npm run db:generate
npm run db:seed
```

4. Start the development server:
```bash
npm run dev
```

## API Documentation

The API will be available at `http://localhost:3000/api/v1`

### Main Endpoints

- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/users/profile` - Get user profile
- `GET /api/v1/foods` - Get food listings
- `POST /api/v1/foods` - Create food listing
- `GET /api/v1/events` - Get events
- `POST /api/v1/swaps` - Create swap request
- `GET /api/v1/messages` - Get messages
- `POST /api/v1/notifications` - Send notification

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/feest_db"

# JWT
JWT_SECRET="your-jwt-secret"
JWT_EXPIRES_IN="7d"

# Server
PORT=3000
NODE_ENV="development"

# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Firebase (for push notifications)
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_PRIVATE_KEY="your-private-key"
FIREBASE_CLIENT_EMAIL="your-client-email"

# Email (for notifications)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
```

## Database Schema

The application uses PostgreSQL with Prisma ORM. Main entities include:

- Users (authentication and profiles)
- Foods (food listings and information)
- Events (community events)
- SwapRequests (transactions)
- Messages (in-app messaging)
- Achievements (gamification)
- Notifications (push and in-app)

## Development

### Running Tests

```bash
npm test
```

### Database Operations

```bash
# Run migrations
npm run db:migrate

# Generate Prisma client
npm run db:generate

# Seed database
npm run db:seed

# Open Prisma Studio
npm run db:studio
```

### Building for Production

```bash
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## License

MIT License
