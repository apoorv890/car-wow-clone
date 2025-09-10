import React from 'react';
import { Link } from 'react-router-dom';
import { FiStar, FiEye, FiHeart } from 'react-icons/fi';

const CarCard = ({ car, className = '' }) => {
  const {
    _id,
    name,
    brand,
    model,
    year,
    price,
    originalPrice,
    discountPercentage,
    leasePrice,
    description,
    primaryImage,
    specifications,
    averageRating,
    reviewCount,
    views,
    dealer
  } = car;

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Calculate savings
  const savings = originalPrice && discountPercentage > 0 
    ? originalPrice - price 
    : 0;

  return (
    <div className={`card-hover overflow-hidden ${className}`}>
      {/* Image Container */}
      <div className="relative">
        <Link to={`/cars/${_id}`}>
          <div className="aspect-w-16 aspect-h-9 bg-secondary-100">
            {primaryImage ? (
              <img
                src={primaryImage}
                alt={name}
                className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-48 bg-secondary-200 flex items-center justify-center">
                <span className="text-secondary-500 text-sm">No image available</span>
              </div>
            )}
          </div>
        </Link>

        {/* Discount Badge */}
        {savings > 0 && (
          <div className="absolute top-3 left-3 bg-accent-500 text-white px-2 py-1 rounded text-xs font-semibold">
            Save {formatPrice(savings)}
          </div>
        )}

        {/* Favorite Button */}
        <button className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white rounded-full transition-colors">
          <FiHeart className="w-4 h-4 text-secondary-600 hover:text-accent-500" />
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Car Title */}
        <Link to={`/cars/${_id}`} className="block mb-3">
          <h3 className="text-lg font-semibold text-secondary-900 hover:text-primary-600 transition-colors line-clamp-1">
            {name}
          </h3>
          <p className="text-sm text-secondary-600">
            {brand} {model} • {year}
          </p>
        </Link>

        {/* Description */}
        <p className="text-sm text-secondary-600 mb-4 line-clamp-2">
          {description}
        </p>

        {/* Specifications */}
        {specifications && (
          <div className="flex flex-wrap gap-2 mb-4">
            {specifications.fuelType && (
              <span className="badge-primary text-xs">
                {specifications.fuelType}
              </span>
            )}
            {specifications.transmission && (
              <span className="badge-secondary text-xs">
                {specifications.transmission}
              </span>
            )}
            {specifications.doors && (
              <span className="badge-secondary text-xs">
                {specifications.doors} doors
              </span>
            )}
          </div>
        )}

        {/* Rating and Views */}
        <div className="flex items-center justify-between mb-4 text-sm text-secondary-600">
          <div className="flex items-center space-x-4">
            {averageRating > 0 && (
              <div className="flex items-center space-x-1">
                <FiStar className="w-4 h-4 text-warning-500 fill-current" />
                <span>{averageRating}</span>
                <span>({reviewCount})</span>
              </div>
            )}
            {views > 0 && (
              <div className="flex items-center space-x-1">
                <FiEye className="w-4 h-4" />
                <span>{views}</span>
              </div>
            )}
          </div>
        </div>

        {/* Pricing */}
        <div className="border-t border-secondary-200 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-secondary-900">
                  {formatPrice(price)}
                </span>
                {originalPrice && originalPrice > price && (
                  <span className="text-sm text-secondary-500 line-through">
                    {formatPrice(originalPrice)}
                  </span>
                )}
              </div>
              
              {leasePrice?.monthly && (
                <p className="text-sm text-secondary-600 mt-1">
                  Lease from <span className="font-semibold">{formatPrice(leasePrice.monthly)}</span>/month
                </p>
              )}
            </div>

            {discountPercentage > 0 && (
              <div className="text-right">
                <span className="inline-block bg-success-100 text-success-800 px-2 py-1 rounded text-xs font-semibold">
                  -{discountPercentage}%
                </span>
              </div>
            )}
          </div>

          {/* Dealer Info */}
          {dealer && (
            <div className="mt-3 pt-3 border-t border-secondary-100">
              <p className="text-xs text-secondary-500">
                <span className="font-medium">{dealer.name}</span>
                {dealer.location && ` • ${dealer.location}`}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex space-x-2">
          <Link
            to={`/cars/${_id}`}
            className="flex-1 btn-primary text-center text-sm py-2"
          >
            View Details
          </Link>
          <button className="btn-outline text-sm py-2 px-4">
            Compare
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
