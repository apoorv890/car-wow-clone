import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { FiHome, FiTruck, FiUsers, FiMessageSquare, FiBarChart, FiSettings } from 'react-icons/fi';

// Admin components (we'll create basic placeholders)
const AdminOverview = () => (
  <div className="bg-white rounded-lg shadow-soft p-6">
    <h2 className="text-2xl font-heading font-bold text-secondary-900 mb-6">Dashboard Overview</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-primary-50 p-6 rounded-lg">
        <div className="flex items-center">
          <FiTruck className="w-8 h-8 text-primary-600 mr-3" />
          <div>
            <p className="text-sm font-medium text-primary-600">Total Cars</p>
            <p className="text-2xl font-bold text-primary-900">1,234</p>
          </div>
        </div>
      </div>
      
      <div className="bg-success-50 p-6 rounded-lg">
        <div className="flex items-center">
          <FiUsers className="w-8 h-8 text-success-600 mr-3" />
          <div>
            <p className="text-sm font-medium text-success-600">Total Users</p>
            <p className="text-2xl font-bold text-success-900">5,678</p>
          </div>
        </div>
      </div>
      
      <div className="bg-warning-50 p-6 rounded-lg">
        <div className="flex items-center">
          <FiMessageSquare className="w-8 h-8 text-warning-600 mr-3" />
          <div>
            <p className="text-sm font-medium text-warning-600">Reviews</p>
            <p className="text-2xl font-bold text-warning-900">2,345</p>
          </div>
        </div>
      </div>
      
      <div className="bg-accent-50 p-6 rounded-lg">
        <div className="flex items-center">
          <FiBarChart className="w-8 h-8 text-accent-600 mr-3" />
          <div>
            <p className="text-sm font-medium text-accent-600">Monthly Sales</p>
            <p className="text-2xl font-bold text-accent-900">£123K</p>
          </div>
        </div>
      </div>
    </div>
    
    <div className="text-center py-12">
      <p className="text-secondary-600">Admin dashboard functionality coming soon...</p>
    </div>
  </div>
);

const AdminCars = () => (
  <div className="bg-white rounded-lg shadow-soft p-6">
    <h2 className="text-2xl font-heading font-bold text-secondary-900 mb-6">Manage Cars</h2>
    <div className="text-center py-12">
      <p className="text-secondary-600">Car management interface coming soon...</p>
      <button className="btn-primary mt-4">Add New Car</button>
    </div>
  </div>
);

const AdminUsers = () => (
  <div className="bg-white rounded-lg shadow-soft p-6">
    <h2 className="text-2xl font-heading font-bold text-secondary-900 mb-6">Manage Users</h2>
    <div className="text-center py-12">
      <p className="text-secondary-600">User management interface coming soon...</p>
    </div>
  </div>
);

const AdminReviews = () => (
  <div className="bg-white rounded-lg shadow-soft p-6">
    <h2 className="text-2xl font-heading font-bold text-secondary-900 mb-6">Manage Reviews</h2>
    <div className="text-center py-12">
      <p className="text-secondary-600">Review management interface coming soon...</p>
    </div>
  </div>
);

const AdminSettings = () => (
  <div className="bg-white rounded-lg shadow-soft p-6">
    <h2 className="text-2xl font-heading font-bold text-secondary-900 mb-6">Settings</h2>
    <div className="text-center py-12">
      <p className="text-secondary-600">Admin settings coming soon...</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const location = useLocation();

  const sidebarItems = [
    { name: 'Overview', href: '/admin', icon: FiHome, exact: true },
    { name: 'Cars', href: '/admin/cars', icon: FiTruck },
    { name: 'Users', href: '/admin/users', icon: FiUsers },
    { name: 'Reviews', href: '/admin/reviews', icon: FiMessageSquare },
    { name: 'Settings', href: '/admin/settings', icon: FiSettings },
  ];

  const isActive = (href, exact = false) => {
    if (exact) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-soft min-h-screen">
          <div className="p-6 border-b border-secondary-200">
            <h1 className="text-xl font-heading font-bold text-secondary-900">
              Admin Dashboard
            </h1>
          </div>
          
          <nav className="p-4">
            <ul className="space-y-2">
              {sidebarItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                        isActive(item.href, item.exact)
                          ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600'
                          : 'text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900'
                      }`}
                    >
                      <IconComponent className="w-5 h-5 mr-3" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <Routes>
            <Route path="/" element={<AdminOverview />} />
            <Route path="/cars" element={<AdminCars />} />
            <Route path="/users" element={<AdminUsers />} />
            <Route path="/reviews" element={<AdminReviews />} />
            <Route path="/settings" element={<AdminSettings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
