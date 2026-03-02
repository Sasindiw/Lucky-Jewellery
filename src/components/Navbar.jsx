import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Swal from 'sweetalert2';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { getCartCount } = useCart();

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
    Swal.fire({
      title: 'Departure Confirmation',
      text: 'Are you prepared to exit the vault sanctuary?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#1e1e1e',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Logout',
      background: '#ffffff',
      customClass: {
        title: 'font-serif text-primary',
        popup: 'rounded-xl border border-gray-100 shadow-2xl'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login', { replace: true });
      }
    });
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Catalog', path: '/gemstones' },
    { name: 'About', path: '/about' },
  ];

  // Determine which links to show
  let visibleNavItems = navItems;
  
  if (user) {
    if (user.role === 'admin') {
      // Admins should see Home, About but NOT Catalog
      visibleNavItems = navItems.filter(item => item.name !== 'Catalog');
    } else {
      // Regular users only show Catalog (They have their own dashboard flow)
      visibleNavItems = navItems.filter(item => item.name === 'Catalog');
    }
  } else {
    // Guest users: Show Home and About, but NOT Catalog
    visibleNavItems = navItems.filter(item => item.name !== 'Catalog');
  }

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
            {visibleNavItems.map((item) => (
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
            
            {/* Conditional Cart Link for Logged-In NON-ADMIN Users */}
            {user && user.role !== 'admin' && (
              <Link to="/cart" className="relative text-primary hover:text-secondary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                {getCartCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-secondary text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                    {getCartCount()}
                  </span>
                )}
              </Link>
            )}
            
            <div className="h-6 w-px bg-gray-200 mx-2"></div>

            {user ? (
              <div className="flex items-center gap-6">
                {user.role === 'admin' ? (
                  <>
                    <Link 
                      to="/admin/orders"
                      className={`text-xs font-bold uppercase tracking-widest transition-all ${location.pathname === '/admin/orders' ? 'text-secondary underline' : 'text-primary hover:text-secondary'}`}
                    >
                      Sales & Orders
                    </Link>
                    <Link 
                      to="/admin/users"
                      className={`text-xs font-bold uppercase tracking-widest transition-all ${location.pathname === '/admin/users' ? 'text-secondary underline' : 'text-primary hover:text-secondary'}`}
                    >
                      Client Registry
                    </Link>
                  </>
                ) : (
                  <Link 
                    to="/dashboard"
                    className="text-xs font-bold uppercase tracking-widest text-secondary hover:underline transition-all"
                  >
                    Dashboard
                  </Link>
                )}
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
              <div className="flex items-center gap-6">
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
                <Link 
                  to="/register"
                  className={`text-sm font-medium uppercase tracking-wider transition-colors duration-300 hover:text-secondary px-5 py-2 rounded-full border border-secondary/30 hover:bg-secondary hover:text-white ${
                    (location.pathname === '/register') 
                      ? 'bg-secondary text-white' 
                      : scrolled ? 'text-primary' : 'text-primary/80'
                  }`}
                >
                  Sign Up
                </Link>
              </div>
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
