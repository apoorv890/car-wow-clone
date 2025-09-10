import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiX } from 'react-icons/fi';
import { useQuery } from 'react-query';
import { apiService } from '../../services/api';

const SearchBar = ({ placeholder = "Search by type", className = "" }) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Fetch suggestions
  const { data: suggestions = [], isLoading } = useQuery(
    ['suggestions', query],
    () => apiService.search.getSuggestions(query),
    {
      enabled: query.length > 2,
      select: (data) => data.data.data,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);
    setShowSuggestions(value.length > 0);
  };

  // Handle search submission
  const handleSearch = (searchQuery = query) => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
      setQuery('');
      inputRef.current?.blur();
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > -1 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSearch(suggestions[selectedIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
      default:
        break;
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    handleSearch(suggestion);
  };

  // Clear search
  const clearSearch = () => {
    setQuery('');
    setShowSuggestions(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        !inputRef.current?.contains(event.target)
      ) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="h-5 w-5 text-secondary-400" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(query.length > 0)}
          placeholder={placeholder}
          className="block w-full pl-10 pr-10 py-2.5 border border-secondary-300 rounded-lg bg-white placeholder-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
        />
        
        {query && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <FiX className="h-4 w-4 text-secondary-400 hover:text-secondary-600" />
          </button>
        )}
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && (query.length > 2 || suggestions.length > 0) && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-secondary-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {isLoading ? (
            <div className="px-4 py-3 text-sm text-secondary-500">
              Searching...
            </div>
          ) : suggestions.length > 0 ? (
            <>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`w-full text-left px-4 py-3 text-sm hover:bg-secondary-50 focus:bg-secondary-50 focus:outline-none ${
                    index === selectedIndex ? 'bg-primary-50 text-primary-700' : 'text-secondary-700'
                  }`}
                >
                  <div className="flex items-center">
                    <FiSearch className="h-4 w-4 mr-3 text-secondary-400" />
                    <span>{suggestion}</span>
                  </div>
                </button>
              ))}
              
              {query.trim() && !suggestions.includes(query.trim()) && (
                <button
                  onClick={() => handleSearch()}
                  className={`w-full text-left px-4 py-3 text-sm hover:bg-secondary-50 focus:bg-secondary-50 focus:outline-none border-t border-secondary-100 ${
                    selectedIndex === suggestions.length ? 'bg-primary-50 text-primary-700' : 'text-secondary-700'
                  }`}
                >
                  <div className="flex items-center">
                    <FiSearch className="h-4 w-4 mr-3 text-secondary-400" />
                    <span>Search for "{query.trim()}"</span>
                  </div>
                </button>
              )}
            </>
          ) : query.length > 2 ? (
            <div className="px-4 py-3 text-sm text-secondary-500">
              No suggestions found
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
