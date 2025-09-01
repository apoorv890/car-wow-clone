# Carwow Clone - MERN Stack

A fully functional clone of the Carwow website built with MongoDB, Express.js, React.js, and Node.js.

## Features

- **Homepage Layout**: Navigation bar, search functionality, featured car deals
- **Search Functionality**: Auto-suggestions and dynamic filtering
- **Car Listings**: Dynamic cards with pagination
- **User Authentication**: JWT-based login/register system
- **Admin Panel**: CRUD operations for car management
- **Reviews System**: User reviews with ratings
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

- **Frontend**: React.js, React Router, Axios, Tailwind CSS
- **Backend**: Node.js, Express.js, JWT, bcrypt, multer
- **Database**: MongoDB
- **Deployment**: Docker

## Project Structure

```
carwow-clone/
├── frontend/          # React.js application
├── backend/           # Node.js/Express.js API
├── docker-compose.yml # Docker configuration
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Docker (optional)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd carwow-clone
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Set up environment variables
```bash
# Create .env file in backend directory
cp .env.example .env
```

5. Start the development servers
```bash
# Backend (from backend directory)
npm run dev

# Frontend (from frontend directory)
npm start
```

## API Endpoints

- `GET /api/cars` - Get all cars
- `POST /api/cars` - Create new car (admin)
- `GET /api/cars/:id` - Get car by ID
- `PUT /api/cars/:id` - Update car (admin)
- `DELETE /api/cars/:id` - Delete car (admin)
- `GET /api/search` - Search cars
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/reviews` - Get reviews
- `POST /api/reviews` - Create review

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
