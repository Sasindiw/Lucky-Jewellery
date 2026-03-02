import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Swal from 'sweetalert2';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, getCartCount, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-4xl font-serif text-primary mb-6">Your Cart is Empty</h2>
        <p className="text-primary/50 text-center max-w-md mb-8">
          You haven't added any gemstones to your private collection yet. Explore our catalog to find your next masterpiece.
        </p>
        <Link 
          to="/gemstones" 
          className="bg-primary hover:bg-secondary text-white px-8 py-4 text-xs font-bold uppercase tracking-widest transition-colors duration-300 shadow-xl"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-white">
      {/* Luxury Header */}
      <div className="relative bg-primary text-white py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
        <div className="container mx-auto px-6 md:px-12 text-center relative z-10">
          <span className="text-secondary text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block">Secured Assets</span>
          <h1 className="text-4xl md:text-5xl font-serif font-light tracking-wide">Your Collection Selection</h1>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-12">
            <div className="flex justify-between items-center border-b border-gray-100 pb-6">
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-primary/40">{getCartCount()} Unique Masterpieces</span>
              <button onClick={() => {
                Swal.fire({
                  title: 'Dissolve Current Selection?',
                  text: 'All masterpieces will be returned to the general inventory.',
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: '#1e1e1e',
                  confirmButtonText: 'Yes, Dissolve'
                }).then((result) => {
                  if (result.isConfirmed) clearCart();
                });
              }} className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary/30 hover:text-red-400 transition-colors">Dissolve All</button>
            </div>

            {cart.map((item) => (
              <div key={item.id} className="group flex flex-col sm:flex-row items-center gap-10 pb-12 border-b border-gray-50 last:border-0">
                
                {/* Image Box with hover effect */}
                <Link to={`/gemstones/${item.id}`} className="w-48 h-56 bg-[#f9f9f9] flex items-center justify-center relative overflow-hidden group-hover:bg-[#f2f2f2] transition-colors duration-500 shrink-0">
                  <img src={`/images/${item.image}`} alt={item.variety} className="w-3/4 h-3/4 object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Link>

                {/* Details */}
                <div className="flex-1 w-full space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-secondary block mb-2">{item.variety}</span>
                      <Link to={`/gemstones/${item.id}`}>
                        <h3 className="text-2xl font-serif text-primary hover:text-secondary transition-colors duration-300">{item.name || item.variety}</h3>
                      </Link>
                    </div>
                    <p className="text-xl font-serif text-primary">{item.price}</p>
                  </div>
                  
                  <div className="flex gap-6 text-[10px] text-primary/40 uppercase tracking-widest font-bold">
                    <div className="flex flex-col gap-1">
                      <span className="text-[8px] text-primary/20">Weight</span>
                      <span>{item.carat} Ct</span>
                    </div>
                    <div className="w-[1px] h-8 bg-gray-100"></div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[8px] text-primary/20">Color</span>
                      <span>{item.color}</span>
                    </div>
                    <div className="w-[1px] h-8 bg-gray-100"></div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[8px] text-primary/20">Origin</span>
                      <span>{item.treatment || 'Natural'}</span>
                    </div>
                  </div>

                  {/* Dynamic Controls */}
                  <div className="flex items-center justify-between pt-6">
                    <div className="flex items-center gap-4">
                      <span className="text-[9px] uppercase tracking-widest text-primary/30 font-bold">Quantity</span>
                      <div className="flex items-center border border-gray-100 bg-white shadow-sm">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 text-primary transition-colors border-r border-gray-100"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"/></svg>
                        </button>
                        <span className="w-12 text-center text-sm font-bold text-primary">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, Math.min(item.quantity + 1, item.stock))}
                          disabled={item.quantity >= item.stock}
                          className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 text-primary transition-colors border-l border-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                        </button>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        removeFromCart(item.id);
                        Swal.fire({ toast: true, position: 'top-end', icon: 'info', title: 'Removed', text: 'Item returned to catalog.', showConfirmButton: false, timer: 2000, background: '#1e1e1e', color: '#fff' });
                      }}
                      className="text-[9px] uppercase tracking-[0.2em] font-bold text-red-300 hover:text-red-500 transition-colors flex items-center gap-2 group/btn"
                    >
                      <svg className="w-3 h-3 opacity-50 group-hover/btn:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Luxury Order Summary Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-primary text-white p-10 sticky top-32 shadow-2xl border-t-2 border-secondary overflow-hidden group">
              {/* Subtle background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl -mr-16 -mt-16 group-hover:bg-white/10 transition-colors duration-700"></div>
              
              <h2 className="text-2xl font-serif font-light mb-10 tracking-wide">Investment Recap</h2>
              
              <div className="space-y-6 mb-10 text-[10px] uppercase tracking-[0.2em] font-bold">
                <div className="flex justify-between items-center text-white/50">
                  <span>Subtotal</span>
                  <span className="text-white font-medium tracking-normal text-sm">${getCartTotal().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between items-center text-white/50">
                  <span>Secured Courier</span>
                  <span className="text-secondary tracking-widest">Complimentary</span>
                </div>
                <div className="flex justify-between items-center text-white/50">
                  <span>Authenticity Escrow</span>
                  <span className="text-secondary tracking-widest">Included</span>
                </div>
              </div>

              <div className="border-t border-white/10 pt-8 mb-10">
                <div className="flex justify-between items-end mb-2">
                  <span className="font-bold text-[11px] uppercase tracking-[0.3em] text-white/40">Total Valuation</span>
                  <span className="text-4xl font-serif text-secondary">${getCartTotal().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <p className="text-[9px] text-white/30 text-right uppercase tracking-widest">Pricing In USD</p>
              </div>

              <button 
                onClick={handleCheckout}
                className="w-full bg-secondary hover:bg-white text-white hover:text-primary py-5 text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-500 shadow-xl relative overflow-hidden group/btn"
              >
                <span className="relative z-10">Initialize Secure Checkout</span>
                <div className="absolute inset-x-0 bottom-0 h-0 group-hover/btn:h-full bg-white transition-all duration-300"></div>
              </button>

              <div className="mt-8 flex items-center justify-center gap-4 text-white/20">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                <span className="text-[8px] uppercase tracking-[0.2em] font-bold">Encrypted 256-bit Transaction</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
