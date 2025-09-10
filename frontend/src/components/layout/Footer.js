import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    'Buy a Car': [
      { name: 'New Cars', href: '/search?condition=New' },
      { name: 'Used Cars', href: '/search?condition=Used' },
      { name: 'Electric Cars', href: '/search?fuelType=Electric' },
      { name: 'Hybrid Cars', href: '/search?fuelType=Hybrid' },
      { name: 'Car Leasing', href: '/search?category=Lease' },
      { name: 'Car Finance', href: '/finance' },
    ],
    'Sell Your Car': [
      { name: 'Get a Valuation', href: '/valuation' },
      { name: 'Sell to Dealers', href: '/sell-to-dealers' },
      { name: 'Part Exchange', href: '/part-exchange' },
      { name: 'Selling Guide', href: '/selling-guide' },
    ],
    'Reviews & Advice': [
      { name: 'Car Reviews', href: '/reviews' },
      { name: 'Buying Guide', href: '/buying-guide' },
      { name: 'Car News', href: '/news' },
      { name: 'Compare Cars', href: '/compare' },
      { name: 'Car Insurance', href: '/insurance' },
    ],
    'About Carwow': [
      { name: 'About Us', href: '/about' },
      { name: 'How It Works', href: '/how-it-works' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' },
      { name: 'Contact Us', href: '/contact' },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', icon: FiFacebook, href: 'https://facebook.com/carwow' },
    { name: 'Twitter', icon: FiTwitter, href: 'https://twitter.com/carwow' },
    { name: 'Instagram', icon: FiInstagram, href: 'https://instagram.com/carwow' },
    { name: 'LinkedIn', icon: FiLinkedin, href: 'https://linkedin.com/company/carwow' },
  ];

  return (
    <footer className="bg-secondary-900 text-white">
      {/* Main Footer Content */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-2xl font-heading font-bold">carwow</span>
            </Link>
            
            <p className="text-secondary-300 mb-6 max-w-sm">
              The UK's leading car buying platform. Compare prices, read reviews, 
              and get the best deals on new and used cars.
            </p>

            {/* Contact Info */}
            <div className="space-y-2 text-sm text-secondary-300">
              <div className="flex items-center space-x-2">
                <FiPhone className="w-4 h-4" />
                <span>0800 123 4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiMail className="w-4 h-4" />
                <span>hello@carwow.co.uk</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiMapPin className="w-4 h-4" />
                <span>London, United Kingdom</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4 mt-6">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-secondary-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
                    aria-label={social.name}
                  >
                    <IconComponent className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-white mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-secondary-300 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="border-t border-secondary-800">
        <div className="container-custom py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold text-white mb-2">
                Stay updated with the latest deals
              </h3>
              <p className="text-secondary-300 text-sm">
                Get exclusive offers and car news delivered to your inbox
              </p>
            </div>
            
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-2 bg-secondary-800 border border-secondary-700 rounded-l-lg text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <button className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-r-lg transition-colors font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-secondary-800">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-secondary-400">
            <div className="mb-4 md:mb-0">
              <p>&copy; {currentYear} Carwow. All rights reserved.</p>
            </div>
            
            <div className="flex flex-wrap items-center space-x-6">
              <Link to="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="hover:text-white transition-colors">
                Cookie Policy
              </Link>
              <Link to="/sitemap" className="hover:text-white transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
