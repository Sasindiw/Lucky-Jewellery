import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    // Check for user in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Gemstones', path: '/gemstones' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-gradient-to-b from-white via-gray-50/50 to-transparent ${scrolled ? 'py-4' : 'py-6'}`}>
      <div className={`container mx-auto px-6 md:px-12 transition-all duration-300`}>
        <div className={`flex items-center justify-between rounded-full px-8 py-3 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg border border-gray-100' : 'bg-gradient-to-r from-white/80 to-gray-50/80 backdrop-blur-sm border border-white/40'}`}>
          
          {/* Logo */}
          <div className="flex-shrink-0">
             <Link to="/" className="flex items-center">
              <img src="/logo.jpg" alt="Lucky Gems" className="h-12 w-12 object-cover rounded-full shadow-md mix-blend-multiply" />
             </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center">
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                to={item.path}
                className={`text-sm font-medium uppercase tracking-wider transition-colors duration-300 hover:text-secondary ${
                  (location.pathname === item.path) 
                    ? 'text-secondary font-bold' 
                    : scrolled ? 'text-primary' : 'text-primary/80'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {user ? (
              <div className="flex items-center gap-6">
                <Link 
                  to={user.role === 'admin' ? "/admin-dashboard" : "/dashboard"}
                  className="text-xs font-bold uppercase tracking-widest text-secondary hover:underline transition-all"
                >
                  Dashboard
                </Link>
                <span className="text-xs font-bold uppercase tracking-widest text-secondary border-l border-gray-200 pl-6">
                  {user.name}
                </span>
                <button 
                  onClick={handleLogout}
                  className="text-xs font-bold uppercase tracking-widest text-primary hover:text-secondary transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                to="/login"
                className={`text-sm font-medium uppercase tracking-wider transition-colors duration-300 hover:text-secondary ${
                  (location.pathname === '/login') 
                    ? 'text-secondary font-bold' 
                    : scrolled ? 'text-primary' : 'text-primary/80'
                }`}
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className={`p-2 transition-colors ${scrolled ? 'text-primary' : 'text-primary'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
