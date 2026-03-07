import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Swal from 'sweetalert2';

const SkeletonCard = () => (
  <div className="animate-pulse">
    <div className="bg-gray-100 aspect-[4/5] w-full mb-6 rounded-sm"></div>
    <div className="h-4 bg-gray-100 w-3/4 mb-2 rounded-sm"></div>
    <div className="h-3 bg-gray-50 w-full rounded-sm"></div>
  </div>
);

const Gemstones = () => {
    const [gemstones, setGemstones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { addToCart } = useCart();
    
    const user = localStorage.getItem('user');
    
    // Filter & Search State
    const [search, setSearch] = useState('');
    const [variety, setVariety] = useState('All');
    const [color, setColor] = useState('All');
    const [shape, setShape] = useState('All');
    const [minCarat, setMinCarat] = useState('');
    const [maxCarat, setMaxCarat] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const varieties = ['All', 'Sapphire', 'Ruby', 'Emerald', 'Diamond', 'Topaz', 'Opal', 'Amethyst', 'Garnet', 'Spinel', 'Citrine'];
    const colors = ['All', 'Pink', 'Yellow', 'Blue', 'Green', 'Red', 'Purple', 'Orange', 'White'];
    const shapes = ['All', 'Round', 'Oval', 'Pear', 'Cushion', 'Emerald', 'Heart', 'Princess', 'Marquise'];

    const fetchGemstones = useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (variety !== 'All') params.append('variety', variety);
            if (color !== 'All') params.append('color', color);
            if (shape !== 'All') params.append('shape', shape);
            if (minCarat !== '') params.append('minCarat', minCarat);
            if (maxCarat !== '') params.append('maxCarat', maxCarat);

            const response = await fetch(`http://localhost:5000/api/gemstones?${params.toString()}`);
            const result = await response.json();
            
            if (result.success) {
                setGemstones(result.data);
                setCurrentPage(1);
                setError(null);
            } else {
                setError('Failed to fetch collection');
            }
        } catch (err) {
            setError('System connection error');
        } finally {
            setLoading(false);
        }
    }, [search, variety, color, shape, minCarat, maxCarat]);

    useEffect(() => {
        const timeoutId = setTimeout(fetchGemstones, 300); // Debounce search
        return () => clearTimeout(timeoutId);
    }, [fetchGemstones]);

    const resetFilters = () => {
        setSearch('');
        setVariety('All');
        setColor('All');
        setShape('All');
        setMinCarat('');
        setMaxCarat('');
    };

    return (
        <div className="pt-24 min-h-screen bg-white">
            {/* Premium Header */}
            <div className="relative bg-primary text-white py-24 overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
                
                <div className="container mx-auto px-6 md:px-12 relative z-10 text-center">
                    <span className="text-secondary text-xs font-bold uppercase tracking-[0.4em] mb-6 block drop-shadow-sm">The Master Collection</span>
                    <h1 className="text-5xl md:text-7xl font-serif mb-6 leading-tight font-light tracking-wide">Curated Excellence</h1>
                    <p className="text-white/70 text-lg font-light max-w-2xl mx-auto leading-relaxed">
                        Explore our exhaustive treasury of unparalleled gemstones, featuring nature's most magnificent creations, meticulously sourced and authenticated.
                    </p>
                </div>
            </div>

            {/* Horizontal Filter & Search Bar - Modern Premium Approach */}
            <div className="sticky top-[80px] z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 py-4 shadow-sm">
                <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
                    {/* Varieties Horizontal Navigation */}
                    <div className="flex overflow-x-auto w-full md:w-auto scrollbar-hide gap-10 pb-2 md:pb-0">
                        {varieties.map(v => (
                            <button
                                key={v}
                                onClick={() => setVariety(v)}
                                className={`text-[10px] uppercase tracking-[0.2em] font-bold whitespace-nowrap transition-all duration-300 relative ${
                                    variety === v ? 'text-secondary' : 'text-primary/40 hover:text-primary'
                                }`}
                            >
                                {v}
                                {variety === v && <div className="absolute -bottom-[19px] left-0 right-0 h-[2px] bg-secondary"></div>}
                            </button>
                        ))}
                    </div>

                    {/* Minimalist Search Bar */}
                    <div className="relative w-full md:w-80 group">
                        <input 
                            type="text"
                            placeholder="Discover your masterpiece..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-transparent border-b border-gray-200 py-2 pl-2 pr-8 text-sm font-light text-primary placeholder:text-primary/30 focus:outline-none focus:border-secondary transition-colors"
                        />
                        <svg className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-primary/30 group-focus-within:text-secondary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 md:px-12 py-16">
                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Advanced Refinements Sidebar */}
                    <aside className="lg:w-64 shrink-0 hidden lg:block">
                        <div className="sticky top-[180px] space-y-12">
                            <div>
                                <h3 className="text-xl font-serif text-primary mb-6">Refine Search</h3>
                                <div className="w-12 h-[1px] bg-secondary"></div>
                            </div>

                            <section>
                                <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary mb-6">Color Spectrum</h4>
                                <div className="space-y-4">
                                    {colors.map(c => (
                                        <label key={c} className="flex items-center gap-4 cursor-pointer group" onClick={() => setColor(c)}>
                                            <div className={`w-3 h-3 border transition-all duration-300 flex items-center justify-center ${color === c ? 'border-secondary bg-secondary' : 'border-gray-300 group-hover:border-primary'}`}>
                                                {color === c && <div className="w-1 h-1 bg-white rounded-full"></div>}
                                            </div>
                                            <span className={`text-sm tracking-wide transition-colors ${color === c ? 'text-primary font-medium' : 'text-primary/60 group-hover:text-primary'}`}>{c}</span>
                                        </label>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary mb-6">Shape & Cut</h4>
                                <div className="space-y-4">
                                    {shapes.map(s => (
                                        <label key={s} className="flex items-center gap-4 cursor-pointer group" onClick={() => setShape(s)}>
                                            <div className={`w-3 h-3 border transition-all duration-300 flex items-center justify-center ${shape === s ? 'border-secondary bg-secondary' : 'border-gray-300 group-hover:border-primary'}`}>
                                                {shape === s && <div className="w-1 h-1 bg-white rounded-full"></div>}
                                            </div>
                                            <span className={`text-sm tracking-wide transition-colors ${shape === s ? 'text-primary font-medium' : 'text-primary/60 group-hover:text-primary'}`}>{s}</span>
                                        </label>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary mb-6">Carat Weight</h4>
                                <div className="flex items-center gap-4">
                                    <input 
                                        type="number" 
                                        placeholder="Min" 
                                        value={minCarat}
                                        onChange={(e) => setMinCarat(e.target.value)}
                                        className="w-full bg-transparent border-b border-gray-200 py-2 text-sm text-center focus:outline-none focus:border-secondary text-primary placeholder:text-primary/30 transition-colors"
                                    />
                                    <span className="text-primary/20 text-xs">—</span>
                                    <input 
                                        type="number" 
                                        placeholder="Max" 
                                        value={maxCarat}
                                        onChange={(e) => setMaxCarat(e.target.value)}
                                        className="w-full bg-transparent border-b border-gray-200 py-2 text-sm text-center focus:outline-none focus:border-secondary text-primary placeholder:text-primary/30 transition-colors"
                                    />
                                </div>
                            </section>

                            <button 
                                onClick={resetFilters}
                                className="w-full py-4 text-[10px] uppercase tracking-[0.2em] font-bold text-primary border border-gray-200 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-sm"
                            >
                                Clear Refinements
                            </button>
                        </div>
                    </aside>

                    {/* Content Grid */}
                    <div className="flex-1">
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 border-b border-gray-100 pb-4 gap-4">
                            <span className="text-xs uppercase tracking-[0.2em] text-primary/40 font-bold">{gemstones.length} {gemstones.length === 1 ? 'Masterpiece' : 'Masterpieces'}</span>
                            <div className="text-[10px] uppercase tracking-[0.2em] text-primary/40 font-bold flex items-center gap-2">
                                Sort By: <span className="text-primary cursor-pointer border-b border-primary hover:text-secondary hover:border-secondary transition-colors pb-0.5">Featured</span>
                            </div>
                        </div>

                        {error ? (
                            <div className="h-96 flex flex-col items-center justify-center text-center">
                                <p className="text-primary/40 font-serif mb-6 italic text-xl">{error}</p>
                                <button onClick={fetchGemstones} className="text-secondary text-xs font-bold uppercase tracking-[0.2em] hover:underline">Re-establish Connection</button>
                            </div>
                        ) : loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-16">
                                {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
                            </div>
                        ) : gemstones.length > 0 ? (
                            <div className="animate-in fade-in duration-1000">
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-16 slide-in-from-bottom-8">
                                    {gemstones.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((gem) => (
                                    <div key={gem.id} className="group flex flex-col">
                                        
                                        {/* Image Box */}
                                        <div className="bg-[#f9f9f9] aspect-[4/5] w-full relative overflow-hidden mb-8 flex items-center justify-center cursor-pointer transition-all duration-700 hover:bg-[#f2f2f2]" onClick={() => navigate(`/gemstones/${gem.id}`)}>
                                            <img 
                                                src={gem.image?.includes('gem_') || gem.image?.includes('placeholder') ? `/images/${gem.image}` : `http://localhost:5000/uploads/${gem.image}`} 
                                                alt={gem.name} 
                                                className="w-3/4 h-3/4 object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]" 
                                                onError={(e) => e.target.src = '/images/sapphire.png'}
                                            />
                                            
                                            {/* Status Badge */}
                                            <div className="absolute top-5 left-5 z-10">
                                                {gem.status !== 'In Stock' && (
                                                    <span className="bg-primary text-white py-1.5 px-3 text-[8px] uppercase tracking-[0.25em] font-bold shadow-md">
                                                        {gem.status}
                                                    </span>
                                                )}
                                            </div>
                                            
                                            {/* Beautiful Gradient Hover Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                                            {/* Elegant Actions overlay */}
                                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[85%] translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out z-20 space-y-2">
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/gemstones/${gem.id}`);
                                                    }}
                                                    className="w-full py-3 bg-white/95 backdrop-blur-sm text-primary text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-gray-50 transition-all shadow-xl border border-gray-100"
                                                >
                                                    View Heritage Profile
                                                </button>
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (user) {
                                                            if (gem.stock > 0) {
                                                                addToCart(gem);
                                                                Swal.fire({
                                                                    toast: true,
                                                                    position: 'top-end',
                                                                    icon: 'success',
                                                                    title: 'Added to Collection',
                                                                    text: `${gem.name} is now in your cart.`,
                                                                    showConfirmButton: false,
                                                                    timer: 3000,
                                                                    background: '#1e1e1e',
                                                                    color: '#ffffff',
                                                                    iconColor: '#ffbb00',
                                                                });
                                                            }
                                                        } else {
                                                            navigate('/login');
                                                        }
                                                    }}
                                                    className="w-full py-4 bg-primary text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-secondary transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed border border-primary"
                                                    disabled={gem.status !== 'In Stock'}
                                                >
                                                    {gem.status !== 'In Stock' ? 'Sold Out' : 'Add to Cart'}
                                                </button>
                                            </div>
                                        </div>
                                        
                                        {/* Classic Typography Below */}
                                        <div className="flex flex-col items-center text-center cursor-pointer px-4" onClick={() => navigate(`/gemstones/${gem.id}`)}>
                                            <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-secondary mb-3">{gem.variety}</span>
                                            <h3 className="text-xl md:text-2xl font-serif text-primary mb-2 line-clamp-1 group-hover:text-secondary transition-colors duration-300">{gem.name}</h3>
                                            <div className="flex justify-center items-center gap-3 mb-4">
                                                <span className="text-[10px] text-primary/50 uppercase tracking-widest">{gem.carat}ct</span>
                                                <span className="w-1 h-1 rounded-full bg-secondary/30"></span>
                                                <span className="text-[10px] text-primary/50 uppercase tracking-widest">{gem.cut}</span>
                                            </div>
                                            <span className="text-primary font-serif font-medium tracking-wider text-xl">{gem.price}</span>
                                        </div>

                                    </div>
                                ))}
                                </div>
                                {Math.ceil(gemstones.length / itemsPerPage) > 1 && (
                                    <div className="flex justify-center items-center gap-6 mt-20 border-t border-gray-100 pt-10">
                                        <button 
                                            onClick={() => {
                                                setCurrentPage(prev => Math.max(prev - 1, 1));
                                                window.scrollTo({ top: 300, behavior: 'smooth' });
                                            }}
                                            disabled={currentPage === 1}
                                            className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-200 text-primary hover:border-secondary hover:text-secondary hover:shadow-md disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-none transition-all duration-300"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7"/></svg>
                                        </button>
                                        
                                        <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-primary/60">
                                            Page {currentPage} of {Math.ceil(gemstones.length / itemsPerPage)}
                                        </span>
                                        
                                        <button 
                                            onClick={() => {
                                                setCurrentPage(prev => Math.min(prev + 1, Math.ceil(gemstones.length / itemsPerPage)));
                                                window.scrollTo({ top: 300, behavior: 'smooth' });
                                            }}
                                            disabled={currentPage === Math.ceil(gemstones.length / itemsPerPage)}
                                            className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-200 text-primary hover:border-secondary hover:text-secondary hover:shadow-md disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-none transition-all duration-300"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7"/></svg>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="h-96 flex flex-col items-center justify-center text-center bg-gray-50/50 border border-gray-100 rounded-sm">
                                <div className="w-20 h-20 bg-white shadow-sm rounded-full flex items-center justify-center mb-8">
                                    <svg className="w-8 h-8 text-primary/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                                </div>
                                <h3 className="text-3xl font-serif text-primary mb-4">No Matching Pieces</h3>
                                <p className="text-primary/50 font-light max-w-sm mb-8 leading-relaxed">We couldn't find any gemstones matching your exact specifications in our current inventory.</p>
                                <button onClick={resetFilters} className="text-[10px] font-bold uppercase tracking-[0.2em] text-white bg-primary hover:bg-secondary px-10 py-4 transition-all shadow-xl">
                                    Clear Refinements
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Gemstones;
