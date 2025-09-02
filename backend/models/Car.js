const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a car name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  brand: {
    type: String,
    required: [true, 'Please add a brand'],
    trim: true
  },
  model: {
    type: String,
    required: [true, 'Please add a model'],
    trim: true
  },
  year: {
    type: Number,
    required: [true, 'Please add a year'],
    min: [1900, 'Year must be after 1900'],
    max: [new Date().getFullYear() + 1, 'Year cannot be in the future']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  originalPrice: {
    type: Number
  },
  discountPercentage: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot be more than 100%']
  },
  leasePrice: {
    monthly: {
      type: Number
    },
    deposit: {
      type: Number
    },
    term: {
      type: Number // in months
    }
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  specifications: {
    engine: {
      type: String
    },
    fuelType: {
      type: String,
      enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid']
    },
    transmission: {
      type: String,
      enum: ['Manual', 'Automatic', 'CVT']
    },
    doors: {
      type: Number,
      min: 2,
      max: 5
    },
    seats: {
      type: Number,
      min: 2,
      max: 8
    },
    mileage: {
      type: Number
    },
    co2Emissions: {
      type: Number
    },
    topSpeed: {
      type: Number
    },
    acceleration: {
      type: Number // 0-60 mph time
    }
  },
  category: {
    type: String,
    enum: ['New', 'Used', 'Electric', 'Hybrid', 'SUV', 'Hatchback', 'Saloon', 'Estate', 'Coupe', 'Convertible', 'MPV'],
    required: true
  },
  condition: {
    type: String,
    enum: ['New', 'Used', 'Nearly New'],
    required: true
  },
  availability: {
    type: String,
    enum: ['Available', 'Sold', 'Reserved'],
    default: 'Available'
  },
  dealer: {
    name: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    contact: {
      phone: String,
      email: String
    }
  },
  features: [{
    type: String
  }],
  tags: [{
    type: String
  }],
  averageRating: {
    type: Number,
    default: 0,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot be more than 5']
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create index for search functionality
CarSchema.index({
  name: 'text',
  brand: 'text',
  model: 'text',
  description: 'text'
});

// Virtual for discount amount
CarSchema.virtual('discountAmount').get(function() {
  if (this.originalPrice && this.discountPercentage > 0) {
    return this.originalPrice - this.price;
  }
  return 0;
});

// Virtual for primary image
CarSchema.virtual('primaryImage').get(function() {
  const primary = this.images.find(img => img.isPrimary);
  return primary ? primary.url : (this.images.length > 0 ? this.images[0].url : null);
});

// Middleware to update averageRating when reviews change
CarSchema.methods.calculateAverageRating = async function() {
  const Review = mongoose.model('Review');
  const stats = await Review.aggregate([
    {
      $match: { car: this._id }
    },
    {
      $group: {
        _id: '$car',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    this.averageRating = Math.round(stats[0].averageRating * 10) / 10;
    this.reviewCount = stats[0].reviewCount;
  } else {
    this.averageRating = 0;
    this.reviewCount = 0;
  }

  await this.save();
};

module.exports = mongoose.model('Car', CarSchema);
