import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        console.log('Login Success Data:', data);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setMessage({ type: 'success', text: 'Login successful! Redirecting...' });
        
        // Redirect logic based on role from backend
        console.log('User Role:', data.user.role);
        const redirectPath = data.user.role === 'admin' ? '/admin-dashboard' : '/dashboard';
        setTimeout(() => navigate(redirectPath), 1500);
      } else {
        setMessage({ type: 'error', text: data.message || 'Invalid credentials' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Could not connect to the server' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20 px-6">
      <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-2xl border border-gray-100">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif text-primary mb-2">Welcome Back</h2>
          <p className="text-primary/50 text-sm">Access your personalized collection & AI analysis</p>
        </div>
        
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg text-sm text-center ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs uppercase tracking-widest text-primary/60 mb-2 font-bold">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-secondary transition-colors"
              placeholder="name@example.com"
            />
          </div>
          
          <div>
            <label className="block text-xs uppercase tracking-widest text-primary/60 mb-2 font-bold">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-secondary transition-colors pr-12"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/40 hover:text-secondary transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
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
          
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="accent-secondary" />
              <span className="text-primary/60">Remember me</span>
            </label>
            <a href="#" className="text-secondary hover:underline font-medium">Forgot password?</a>
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-4 bg-primary text-white text-xs uppercase tracking-widest font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-secondary/20 ${
              loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-secondary'
            }`}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-10 text-center text-xs text-primary/40">
          Don't have an account? <a href="#" className="text-secondary font-bold hover:underline">Request Invitation</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
