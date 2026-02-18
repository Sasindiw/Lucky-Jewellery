import React, { useState } from 'react';

const Gemstones = () => {
    const allGemstones = [
        { id: 1, name: "Royal Blue Sapphire", carat: "2.5ct", price: "$3,400", type: "Sapphire", color: "Blue", image: "/images/sapphire.png" },
        { id: 2, name: "Crimson Ruby", carat: "1.8ct", price: "$4,200", type: "Ruby", color: "Red", image: "/images/ruby.png" },
        { id: 3, name: "Colombian Emerald", carat: "1.5ct", price: "$5,000", type: "Emerald", color: "Green", image: "/images/emerald.png" },
        { id: 4, name: "Imperial Topaz", carat: "3.2ct", price: "$2,800", type: "Topaz", color: "Yellow", image: "/images/ruby.png" },
        { id: 5, name: "Amethyst Geode", carat: "4.0ct", price: "$900", type: "Amethyst", color: "Purple", image: "/images/sapphire.png" },
        { id: 6, name: "Black Opal", carat: "2.1ct", price: "$6,700", type: "Opal", color: "Black", image: "/images/emerald.png" },
        { id: 7, name: "Pink Diamond", carat: "1.2ct", price: "$12,000", type: "Diamond", color: "Pink", image: "/images/sapphire.png" },
        { id: 8, name: "Aquamarine Crystal", carat: "5.5ct", price: "$1,500", type: "Aquamarine", color: "Light Blue", image: "/images/emerald.png" },
        { id: 9, name: "Golden Beryl", carat: "2.8ct", price: "$2,200", type: "Beryl", color: "Gold", image: "/images/ruby.png" },
        { id: 10, name: "Tanzanite Stud", carat: "3.5ct", price: "$4,800", type: "Tanzanite", color: "Violet-Blue", image: "/images/sapphire.png" },
        { id: 11, name: "Morganite Oval", carat: "2.4ct", price: "$1,100", type: "Morganite", color: "Peach", image: "/images/ruby.png" },
        { id: 12, name: "Ruby Marquise", carat: "1.1ct", price: "$3,100", type: "Ruby", color: "Red", image: "/images/ruby.png" },
    ];

    const [filter, setFilter] = useState('All');
    const categories = ['All', 'Sapphire', 'Ruby', 'Emerald', 'Diamond', 'Topaz', 'Opal'];

    const filteredGemstones = filter === 'All' 
        ? allGemstones 
        : allGemstones.filter(gem => gem.type === filter);

    return (
        <div className="pt-24 min-h-screen bg-white">
            {/* Page Header */}
            <div className="bg-gray-50 py-20 border-b border-gray-100">
                <div className="container mx-auto px-6 md:px-12 text-center">
                    <span className="text-xs font-bold tracking-widest uppercase text-secondary mb-4 block">Exquisite Collection</span>
                    <h1 className="text-5xl md:text-7xl font-serif text-primary mb-6">Our Gemstones</h1>
                    <p className="text-primary/60 text-lg font-light max-w-2xl mx-auto">
                        Explore our curated selection of the world's most precious stones, each ethically sourced and AI-verified for supreme quality and authenticity.
                    </p>
                </div>
            </div>

            {/* Filters & Content */}
            <div className="container mx-auto px-6 md:px-12 py-16">
                {/* Filter Bar */}
                <div className="flex flex-wrap justify-center gap-4 mb-20">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-8 py-2 rounded-full text-xs uppercase tracking-widest transition-all duration-300 ${
                                filter === cat 
                                    ? 'bg-primary text-white shadow-lg' 
                                    : 'bg-white text-primary border border-gray-200 hover:border-secondary hover:text-secondary'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                {filteredGemstones.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-16">
                        {filteredGemstones.map((gem) => (
                            <div key={gem.id} className="group cursor-pointer">
                                <div className="bg-gray-50 aspect-[4/5] w-full relative overflow-hidden mb-6 rounded-sm">
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 group-hover:bg-gray-200 transition-colors duration-500">
                                        <img 
                                            src={gem.image} 
                                            alt={gem.name} 
                                            className="w-3/4 h-3/4 object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-700 ease-out" 
                                        />
                                    </div>
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <button className="w-10 h-10 bg-white flex items-center justify-center rounded-full shadow-md hover:bg-primary hover:text-white transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                            </svg>
                                        </button>
                                    </div>
                                    {gem.type === "Diamond" && (
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-secondary text-white text-[10px] uppercase tracking-tighter px-2 py-1 rounded-sm">Rare</span>
                                        </div>
                                    )}
                                </div>
                                
                                <div>
                                    <h3 className="text-xl font-serif text-primary mb-1 group-hover:text-secondary transition-colors">{gem.name}</h3>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-primary/50 tracking-wider uppercase text-xs">{gem.carat} • {gem.type}</span>
                                        <span className="text-primary font-medium">{gem.price}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-primary/40 text-lg">No gemstones found in this category.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Gemstones;
