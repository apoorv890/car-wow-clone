const express = require('express');
const { body, query, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Car = require('../models/Car');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/cars';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, `car-${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: process.env.MAX_FILE_UPLOAD || 1000000 // 1MB
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// @desc    Get all cars
// @route   GET /api/cars
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('sort').optional().isIn(['price', '-price', 'year', '-year', 'name', '-name', 'createdAt', '-createdAt']).withMessage('Invalid sort field'),
  query('category').optional().isIn(['New', 'Used', 'Electric', 'Hybrid', 'SUV', 'Hatchback', 'Saloon', 'Estate', 'Coupe', 'Convertible', 'MPV']).withMessage('Invalid category'),
  query('condition').optional().isIn(['New', 'Used', 'Nearly New']).withMessage('Invalid condition'),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('Min price must be a positive number'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Max price must be a positive number'),
  query('brand').optional().isString().withMessage('Brand must be a string'),
  query('fuelType').optional().isIn(['Petrol', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid']).withMessage('Invalid fuel type'),
  query('featured').optional().isBoolean().withMessage('Featured must be a boolean')
], optionalAuth, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const startIndex = (page - 1) * limit;

    // Build filter object
    const filter = { isActive: true };
    
    if (req.query.category) filter.category = req.query.category;
    if (req.query.condition) filter.condition = req.query.condition;
    if (req.query.brand) filter.brand = new RegExp(req.query.brand, 'i');
    if (req.query.fuelType) filter['specifications.fuelType'] = req.query.fuelType;
    if (req.query.featured !== undefined) filter.isFeatured = req.query.featured === 'true';
    
    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice);
    }

    // Sort
    const sort = req.query.sort || '-createdAt';

    const cars = await Car.find(filter)
      .sort(sort)
      .limit(limit)
      .skip(startIndex)
      .select('-__v');

    const total = await Car.countDocuments(filter);

    // Pagination result
    const pagination = {};
    
    if (startIndex + limit < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: cars.length,
      total,
      pagination,
      data: cars
    });
  } catch (error) {
    console.error('Get cars error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get single car
// @route   GET /api/cars/:id
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car || !car.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    // Increment view count
    car.views += 1;
    await car.save();

    res.status(200).json({
      success: true,
      data: car
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }
    console.error('Get car error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create new car
// @route   POST /api/cars
// @access  Private (Admin only)
router.post('/', protect, authorize('admin'), upload.array('images', 10), [
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Name is required and must be less than 100 characters'),
  body('brand').trim().isLength({ min: 1 }).withMessage('Brand is required'),
  body('model').trim().isLength({ min: 1 }).withMessage('Model is required'),
  body('year').isInt({ min: 1900, max: new Date().getFullYear() + 1 }).withMessage('Valid year is required'),
  body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
  body('description').trim().isLength({ min: 1, max: 500 }).withMessage('Description is required and must be less than 500 characters'),
  body('category').isIn(['New', 'Used', 'Electric', 'Hybrid', 'SUV', 'Hatchback', 'Saloon', 'Estate', 'Coupe', 'Convertible', 'MPV']).withMessage('Valid category is required'),
  body('condition').isIn(['New', 'Used', 'Nearly New']).withMessage('Valid condition is required'),
  body('dealer.name').trim().isLength({ min: 1 }).withMessage('Dealer name is required'),
  body('dealer.location').trim().isLength({ min: 1 }).withMessage('Dealer location is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Process uploaded images
    const images = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file, index) => {
        images.push({
          url: `/uploads/cars/${file.filename}`,
          alt: `${req.body.name} - Image ${index + 1}`,
          isPrimary: index === 0
        });
      });
    }

    const carData = {
      ...req.body,
      images
    };

    // Parse JSON fields if they exist
    if (req.body.specifications) {
      carData.specifications = typeof req.body.specifications === 'string' 
        ? JSON.parse(req.body.specifications) 
        : req.body.specifications;
    }

    if (req.body.leasePrice) {
      carData.leasePrice = typeof req.body.leasePrice === 'string' 
        ? JSON.parse(req.body.leasePrice) 
        : req.body.leasePrice;
    }

    if (req.body.dealer) {
      carData.dealer = typeof req.body.dealer === 'string' 
        ? JSON.parse(req.body.dealer) 
        : req.body.dealer;
    }

    if (req.body.features) {
      carData.features = Array.isArray(req.body.features) 
        ? req.body.features 
        : req.body.features.split(',').map(f => f.trim());
    }

    if (req.body.tags) {
      carData.tags = Array.isArray(req.body.tags) 
        ? req.body.tags 
        : req.body.tags.split(',').map(t => t.trim());
    }

    const car = await Car.create(carData);

    res.status(201).json({
      success: true,
      message: 'Car created successfully',
      data: car
    });
  } catch (error) {
    console.error('Create car error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update car
// @route   PUT /api/cars/:id
// @access  Private (Admin only)
router.put('/:id', protect, authorize('admin'), upload.array('images', 10), async (req, res) => {
  try {
    let car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    // Process new uploaded images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file, index) => ({
        url: `/uploads/cars/${file.filename}`,
        alt: `${req.body.name || car.name} - Image ${index + 1}`,
        isPrimary: index === 0 && (!car.images || car.images.length === 0)
      }));

      // Add new images to existing ones
      req.body.images = [...(car.images || []), ...newImages];
    }

    // Parse JSON fields if they exist
    if (req.body.specifications && typeof req.body.specifications === 'string') {
      req.body.specifications = JSON.parse(req.body.specifications);
    }

    if (req.body.leasePrice && typeof req.body.leasePrice === 'string') {
      req.body.leasePrice = JSON.parse(req.body.leasePrice);
    }

    if (req.body.dealer && typeof req.body.dealer === 'string') {
      req.body.dealer = JSON.parse(req.body.dealer);
    }

    if (req.body.features && typeof req.body.features === 'string') {
      req.body.features = req.body.features.split(',').map(f => f.trim());
    }

    if (req.body.tags && typeof req.body.tags === 'string') {
      req.body.tags = req.body.tags.split(',').map(t => t.trim());
    }

    car = await Car.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Car updated successfully',
      data: car
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }
    console.error('Update car error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete car
// @route   DELETE /api/cars/:id
// @access  Private (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    // Soft delete - set isActive to false
    car.isActive = false;
    await car.save();

    res.status(200).json({
      success: true,
      message: 'Car deleted successfully'
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }
    console.error('Delete car error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get featured cars
// @route   GET /api/cars/featured
// @access  Public
router.get('/featured/list', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 6;

    const cars = await Car.find({ 
      isActive: true, 
      isFeatured: true 
    })
      .sort('-createdAt')
      .limit(limit)
      .select('-__v');

    res.status(200).json({
      success: true,
      count: cars.length,
      data: cars
    });
  } catch (error) {
    console.error('Get featured cars error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
