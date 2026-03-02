import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const FeaturedGemstones = () => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const user = localStorage.getItem('user');
    const [gemstones, setGemstones] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/gemstones?limit=6');
                const result = await response.json();
                if (result.success) {
                    setGemstones(result.data);
                }
            } catch (err) {
                console.error("Failed to fetch featured gems", err);
            } finally {
                setLoading(false);
            }
        };
        fetchFeatured();
    }, []);

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
          {loading ? (
             [...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                    <div className="bg-gray-100 aspect-[4/5] w-full mb-8"></div>
                    <div className="h-6 bg-gray-100 w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-100 w-1/2"></div>
                </div>
             ))
          ) : gemstones.map((gem, index) => (
            <Link key={gem.id} to={`/gemstones/${gem.id}`} className="group cursor-pointer block">
              {/* Image Area - Aspect Ratio Box */}
              <div className="bg-gray-50 aspect-[4/5] w-full relative overflow-hidden mb-8">
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 group-hover:bg-gray-200 transition-colors duration-500">
                    <img src={`/images/${gem.image}`} alt={gem.name} className="w-3/4 h-3/4 object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-700 ease-out" onError={(e) => e.target.src = '/images/sapphire.png'} />
                  </div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-10 h-10 bg-white flex items-center justify-center rounded-full shadow-md hover:bg-primary hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                      </div>
                  </div>
              </div>
              
              {/* Text Area - Minimal */}
              <div>
                  <h3 className="text-2xl font-serif text-primary mb-2 group-hover:text-secondary transition-colors">{gem.name}</h3>
                  <div className="flex justify-between items-center text-sm mb-4">
                    <span className="text-primary/50 tracking-wider uppercase">{gem.carat}ct</span>
                    <span className="text-primary font-medium">${gem.price}</span>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      if (user) {
                          if (gem.stock > 0) {
                              addToCart(gem);
                          }
                      } else {
                          navigate('/login');
                      }
                    }}
                    className="w-full py-3 border border-primary text-primary text-[10px] font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={gem.status !== 'In Stock'}
                  >
                    {gem.status !== 'In Stock' ? 'Sold Out' : 'Add to Cart'}
                  </button>
              </div>
            </Link>
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
