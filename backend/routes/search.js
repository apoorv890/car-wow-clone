const express = require('express');
const { query, validationResult } = require('express-validator');
const Car = require('../models/Car');

const router = express.Router();

// @desc    Search cars
// @route   GET /api/search
// @access  Public
router.get('/', [
  query('q').optional().isString().withMessage('Search query must be a string'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('sort').optional().isIn(['relevance', 'price', '-price', 'year', '-year', 'name', '-name']).withMessage('Invalid sort field'),
  query('category').optional().isIn(['New', 'Used', 'Electric', 'Hybrid', 'SUV', 'Hatchback', 'Saloon', 'Estate', 'Coupe', 'Convertible', 'MPV']).withMessage('Invalid category'),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('Min price must be a positive number'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Max price must be a positive number'),
  query('brand').optional().isString().withMessage('Brand must be a string'),
  query('fuelType').optional().isIn(['Petrol', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid']).withMessage('Invalid fuel type')
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

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const startIndex = (page - 1) * limit;
    const searchQuery = req.query.q;

    // Build filter object
    const filter = { isActive: true };
    
    // Text search
    if (searchQuery) {
      filter.$text = { $search: searchQuery };
    }

    // Additional filters
    if (req.query.category) filter.category = req.query.category;
    if (req.query.brand) filter.brand = new RegExp(req.query.brand, 'i');
    if (req.query.fuelType) filter['specifications.fuelType'] = req.query.fuelType;
    
    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice);
    }

    // Sort
    let sort = {};
    if (req.query.sort === 'relevance' && searchQuery) {
      sort = { score: { $meta: 'textScore' } };
    } else {
      const sortField = req.query.sort || '-createdAt';
      if (sortField.startsWith('-')) {
        sort[sortField.substring(1)] = -1;
      } else {
        sort[sortField] = 1;
      }
    }

    // Build aggregation pipeline for better search
    const pipeline = [
      { $match: filter }
    ];

    // Add text score for relevance sorting
    if (searchQuery) {
      pipeline.push({ $addFields: { score: { $meta: 'textScore' } } });
    }

    // Sort
    pipeline.push({ $sort: sort });

    // Pagination
    pipeline.push({ $skip: startIndex });
    pipeline.push({ $limit: limit });

    // Remove sensitive fields
    pipeline.push({
      $project: {
        __v: 0
      }
    });

    const cars = await Car.aggregate(pipeline);
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
      query: searchQuery,
      data: cars
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during search'
    });
  }
});

// @desc    Get search suggestions
// @route   GET /api/search/suggestions
// @access  Public
router.get('/suggestions', [
  query('q').isString().isLength({ min: 1 }).withMessage('Search query is required')
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

    const searchQuery = req.query.q;
    const limit = parseInt(req.query.limit, 10) || 5;

    // Get suggestions from car names, brands, and models
    const suggestions = await Car.aggregate([
      {
        $match: {
          isActive: true,
          $or: [
            { name: { $regex: searchQuery, $options: 'i' } },
            { brand: { $regex: searchQuery, $options: 'i' } },
            { model: { $regex: searchQuery, $options: 'i' } }
          ]
        }
      },
      {
        $group: {
          _id: null,
          names: { $addToSet: '$name' },
          brands: { $addToSet: '$brand' },
          models: { $addToSet: '$model' }
        }
      },
      {
        $project: {
          suggestions: {
            $slice: [
              {
                $setUnion: [
                  {
                    $filter: {
                      input: '$names',
                      cond: { $regexMatch: { input: '$$this', regex: searchQuery, options: 'i' } }
                    }
                  },
                  {
                    $filter: {
                      input: '$brands',
                      cond: { $regexMatch: { input: '$$this', regex: searchQuery, options: 'i' } }
                    }
                  },
                  {
                    $filter: {
                      input: '$models',
                      cond: { $regexMatch: { input: '$$this', regex: searchQuery, options: 'i' } }
                    }
                  }
                ]
              },
              limit
            ]
          }
        }
      }
    ]);

    const suggestionList = suggestions.length > 0 ? suggestions[0].suggestions : [];

    res.status(200).json({
      success: true,
      count: suggestionList.length,
      data: suggestionList
    });
  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting suggestions'
    });
  }
});

// @desc    Get popular searches
// @route   GET /api/search/popular
// @access  Public
router.get('/popular', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;

    // Get most viewed cars as popular searches
    const popularCars = await Car.find({ isActive: true })
      .sort('-views')
      .limit(limit)
      .select('name brand model views')
      .lean();

    const popularSearches = popularCars.map(car => ({
      term: car.name,
      brand: car.brand,
      model: car.model,
      views: car.views
    }));

    res.status(200).json({
      success: true,
      count: popularSearches.length,
      data: popularSearches
    });
  } catch (error) {
    console.error('Popular searches error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting popular searches'
    });
  }
});

// @desc    Get filter options
// @route   GET /api/search/filters
// @access  Public
router.get('/filters', async (req, res) => {
  try {
    // Get unique values for filter options
    const filters = await Car.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          brands: { $addToSet: '$brand' },
          categories: { $addToSet: '$category' },
          fuelTypes: { $addToSet: '$specifications.fuelType' },
          conditions: { $addToSet: '$condition' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          minYear: { $min: '$year' },
          maxYear: { $max: '$year' }
        }
      },
      {
        $project: {
          _id: 0,
          brands: { $sortArray: { input: '$brands', sortBy: 1 } },
          categories: { $sortArray: { input: '$categories', sortBy: 1 } },
          fuelTypes: { 
            $sortArray: { 
              input: { $filter: { input: '$fuelTypes', cond: { $ne: ['$$this', null] } } }, 
              sortBy: 1 
            } 
          },
          conditions: { $sortArray: { input: '$conditions', sortBy: 1 } },
          priceRange: {
            min: '$minPrice',
            max: '$maxPrice'
          },
          yearRange: {
            min: '$minYear',
            max: '$maxYear'
          }
        }
      }
    ]);

    const filterOptions = filters.length > 0 ? filters[0] : {
      brands: [],
      categories: [],
      fuelTypes: [],
      conditions: [],
      priceRange: { min: 0, max: 0 },
      yearRange: { min: 0, max: 0 }
    };

    res.status(200).json({
      success: true,
      data: filterOptions
    });
  } catch (error) {
    console.error('Filter options error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting filter options'
    });
  }
});

module.exports = router;
