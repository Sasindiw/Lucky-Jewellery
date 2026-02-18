import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-white via-gray-50/30 to-white flex items-center overflow-hidden pt-20">
      {/* Enhanced Background with Subtle Patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-20"></div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-secondary/5 to-transparent rounded-full blur-[120px] animate-pulse-slow"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-50/30 to-transparent rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24">
          
          {/* Text Content - Enhanced */}
          <div className="w-full lg:w-1/2 text-left animate-fade-in-up">
            {/* Decorative Line */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-[2px] bg-gradient-to-r from-secondary to-transparent"></div>
              <span className="block text-secondary font-medium tracking-[0.3em] text-xs uppercase">
                Est. 1980
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-primary leading-[0.85] tracking-tighter mb-6">
              <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-secondary via-yellow-600 to-secondary animate-gradient-x">
                Lucky Gems
              </span>
              <br />
              Discover Elegance
            </h1>
            
            <p className="text-primary/70 text-lg md:text-xl mb-10 max-w-md font-light leading-relaxed border-l-2 border-secondary/30 pl-6">
              Where nature's rarest treasures meet timeless craftsmanship. Each gemstone tells a story of beauty, brilliance, and eternal elegance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <Link to="/gemstones" className="group px-10 py-5 bg-primary text-white text-sm tracking-widest uppercase hover:bg-secondary transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-secondary/20 relative overflow-hidden inline-block text-center">
                <span className="relative z-10">Explore Collection</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </Link>
              <button className="px-10 py-5 border-2 border-primary text-primary text-sm tracking-widest uppercase hover:bg-primary hover:text-white transition-all duration-300 hover:shadow-lg">
                AI Analysis
              </button>
            </div>
            
            {/* Stats Section */}
            <div className="flex gap-8 mt-12 pt-8 border-t border-gray-200">
              <div>
                <div className="text-3xl font-serif text-secondary mb-1">500+</div>
                <div className="text-xs uppercase tracking-wider text-gray-500">Rare Gems</div>
              </div>
              <div>
                <div className="text-3xl font-serif text-secondary mb-1">98%</div>
                <div className="text-xs uppercase tracking-wider text-gray-500">AI Accuracy</div>
              </div>
              <div>
                <div className="text-3xl font-serif text-secondary mb-1">40+</div>
                <div className="text-xs uppercase tracking-wider text-gray-500">Years Legacy</div>
              </div>
            </div>
          </div>

          {/* Visual - Enhanced */}
          <div className="w-full lg:w-1/2 relative h-[500px] lg:h-[700px] flex items-center justify-center">
             {/* Glow Effect */}
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-secondary/10 via-transparent to-transparent blur-[100px] animate-pulse-slow"></div>
             
             {/* Main Image with Frame */}
             <div className="relative w-full h-full max-h-[600px] max-w-[500px] animate-float hover:scale-105 transition-all duration-1000 ease-in-out group">
                 {/* Decorative Corner Accents */}
                 <div className="absolute -top-4 -left-4 w-16 h-16 border-t-2 border-l-2 border-secondary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                 <div className="absolute -bottom-4 -right-4 w-16 h-16 border-b-2 border-r-2 border-secondary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                 
                 <img src="/images/hero_elegant.png" className="w-full h-full object-cover rounded-[3rem] shadow-2xl ring-1 ring-gray-100" alt="Lucky Gems Collection" />
                 
                 {/* Overlay Badge */}
                 <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-gray-100">
                   <div className="flex items-center gap-2">
                     <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                     <span className="text-xs font-medium text-primary">Certified Authentic</span>
                   </div>
                 </div>
             </div>

             {/* Floating Accent Card */}
             <div className="absolute bottom-8 -left-8 bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-gray-100 animate-float max-w-[200px]" style={{ animationDelay: '1s' }}>
                 <div className="text-sm font-serif italic text-primary/80 mb-2">"Timeless Elegance"</div>
                 <div className="flex items-center gap-1">
                   {[...Array(5)].map((_, i) => (
                     <svg key={i} className="w-3 h-3 text-secondary fill-current" viewBox="0 0 20 20">
                       <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                     </svg>
                   ))}
                 </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Hero;
