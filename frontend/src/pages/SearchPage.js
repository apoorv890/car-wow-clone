import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { apiService } from '../services/api';
import SearchBar from '../components/ui/SearchBar';
import CarCard from '../components/cars/CarCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { FiFilter, FiGrid, FiList, FiX } from 'react-icons/fi';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  
  // Get search parameters
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page')) || 1;
  const category = searchParams.get('category') || '';
  const condition = searchParams.get('condition') || '';
  const brand = searchParams.get('brand') || '';
  const fuelType = searchParams.get('fuelType') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sort = searchParams.get('sort') || '-createdAt';

  // Build search parameters
  const searchParameters = {
    q: query,
    page,
    limit: 12,
    sort,
    ...(category && { category }),
    ...(condition && { condition }),
    ...(brand && { brand }),
    ...(fuelType && { fuelType }),
    ...(minPrice && { minPrice }),
    ...(maxPrice && { maxPrice }),
  };

  // Fetch search results
  const { data: searchResults, isLoading, error } = useQuery(
    ['searchCars', searchParameters],
    () => apiService.search.searchCars(searchParameters),
    {
      select: (data) => data.data,
      keepPreviousData: true,
    }
  );

  // Fetch filter options
  const { data: filterOptions } = useQuery(
    'filterOptions',
    () => apiService.search.getFilters(),
    {
      select: (data) => data.data.data,
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );

  const cars = searchResults?.data || [];
  const total = searchResults?.total || 0;
  const pagination = searchResults?.pagination || {};

  // Update search parameters
  const updateSearchParams = (updates) => {
    const newParams = new URLSearchParams(searchParams);
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    
    // Reset page when filters change
    if (Object.keys(updates).some(key => key !== 'page')) {
      newParams.delete('page');
    }
    
    setSearchParams(newParams);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchParams({ q: query });
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    updateSearchParams({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Search Header */}
      <div className="bg-white border-b border-secondary-200">
        <div className="container-custom py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1 max-w-2xl">
              <SearchBar placeholder="Search for cars..." />
            </div>
            
            <div className="flex items-center space-x-4">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-secondary-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                >
                  <FiGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                >
                  <FiList className="w-4 h-4" />
                </button>
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn-outline flex items-center lg:hidden"
              >
                <FiFilter className="w-4 h-4 mr-2" />
                Filters
              </button>
            </div>
          </div>

          {/* Search Results Summary */}
          <div className="mt-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-heading font-bold text-secondary-900">
                {query ? `Search results for "${query}"` : 'All Cars'}
              </h1>
              <p className="text-secondary-600 mt-1">
                {total} {total === 1 ? 'car' : 'cars'} found
              </p>
            </div>

            {/* Sort Options */}
            <div className="hidden sm:flex items-center space-x-2">
              <label className="text-sm text-secondary-600">Sort by:</label>
              <select
                value={sort}
                onChange={(e) => updateSearchParams({ sort: e.target.value })}
                className="input text-sm py-1"
              >
                <option value="-createdAt">Newest First</option>
                <option value="createdAt">Oldest First</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
                <option value="-name">Name: Z to A</option>
                <option value="-year">Year: Newest First</option>
                <option value="year">Year: Oldest First</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 flex-shrink-0`}>
            <div className="bg-white rounded-lg shadow-soft p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-secondary-900">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Clear All
                </button>
              </div>

              {/* Active Filters */}
              {(category || condition || brand || fuelType || minPrice || maxPrice) && (
                <div className="mb-4 pb-4 border-b border-secondary-200">
                  <h4 className="text-sm font-medium text-secondary-700 mb-2">Active Filters:</h4>
                  <div className="flex flex-wrap gap-2">
                    {category && (
                      <span className="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                        {category}
                        <button
                          onClick={() => updateSearchParams({ category: '' })}
                          className="ml-1 hover:text-primary-900"
                        >
                          <FiX className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {condition && (
                      <span className="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                        {condition}
                        <button
                          onClick={() => updateSearchParams({ condition: '' })}
                          className="ml-1 hover:text-primary-900"
                        >
                          <FiX className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {brand && (
                      <span className="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                        {brand}
                        <button
                          onClick={() => updateSearchParams({ brand: '' })}
                          className="ml-1 hover:text-primary-900"
                        >
                          <FiX className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Filter Options */}
              {filterOptions && (
                <div className="space-y-6">
                  {/* Condition Filter */}
                  <div>
                    <h4 className="font-medium text-secondary-900 mb-2">Condition</h4>
                    <div className="space-y-2">
                      {filterOptions.conditions?.map((cond) => (
                        <label key={cond} className="flex items-center">
                          <input
                            type="radio"
                            name="condition"
                            value={cond}
                            checked={condition === cond}
                            onChange={(e) => updateSearchParams({ condition: e.target.value })}
                            className="mr-2"
                          />
                          <span className="text-sm text-secondary-700">{cond}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Brand Filter */}
                  <div>
                    <h4 className="font-medium text-secondary-900 mb-2">Brand</h4>
                    <select
                      value={brand}
                      onChange={(e) => updateSearchParams({ brand: e.target.value })}
                      className="input w-full text-sm"
                    >
                      <option value="">All Brands</option>
                      {filterOptions.brands?.map((brandOption) => (
                        <option key={brandOption} value={brandOption}>
                          {brandOption}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Fuel Type Filter */}
                  <div>
                    <h4 className="font-medium text-secondary-900 mb-2">Fuel Type</h4>
                    <div className="space-y-2">
                      {filterOptions.fuelTypes?.map((fuel) => (
                        <label key={fuel} className="flex items-center">
                          <input
                            type="radio"
                            name="fuelType"
                            value={fuel}
                            checked={fuelType === fuel}
                            onChange={(e) => updateSearchParams({ fuelType: e.target.value })}
                            className="mr-2"
                          />
                          <span className="text-sm text-secondary-700">{fuel}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Range Filter */}
                  <div>
                    <h4 className="font-medium text-secondary-900 mb-2">Price Range</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => updateSearchParams({ minPrice: e.target.value })}
                        className="input text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => updateSearchParams({ maxPrice: e.target.value })}
                        className="input text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" text="Searching cars..." />
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-accent-600">Error loading search results. Please try again.</p>
              </div>
            ) : cars.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-secondary-600 text-lg mb-4">No cars found matching your criteria.</p>
                <button
                  onClick={clearFilters}
                  className="btn-primary"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                {/* Results Grid */}
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {cars.map((car) => (
                    <CarCard key={car._id} car={car} />
                  ))}
                </div>

                {/* Pagination */}
                {total > 12 && (
                  <div className="mt-12 flex justify-center">
                    <div className="flex items-center space-x-2">
                      {pagination.prev && (
                        <button
                          onClick={() => handlePageChange(pagination.prev.page)}
                          className="btn-outline"
                        >
                          Previous
                        </button>
                      )}
                      
                      <span className="px-4 py-2 text-secondary-600">
                        Page {page} of {Math.ceil(total / 12)}
                      </span>
                      
                      {pagination.next && (
                        <button
                          onClick={() => handlePageChange(pagination.next.page)}
                          className="btn-primary"
                        >
                          Next
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
