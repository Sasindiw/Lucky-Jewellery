import React from 'react';
import { Link } from 'react-router-dom';

const FeaturedGemstones = () => {
    const gemstones = [
        { id: 1, name: "Royal Blue Sapphire", carat: "2.5ct", price: "$3,400", color: "text-blue-600", image: "/images/sapphire.png" },
        { id: 2, name: "Crimson Ruby", carat: "1.8ct", price: "$4,200", color: "text-red-600", image: "/images/ruby.png" },
        { id: 3, name: "Colombian Emerald", carat: "1.5ct", price: "$5,000", color: "text-green-600", image: "/images/emerald.png" },
        { id: 4, name: "Imperial Topaz", carat: "3.2ct", price: "$2,800", color: "text-yellow-600", image: "/images/ruby.png" }, // Reusing ruby for topaz placeholder or generate new if needed, using ruby for now
        { id: 5, name: "Amethyst Geode", carat: "4.0ct", price: "$900", color: "text-purple-600", image: "/images/sapphire.png" }, // Reusing sapphire
        { id: 6, name: "Black Opal", carat: "2.1ct", price: "$6,700", color: "text-gray-800", image: "/images/emerald.png" }, // Reusing emerald
    ];

  return (
    <section id="gemstones" className="py-32 bg-white relative">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24">
            <div className="max-w-2xl">
                <span className="text-xs font-bold tracking-widest uppercase text-secondary mb-4 block">Selected for You</span>
                <h2 className="text-5xl md:text-6xl font-serif text-primary mb-6 leading-none">Curated Collection</h2>
                <p className="text-primary/60 text-lg font-light max-w-lg">
                    Each piece tells a story of rarity and provenance. Handpicked by our experts and verified by AI.
                </p>
            </div>
            <Link to="/gemstones" className="hidden md:inline-block border-b border-primary pb-1 text-primary hover:text-secondary hover:border-secondary transition-colors uppercase tracking-widest text-xs">
                View All Items
            </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
          {gemstones.map((gem, index) => (
            <div key={gem.id} className="group cursor-pointer">
              {/* Image Area - Aspect Ratio Box */}
              <div className="bg-gray-50 aspect-[4/5] w-full relative overflow-hidden mb-8">
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 group-hover:bg-gray-200 transition-colors duration-500">
                    <img src={gem.image} alt={gem.name} className="w-3/4 h-3/4 object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-700 ease-out" />
                  </div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="w-10 h-10 bg-white flex items-center justify-center rounded-full shadow-md hover:bg-primary hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                      </button>
                  </div>
              </div>
              
              {/* Text Area - Minimal */}
              <div>
                  <h3 className="text-2xl font-serif text-primary mb-2 group-hover:text-secondary transition-colors">{gem.name}</h3>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-primary/50 tracking-wider uppercase">{gem.carat}</span>
                    <span className="text-primary font-medium">{gem.price}</span>
                  </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-20 text-center md:hidden">
            <Link to="/gemstones" className="px-8 py-3 border border-primary text-primary uppercase text-xs tracking-widest inline-block">View Full Collection</Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedGemstones;
