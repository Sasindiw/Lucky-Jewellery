import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    
  // Simple footer links structure
  const links = {
    Shop: [
        { name: 'All Gemstones', path: '/gemstones' },
        { name: 'New Arrivals', path: '/gemstones' },
        { name: 'Best Sellers', path: '/gemstones' },
        { name: 'Investment Grade', path: '/gemstones' }
    ],
    Company: [
        { name: 'About Us', path: '/about' },
        { name: 'Our Story', path: '/about' },
        { name: 'Careers', path: '#' },
        { name: 'Press', path: '#' }
    ],
    Support: [
        { name: 'Contact Us', path: '#' },
        { name: 'FAQs', path: '#' },
        { name: 'Shipping & Returns', path: '#' },
        { name: 'Size Guide', path: '#' }
    ]
  };

  return (
    <footer className="bg-gray-100 text-gray-600 py-16 border-t border-gray-200">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
            
            {/* Brand Column */}
            <div className="lg:col-span-2">
                <Link to="/" className="block mb-6">
                    <img src="/logo.jpg" alt="Lucky Gems" className="h-16 w-16 object-cover rounded-full shadow-sm mix-blend-multiply opacity-80" />
                </Link>
                <p className="text-sm leading-7 mb-6 max-w-sm text-primary/80">
                    Elevating the art of gemstone collection with AI-driven precision and timeless elegance. Find the piece that speaks to your soul.
                </p>
                <div className="flex space-x-4">
                    {/* Social Icons */}
                    {['F', 'T', 'I', 'L'].map((social, i) => (
                        <div key={i} className="w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer hover:bg-secondary hover:text-white transition-all duration-300 shadow-sm text-primary">
                            <span className="font-bold">{social}</span>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Links Columns */}
            {Object.entries(links).map(([category, items]) => (
                <div key={category}>
                    <h4 className="text-white font-serif font-bold mb-6 tracking-wide">{category}</h4>
                    <ul className="space-y-4 text-sm">
                        {items.map(item => (
                            <li key={item.name}>
                                <Link to={item.path} className="hover:text-secondary transition-colors duration-200">{item.name}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 text-xs text-gray-500">
            <p>&copy; {new Date().getFullYear()} Lucky Gems. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
