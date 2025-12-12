# Transform Project - Role-Based Task Management System

## Project Overview
A comprehensive full-stack web application featuring role-based authentication and task management with real-time updates, built using the MERN stack (MongoDB, Express, React, Node.js) with Redis caching.

## Author
**Naitik Maisuriya**

## Features

### 🔐 Authentication & Authorization
- **JWT-Based Authentication** - Secure token-based authentication with HTTP-only cookies
- **Password Security** - bcrypt hashing with 12 salt rounds
- **Session Management** - Redis-based token blacklisting for logout
- **Role-Based Access Control (RBAC)** - Four distinct roles with specific permissions
- **Protected Routes** - Frontend and backend route protection
- **Token Expiration** - Automatic token refresh and expiration handling

### 👥 User Management
- **Multi-Role System** - Admin, Manager, QA, and Agent roles
- **User CRUD Operations** - Complete user lifecycle management
- **Soft Delete** - Non-destructive user deactivation
- **User Search & Filtering** - Search by name, email, role
- **QA-Agent Assignment** - Hierarchical user relationships
- **Profile Management** - Update user details and roles

### 📋 Task Management
- **Task Creation & Assignment** - Assign tasks to agents
- **Priority Levels** - Low, Medium, High, Critical
- **Status Tracking** - Pending, In Progress, Completed, Cancelled
- **QA Review System** - Assign QA reviewers to tasks
- **Due Date Management** - Track task deadlines
- **Task Filtering** - Filter by status, priority, assignment

### 🎨 User Interface
- **Responsive Design** - Mobile, tablet, and desktop optimized
- **Role-Specific Dashboards** - Customized views per role
- **Real-Time Notifications** - Toast notifications for actions
- **Modern UI Components** - Clean, intuitive interface
- **Loading States** - Smooth user experience
- **Form Validation** - Client-side and server-side validation

### 🔒 Security Features
- **HTTP-Only Cookies** - Prevents XSS attacks on tokens
- **CORS Protection** - Configured cross-origin resource sharing
- **Helmet Security** - Security headers for Express
- **Input Validation** - Joi and Yup validation schemas
- **SQL Injection Prevention** - Mongoose ODM parameterized queries
- **Password Requirements** - Strong password enforcement
- **CSRF Protection** - Token-based protection
- **Rate Limiting Ready** - Infrastructure for rate limiting

### 📊 Performance Optimization
- **Redis Caching** - User data and session caching
- **Database Indexing** - Optimized MongoDB queries
- **Lazy Loading** - Component-level code splitting
- **Pagination** - Efficient data loading
- **Connection Pooling** - MongoDB connection optimization

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5.2
- **Database**: MongoDB 9.0 with Mongoose ODM
- **Cache**: Redis 5.10
- **Authentication**: JWT (jsonwebtoken 9.0)
- **Security**: bcryptjs, helmet, cors
- **Validation**: Joi 18.0
- **Environment**: dotenv

### Frontend
- **Library**: React 19.2
- **Build Tool**: Vite 7.2
- **Styling**: Tailwind CSS 4.1
- **Routing**: React Router DOM 7.10
- **State Management**: Context API
- **HTTP Client**: Axios 1.13
- **Form Handling**: React Hook Form 7.68
- **Validation**: Yup 1.7
- **Notifications**: React Hot Toast 2.6
- **Icons**: Lucide React, Heroicons

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                     │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │   Login/    │  │  Dashboard   │  │  Task           │   │
│  │  Register   │  │  Components  │  │  Management     │   │
│  └─────────────┘  └──────────────┘  └──────────────────┘   │
│         │                  │                   │             │
│         └──────────────────┴───────────────────┘             │
│                            │                                 │
│                    ┌───────▼────────┐                        │
│                    │  Axios Client  │                        │
│                    │  (with auth)   │                        │
│                    └───────┬────────┘                        │
└────────────────────────────┼──────────────────────────────────┘
                             │ HTTP/HTTPS + Cookies
                    ┌────────▼─────────┐
┌───────────────────┤  Express Server  ├───────────────────────┐
│                   └────────┬─────────┘                        │
│  ┌────────────────────────┼────────────────────────┐         │
│  │         ┌──────────────▼──────────────┐         │         │
│  │         │   Middleware Layer           │         │         │
│  │         │  • Authentication (JWT)      │         │         │
│  │         │  • Authorization (RBAC)      │         │         │
│  │         │  • Validation (Joi)          │         │         │
│  │         │  • Error Handler             │         │         │
│  │         └──────────────┬──────────────┘         │         │
│  │                        │                         │         │
│  │         ┌──────────────▼──────────────┐         │         │
│  │         │      Controllers              │         │         │
│  │         │  • Auth Controller            │         │         │
│  │         │  • User Controller            │         │         │
│  │         │  • Task Controller            │         │         │
│  │         └──────────────┬──────────────┘         │         │
│  │                        │                         │         │
│  └────────────────────────┼─────────────────────────┘         │
│                           │                                    │
│          ┌────────────────▼────────────────┐                  │
│          │        Models (Mongoose)        │                  │
│          │  • User Schema                  │                  │
│          │  • Task Schema                  │                  │
│          └────────────────┬────────────────┘                  │
└───────────────────────────┼───────────────────────────────────┘
                            │
          ┌─────────────────┴─────────────────┐
          │                                   │
  ┌───────▼────────┐              ┌──────────▼─────────┐
  │   MongoDB      │              │      Redis         │
  │  • User Data   │              │  • User Cache      │
  │  • Task Data   │              │  • Session Cache   │
  │  • Indexes     │              │  • Token Blacklist │
  └────────────────┘              └────────────────────┘
```

## Local Setup Guide

### Prerequisites Installation

#### 1. Install Node.js
**Windows:**
1. Download Node.js LTS from https://nodejs.org/
2. Run the installer (.msi file)
3. Verify installation:
```bash
node --version
npm --version
```

**macOS:**
```bash
brew install node
```

**Linux:**
```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### 2. Install MongoDB

**Windows:**
1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Run the installer (.msi file)
3. Choose "Complete" installation
4. Install MongoDB as a Windows Service
5. Default data directory: `C:\Program Files\MongoDB\Server\{version}\data`
6. Verify installation:
```bash
mongod --version
```

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Create list file
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update and install
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

**MongoDB Setup:**
1. Create data directory (if not exists):
```bash
# Windows
mkdir C:\data\db

# macOS/Linux
sudo mkdir -p /data/db
sudo chown -R `id -un` /data/db
```

2. Start MongoDB:
```bash
# Windows
mongod

# macOS/Linux
sudo systemctl start mongod
```

3. Verify MongoDB is running:
```bash
mongosh
# Should connect to MongoDB shell
```

#### 3. Install Redis

**Windows:**
1. Download Redis from https://github.com/tporadowski/redis/releases
2. Extract the ZIP file
3. Run `redis-server.exe`
4. Keep the terminal window open

**Alternative (Windows with WSL):**
```bash
wsl --install
# Then follow Linux instructions
```

**macOS:**
```bash
brew install redis
brew services start redis
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install redis-server

# Start Redis
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

**Redis Configuration:**
1. Verify Redis is running:
```bash
redis-cli ping
# Should respond with PONG
```

2. Check Redis status:
```bash
# Windows
redis-cli info server

# macOS/Linux
sudo systemctl status redis
```

### Project Installation

#### 1. Clone or Download Project
```bash
git clone <repository-url>
cd Transform_Project
```

#### 2. Backend Setup

Navigate to backend folder:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

Create `.env` file:
```env
NODE_ENV=development
PORT=5000

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/role_dashboard

# JWT Configuration
JWT_SECRET=e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
JWT_EXPIRE=24h

# Redis Configuration (NO PASSWORD for local)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Session Configuration
SESSION_SECRET=7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d
COOKIE_DOMAIN=
```

Start backend server:
```bash
npm run dev
```

Backend should be running on http://localhost:5000

#### 3. Frontend Setup

Open new terminal and navigate to frontend:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Create `.env` file:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start frontend development server:
```bash
npm run dev
```

Frontend should be running on http://localhost:5173

### Verification Steps

#### 1. Check MongoDB
```bash
mongosh
show dbs
use role_dashboard
show collections
```

#### 2. Check Redis
```bash
redis-cli
ping
# Should return PONG
keys *
# Should show cached keys after using the app
```

#### 3. Check Backend API
Open browser or use curl:
```bash
curl http://localhost:5000/api/health
# Should return: {"status":"OK","timestamp":"..."}
```

#### 4. Check Frontend
Open browser: http://localhost:5173
- Should see login page
- Register a new user
- Login and access dashboard

### Common Issues & Solutions

#### MongoDB Won't Start
**Issue**: MongoDB service fails to start
**Solution**:
```bash
# Windows
# Delete lock file
del C:\data\db\mongod.lock
mongod --repair

# macOS/Linux
sudo rm /data/db/mongod.lock
sudo mongod --repair
```

#### Redis Connection Error
**Issue**: Cannot connect to Redis
**Solution**:
```bash
# Check if Redis is running
# Windows
tasklist | findstr redis

# macOS/Linux
ps aux | grep redis

# Restart Redis
# macOS
brew services restart redis

# Linux
sudo systemctl restart redis-server
```

#### Port Already in Use
**Issue**: Port 5000 or 5173 already in use
**Solution**:
```bash
# Find process using port
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>

# Or change port in .env files
```

#### CORS Error
**Issue**: CORS policy blocking requests
**Solution**:
- Ensure `CORS_ORIGIN` in backend .env matches frontend URL
- Check both servers are running
- Clear browser cache

## User Roles & Permissions

### Admin
- Full system access
- User management (create, read, update, delete)
- Task management (create, assign, update, delete)
- QA-Agent assignment
- View all dashboards
- System configuration

### Manager
- User management (create, read, update)
- Task management (create, assign, update)
- QA-Agent assignment
- View all tasks
- Generate reports

### QA (Quality Assurance)
- View assigned tasks for review
- View tasks of assigned agents
- Review and approve tasks
- Update QA status
- View team performance

### Agent
- View personally assigned tasks
- Update task status
- View task priorities
- Track due dates
- View personal performance

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user

### User Endpoints
- `GET /users` - Get all users (Admin/Manager)
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user (Admin only)
- `POST /users/assign-qa` - Assign agent to QA
- `GET /users/qa/tasks` - Get QA tasks
- `GET /users/agent/tasks` - Get agent tasks

### Task Endpoints
- `POST /tasks` - Create task (Admin/Manager)
- `GET /tasks` - Get all tasks
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task (Admin only)

## Database Schema

### User Collection
```javascript
{
  firstName: String (required, 2-50 chars),
  lastName: String (required, 2-50 chars),
  email: String (required, unique, lowercase),
  password: String (required, hashed, 8+ chars),
  role: String (enum: admin, manager, qa, agent),
  assignedQA: ObjectId (reference to User),
  isActive: Boolean (default: true),
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Task Collection
```javascript
{
  title: String (required, 3-200 chars),
  description: String (max 1000 chars),
  assignedTo: ObjectId (required, reference to User),
  assignedBy: ObjectId (required, reference to User),
  status: String (enum: pending, in-progress, completed, cancelled),
  priority: String (enum: low, medium, high, critical),
  dueDate: Date,
  completedAt: Date,
  qaReviewer: ObjectId (reference to User),
  qaStatus: String (enum: pending-review, approved, needs-revision, null),
  createdAt: Date,
  updatedAt: Date
}
```

## Security Best Practices Implemented

### Authentication
- ✅ JWT tokens stored in HTTP-only cookies
- ✅ Token expiration (24 hours default)
- ✅ Password hashing with bcrypt (12 rounds)
- ✅ Token blacklisting on logout

### Authorization
- ✅ Role-based access control
- ✅ Permission-based middleware
- ✅ Protected API endpoints
- ✅ Frontend route guards

### Data Protection
- ✅ Input validation (client and server)
- ✅ SQL injection prevention (Mongoose)
- ✅ XSS protection (React sanitization)
- ✅ CORS configuration
- ✅ Helmet security headers

### Password Security
- ✅ Minimum 8 characters
- ✅ Uppercase, lowercase, number, special character required
- ✅ Password confirmation on registration
- ✅ Secure password reset flow ready

## Testing the Application

### 1. Register Users
Create users with different roles:
- Admin: admin@example.com
- Manager: manager@example.com
- QA: qa@example.com
- Agent: agent@example.com

### 2. Test Admin Features
- Login as Admin
- Create/Edit/Delete users
- Assign QA to agents
- Create tasks
- View all dashboards

### 3. Test Manager Features
- Login as Manager
- Create users (no delete)
- Create and assign tasks
- View all tasks

### 4. Test QA Features
- Login as QA
- View assigned review tasks
- Update task QA status

### 5. Test Agent Features
- Login as Agent
- View assigned tasks
- Update task status

## Production Deployment Considerations

### Environment Variables
- Use strong, unique secrets for JWT_SECRET and SESSION_SECRET
- Enable HTTPS only
- Set NODE_ENV=production
- Configure proper CORS_ORIGIN
- Set COOKIE_DOMAIN for production domain

### Database
- Enable MongoDB authentication
- Set up database backups
- Configure connection pooling
- Add monitoring

### Redis
- Enable Redis authentication
- Configure persistence (RDB/AOF)
- Set up Redis cluster for high availability

### Security
- Enable rate limiting
- Add request logging
- Set up SSL/TLS certificates
- Configure firewall rules
- Enable database encryption

### Performance
- Enable gzip compression
- Set up CDN for static assets
- Configure caching headers
- Add load balancer
- Enable horizontal scaling

## 🚀 Deployment

This project is ready to be deployed on Vercel with live databases. We provide comprehensive deployment guides:

### Quick Deployment (45 minutes)
Follow [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) for a step-by-step checklist to:
- ✅ Set up MongoDB Atlas (free tier)
- ✅ Set up Redis/Upstash (free tier)
- ✅ Deploy backend to Vercel
- ✅ Deploy frontend to Vercel
- ✅ Configure environment variables
- ✅ Test your live application

### Detailed Deployment Guide
See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for comprehensive documentation including:
- 📋 Database setup (MongoDB Atlas & Redis Cloud)
- 🔧 Vercel configuration
- 🐛 Troubleshooting common issues
- 🔐 Security best practices
- 📊 Monitoring and analytics
- 💰 Cost considerations

### Environment Setup
See [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) for:
- 🔑 All environment variables explained
- 🗄️ Database configuration options
- 💻 Local development setup
- 🔍 Troubleshooting guide

### Deployment Checklist
```bash
# 1. Set up databases
✓ MongoDB Atlas account and cluster
✓ Redis Cloud or Upstash account

# 2. Deploy backend
✓ Push code to GitHub
✓ Create Vercel project (root: backend)
✓ Add environment variables
✓ Deploy and test API

# 3. Deploy frontend  
✓ Create Vercel project (root: frontend)
✓ Add backend URL to env vars
✓ Deploy and test app

# 4. Final configuration
✓ Update CORS settings
✓ Test registration and login
✓ Verify database connections
```

**Live Demo URLs** (after deployment):
- Frontend: `https://your-app.vercel.app`
- Backend API: `https://your-api.vercel.app/api`

## Future Enhancements
- Email notifications
- Real-time updates with WebSockets
- File attachments for tasks
- Activity logs and audit trails
- Advanced reporting and analytics
- Two-factor authentication
- Password reset functionality
- Task comments and collaboration
- Dashboard customization
- Export data to CSV/PDF

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## Support
For issues or questions:
- Create an issue in the repository
- Contact: Naitik Maisuriya

## License
MIT License - feel free to use this project for learning or commercial purposes.

## Acknowledgments
- MERN Stack Community
- React Team
- MongoDB Team
- Redis Team
- All open-source contributors

---
**Built with ❤️ by Naitik Maisuriya**
