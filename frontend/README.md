# Frontend - Transform Project

## Overview
Modern React-based frontend for role-based authentication and task management system with responsive design and role-specific dashboards.

## Tech Stack
- **Framework**: React 19.2
- **Build Tool**: Vite 7.2
- **Styling**: Tailwind CSS 4.1
- **Routing**: React Router DOM 7.10
- **State Management**: Context API
- **Form Handling**: React Hook Form 7.68
- **Validation**: Yup 1.7
- **HTTP Client**: Axios 1.13
- **Notifications**: React Hot Toast 2.6
- **Icons**: Lucide React, React Icons, Heroicons

## Project Structure

### Components (`src/components/`)

#### Authentication (`auth/`)
- **Login.jsx** - User login with email/password validation
- **Register.jsx** - User registration with role selection

#### Common (`common/`)
- **Header.jsx** - Application header with user menu and navigation
- **Sidebar.jsx** - Responsive sidebar with role-based menu items
- **ProtectedRoute.jsx** - Route wrapper for authentication and authorization

#### Dashboard (`dashboard/`)
- **SimpleAdminDashboard.jsx** - Admin dashboard for user management
- **SimpleAgentDashboard.jsx** - Agent dashboard for viewing assigned tasks
- **SimpleQADashboard.jsx** - QA dashboard for reviewing team tasks
- **TaskManagement.jsx** - Task creation, assignment, and QA assignment

### Context (`src/context/`)
- **AuthContext.jsx** - Authentication state management with user context

### Services (`src/services/`)
- **api.js** - Axios configuration with interceptors for auth
- **authService.js** - Authentication service wrapper

### Utils (`src/utils/`)
- **constants.js** - Application constants for roles, permissions, status

### Main Files
- **App.jsx** - Main app component with routing configuration
- **main.jsx** - React application entry point
- **index.css** - Global Tailwind CSS styles

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Steps

1. **Install Dependencies**
```bash
cd frontend
npm install
```

2. **Environment Configuration**
Create a `.env` file in the frontend root directory:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

3. **Run Development Server**
```bash
npm run dev
```

4. **Build for Production**
```bash
npm run build
```

5. **Preview Production Build**
```bash
npm run preview
```

## Features Implemented

### Authentication
- User registration with role selection (Admin, Manager, QA, Agent)
- Email and password login
- JWT token management with HTTP-only cookies
- Persistent authentication state
- Auto-logout on token expiration

### Role-Based Dashboards

#### Admin Dashboard
- View all users with pagination
- Add new users with role assignment
- Edit user details (name, email, role)
- Delete users (soft delete)
- User search and filtering by role
- Responsive table with action buttons

#### Manager Dashboard
- Similar to Admin but limited permissions
- Cannot delete users
- Can assign tasks and manage QA assignments

#### QA Dashboard
- View tasks assigned for review
- Filter tasks by status
- View task details and priorities
- Monitor team performance

#### Agent Dashboard
- View personally assigned tasks
- Task status overview (pending, in-progress, completed)
- Priority-based task list
- Due date tracking

### Task Management
- Create and assign tasks to agents
- Set task priority (low, medium, high, critical)
- Assign QA reviewers
- Set due dates
- Update task status
- Real-time task filtering

### UI/UX Features
- Fully responsive design (mobile, tablet, desktop)
- Dark mode compatible
- Loading states and spinners
- Toast notifications for user feedback
- Form validation with error messages
- Modal dialogs for actions
- Sidebar navigation with icons
- Protected routes with role-based access

## Components Overview

### Login.jsx
User authentication form with:
- Email validation
- Password visibility toggle
- Form error handling
- Redirect to role-specific dashboard
- Remember me functionality

### Register.jsx
User registration form with:
- First name and last name fields
- Email validation
- Password strength requirements
- Confirm password matching
- Role dropdown selection
- Terms acceptance

### Protected Route
Higher-order component providing:
- Authentication check
- Role-based authorization
- Loading state during auth verification
- Automatic redirect to login

### Dashboard Components
Role-specific views providing:
- User/task data fetching
- Pagination support
- CRUD operations
- Real-time updates
- Responsive layouts

## API Integration

### Axios Configuration
- Base URL from environment variables
- Request/response interceptors
- Automatic token handling
- Error response handling
- Credentials support for cookies

### API Services
- **authAPI**: register, login, logout, getCurrentUser
- **userAPI**: getAllUsers, getUserById, updateUser, deleteUser, assignAgentToQA
- **taskAPI**: getAllTasks, createTask, updateTask, deleteTask

## Routing Structure

```
/ → Redirect to appropriate dashboard based on role
/login → Public login page
/register → Public registration page
/admin → Admin dashboard (protected, admin only)
/manager → Manager dashboard (protected, manager only)
/qa → QA dashboard (protected, QA only)
/agent → Agent dashboard (protected, agent only)
/unauthorized → Access denied page
```

## Dependencies

### Production
```json
{
  "react": "^19.2.3",
  "react-dom": "^19.2.3",
  "react-router-dom": "^7.10.1",
  "react-hook-form": "^7.68.0",
  "yup": "^1.7.1",
  "@hookform/resolvers": "^5.2.2",
  "axios": "^1.13.2",
  "react-hot-toast": "^2.6.0",
  "lucide-react": "^0.560.0",
  "react-icons": "^5.5.0",
  "@heroicons/react": "^2.2.0",
  "tailwindcss": "^4.1.17",
  "clsx": "^2.1.1",
  "tailwind-merge": "^3.4.0",
  "date-fns": "^4.1.0",
  "jwt-decode": "^4.0.0"
}
```

### Development
```json
{
  "vite": "^7.2.4",
  "@vitejs/plugin-react": "^5.1.1",
  "eslint": "^9.39.1",
  "autoprefixer": "^10.4.22",
  "postcss": "^8.5.6",
  "@tailwindcss/postcss": "^4.1.17"
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| VITE_API_BASE_URL | Backend API base URL | http://localhost:5000/api |

## Scripts

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally

## Styling

### Tailwind CSS Configuration
- Custom color palette for primary, secondary, success, warning, danger
- Responsive breakpoints
- Custom utility classes
- Dark mode support

### CSS Features
- Mobile-first responsive design
- Flexbox and Grid layouts
- Smooth transitions and animations
- Hover and focus states
- Accessible form inputs

## Form Validation

### Yup Schemas
- **Login**: Email format, password required
- **Register**: Name validation, email format, password strength, confirm password match, role selection
- **User Update**: Optional fields with same validation rules
- **Task Creation**: Title length, description limits, priority enum

## Security Features
- XSS protection through React's built-in sanitization
- CSRF protection via HTTP-only cookies
- Input validation on client and server
- Secure password requirements
- Token-based authentication
- Role-based access control

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Author
**Naitik Maisuriya**

## License
MIT
