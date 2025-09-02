const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a review title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  text: {
    type: String,
    required: [true, 'Please add review text'],
    maxlength: [1000, 'Review cannot be more than 1000 characters']
  },
  rating: {
    type: Number,
    required: [true, 'Please add a rating between 1 and 5'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  car: {
    type: mongoose.Schema.ObjectId,
    ref: 'Car',
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  helpfulCount: {
    type: Number,
    default: 0
  },
  reportCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Prevent user from submitting more than one review per car
ReviewSchema.index({ car: 1, user: 1 }, { unique: true });

// Static method to get average rating and save
ReviewSchema.statics.getAverageRating = async function(carId) {
  const obj = await this.aggregate([
    {
      $match: { car: carId, isActive: true }
    },
    {
      $group: {
        _id: '$car',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 }
      }
    }
  ]);

  try {
    if (obj.length > 0) {
      await this.model('Car').findByIdAndUpdate(carId, {
        averageRating: Math.round(obj[0].averageRating * 10) / 10,
        reviewCount: obj[0].reviewCount
      });
    } else {
      await this.model('Car').findByIdAndUpdate(carId, {
        averageRating: 0,
        reviewCount: 0
      });
    }
  } catch (err) {
    console.error('Error updating car rating:', err);
  }
};

// Call getAverageRating after save
ReviewSchema.post('save', async function() {
  await this.constructor.getAverageRating(this.car);
});

// Call getAverageRating after remove
ReviewSchema.post('remove', async function() {
  await this.constructor.getAverageRating(this.car);
});

// Call getAverageRating after findOneAndUpdate
ReviewSchema.post('findOneAndUpdate', async function(doc) {
  if (doc) {
    await doc.constructor.getAverageRating(doc.car);
  }
});

module.exports = mongoose.model('Review', ReviewSchema);
