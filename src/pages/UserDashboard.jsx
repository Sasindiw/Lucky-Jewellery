import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Swal from 'sweetalert2';

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('collection');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, getCartTotal, getCartCount, clearCart } = useCart();

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
        try {
          const res = await fetch('http://localhost:5000/api/orders/myorders', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          if (data.success) {
            setOrders(data.data);
          }
        } catch (err) {
          console.error("Failed to fetch orders", err);
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const totalGemsOwned = orders.reduce((total, order) => {
    return total + order.OrderItems.reduce((sum, item) => sum + item.quantity, 0);
  }, 0);

  // Flatten ordered gems for display
  const collectionGems = orders.flatMap(order => 
    order.OrderItems.map(item => ({
      ...item.Gemstone,
      orderDate: new Date(order.order_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      purchasePrice: item.Gemstone.price
    }))
  );

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
        <div className="animate-pulse text-primary/70 text-lg font-serif">Loading your sanctuary...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col pt-24 relative">

      <main className="flex-1 container mx-auto px-6 md:px-12 py-12">
        {/* Profile Header */}
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-gray-100">
          <div>
            <span className="text-secondary text-sm font-bold uppercase tracking-[0.3em] mb-4 block">Welcome back</span>
            <h1 className="text-5xl font-serif text-primary mb-2 line-clamp-1">{user.name}</h1>
            <p className="text-primary/70 font-light max-w-md">Your curated entrance to the world's most exquisite gemstones and AI-powered insights.</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-gray-50 px-8 py-4 rounded-sm border border-gray-100 flex flex-col items-center min-w-[120px]">
              <span className="text-primary font-serif text-xl">{totalGemsOwned}</span>
              <span className="text-xs uppercase tracking-widest text-primary/70">Gems Owned</span>
            </div>
          </div>
        </header>

        {/* Dashboard Navigation */}
        <div className="flex gap-12 mb-12 border-b border-gray-50 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {['Collection', 'Cart'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`pb-4 text-sm uppercase tracking-[0.2em] font-bold transition-all relative ${
                activeTab === tab.toLowerCase() 
                  ? 'text-secondary' 
                  : 'text-primary/60 hover:text-primary'
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
                  <Link to="/gemstones" className="text-sm uppercase tracking-widest text-secondary hover:underline">Grow Collection</Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {collectionGems.length > 0 ? collectionGems.map((gem, index) => (
                      <Link to={`/gemstones/${gem.id}`} key={`${gem.id}-${index}`} className="group bg-gray-50 rounded-sm overflow-hidden border border-gray-100 hover:shadow-xl hover:shadow-gray-100 transition-all duration-500 block">
                        <div className="aspect-square bg-white relative overflow-hidden">
                           <div className="absolute inset-0 flex items-center justify-center opacity-40 group-hover:scale-110 transition-transform duration-700">
                             <img src={`/images/${gem.image}`} alt={gem.variety} className="w-1/2 h-1/2 object-contain" />
                           </div>
                           <div className="absolute top-4 right-4 group-hover:translate-x-0 translate-x-12 opacity-0 group-hover:opacity-100 transition-all duration-300">
                              <span className="bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-xs uppercase tracking-widest text-primary font-bold shadow-sm">Verified</span>
                           </div>
                        </div>
                        <div className="p-6">
                            <h3 className="text-primary font-serif text-lg mb-1">{gem.name || gem.variety}</h3>
                            <div className="flex justify-between items-center">
                              <span className="text-xs uppercase tracking-widest text-primary/70 font-bold">Bought {gem.orderDate}</span>
                              <span className="text-secondary text-base font-medium">{gem.purchasePrice}</span>
                            </div>
                        </div>
                      </Link>
                    )) : (
                      <div className="col-span-2 py-20 text-center border-2 border-dashed border-gray-100 rounded-sm">
                        <p className="text-primary/60 font-serif italic text-lg">Your collection awaits.</p>
                        <p className="text-xs uppercase tracking-widest text-primary/80 mt-2">Discover your first masterpiece today.</p>
                      </div>
                    )}
                </div>
              </div>
            )}

            {activeTab === 'cart' && (
              <div className="animate-in fade-in duration-700">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-serif text-primary">Your Private Cart</h2>
                  <span className="text-sm uppercase tracking-[0.2em] font-bold text-secondary">{getCartCount()} items</span>
                </div>

                {cart.length === 0 ? (
                  <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-sm">
                    <p className="text-primary/60 font-serif italic text-lg mb-4">Your cart is currently empty.</p>
                    <Link to="/gemstones" className="text-xs uppercase tracking-widest text-secondary font-bold hover:underline">Explore Collection</Link>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {cart.map((item) => (
                      <div key={item.id} className="flex flex-col sm:flex-row items-center gap-8 bg-gray-50 p-6 border border-gray-100 rounded-sm hover:border-secondary/20 transition-colors">
                        <Link to={`/gemstones/${item.id}`} className="w-24 h-24 bg-white p-2 border border-gray-100 shrink-0">
                          <img src={`/images/${item.image}`} alt={item.variety} className="w-full h-full object-contain" />
                        </Link>
                        
                        <div className="flex-1 w-full">
                          <div className="flex justify-between items-start mb-1">
                            <Link to={`/gemstones/${item.id}`}>
                              <h3 className="text-lg font-serif text-primary hover:text-secondary transition-colors">{item.name || item.variety}</h3>
                            </Link>
                            <p className="font-serif text-primary font-bold">${item.price}</p>
                          </div>
                          
                          <div className="flex gap-3 mb-4 text-xs text-primary/80 uppercase tracking-widest font-bold">
                            <span>{item.carat} Ct</span> • <span>{item.color}</span>
                          </div>

                          <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xs uppercase tracking-widest text-primary font-bold">Qty:</span>
                              <div className="flex items-center bg-white border border-gray-200 rounded-sm">
                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 text-primary hover:bg-gray-100">-</button>
                                <span className="px-3 text-sm font-bold border-x border-gray-200">{item.quantity}</span>
                                <button 
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                                  disabled={item.quantity >= item.stock}
                                  className="px-2 text-primary hover:bg-gray-100 disabled:opacity-50"
                                >+</button>
                              </div>
                            </div>

                            <button onClick={() => {
                                removeFromCart(item.id);
                                Swal.fire({ toast: true, position: 'top-end', icon: 'info', title: 'Removed', text: 'Item returned to catalog.', showConfirmButton: false, timer: 2000, background: '#1e1e1e', color: '#fff' });
                            }} className="text-xs uppercase tracking-widest font-bold text-red-400 hover:text-red-600">
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="flex justify-between items-center border-t border-gray-100 pt-6">
                      <button onClick={() => {
                        Swal.fire({
                          title: 'Empty Private Cart?',
                          text: 'All selected masterpieces will be returned to our general inventory.',
                          icon: 'warning',
                          showCancelButton: true,
                          confirmButtonColor: '#1e1e1e',
                          confirmButtonText: 'Yes, clear it'
                        }).then((result) => {
                          if (result.isConfirmed) clearCart();
                        })
                      }} className="text-xs uppercase tracking-widest text-primary/70 hover:text-primary font-bold">
                        Clear Cart
                      </button>
                      <div className="text-right">
                        <p className="text-base text-primary/60 mb-1">Subtotal</p>
                        <p className="text-2xl font-serif text-secondary">${getCartTotal().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                      </div>
                    </div>

                    <button 
                      onClick={() => navigate('/checkout')}
                      className="w-full py-4 bg-primary text-white text-sm font-bold uppercase tracking-[0.2em] hover:bg-secondary transition-all shadow-xl mt-6"
                    >
                      Proceed to Secure Checkout
                    </button>
                  </div>
                )}
              </div>
            )}
            
          </div>

          {/* AI Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="border border-gray-100 rounded-sm p-8">
               <h4 className="text-sm uppercase tracking-[0.2em] font-bold text-primary/60 mb-6">Expert Consultant</h4>
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center font-serif italic text-primary">S</div>
                  <div>
                    <p className="text-primary text-sm font-bold">Sarah Wickramasinghe</p>
                    <p className="text-xs text-primary/70 uppercase tracking-widest">Master Gemologist</p>
                  </div>
               </div>
               <button className="w-full mt-6 py-3 border border-gray-100 text-xs uppercase tracking-widest text-primary/60 hover:border-primary hover:text-primary transition-all">Schedule Call</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;

