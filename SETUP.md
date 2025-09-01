# Carwow Clone - Local Setup Guide

## Prerequisites

Make sure you have the following installed:
- Node.js (v14 or higher)
- MongoDB (running locally on port 27017)
- Git

## Quick Start

### 1. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Setup Environment Variables

The backend `.env` file is already created with default values for local development.

### 3. Seed Sample Data (Optional)

```bash
cd backend
npm run seed
```

This will create:
- Admin user: `admin@carwow.com` / `admin123`
- Regular user: `john@example.com` / `password123`
- Sample cars and reviews

### 4. Start the Servers

**Start Backend (Terminal 1):**
```bash
cd backend
npm run dev
```
Backend will run on: http://localhost:5000

**Start Frontend (Terminal 2):**
```bash
cd frontend
npm start
```
Frontend will run on: http://localhost:3000

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## Default Login Credentials

After running the seeder:
- **Admin**: admin@carwow.com / admin123
- **User**: john@example.com / password123

## Troubleshooting

### MongoDB Connection Issues
- Make sure MongoDB is running: `mongod`
- Check if MongoDB is accessible on port 27017

### Port Already in Use
- Backend: Change PORT in `.env` file
- Frontend: It will automatically suggest a different port

### Missing Dependencies
```bash
# Backend
cd backend && npm install

# Frontend  
cd frontend && npm install
```

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/cars` - Get all cars
- `GET /api/cars/featured/list` - Get featured cars
- `GET /api/search` - Search cars
- `GET /api/reviews` - Get reviews

## Project Structure

```
carwow-clone/
├── backend/           # Node.js/Express API
│   ├── models/       # MongoDB models
│   ├── routes/       # API routes
│   ├── middleware/   # Auth middleware
│   └── scripts/      # Database scripts
├── frontend/         # React application
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/      # Page components
│   │   ├── contexts/   # React contexts
│   │   └── services/   # API services
└── docker-compose.yml # Docker setup
```
