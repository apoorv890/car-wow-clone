// MongoDB initialization script for Docker
db = db.getSiblingDB('carwow');

// Create collections
db.createCollection('users');
db.createCollection('cars');
db.createCollection('reviews');

// Create indexes for better performance
db.cars.createIndex({ "name": "text", "brand": "text", "model": "text", "description": "text" });
db.cars.createIndex({ "brand": 1 });
db.cars.createIndex({ "category": 1 });
db.cars.createIndex({ "condition": 1 });
db.cars.createIndex({ "specifications.fuelType": 1 });
db.cars.createIndex({ "price": 1 });
db.cars.createIndex({ "isFeatured": 1 });
db.cars.createIndex({ "isActive": 1 });
db.cars.createIndex({ "createdAt": -1 });

db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "role": 1 });
db.users.createIndex({ "isActive": 1 });

db.reviews.createIndex({ "car": 1, "user": 1 }, { unique: true });
db.reviews.createIndex({ "car": 1 });
db.reviews.createIndex({ "user": 1 });
db.reviews.createIndex({ "rating": 1 });
db.reviews.createIndex({ "isActive": 1 });
db.reviews.createIndex({ "createdAt": -1 });

print('Database initialized with collections and indexes');
