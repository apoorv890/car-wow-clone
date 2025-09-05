const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Car = require('../models/Car');
const Review = require('../models/Review');

// Sample data
const users = [
  {
    name: 'Admin User',
    email: 'admin@carwow.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    name: 'John Smith',
    email: 'john@example.com',
    password: 'password123',
    role: 'user'
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    password: 'password123',
    role: 'user'
  },
  {
    name: 'Mike Wilson',
    email: 'mike@example.com',
    password: 'password123',
    role: 'user'
  }
];

const cars = [
  {
    name: 'Jaguar 7',
    brand: 'Jaguar',
    model: '7',
    year: 2024,
    price: 28623,
    originalPrice: 30000,
    discountPercentage: 5,
    leasePrice: {
      monthly: 294,
      deposit: 2500,
      term: 36
    },
    description: 'Jaguar SUV with bold styling',
    images: [
      {
        url: '/uploads/cars/jaguar-7.jpg',
        alt: 'Jaguar 7 - Front view',
        isPrimary: true
      }
    ],
    specifications: {
      engine: '2.0L Turbo',
      fuelType: 'Petrol',
      transmission: 'Automatic',
      doors: 5,
      seats: 5,
      mileage: 0,
      co2Emissions: 180,
      topSpeed: 155,
      acceleration: 7.2
    },
    category: 'SUV',
    condition: 'New',
    dealer: {
      name: 'Premium Motors',
      location: 'London',
      contact: {
        phone: '020 1234 5678',
        email: 'sales@premiummotors.co.uk'
      }
    },
    features: [
      'LED Headlights',
      'Panoramic Sunroof',
      'Leather Seats',
      'Navigation System',
      'Bluetooth Connectivity',
      'Parking Sensors'
    ],
    tags: ['luxury', 'suv', 'new'],
    isFeatured: true,
    views: 1876
  },
  {
    name: 'Hyundai Tucson',
    brand: 'Hyundai',
    model: 'Tucson',
    year: 2023,
    price: 25958,
    originalPrice: 28000,
    discountPercentage: 7,
    leasePrice: {
      monthly: 267,
      deposit: 2000,
      term: 36
    },
    description: 'Hyundai\'s unusual-looking family SUV contender',
    images: [
      {
        url: '/uploads/cars/hyundai-tucson.jpg',
        alt: 'Hyundai Tucson - Side view',
        isPrimary: true
      }
    ],
    specifications: {
      engine: '1.6L Hybrid',
      fuelType: 'Hybrid',
      transmission: 'Automatic',
      doors: 5,
      seats: 5,
      mileage: 15000,
      co2Emissions: 120,
      topSpeed: 180,
      acceleration: 8.5
    },
    category: 'SUV',
    condition: 'Nearly New',
    dealer: {
      name: 'City Hyundai',
      location: 'Manchester',
      contact: {
        phone: '0161 234 5678',
        email: 'info@cityhyundai.co.uk'
      }
    },
    features: [
      'Hybrid Engine',
      'Apple CarPlay',
      'Android Auto',
      'Rear Camera',
      'Climate Control',
      'Alloy Wheels'
    ],
    tags: ['hybrid', 'suv', 'efficient'],
    isFeatured: true,
    views: 2103
  },
  {
    name: 'Kia Sportage',
    brand: 'Kia',
    model: 'Sportage',
    year: 2023,
    price: 28416,
    originalPrice: 30000,
    discountPercentage: 5,
    leasePrice: {
      monthly: 236,
      deposit: 2200,
      term: 36
    },
    description: 'Practical family SUV with stand-out styling',
    images: [
      {
        url: '/uploads/cars/kia-sportage.jpg',
        alt: 'Kia Sportage - Front view',
        isPrimary: true
      }
    ],
    specifications: {
      engine: '1.6L Turbo',
      fuelType: 'Petrol',
      transmission: 'Manual',
      doors: 5,
      seats: 5,
      mileage: 8500,
      co2Emissions: 155,
      topSpeed: 175,
      acceleration: 9.1
    },
    category: 'SUV',
    condition: 'Nearly New',
    dealer: {
      name: 'Kia Central',
      location: 'Birmingham',
      contact: {
        phone: '0121 345 6789',
        email: 'sales@kiacentral.co.uk'
      }
    },
    features: [
      '7-Year Warranty',
      'Touchscreen Display',
      'Cruise Control',
      'Electric Windows',
      'Air Conditioning',
      'USB Ports'
    ],
    tags: ['suv', 'reliable', 'warranty'],
    isFeatured: true,
    views: 1654
  },
  {
    name: 'Tesla Model 3',
    brand: 'Tesla',
    model: 'Model 3',
    year: 2024,
    price: 42990,
    leasePrice: {
      monthly: 450,
      deposit: 3000,
      term: 36
    },
    description: 'Premium electric sedan with autopilot capabilities',
    images: [
      {
        url: '/uploads/cars/tesla-model3.jpg',
        alt: 'Tesla Model 3 - Side view',
        isPrimary: true
      }
    ],
    specifications: {
      engine: 'Electric Motor',
      fuelType: 'Electric',
      transmission: 'Automatic',
      doors: 4,
      seats: 5,
      mileage: 0,
      co2Emissions: 0,
      topSpeed: 225,
      acceleration: 5.3
    },
    category: 'Electric',
    condition: 'New',
    dealer: {
      name: 'Tesla Store London',
      location: 'London',
      contact: {
        phone: '020 8765 4321',
        email: 'london@tesla.com'
      }
    },
    features: [
      'Autopilot',
      'Supercharging',
      'Premium Audio',
      'Glass Roof',
      'Mobile Connectivity',
      'Over-the-air Updates'
    ],
    tags: ['electric', 'luxury', 'tech'],
    isFeatured: true,
    views: 3245
  },
  {
    name: 'BMW 3 Series',
    brand: 'BMW',
    model: '3 Series',
    year: 2022,
    price: 35500,
    originalPrice: 38000,
    discountPercentage: 7,
    leasePrice: {
      monthly: 380,
      deposit: 2800,
      term: 36
    },
    description: 'Executive saloon with sporty handling',
    images: [
      {
        url: '/uploads/cars/bmw-3series.jpg',
        alt: 'BMW 3 Series - Front view',
        isPrimary: true
      }
    ],
    specifications: {
      engine: '2.0L Turbo',
      fuelType: 'Petrol',
      transmission: 'Automatic',
      doors: 4,
      seats: 5,
      mileage: 12000,
      co2Emissions: 140,
      topSpeed: 250,
      acceleration: 6.2
    },
    category: 'Saloon',
    condition: 'Used',
    dealer: {
      name: 'BMW Park Lane',
      location: 'London',
      contact: {
        phone: '020 7123 4567',
        email: 'parklane@bmw.co.uk'
      }
    },
    features: [
      'iDrive System',
      'Heated Seats',
      'Parking Assistant',
      'LED Lights',
      'Premium Sound',
      'Wireless Charging'
    ],
    tags: ['luxury', 'performance', 'executive'],
    isFeatured: false,
    views: 1876
  },
  {
    name: 'Volkswagen Golf',
    brand: 'Volkswagen',
    model: 'Golf',
    year: 2023,
    price: 24500,
    leasePrice: {
      monthly: 280,
      deposit: 2000,
      term: 36
    },
    description: 'Reliable family hatchback with excellent build quality',
    images: [
      {
        url: '/uploads/cars/vw-golf.jpg',
        alt: 'Volkswagen Golf - Side view',
        isPrimary: true
      }
    ],
    specifications: {
      engine: '1.5L TSI',
      fuelType: 'Petrol',
      transmission: 'Manual',
      doors: 5,
      seats: 5,
      mileage: 5000,
      co2Emissions: 125,
      topSpeed: 200,
      acceleration: 8.5
    },
    category: 'Hatchback',
    condition: 'Nearly New',
    dealer: {
      name: 'Volkswagen Centre',
      location: 'Leeds',
      contact: {
        phone: '0113 456 7890',
        email: 'leeds@volkswagen.co.uk'
      }
    },
    features: [
      'Digital Cockpit',
      'App Connect',
      'Front Assist',
      'Lane Assist',
      'Adaptive Cruise Control',
      'Keyless Start'
    ],
    tags: ['reliable', 'efficient', 'family'],
    isFeatured: false,
    views: 987
  }
];

const reviews = [
  {
    title: 'Excellent SUV',
    text: 'The Jaguar 7 is an outstanding vehicle with great performance and luxury features. Highly recommended!',
    rating: 5
  },
  {
    title: 'Great value hybrid',
    text: 'Very impressed with the fuel economy and build quality of the Hyundai Tucson. Perfect for families.',
    rating: 4
  },
  {
    title: 'Stylish and practical',
    text: 'The Kia Sportage offers great value for money with its 7-year warranty and modern features.',
    rating: 4
  },
  {
    title: 'Future of driving',
    text: 'Tesla Model 3 is simply amazing. The technology and performance are unmatched.',
    rating: 5
  }
];

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/carwow');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Seed function
const seedData = async () => {
  try {
    console.log('Starting data seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Car.deleteMany({});
    await Review.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const createdUsers = [];
    for (const userData of users) {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);
      const user = await User.create(userData);
      createdUsers.push(user);
    }
    console.log(`Created ${createdUsers.length} users`);

    // Create cars
    const createdCars = await Car.insertMany(cars);
    console.log(`Created ${createdCars.length} cars`);

    // Create reviews
    const reviewsWithRefs = reviews.map((review, index) => ({
      ...review,
      user: createdUsers[Math.min(index + 1, createdUsers.length - 1)]._id, // Skip admin user
      car: createdCars[Math.min(index, createdCars.length - 1)]._id
    }));
    
    const createdReviews = await Review.insertMany(reviewsWithRefs);
    console.log(`Created ${createdReviews.length} reviews`);

    // Update car ratings
    for (const review of createdReviews) {
      const car = await Car.findById(review.car);
      if (car) {
        await car.calculateAverageRating();
      }
    }
    console.log('Updated car ratings');

    console.log('Data seeding completed successfully!');
    console.log('\nSample login credentials:');
    console.log('Admin: admin@carwow.com / admin123');
    console.log('User: john@example.com / password123');
    
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run seeder
const runSeeder = async () => {
  await connectDB();
  await seedData();
};

// Check if script is run directly
if (require.main === module) {
  runSeeder();
}

module.exports = { seedData, connectDB };
