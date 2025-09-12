import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { apiService } from '../services/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { FiStar, FiEye, FiHeart, FiShare2, FiPhone, FiMail, FiMapPin } from 'react-icons/fi';

const CarDetailPage = () => {
  const { id } = useParams();

  // Fetch car details
  const { data: car, isLoading, error } = useQuery(
    ['car', id],
    () => apiService.cars.getById(id),
    {
      select: (data) => data.data.data,
    }
  );

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading car details..." />
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-secondary-900 mb-4">Car Not Found</h1>
          <p className="text-secondary-600 mb-6">The car you're looking for doesn't exist or has been removed.</p>
          <Link to="/search" className="btn-primary">
            Browse Cars
          </Link>
        </div>
      </div>
    );
  }

  const savings = car.originalPrice && car.discountPercentage > 0 
    ? car.originalPrice - car.price 
    : 0;

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-secondary-200">
        <div className="container-custom py-4">
          <nav className="text-sm text-secondary-600">
            <Link to="/" className="hover:text-primary-600">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/search" className="hover:text-primary-600">Cars</Link>
            <span className="mx-2">/</span>
            <span className="text-secondary-900">{car.name}</span>
          </nav>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Car Images */}
            <div className="bg-white rounded-lg shadow-soft overflow-hidden mb-8">
              <div className="aspect-w-16 aspect-h-9">
                {car.primaryImage ? (
                  <img
                    src={car.primaryImage}
                    alt={car.name}
                    className="w-full h-96 object-cover"
                  />
                ) : (
                  <div className="w-full h-96 bg-secondary-200 flex items-center justify-center">
                    <span className="text-secondary-500">No image available</span>
                  </div>
                )}
              </div>
              
              {/* Image Gallery */}
              {car.images && car.images.length > 1 && (
                <div className="p-4 border-t border-secondary-200">
                  <div className="flex space-x-2 overflow-x-auto">
                    {car.images.map((image, index) => (
                      <img
                        key={index}
                        src={image.url}
                        alt={image.alt || `${car.name} - Image ${index + 1}`}
                        className="w-20 h-20 object-cover rounded cursor-pointer hover:opacity-75"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Car Details */}
            <div className="bg-white rounded-lg shadow-soft p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-heading font-bold text-secondary-900 mb-2">
                    {car.name}
                  </h1>
                  <p className="text-lg text-secondary-600">
                    {car.brand} {car.model} • {car.year}
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <button className="p-2 text-secondary-600 hover:text-accent-500 transition-colors">
                    <FiHeart className="w-6 h-6" />
                  </button>
                  <button className="p-2 text-secondary-600 hover:text-primary-600 transition-colors">
                    <FiShare2 className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-6 mb-6 text-sm text-secondary-600">
                {car.averageRating > 0 && (
                  <div className="flex items-center space-x-1">
                    <FiStar className="w-4 h-4 text-warning-500 fill-current" />
                    <span>{car.averageRating}</span>
                    <span>({car.reviewCount} reviews)</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <FiEye className="w-4 h-4" />
                  <span>{car.views} views</span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-secondary-900 mb-3">Description</h3>
                <p className="text-secondary-700 leading-relaxed">{car.description}</p>
              </div>

              {/* Specifications */}
              {car.specifications && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-4">Specifications</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {car.specifications.engine && (
                      <div>
                        <dt className="text-sm font-medium text-secondary-500">Engine</dt>
                        <dd className="text-secondary-900">{car.specifications.engine}</dd>
                      </div>
                    )}
                    {car.specifications.fuelType && (
                      <div>
                        <dt className="text-sm font-medium text-secondary-500">Fuel Type</dt>
                        <dd className="text-secondary-900">{car.specifications.fuelType}</dd>
                      </div>
                    )}
                    {car.specifications.transmission && (
                      <div>
                        <dt className="text-sm font-medium text-secondary-500">Transmission</dt>
                        <dd className="text-secondary-900">{car.specifications.transmission}</dd>
                      </div>
                    )}
                    {car.specifications.doors && (
                      <div>
                        <dt className="text-sm font-medium text-secondary-500">Doors</dt>
                        <dd className="text-secondary-900">{car.specifications.doors}</dd>
                      </div>
                    )}
                    {car.specifications.seats && (
                      <div>
                        <dt className="text-sm font-medium text-secondary-500">Seats</dt>
                        <dd className="text-secondary-900">{car.specifications.seats}</dd>
                      </div>
                    )}
                    {car.specifications.mileage && (
                      <div>
                        <dt className="text-sm font-medium text-secondary-500">Mileage</dt>
                        <dd className="text-secondary-900">{car.specifications.mileage.toLocaleString()} miles</dd>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Features */}
              {car.features && car.features.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-4">Features</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {car.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-secondary-700">
                        <div className="w-2 h-2 bg-primary-600 rounded-full mr-2"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Pricing Card */}
            <div className="bg-white rounded-lg shadow-soft p-6 mb-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <span className="text-3xl font-bold text-secondary-900">
                    {formatPrice(car.price)}
                  </span>
                  {car.originalPrice && car.originalPrice > car.price && (
                    <span className="text-lg text-secondary-500 line-through">
                      {formatPrice(car.originalPrice)}
                    </span>
                  )}
                </div>
                
                {savings > 0 && (
                  <div className="mb-4">
                    <span className="inline-block bg-success-100 text-success-800 px-3 py-1 rounded-full text-sm font-semibold">
                      Save {formatPrice(savings)} ({car.discountPercentage}% off)
                    </span>
                  </div>
                )}

                {car.leasePrice?.monthly && (
                  <p className="text-secondary-600 mb-4">
                    Or lease from <span className="font-semibold text-secondary-900">
                      {formatPrice(car.leasePrice.monthly)}
                    </span>/month
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <button className="w-full btn-primary py-3">
                  Contact Dealer
                </button>
                <button className="w-full btn-outline py-3">
                  Schedule Test Drive
                </button>
                <button className="w-full btn-ghost py-3">
                  Get Finance Quote
                </button>
              </div>
            </div>

            {/* Dealer Info */}
            {car.dealer && (
              <div className="bg-white rounded-lg shadow-soft p-6">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Dealer Information</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <FiMapPin className="w-5 h-5 text-secondary-400 mr-3" />
                    <div>
                      <p className="font-medium text-secondary-900">{car.dealer.name}</p>
                      <p className="text-sm text-secondary-600">{car.dealer.location}</p>
                    </div>
                  </div>
                  
                  {car.dealer.contact?.phone && (
                    <div className="flex items-center">
                      <FiPhone className="w-5 h-5 text-secondary-400 mr-3" />
                      <a 
                        href={`tel:${car.dealer.contact.phone}`}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        {car.dealer.contact.phone}
                      </a>
                    </div>
                  )}
                  
                  {car.dealer.contact?.email && (
                    <div className="flex items-center">
                      <FiMail className="w-5 h-5 text-secondary-400 mr-3" />
                      <a 
                        href={`mailto:${car.dealer.contact.email}`}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        {car.dealer.contact.email}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetailPage;
