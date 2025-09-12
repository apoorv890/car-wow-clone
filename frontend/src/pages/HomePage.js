import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { apiService } from '../services/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { FiSearch, FiStar, FiChevronRight } from 'react-icons/fi';

const HomePage = () => {
  // Fetch featured cars
  const { data: featuredCars, isLoading: carsLoading } = useQuery(
    'featuredCars',
    () => apiService.cars.getFeatured(3),
    {
      select: (data) => data.data.data,
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );

  const categories = [
    { name: 'EVs', href: '/search?fuelType=Electric' },
    { name: 'New', href: '/search?condition=New' },
    { name: 'Used', href: '/search?condition=Used' },
    { name: 'Lease', href: '/search?category=Lease' },
    { name: 'Vans', href: '/search?category=MPV' },
    { name: 'SUVs', href: '/search?category=SUV' },
    { name: 'Hybrids', href: '/search?fuelType=Hybrid' },
    { name: 'Big boot', href: '/search?category=Estate' },
    { name: 'Below £30k', href: '/search?maxPrice=30000' },
  ];

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Dark Header Section */}
      <section className="bg-gray-900 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 py-12">
          {/* Mobile App Cards - Left and Right */}
          <div className="absolute left-4 top-8 hidden lg:block">
            <div className="bg-teal-400 rounded-lg p-4 w-32 h-40 transform -rotate-12">
              <div className="text-xs font-bold text-gray-900 mb-2">NEW CAR BUYING</div>
              <div className="bg-white rounded p-2 mb-2">
                <div className="w-8 h-6 bg-red-500 rounded"></div>
              </div>
              <div className="text-xs text-gray-900">Get quotes from dealers</div>
            </div>
          </div>
          
          <div className="absolute right-4 top-8 hidden lg:block">
            <div className="bg-green-400 rounded-lg p-4 w-32 h-40 transform rotate-12">
              <div className="text-xs font-bold text-gray-900 mb-2">SELL MY CAR</div>
              <div className="bg-white rounded p-2 mb-2">
                <div className="w-8 h-6 bg-blue-500 rounded"></div>
              </div>
              <div className="text-xs text-gray-900">Get instant valuation</div>
            </div>
          </div>

          <div className="text-center max-w-2xl mx-auto">
            {/* Main Search */}
            <div className="mb-8">
              <div className="relative max-w-md mx-auto">
                <input
                  type="text"
                  placeholder="Search by body type"
                  className="w-full px-4 py-3 pl-12 rounded-full text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-teal-400 text-gray-900 p-2 rounded-full hover:bg-teal-300">
                  <FiSearch className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Sale Banner */}
            <div className="bg-teal-400 text-gray-900 px-6 py-3 rounded-lg inline-flex items-center space-x-4 mb-4">
              <span className="font-bold">SALE: Save up to £8,582</span>
              <button className="bg-gray-900 text-white px-4 py-1 rounded font-medium hover:bg-gray-800">
                Browse Sale
              </button>
            </div>
            
            <p className="text-sm text-gray-300">
              Saving off RRP. Carwow T&Cs apply.
            </p>
          </div>
        </div>
      </section>

      {/* Category Buttons */}
      <section className="bg-gray-200 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={category.href}
                className="flex items-center space-x-2 px-4 py-2 bg-white rounded-full text-sm font-medium hover:bg-gray-50 transition-colors border border-gray-300"
              >
                <span>{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Big Deals Section */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <div className="flex items-center mb-2">
              <div className="w-6 h-6 bg-teal-400 rounded-full flex items-center justify-center mr-3">
                <FiStar className="w-4 h-4 text-gray-900" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                Big deals on wheels
              </h2>
            </div>
            <p className="text-gray-600 ml-9">
              Say hello to the hottest deals on the market
            </p>
          </div>

          {/* Featured Cars Grid */}
          {carsLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" text="Loading featured cars..." />
            </div>
          ) : featuredCars && featuredCars.length > 0 ? (
            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredCars.map((car, index) => {
                  const savings = car.originalPrice && car.discountPercentage > 0 
                    ? car.originalPrice - car.price 
                    : 0;
                  
                  return (
                    <div key={car._id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      {/* Car Title */}
                      <div className="p-4 pb-2">
                        <h3 className="font-bold text-lg text-gray-900 mb-1">{car.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{car.description}</p>
                        
                        {/* Savings Badge */}
                        {savings > 0 && (
                          <div className="inline-block bg-teal-100 text-teal-800 px-2 py-1 rounded text-xs font-semibold mb-3">
                            Big Saving: {formatPrice(savings)} off RRP
                          </div>
                        )}
                      </div>

                      {/* Car Image */}
                      <div className="px-4 pb-4">
                        <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
                          {car.primaryImage ? (
                            <img
                              src={car.primaryImage}
                              alt={car.name}
                              className="w-full h-48 object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-500 text-sm">No image available</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Pricing */}
                      <div className="px-4 pb-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900 mb-1">
                            Cash from {formatPrice(car.price)}
                          </div>
                          {car.leasePrice?.monthly && (
                            <div className="text-sm text-gray-600">
                              Lease from {formatPrice(car.leasePrice.monthly)} / month
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="px-4 pb-4">
                        <Link
                          to={`/cars/${car._id}`}
                          className="w-full bg-gray-900 text-white py-2 px-4 rounded-full text-center font-medium hover:bg-gray-800 transition-colors flex items-center justify-center"
                        >
                          View Deal
                          <FiChevronRight className="w-4 h-4 ml-1" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Navigation Arrow */}
              <button className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow">
                <FiChevronRight className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No featured cars available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <div className="flex items-center mb-2">
              <div className="w-6 h-6 bg-teal-400 rounded-full flex items-center justify-center mr-3">
                <FiStar className="w-4 h-4 text-gray-900" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                This is how it should feel
              </h2>
            </div>
            <p className="text-gray-600 ml-9">
              Our customers rate us as 'Excellent' on Trustpilot
            </p>
          </div>

          {/* Review Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((review) => (
              <div key={review} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar key={star} className="w-4 h-4 text-green-500 fill-current" />
                  ))}
                </div>
                <h4 className="font-semibold text-sm mb-2">Great service</h4>
                <p className="text-xs text-gray-600 mb-2">
                  Fantastic process with excellent customer service. Would definitely recommend.
                </p>
                <p className="text-xs text-gray-500">John Smith • 2 days ago</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Rated 4.5 / 5 based on <span className="font-semibold">25,342 reviews</span>. Showing our 4 star reviews.
            </p>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <div className="flex items-center mb-2">
              <div className="w-6 h-6 bg-teal-400 rounded-full flex items-center justify-center mr-3">
                <FiStar className="w-4 h-4 text-gray-900" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                With partners we trust
              </h2>
            </div>
            <p className="text-gray-600 ml-9">
              We connect you with all the major manufacturers and thousands of hand-picked dealers.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
