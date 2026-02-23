import React, { useState, useEffect, useCallback } from 'react';

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
    
    // Filter & Search State
    const [search, setSearch] = useState('');
    const [variety, setVariety] = useState('All');
    const [color, setColor] = useState('All');
    const [shape, setShape] = useState('All');
    const [minCarat, setMinCarat] = useState('');
    const [maxCarat, setMaxCarat] = useState('');

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
            if (minCarat) params.append('minCarat', minCarat);
            if (maxCarat) params.append('maxCarat', maxCarat);

            const response = await fetch(`http://localhost:5000/api/gemstones?${params.toString()}`);
            const result = await response.json();
            
            if (result.success) {
                setGemstones(result.data);
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
            {/* Page Header */}
            <div className="bg-gray-50 py-20 border-b border-gray-100 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-secondary/5 blur-3xl rounded-full -mr-20 -mt-20"></div>
                <div className="container mx-auto px-6 md:px-12 text-center relative z-10">
                    <span className="text-secondary text-xs font-bold uppercase tracking-[0.3em] mb-4 block">The Master Collection</span>
                    <h1 className="text-5xl md:text-8xl font-serif text-primary mb-8 leading-tight">Gemstone Catalog</h1>
                    <p className="text-primary/40 text-lg font-light max-w-2xl mx-auto leading-relaxed">
                        An exhaustive treasury of nature's most rarest specimens, individually analyzed by our proprietary AI for unmatched brilliance and heritage.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-6 md:px-12 py-16">
                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Filter Sidebar */}
                    <aside className="lg:w-72 space-y-12 shrink-0">
                        {/* Search */}
                        <div className="relative">
                            <input 
                                type="text"
                                placeholder="Search variety or name"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-gray-50 border-b border-gray-200 py-4 px-2 text-sm font-light text-primary placeholder:text-primary/20 focus:outline-none focus:border-secondary transition-colors"
                            />
                            <svg className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-primary/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                        </div>

                        {/* Variety Filter */}
                        <section>
                            <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary/30 mb-6">Variety</h4>
                            <div className="flex flex-wrap gap-2">
                                {varieties.slice(0, 11).map(v => (
                                    <button
                                        key={v}
                                        onClick={() => setVariety(v)}
                                        className={`px-3 py-1.5 rounded-sm text-[10px] uppercase tracking-widest transition-all ${
                                            variety === v ? 'bg-primary text-white' : 'bg-gray-50 text-primary/60 hover:bg-gray-100'
                                        }`}
                                    >
                                        {v}
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Attribute Filters */}
                        <div className="space-y-10">
                            <section>
                                <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary/30 mb-4">Color Spectrum</h4>
                                <select 
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    className="w-full bg-transparent border-b border-gray-100 py-2 text-sm text-primary focus:outline-none focus:border-secondary appearance-none cursor-pointer"
                                >
                                    {colors.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </section>

                            <section>
                                <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary/30 mb-4">Geometric Shape</h4>
                                <select 
                                    value={shape}
                                    onChange={(e) => setShape(e.target.value)}
                                    className="w-full bg-transparent border-b border-gray-100 py-2 text-sm text-primary focus:outline-none focus:border-secondary appearance-none cursor-pointer"
                                >
                                    {shapes.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </section>

                            <section>
                                <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary/30 mb-4">Carat Weight Range</h4>
                                <div className="flex items-center gap-4">
                                    <input 
                                        type="number" 
                                        placeholder="Min" 
                                        value={minCarat}
                                        onChange={(e) => setMinCarat(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-sm py-2 px-3 text-xs focus:outline-none focus:border-secondary"
                                    />
                                    <span className="text-primary/20 text-xs">—</span>
                                    <input 
                                        type="number" 
                                        placeholder="Max" 
                                        value={maxCarat}
                                        onChange={(e) => setMaxCarat(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-sm py-2 px-3 text-xs focus:outline-none focus:border-secondary"
                                    />
                                </div>
                            </section>
                        </div>

                        <button 
                            onClick={resetFilters}
                            className="text-[10px] uppercase tracking-widest text-secondary hover:underline transition-all pt-4"
                        >
                            Reset all filters
                        </button>
                    </aside>

                    {/* Content Grid */}
                    <div className="flex-1">
                        {error ? (
                            <div className="h-96 flex flex-col items-center justify-center text-center">
                                <p className="text-primary/40 font-serif mb-4 italic text-lg">{error}</p>
                                <button onClick={fetchGemstones} className="text-secondary text-xs uppercase tracking-widest hover:underline">Re-establish Connection</button>
                            </div>
                        ) : loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-16">
                                {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
                            </div>
                        ) : gemstones.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                {gemstones.map((gem) => (
                                    <div key={gem.id} className="group cursor-pointer">
                                        <div className="bg-gray-50 aspect-[4/5] w-full relative overflow-hidden mb-6 rounded-sm border border-transparent group-hover:border-gray-100 transition-all duration-500 shadow-sm group-hover:shadow-2xl group-hover:shadow-gray-100">
                                            <div className="absolute inset-0 flex items-center justify-center p-8">
                                                <img 
                                                    src={`/images/${gem.image}`} 
                                                    alt={gem.name} 
                                                    className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-1000 ease-out" 
                                                    onError={(e) => e.target.src = '/images/sapphire.png'}
                                                />
                                            </div>
                                            
                                            {/* Labels */}
                                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                                                <span className="bg-white/90 backdrop-blur-sm shadow-sm py-1 px-3 text-[8px] uppercase tracking-[0.2em] font-bold text-primary opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-500">
                                                    AI Verified
                                                </span>
                                                {gem.status !== 'In Stock' && (
                                                    <span className="bg-red-500 text-white py-1 px-3 text-[8px] uppercase tracking-[0.2em] font-bold">
                                                        {gem.status}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Quick Actions */}
                                            <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-black/20 to-transparent">
                                                <button className="w-full py-3 bg-white text-primary text-[10px] font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl">
                                                    View Heritage Profile
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-1">
                                            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-secondary">{gem.variety}</span>
                                            <h3 className="text-2xl font-serif text-primary mb-2 line-clamp-1">{gem.name}</h3>
                                            <div className="flex justify-between items-center border-t border-gray-50 pt-3">
                                                <div className="flex gap-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-[8px] uppercase tracking-widest text-primary/30">Carat</span>
                                                        <span className="text-xs text-primary/60">{gem.carat}ct</span>
                                                    </div>
                                                    <div className="flex flex-col border-l border-gray-100 pl-4">
                                                        <span className="text-[8px] uppercase tracking-widest text-primary/30">Color</span>
                                                        <span className="text-xs text-primary/60">{gem.color}</span>
                                                    </div>
                                                </div>
                                                <span className="text-primary font-serif text-xl">${gem.price}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-96 flex flex-col items-center justify-center text-center">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                    <svg className="w-8 h-8 text-primary/10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                                </div>
                                <p className="text-primary/40 font-serif italic text-xl">No gems matched these specific criteria.</p>
                                <button onClick={resetFilters} className="text-secondary text-xs uppercase tracking-widest hover:underline mt-4">Broaden Search</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Gemstones;
