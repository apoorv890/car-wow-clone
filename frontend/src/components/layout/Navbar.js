import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FiSearch, 
  FiUser, 
  FiMenu, 
  FiX, 
  FiShoppingCart, 
  FiHeart,
  FiSettings,
  FiLogOut,
  FiChevronDown
} from 'react-icons/fi';
import SearchBar from '../ui/SearchBar';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Navigation items
  const navItems = [
    { name: 'New', href: '/search?condition=New' },
    { name: 'Used', href: '/search?condition=Used' },
    { name: 'Sell', href: '/sell' },
    { name: 'Leasing', href: '/search?category=Lease' },
    { name: 'Electric', href: '/search?fuelType=Electric' },
    { name: 'Vans', href: '/search?category=MPV' },
    { name: 'Reviews', href: '/reviews' },
    { name: 'News', href: '/news' },
  ];

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const isActive = (href) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-secondary-200 sticky top-0 z-50">
      {/* Top bar with icons */}
      <div className="bg-secondary-900 text-white py-2">
        <div className="container-custom">
          <div className="flex justify-end items-center space-x-4 text-sm">
            <Link to="/buying" className="hover:text-primary-400 transition-colors">
              <FiShoppingCart className="inline mr-1" />
              Buying
            </Link>
            <Link to="/selling" className="hover:text-primary-400 transition-colors">
              <FiHeart className="inline mr-1" />
              Selling
            </Link>
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-1 hover:text-primary-400 transition-colors"
                >
                  <FiUser className="w-4 h-4" />
                  <span>{user?.name}</span>
                  <FiChevronDown className="w-3 h-3" />
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <FiUser className="mr-3 w-4 h-4" />
                      Profile
                    </Link>
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="flex items-center px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <FiSettings className="mr-3 w-4 h-4" />
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100"
                    >
                      <FiLogOut className="mr-3 w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="hover:text-primary-400 transition-colors">
                <FiUser className="inline mr-1" />
                Login
              </Link>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden hover:text-primary-400 transition-colors"
            >
              <FiMenu className="w-5 h-5" />
              Menu
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-2xl font-heading font-bold text-secondary-900">
              carwow
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-primary-600 border-b-2 border-primary-600 pb-1'
                    : 'text-secondary-700 hover:text-primary-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Search and Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {/* Desktop Search */}
            <div className="hidden md:block w-80">
              <SearchBar />
            </div>

            {/* Mobile Search Button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden p-2 text-secondary-600 hover:text-primary-600 transition-colors"
            >
              <FiSearch className="w-5 h-5" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-secondary-600 hover:text-primary-600 transition-colors"
            >
              {isMobileMenuOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchOpen && (
          <div className="md:hidden py-4 border-t border-secondary-200">
            <SearchBar />
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-secondary-200">
          <div className="container-custom py-4">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-base font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-primary-600'
                      : 'text-secondary-700 hover:text-primary-600'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              {!isAuthenticated && (
                <div className="pt-4 border-t border-secondary-200">
                  <Link
                    to="/login"
                    className="block text-base font-medium text-secondary-700 hover:text-primary-600 mb-2"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block text-base font-medium text-primary-600 hover:text-primary-700"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
