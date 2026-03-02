import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Passwords do not match. Please ensure both fields are identical.',
        confirmButtonColor: '#1e1e1e'
      });
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Membership Granted',
          text: 'Welcome to the Lucky Gems sanctuary. Please sign in to access your vault.',
          showConfirmButton: false,
          timer: 3000,
          background: '#ffffff',
          iconColor: '#ffbb00',
          customClass: {
            title: 'font-serif text-primary',
            popup: 'rounded-xl border border-gray-100 shadow-2xl'
          }
        });
        setTimeout(() => navigate('/login'), 3000);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Admission Failed',
          text: data.message || 'Registration encountered an issue.',
          confirmButtonText: 'Try Again',
          confirmButtonColor: '#1e1e1e'
        });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Registry Error',
        text: 'The sanctuary registry is currently offline. Please try again later.',
        confirmButtonColor: '#1e1e1e',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-32 pb-20 px-6">
      <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-2xl border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif text-primary mb-2">Join the Sanctuary</h2>
          <p className="text-primary/50 text-sm">Experience the prestige of Lucky Gems</p>
        </div>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs uppercase tracking-widest text-primary/60 mb-2 font-bold">Full Name</label>
            <input 
              type="text" 
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-secondary transition-colors"
              placeholder="Your Prestigious Name"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-primary/60 mb-2 font-bold">Email Address</label>
            <input 
              type="email" 
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-secondary transition-colors"
              placeholder="name@example.com"
            />
          </div>
          
          <div>
            <label className="block text-xs uppercase tracking-widest text-primary/60 mb-2 font-bold">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-secondary transition-colors pr-12"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/40 hover:text-secondary transition-colors"
              >
                {showPassword ? (
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a10.103 10.103 0 0 1 1.455-1.916C3.998 8.131 7.707 4.5 12 4.5c4.293 0 8 3.631 10.511 7.821a10.103 10.103 0 0 1-1.455 1.916A10.08 10.08 0 0 1 12 20c-4.293 0-8-3.631-10.511-7.821Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-primary/60 mb-2 font-bold">Confirm Password</label>
            <input 
              type="password" 
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-secondary transition-colors"
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-4 bg-primary text-white text-xs uppercase tracking-widest font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-secondary/20 ${
              loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-secondary'
            }`}
          >
            {loading ? 'Processing Admission...' : 'Join the Registry'}
          </button>
        </form>
        
        <div className="mt-10 text-center text-xs text-primary/40">
          Already a member? <Link to="/login" className="text-secondary font-bold hover:underline">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
