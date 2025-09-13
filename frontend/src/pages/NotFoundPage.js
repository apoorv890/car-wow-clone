import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiSearch, FiArrowLeft } from 'react-icons/fi';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-secondary-50 flex flex-col justify-center items-center px-4">
      <div className="text-center max-w-md mx-auto">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-primary-600 mb-4">404</div>
          <div className="w-24 h-1 bg-primary-600 mx-auto rounded-full"></div>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-heading font-bold text-secondary-900 mb-4">
          Page Not Found
        </h1>
        <p className="text-lg text-secondary-600 mb-8">
          Sorry, we couldn't find the page you're looking for. 
          It might have been moved, deleted, or you entered the wrong URL.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="btn-primary inline-flex items-center justify-center"
          >
            <FiHome className="w-5 h-5 mr-2" />
            Go Home
          </Link>
          
          <Link
            to="/search"
            className="btn-outline inline-flex items-center justify-center"
          >
            <FiSearch className="w-5 h-5 mr-2" />
            Search Cars
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="btn-ghost inline-flex items-center justify-center"
          >
            <FiArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </button>
        </div>

        {/* Help Links */}
        <div className="mt-12 pt-8 border-t border-secondary-200">
          <p className="text-sm text-secondary-500 mb-4">
            Need help? Try these popular pages:
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link to="/search?condition=New" className="text-primary-600 hover:text-primary-700">
              New Cars
            </Link>
            <Link to="/search?condition=Used" className="text-primary-600 hover:text-primary-700">
              Used Cars
            </Link>
            <Link to="/search?fuelType=Electric" className="text-primary-600 hover:text-primary-700">
              Electric Cars
            </Link>
            <Link to="/reviews" className="text-primary-600 hover:text-primary-700">
              Reviews
            </Link>
            <Link to="/contact" className="text-primary-600 hover:text-primary-700">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
