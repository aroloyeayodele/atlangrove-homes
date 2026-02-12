import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and about */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <img 
                src="/lovable-uploads/d8b82a03-78f9-4b90-ac43-39097201c852.png" 
                alt="Atlangrove Homes Logo" 
                className="h-8"
              />
            </Link>
            <p className="text-sm text-gray-600 mt-4">
             Atlangrove Homes provides quality and affordable accommodation while redefining possibilities in real estate with integrity, professionalism, and innovation.
            </p>
            <div className="flex space-x-4 pt-2">
              <a 
                href="https://facebook.com/atlangrovehomes" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-brand-red transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://instagram.com/atlangrovehomes" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-brand-red transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-brand-red transition-colors"
                aria-label="LinkedIn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.027-3.063-1.867-3.063-1.868 0-2.153 1.46-2.153 2.968v5.699h-3v-10h2.885v1.367h.041c.402-.761 1.384-1.563 2.847-1.563 3.045 0 3.607 2.004 3.607 4.609v5.587z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="text-gray-600 hover:text-brand-red transition-colors text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/properties" 
                  className="text-gray-600 hover:text-brand-red transition-colors text-sm"
                >
                  Properties
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-gray-600 hover:text-brand-red transition-colors text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-gray-600 hover:text-brand-red transition-colors text-sm"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Properties */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Properties</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/properties?category=land" 
                  className="text-gray-600 hover:text-brand-red transition-colors text-sm"
                >
                  Land
                </Link>
              </li>
              <li>
                <Link 
                  to="/properties?category=carcass" 
                  className="text-gray-600 hover:text-brand-red transition-colors text-sm"
                >
                  Carcass
                </Link>
              </li>
              <li>
                <Link 
                  to="/properties?category=finished" 
                  className="text-gray-600 hover:text-brand-red transition-colors text-sm"
                >
                  Finished Buildings
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <p className="flex items-start text-sm">
                <MapPin className="h-5 w-5 text-brand-red mr-2 mt-0.5" />
                <span className="text-gray-600">Garki Area 3 Abuja</span>
              </p>
              <p className="flex items-start text-sm">
                <Phone className="h-5 w-5 text-brand-red mr-2 mt-0.5" />
                <span className="text-gray-600">+234 806 172 0146</span>
              </p>
              <p className="flex items-start text-sm">
                <Mail className="h-5 w-5 text-brand-red mr-2 mt-0.5" />
                <span className="text-gray-600">info@atlangrovehomes.com</span>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-10 pt-6 text-center text-sm text-gray-500">
          <p>&copy; {currentYear} Atlangrove Homes. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
