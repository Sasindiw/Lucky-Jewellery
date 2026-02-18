import React from 'react';

const AIRecommendations = () => {
  const recommendations = [
    { id: 1, name: "Sapphire Elegance", reason: "Matches your preference for Blue", price: "$1,200", bg: "bg-gradient-to-br from-gray-50 to-silver" },
    { id: 2, name: "Ruby Passion", reason: "Based on your search history", price: "$2,500", bg: "bg-gradient-to-br from-white to-gray-100" },
    { id: 3, name: "Emerald Serenity", reason: "Trending in your region", price: "$1,800", bg: "bg-gradient-to-br from-gray-50 to-gray-200" },
  ];

  return (
    <section className="py-32 bg-primary text-white relative overflow-hidden">
      {/* Dark luxury background for contrast */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#1e293b,_#0f172a)] opacity-100"></div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center mb-20 animate-fade-in-up">
          <h2 className="text-4xl md:text-6xl font-serif font-medium mb-6">AI-Curated for You</h2>
          <p className="text-gray-400 max-w-xl mx-auto text-lg font-light">
            Based on your browsing history, our algorithm believes these pieces resonate with your personal style.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {recommendations.map((item, index) => (
            <div 
                key={item.id} 
                className="group relative bg-white/5 border border-white/10 p-1 rounded-2xl overflow-hidden hover:bg-white/10 transition-colors duration-500"
                style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="relative h-64 w-full bg-gradient-to-br from-gray-800 to-black rounded-xl overflow-hidden mb-6 flex items-center justify-center group-hover:scale-[0.98] transition-transform duration-500">
                  <div className={`absolute inset-0 opacity-20 bg-gradient-to-tr from-secondary/20 to-transparent`}></div>
                  <img src={item.image} alt={item.name} className="h-40 w-auto object-contain filter drop-shadow-2xl hover:scale-110 transition-transform duration-700" />
                  
                  <div className="absolute top-4 left-4 bg-black/40 backdrop-blur px-3 py-1 rounded-full border border-white/10">
                    <span className="text-xs uppercase tracking-widest text-secondary">{item.reason}</span>
                  </div>
              </div>

              <div className="px-4 pb-6">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-serif">{item.name}</h3>
                    <span className="text-xl font-light text-secondary">{item.price}</span>
                </div>
                <button className="w-full mt-4 py-3 border border-white/20 hover:bg-white hover:text-primary transition-all duration-300 text-sm uppercase tracking-widest">
                    View Analysis
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AIRecommendations;
