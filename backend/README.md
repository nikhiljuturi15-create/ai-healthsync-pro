# AI HealthSync Pro - Backend API

Node.js/Express backend with MongoDB for user authentication.

## Setup

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```
PORT=5001
MONGODB_URI=mongodb://localhost:27017/healthsync
JWT_SECRET=your-secret-key-here
```

4. Start the server:
```bash
npm start
```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/register | Register new user | No |
| POST | /api/auth/login | Login user | No |
| POST | /api/auth/logout | Logout user | Yes |
| GET | /api/auth/me | Get current user | Yes |
| GET | /api/auth/verify | Verify token | No |
| POST | /api/auth/refresh | Refresh token | No |
| PUT | /api/auth/profile | Update profile | Yes |
| PUT | /api/auth/password | Change password | Yes |

### Request/Response Examples

#### Register
```json
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "role": "patient"
}
```

Response:
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "user": {...},
    "token": "jwt-token",
    "refreshToken": "refresh-token"
  }
}
```

#### Login
```json
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5001 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/healthsync |
| JWT_SECRET | JWT signing secret | (change in production) |
| JWT_EXPIRES_IN | Token expiration | 7d |
| FRONTEND_URL | Frontend URL for CORS | http://localhost:5173 |

## Testing

Use Postman or curl to test the API endpoints.

### Health Check
```bash
curl http://localhost:5001/api/health
```

### Register User
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","fullName":"Test User","role":"patient"}'
```

### Login
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```
