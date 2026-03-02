import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Swal from 'sweetalert2';

const Checkout = () => {
  const { cart, getCartTotal, getCartCount, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    country: 'United States',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to complete your purchase.');
      setLoading(false);
      return;
    }

    try {
      const orderPayload = {
        total_amount: getCartTotal(),
        items: cart.map(item => ({
          gemstone_id: item.id,
          quantity: item.quantity
        }))
      };

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderPayload)
      });

      const data = await response.json();

      if (data.success) {
        clearCart();
        Swal.fire({
          icon: 'success',
          title: 'Acquisition Confirmed',
          text: 'Your masterpieces are being prepared for secure transit. Welcome to the Lucky Gems family.',
          confirmButtonText: 'Enter Dashboard',
          confirmButtonColor: '#1e1e1e',
          background: '#ffffff',
          customClass: {
            title: 'font-serif text-primary',
            popup: 'rounded-xl border border-gray-100 shadow-2xl'
          }
        }).then(() => {
          navigate('/dashboard');
        });
      } else {
        const errorMsg = data.message || 'Checkout failed. Please try again.';
        Swal.fire({
          icon: 'error',
          title: 'Transaction Declined',
          text: errorMsg.includes('stock') ? 'One or more items in your cart are no longer available. Please review your cart.' : errorMsg,
          confirmButtonText: 'Review Cart',
          confirmButtonColor: '#1e1e1e',
        });
        setError(errorMsg);
      }
    } catch (err) {
      setError('A network error occurred during checkout.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-3xl font-serif text-primary mb-4">Your Cart is Empty</h2>
        <Link to="/gemstones" className="text-secondary hover:underline uppercase tracking-widest text-xs font-bold">Return to Catalog</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-white">
      {/* Premium Checkout Header */}
      <div className="relative bg-primary text-white py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
        <div className="container mx-auto px-6 md:px-12 text-center relative z-10">
          <span className="text-secondary text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block">Finalize Acquisition</span>
          <h1 className="text-4xl md:text-5xl font-serif font-light tracking-wide">Secure Checkout</h1>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 py-16">
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-6 mb-12 rounded-sm text-xs font-bold uppercase tracking-widest animate-in fade-in slide-in-from-top-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Form Section */}
          <div className="lg:col-span-7">
            <form onSubmit={handleCheckout} className="space-y-16">
              
              {/* Shipping Information */}
              <section className="space-y-10">
                <div className="flex items-center gap-6">
                  <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-primary">01. Shipping Pedigree</h3>
                  <div className="flex-1 h-[1px] bg-gray-100"></div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="group">
                    <label className="block text-[9px] uppercase tracking-widest text-primary/30 font-bold mb-2 group-focus-within:text-secondary transition-colors">First Name</label>
                    <input required type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full border-b border-gray-200 bg-transparent py-3 focus:outline-none focus:border-secondary transition-colors text-sm text-primary placeholder:text-gray-200" placeholder="John" />
                  </div>
                  <div className="group">
                    <label className="block text-[9px] uppercase tracking-widest text-primary/30 font-bold mb-2 group-focus-within:text-secondary transition-colors">Last Name</label>
                    <input required type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full border-b border-gray-200 bg-transparent py-3 focus:outline-none focus:border-secondary transition-colors text-sm text-primary placeholder:text-gray-200" placeholder="Doe" />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-[9px] uppercase tracking-widest text-primary/30 font-bold mb-2 group-focus-within:text-secondary transition-colors">Email Address</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border-b border-gray-200 bg-transparent py-3 focus:outline-none focus:border-secondary transition-colors text-sm text-primary placeholder:text-gray-200" placeholder="john.doe@example.com" />
                </div>

                <div className="group">
                  <label className="block text-[9px] uppercase tracking-widest text-primary/30 font-bold mb-2 group-focus-within:text-secondary transition-colors">Destination Address</label>
                  <input required type="text" name="address" value={formData.address} onChange={handleChange} className="w-full border-b border-gray-200 bg-transparent py-3 focus:outline-none focus:border-secondary transition-colors text-sm text-primary placeholder:text-gray-200" placeholder="123 Luxury Lane" />
                </div>

                <div className="grid grid-cols-3 gap-8">
                  <div className="group col-span-1">
                    <label className="block text-[9px] uppercase tracking-widest text-primary/30 font-bold mb-2 group-focus-within:text-secondary transition-colors">City</label>
                    <input required type="text" name="city" value={formData.city} onChange={handleChange} className="w-full border-b border-gray-200 bg-transparent py-3 focus:outline-none focus:border-secondary transition-colors text-sm text-primary placeholder:text-gray-200" placeholder="New York" />
                  </div>
                  <div className="group col-span-1">
                    <label className="block text-[9px] uppercase tracking-widest text-primary/30 font-bold mb-2 group-focus-within:text-secondary transition-colors">Zip Code</label>
                    <input required type="text" name="zip" value={formData.zip} onChange={handleChange} className="w-full border-b border-gray-200 bg-transparent py-3 focus:outline-none focus:border-secondary transition-colors text-sm text-primary placeholder:text-gray-200" placeholder="10001" />
                  </div>
                  <div className="group col-span-1">
                    <label className="block text-[9px] uppercase tracking-widest text-primary/30 font-bold mb-2 group-focus-within:text-secondary transition-colors">Country</label>
                    <select name="country" value={formData.country} onChange={handleChange} className="w-full border-b border-gray-200 bg-transparent py-3 focus:outline-none focus:border-secondary transition-colors text-sm text-primary appearance-none cursor-pointer">
                      <option>United States</option>
                      <option>United Kingdom</option>
                      <option>Canada</option>
                      <option>Australia</option>
                      <option>International</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Payment Information */}
              <section className="space-y-10">
                <div className="flex items-center gap-6">
                  <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-primary">02. Vault Transaction</h3>
                  <div className="flex-1 h-[1px] bg-gray-100"></div>
                </div>

                <div className="bg-[#f9f9f9] border border-gray-100 p-10 space-y-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-[60px] -mr-20 -mt-20"></div>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-6 bg-primary rounded-sm overflow-hidden flex items-center justify-center p-1">
                       <div className="w-full h-full bg-white/20 rounded-[1px]"></div>
                    </div>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-primary">Tier One Payment Security</span>
                  </div>

                  <div className="group">
                    <label className="block text-[9px] uppercase tracking-widest text-primary/30 font-bold mb-3 group-focus-within:text-secondary transition-colors">Mastercard / Visa Number</label>
                    <input required type="text" name="cardNumber" placeholder="0000 0000 0000 0000" value={formData.cardNumber} onChange={handleChange} className="w-full border border-gray-200 bg-white p-4 focus:outline-none focus:border-secondary transition-all font-mono text-sm tracking-wider text-primary shadow-sm" />
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="group">
                      <label className="block text-[9px] uppercase tracking-widest text-primary/30 font-bold mb-3 group-focus-within:text-secondary transition-colors">Expiry Date</label>
                      <input required type="text" name="expiryDate" placeholder="MM/YY" value={formData.expiryDate} onChange={handleChange} className="w-full border border-gray-200 bg-white p-4 focus:outline-none focus:border-secondary transition-all font-mono text-sm text-primary shadow-sm" />
                    </div>
                    <div className="group">
                      <label className="block text-[9px] uppercase tracking-widest text-primary/30 font-bold mb-3 group-focus-within:text-secondary transition-colors">CVC / Security Code</label>
                      <input required type="password" name="cvv" placeholder="•••" value={formData.cvv} onChange={handleChange} className="w-full border border-gray-200 bg-white p-4 focus:outline-none focus:border-secondary transition-all font-mono text-sm text-primary shadow-sm" />
                    </div>
                  </div>
                </div>
              </section>

              <div className="flex items-start gap-4 mb-8 bg-gray-50/50 p-6 border border-gray-100">
                 <svg className="w-5 h-5 text-secondary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 <p className="text-[10px] text-primary/40 leading-relaxed uppercase tracking-wider font-medium">
                   All shipments are fully insured and tracked. Our master gemologists personally oversee the packaging of every order.
                 </p>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-6 bg-primary text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-secondary transition-all duration-500 shadow-2xl relative overflow-hidden group/btn"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
                ) : (
                  <span className="relative z-10 font-bold">Complete Purchase • ${getCartTotal().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                )}
                <div className="absolute inset-x-0 bottom-0 h-0 group-hover/btn:h-full bg-secondary transition-all duration-300"></div>
              </button>
            </form>
          </div>

          {/* Luxury Order Summary Sidebar */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-gray-100 p-10 sticky top-32 shadow-xl">
              <h3 className="text-xl font-serif text-primary mb-10 border-b border-gray-50 pb-6 tracking-wide">Investment Summary</h3>
              
              <div className="space-y-8 mb-10 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-6 group">
                    <div className="w-24 h-24 bg-[#f9f9f9] p-3 shrink-0 flex items-center justify-center border border-gray-50 group-hover:bg-[#f2f2f2] transition-colors">
                      <img src={`/images/${item.image}`} alt={item.variety} className="w-full h-full object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="font-serif text-primary text-base line-clamp-1">{item.name || item.variety}</h4>
                      <div className="flex items-center gap-3">
                        <span className="text-[9px] uppercase tracking-widest text-primary/30 font-bold">Qty {item.quantity}</span>
                        <div className="w-[1px] h-2 bg-gray-200"></div>
                        <span className="text-[9px] uppercase tracking-widest text-primary/30 font-bold">{item.carat}ct</span>
                      </div>
                      <p className="text-secondary font-serif text-lg pt-1">{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-50 pt-8 space-y-4 mb-10 text-[10px] uppercase tracking-[0.2em] font-bold text-primary/40">
                <div className="flex justify-between items-center text-primary/60">
                  <span>Subtotal</span>
                  <span className="text-primary tracking-normal text-sm font-medium">${getCartTotal().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between items-center text-primary/60">
                  <span>Global Secure Shipping</span>
                  <span className="text-secondary font-bold">Complimentary</span>
                </div>
              </div>

              <div className="border-t border-primary/10 pt-8">
                <div className="flex justify-between items-end text-primary">
                  <span className="font-bold uppercase tracking-[0.3em] text-[11px] text-primary/40">Acquisition Total</span>
                  <span className="text-4xl font-serif text-secondary tracking-tight">${getCartTotal().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>

              <div className="mt-12 flex items-center justify-center gap-3 opacity-30">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                <span className="text-[8px] uppercase tracking-[0.2em] font-bold">Secured by SSL Protocol</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
