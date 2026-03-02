import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Swal from 'sweetalert2';

const GemstoneDetail = () => {
    const { id } = useParams();
    const [gemstone, setGemstone] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart } = useCart();
    const [addedToCart, setAddedToCart] = useState(false);

    useEffect(() => {
        const fetchGemstoneAndRecommendations = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

                // 1. Log interaction (if logged in)
                if (token) {
                    fetch('http://localhost:5000/api/gemstones/interaction', {
                        method: 'POST',
                        headers: { ...headers, 'Content-Type': 'application/json' },
                        body: JSON.stringify({ gemstone_id: id })
                    }).catch(err => console.error("Interation log failed", err));
                }

                // 2. Fetch Gemstone Details
                const gemRes = await fetch(`http://localhost:5000/api/gemstones/${id}`);
                const gemData = await gemRes.json();
                if (gemData.success) {
                    setGemstone(gemData.data);
                } else {
                    setError('Gemstone not found');
                }

                // 3. Fetch Hybrid Recommendations
                const recRes = await fetch(`http://localhost:5000/api/gemstones/${id}/recommendations`, {
                    headers
                });
                const recData = await recRes.json();
                if (recData.success) {
                    setRecommendations(recData.data);
                }

            } catch (err) {
                setError('Error connecting to server');
            } finally {
                setLoading(false);
            }
        };

        fetchGemstoneAndRecommendations();
        window.scrollTo(0, 0);
        setAddedToCart(false);
    }, [id]);

    const handleAddToCart = () => {
        if (gemstone && gemstone.stock > 0) {
            addToCart(gemstone);
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Added to Collection',
                text: `${gemstone.name || gemstone.variety} added to your vault.`,
                showConfirmButton: false,
                timer: 3000,
                background: '#1e1e1e',
                color: '#ffffff',
                iconColor: '#ffbb00',
            });
        }
    };

    if (loading) return (
        <div className="pt-32 text-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
    );

    if (error || !gemstone) return (
        <div className="pt-32 text-center min-h-screen text-red-500">
            {error || 'Something went wrong'}
        </div>
    );

    return (
        <div className="pt-24 min-h-screen bg-white">
            <div className="container mx-auto px-6 md:px-12 py-16">
                <div className="flex flex-col lg:flex-row gap-16 mb-32">
                    {/* Left: Image */}
                    <div className="lg:w-1/2">
                        <div className="bg-gray-50 aspect-square rounded-2xl flex items-center justify-center p-12 shadow-inner border border-gray-100">
                            <img 
                                src={`/images/${gemstone.image}`} 
                                alt={gemstone.variety} 
                                className="w-full h-full object-contain filter drop-shadow-2xl" 
                            />
                        </div>
                    </div>

                    {/* Right: Info */}
                    <div className="lg:w-1/2 space-y-8">
                        <div>
                            <span className="text-secondary text-sm font-bold uppercase tracking-[0.3em] mb-4 block">{gemstone.variety}</span>
                            <h1 className="text-5xl font-serif text-primary mb-4 leading-tight">{gemstone.variety} Specimen</h1>
                            <p className="text-3xl font-serif text-primary mb-6">{gemstone.price}</p>
                            <p className="text-primary/60 font-light leading-relaxed max-w-lg italic">
                                "{gemstone.description || 'A unique and rare specimen from the Lucky Gems master collection, verified for its exquisite heritage and crystalline purity.'}"
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-8 border-y border-gray-100 py-10">
                            <div>
                                <h4 className="text-[10px] uppercase tracking-widest text-primary/30 mb-2 font-bold">Carat Weight</h4>
                                <p className="text-lg text-primary">{gemstone.carat}ct</p>
                            </div>
                            <div>
                                <h4 className="text-[10px] uppercase tracking-widest text-primary/30 mb-2 font-bold">Color Grade</h4>
                                <p className="text-lg text-primary">{gemstone.color}</p>
                            </div>
                            <div>
                                <h4 className="text-[10px] uppercase tracking-widest text-primary/30 mb-2 font-bold">Cut Style</h4>
                                <p className="text-lg text-primary">{gemstone.cut || 'Exquisite'}</p>
                            </div>
                            <div>
                                <h4 className="text-[10px] uppercase tracking-widest text-primary/30 mb-2 font-bold">Treatment</h4>
                                <p className="text-lg text-primary">{gemstone.treatment || 'Natural'}</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {gemstone.status === 'Sold Out' || gemstone.stock <= 0 ? (
                                <button disabled className="w-full py-5 bg-gray-200 text-gray-400 text-xs font-bold uppercase tracking-widest cursor-not-allowed">
                                    Sold Out
                                </button>
                            ) : (
                                <button 
                                    onClick={handleAddToCart}
                                    className="w-full py-5 text-white text-xs font-bold uppercase tracking-widest transition-all shadow-xl bg-primary hover:bg-secondary"
                                >
                                    Add to Cart
                                </button>
                            )}
                            <p className="text-xs text-primary/40 text-center italic">
                                Includes Certificate of Authenticity and Global Gemstone Registry Profile.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Recommendations Section */}
                {recommendations.length > 0 && (
                    <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-serif text-primary mb-4">You Might Also Like</h2>
                            <p className="text-primary/40 italic font-light">Based on your browsing profile and gemstone features</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
                            {recommendations.map((gem) => (
                                <Link key={gem.id} to={`/gemstones/${gem.id}`} className="group block">
                                    <div className="bg-gray-50 aspect-[4/5] rounded-xl flex items-center justify-center p-6 mb-4 group-hover:shadow-xl transition-all border border-transparent group-hover:border-gray-100">
                                        <img src={`/images/${gem.image}`} alt={gem.variety} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <h3 className="text-sm font-serif text-primary group-hover:text-secondary transition-colors">{gem.variety}</h3>
                                    <p className="text-xs text-primary/40">{gem.carat}ct • {gem.color}</p>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default GemstoneDetail;
