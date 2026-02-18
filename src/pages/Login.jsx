import React from 'react';

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20 px-6">
      <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-2xl border border-gray-100">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif text-primary mb-2">Welcome Back</h2>
          <p className="text-primary/50 text-sm">Access your personalized collection & AI analysis</p>
        </div>
        
        <form className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-widest text-primary/60 mb-2 font-bold">Email Address</label>
            <input 
              type="email" 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-secondary transition-colors"
              placeholder="name@example.com"
            />
          </div>
          
          <div>
            <label className="block text-xs uppercase tracking-widest text-primary/60 mb-2 font-bold">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-secondary transition-colors"
              placeholder="••••••••"
            />
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="accent-secondary" />
              <span className="text-primary/60">Remember me</span>
            </label>
            <a href="#" className="text-secondary hover:underline font-medium">Forgot password?</a>
          </div>
          
          <button className="w-full py-4 bg-primary text-white text-xs uppercase tracking-widest font-bold rounded-lg hover:bg-secondary transition-all duration-300 shadow-lg hover:shadow-secondary/20">
            Sign In
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
