# Backend - Transform Project

## Overview
RESTful API backend for role-based authentication and task management system built with Node.js, Express, MongoDB, and Redis.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Cache**: Redis for session and data caching
- **Authentication**: JWT (JSON Web Tokens) with HTTP-only cookies
- **Security**: Helmet, CORS, bcrypt for password hashing
- **Validation**: Joi for request validation

## Project Structure

### Configuration (`src/config/`)
- **database.js** - MongoDB connection with error handling and graceful shutdown
- **redis.js** - Redis client singleton for caching and session management

### Controllers (`src/controllers/`)
- **authController.js** - User authentication (register, login, logout, getCurrentUser)
- **taskController.js** - Task CRUD operations (create, read, update, delete)
- **userController.js** - User management and role-specific task retrieval

### Middlewares (`src/middlewares/`)
- **auth.js** - JWT authentication, role-based authorization, permission checking
- **errorHandler.js** - Centralized error handling with Mongoose validation support
- **validation.js** - Request validation middleware using express-validator

### Models (`src/models/`)
- **User.js** - User schema with password hashing, role enum, and indexes
- **Task.js** - Task schema with status, priority, assignments, and QA reviewer

### Routes (`src/routes/`)
- **authRoutes.js** - Authentication endpoints (/api/auth)
- **taskRoutes.js** - Task management endpoints (/api/tasks)
- **userRoutes.js** - User management endpoints (/api/users)

### Utils (`src/utils/`)
- **constants.js** - Application constants (roles, permissions, cache keys)
- **validators.js** - Joi validation schemas for auth, user, and task operations

### Main Files
- **server.js** - Express app initialization, middleware setup, database connections

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- Redis (v6 or higher)

### Steps

1. **Install Dependencies**
```bash
cd backend
npm install
```

2. **Environment Configuration**
Create a `.env` file in the backend root directory:
```env
NODE_ENV=development
PORT=5000

MONGODB_URI=mongodb://localhost:27017/role_dashboard

JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=24h

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

CORS_ORIGIN=http://localhost:5173

SESSION_SECRET=your_session_secret
COOKIE_DOMAIN=
```

3. **Start MongoDB**
```bash
# Windows
mongod

# macOS/Linux
sudo systemctl start mongod
```

4. **Start Redis**
```bash
# Windows
redis-server

# macOS/Linux
sudo systemctl start redis
```

5. **Run Development Server**
```bash
npm run dev
```

6. **Run Production Server**
```bash
npm start
```

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `POST /logout` - User logout
- `GET /me` - Get current user (protected)

### Users (`/api/users`)
- `GET /` - Get all users (Admin/Manager)
- `GET /:id` - Get user by ID (Admin/Manager)
- `PUT /:id` - Update user (Admin/Manager)
- `DELETE /:id` - Soft delete user (Admin)
- `POST /assign-qa` - Assign agent to QA (Admin/Manager)
- `GET /qa/tasks` - Get QA tasks (QA role)
- `GET /agent/tasks` - Get agent tasks (Agent role)

### Tasks (`/api/tasks`)
- `POST /` - Create task (Admin/Manager)
- `GET /` - Get all tasks (All authenticated users)
- `PUT /:id` - Update task (Admin/Manager)
- `DELETE /:id` - Delete task (Admin)

## Features Implemented

### Authentication & Authorization
- JWT-based authentication with HTTP-only cookies
- Password hashing using bcrypt (12 salt rounds)
- Token blacklisting on logout using Redis
- Role-based access control (Admin, Manager, QA, Agent)
- Permission-based middleware for fine-grained access

### User Management
- CRUD operations for users
- Soft delete functionality (isActive flag)
- Role assignment and modification
- QA-Agent relationship management
- User search and filtering

### Task Management
- Task creation with assignments
- Priority levels (low, medium, high, critical)
- Status tracking (pending, in-progress, completed, cancelled)
- QA reviewer assignment
- Due date management

### Data Caching
- Redis caching for user data
- Configurable TTL for cache entries
- Cache invalidation on updates
- Pattern-based cache deletion

### Security Features
- HTTP-only cookies for JWT
- CORS configuration
- Helmet for security headers
- Request validation using Joi
- Mongoose schema validation
- Error sanitization in production

## Dependencies

### Production
```json
{
  "bcryptjs": "^3.0.3",
  "cookie-parser": "^1.4.7",
  "cors": "^2.8.5",
  "dotenv": "^17.2.3",
  "express": "^5.2.1",
  "express-validator": "^7.3.1",
  "helmet": "^8.1.0",
  "joi": "^18.0.2",
  "jsonwebtoken": "^9.0.3",
  "mongoose": "^9.0.1",
  "redis": "^5.10.0"
}
```

### Development
```json
{
  "nodemon": "^3.1.11"
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment mode | development |
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/role_dashboard |
| JWT_SECRET | JWT signing secret | Required |
| JWT_EXPIRE | JWT expiration time | 24h |
| REDIS_HOST | Redis server host | localhost |
| REDIS_PORT | Redis server port | 6379 |
| REDIS_PASSWORD | Redis password | (empty) |
| CORS_ORIGIN | Allowed CORS origin | http://localhost:5173 |
| SESSION_SECRET | Session secret key | Required |
| COOKIE_DOMAIN | Cookie domain | (empty) |

## Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

## Author
**Naitik Maisuriya**

## License
MIT
