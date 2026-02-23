import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('collection');
  const [recommendations, setRecommendations] = useState([]);

  const fetchRecommendations = async (seedId = null) => {
    try {
      setRecommendations([]); // Show loading state
      const id = seedId || Math.floor(Math.random() * 100) + 1;
      const response = await fetch(`http://localhost:5000/api/gemstones/${id}/recommendations`);
      const result = await response.json();
      if (result.success) {
        setRecommendations(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch recommendations:', err);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchRecommendations();
  }, []);

  const handleRefreshRecommendations = () => {
    fetchRecommendations();
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
        <div className="animate-pulse text-primary/40 text-lg font-serif">Loading your sanctuary...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col pt-24">
      <main className="flex-1 container mx-auto px-6 md:px-12 py-12">
        {/* Profile Header */}
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-gray-100">
          <div>
            <span className="text-secondary text-xs font-bold uppercase tracking-[0.3em] mb-4 block">Welcome back</span>
            <h1 className="text-5xl font-serif text-primary mb-2 line-clamp-1">{user.name}</h1>
            <p className="text-primary/40 font-light max-w-md">Your curated entrance to the world's most exquisite gemstones and AI-powered insights.</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-gray-50 px-8 py-4 rounded-sm border border-gray-100 flex flex-col items-center min-w-[120px]">
              <span className="text-primary font-serif text-xl">3</span>
              <span className="text-[10px] uppercase tracking-widest text-primary/40">Gems Owned</span>
            </div>
            <div className="bg-gray-50 px-8 py-4 rounded-sm border border-gray-100 flex flex-col items-center min-w-[120px]">
              <span className="text-primary font-serif text-xl">12</span>
              <span className="text-[10px] uppercase tracking-widest text-primary/40">AI Analyzed</span>
            </div>
          </div>
        </header>

        {/* Dashboard Navigation */}
        <div className="flex gap-12 mb-12 border-b border-gray-50 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {['Collection', 'Recommendations', 'Analysis History', 'Account'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`pb-4 text-xs uppercase tracking-[0.2em] font-bold transition-all relative ${
                activeTab === tab.toLowerCase() 
                  ? 'text-secondary' 
                  : 'text-primary/30 hover:text-primary'
              }`}
            >
              {tab}
              {activeTab === tab.toLowerCase() && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary animate-in fade-in slide-in-from-left-2 duration-300"></div>
              )}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main List */}
          <div className="lg:col-span-8">
            {activeTab === 'collection' && (
              <div className="space-y-8 animate-in fade-in duration-700">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-serif text-primary">Your Collection</h2>
                  <Link to="/gemstones" className="text-xs uppercase tracking-widest text-secondary hover:underline">Grow Collection</Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[1, 2].map((i) => (
                      <div key={i} className="group bg-gray-50 rounded-sm overflow-hidden border border-gray-100 hover:shadow-xl hover:shadow-gray-100 transition-all duration-500">
                        <div className="aspect-square bg-white relative overflow-hidden">
                           <div className="absolute inset-0 flex items-center justify-center opacity-40 group-hover:scale-110 transition-transform duration-700">
                             <img src={`/images/${i === 1 ? 'sapphire' : 'ruby'}.png`} alt="Gemstone" className="w-1/2 h-1/2 object-contain" />
                           </div>
                           <div className="absolute top-4 right-4 group-hover:translate-x-0 translate-x-12 opacity-0 group-hover:opacity-100 transition-all duration-300">
                              <span className="bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] uppercase tracking-widest text-primary font-bold shadow-sm">Verified</span>
                           </div>
                        </div>
                        <div className="p-6">
                            <h3 className="text-primary font-serif text-lg mb-1">{i === 1 ? 'Oval Cut Sapphire' : 'Marquise Ruby'}</h3>
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] uppercase tracking-widest text-primary/40 font-bold">Bought May 2025</span>
                              <span className="text-secondary text-sm font-medium">$4,500</span>
                            </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
            
            {activeTab === 'recommendations' && (
              <div className="animate-in fade-in duration-700">
                 <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-serif text-primary">AI-Personalized Selection</h2>
                    <button 
                      onClick={handleRefreshRecommendations}
                      className="text-[10px] uppercase tracking-[0.2em] font-bold text-secondary hover:text-primary transition-colors flex items-center gap-2"
                    >
                      <span className="text-lg">🔄</span> Explore New Styles
                    </button>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {recommendations.length > 0 ? recommendations.map(gem => (
                      <div key={gem.id} className="flex flex-col p-6 bg-gray-50 border border-gray-100 rounded-sm hover:border-secondary/30 transition-colors cursor-pointer group">
                        <div className="flex gap-6 items-center mb-6">
                          <div className="w-24 h-24 bg-white flex items-center justify-center p-2 group-hover:scale-110 transition-transform">
                            <img 
                              src={`/images/${gem.image}`} 
                              alt={gem.name} 
                              className="w-full h-full object-contain"
                              onError={(e) => e.target.src = '/images/sapphire.png'}
                            />
                          </div>
                          <div>
                            <h4 className="font-serif text-primary text-xl leading-tight">{gem.name}</h4>
                            <p className="text-secondary font-medium text-sm mb-1">${gem.price}</p>
                            <span className="text-[10px] uppercase tracking-widest text-primary/40 font-bold bg-white px-2 py-0.5 rounded-full border border-gray-100">
                              {gem.variety}
                            </span>
                          </div>
                        </div>
                        <div className="pt-4 border-t border-gray-200 grid grid-cols-2 gap-y-3">
                           <div className="flex flex-col">
                              <span className="text-[8px] uppercase tracking-widest text-primary/40 font-bold">Carat</span>
                              <span className="text-xs text-primary">{gem.carat}ct</span>
                           </div>
                           <div className="flex flex-col">
                              <span className="text-[8px] uppercase tracking-widest text-primary/40 font-bold">Color</span>
                              <span className="text-xs text-primary">{gem.color}</span>
                           </div>
                           <div className="flex flex-col">
                              <span className="text-[8px] uppercase tracking-widest text-primary/40 font-bold">Cut</span>
                              <span className="text-xs text-primary">{gem.cut}</span>
                           </div>
                           <div className="flex flex-col">
                              <span className="text-[8px] uppercase tracking-widest text-primary/40 font-bold">Treatment</span>
                              <span className="text-xs text-primary">{gem.treatment}</span>
                           </div>
                        </div>
                        <button className="w-full mt-6 py-3 bg-white border border-gray-100 text-[10px] uppercase tracking-widest text-primary font-bold group-hover:bg-primary group-hover:text-white transition-all">
                          View Match Details
                        </button>
                      </div>
                   )) : (
                     <div className="col-span-2 py-20 text-center border-2 border-dashed border-gray-100 rounded-sm">
                       <p className="text-primary/30 font-serif italic text-lg">AI Engines Warming Up...</p>
                       <p className="text-[10px] uppercase tracking-widest text-primary/20 mt-2">Start a new analysis to see recommendations</p>
                     </div>
                   )}
                 </div>
              </div>
            )}
          </div>

          {/* AI Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-primary text-white p-8 rounded-sm overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-secondary/20 transition-colors duration-700"></div>
              <h3 className="text-xl font-serif mb-4 relative z-10">AI Gem Assistant</h3>
              <p className="text-white/60 text-sm font-light mb-8 leading-relaxed relative z-10">
                Our neural engines are analyzing 500+ data points to find your next perfect centerpiece.
              </p>
              <button className="w-full py-4 bg-secondary text-white text-[10px] uppercase tracking-[0.3em] font-bold rounded-sm hover:bg-white hover:text-primary transition-all duration-300 relative z-10">
                Start New Analysis
              </button>
            </div>

            <div className="border border-gray-100 rounded-sm p-8">
               <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-primary/30 mb-6">Expert Consultant</h4>
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center font-serif italic text-primary">S</div>
                  <div>
                    <p className="text-primary text-sm font-bold">Sarah Wickramasinghe</p>
                    <p className="text-[10px] text-primary/40 uppercase tracking-widest">Master Gemologist</p>
                  </div>
               </div>
               <button className="w-full mt-6 py-3 border border-gray-100 text-[10px] uppercase tracking-widest text-primary/60 hover:border-primary hover:text-primary transition-all">Schedule Call</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
