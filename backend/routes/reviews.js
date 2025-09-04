const express = require('express');
const { body, query, validationResult } = require('express-validator');
const Review = require('../models/Review');
const Car = require('../models/Car');
const { protect, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @desc    Get reviews for a car
// @route   GET /api/reviews
// @access  Public
router.get('/', [
  query('car').optional().isMongoId().withMessage('Valid car ID is required'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('sort').optional().isIn(['rating', '-rating', 'createdAt', '-createdAt', 'helpfulCount', '-helpfulCount']).withMessage('Invalid sort field')
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
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Build filter object
    const filter = { isActive: true };
    if (req.query.car) {
      filter.car = req.query.car;
    }

    // Sort
    const sort = req.query.sort || '-createdAt';

    const reviews = await Review.find(filter)
      .populate('user', 'name avatar')
      .populate('car', 'name brand model')
      .sort(sort)
      .limit(limit)
      .skip(startIndex)
      .select('-__v');

    const total = await Review.countDocuments(filter);

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
      count: reviews.length,
      total,
      pagination,
      data: reviews
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get single review
// @route   GET /api/reviews/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('user', 'name avatar')
      .populate('car', 'name brand model');

    if (!review || !review.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    console.error('Get review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private
router.post('/', protect, [
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title is required and must be less than 100 characters'),
  body('text').trim().isLength({ min: 1, max: 1000 }).withMessage('Review text is required and must be less than 1000 characters'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('car').isMongoId().withMessage('Valid car ID is required')
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

    const { title, text, rating, car } = req.body;

    // Check if car exists
    const carExists = await Car.findById(car);
    if (!carExists || !carExists.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    // Check if user has already reviewed this car
    const existingReview = await Review.findOne({
      user: req.user.id,
      car: car
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this car'
      });
    }

    const review = await Review.create({
      title,
      text,
      rating,
      car,
      user: req.user.id
    });

    // Populate the review with user and car data
    await review.populate('user', 'name avatar');
    await review.populate('car', 'name brand model');

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: review
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
router.put('/:id', protect, [
  body('title').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Title must be less than 100 characters'),
  body('text').optional().trim().isLength({ min: 1, max: 1000 }).withMessage('Review text must be less than 1000 characters'),
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5')
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

    let review = await Review.findById(req.params.id);

    if (!review || !review.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Make sure user owns the review
    if (review.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('user', 'name avatar').populate('car', 'name brand model');

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      data: review
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review || !review.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Make sure user owns the review or is admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    // Soft delete - set isActive to false
    review.isActive = false;
    await review.save();

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Mark review as helpful
// @route   PUT /api/reviews/:id/helpful
// @access  Private
router.put('/:id/helpful', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review || !review.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Increment helpful count
    review.helpfulCount += 1;
    await review.save();

    res.status(200).json({
      success: true,
      message: 'Review marked as helpful',
      data: {
        helpfulCount: review.helpfulCount
      }
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    console.error('Mark helpful error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Report review
// @route   PUT /api/reviews/:id/report
// @access  Private
router.put('/:id/report', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review || !review.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Increment report count
    review.reportCount += 1;
    await review.save();

    res.status(200).json({
      success: true,
      message: 'Review reported successfully'
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    console.error('Report review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get review statistics for a car
// @route   GET /api/reviews/stats/:carId
// @access  Public
router.get('/stats/:carId', async (req, res) => {
  try {
    const carId = req.params.carId;

    // Check if car exists
    const car = await Car.findById(carId);
    if (!car || !car.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    const stats = await Review.aggregate([
      {
        $match: { car: car._id, isActive: true }
      },
      {
        $group: {
          _id: '$car',
          totalReviews: { $sum: 1 },
          averageRating: { $avg: '$rating' },
          ratingDistribution: {
            $push: '$rating'
          }
        }
      },
      {
        $project: {
          totalReviews: 1,
          averageRating: { $round: ['$averageRating', 1] },
          ratingCounts: {
            5: {
              $size: {
                $filter: {
                  input: '$ratingDistribution',
                  cond: { $eq: ['$$this', 5] }
                }
              }
            },
            4: {
              $size: {
                $filter: {
                  input: '$ratingDistribution',
                  cond: { $eq: ['$$this', 4] }
                }
              }
            },
            3: {
              $size: {
                $filter: {
                  input: '$ratingDistribution',
                  cond: { $eq: ['$$this', 3] }
                }
              }
            },
            2: {
              $size: {
                $filter: {
                  input: '$ratingDistribution',
                  cond: { $eq: ['$$this', 2] }
                }
              }
            },
            1: {
              $size: {
                $filter: {
                  input: '$ratingDistribution',
                  cond: { $eq: ['$$this', 1] }
                }
              }
            }
          }
        }
      }
    ]);

    const reviewStats = stats.length > 0 ? stats[0] : {
      totalReviews: 0,
      averageRating: 0,
      ratingCounts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    };

    res.status(200).json({
      success: true,
      data: reviewStats
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Invalid car ID'
      });
    }
    console.error('Get review stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
