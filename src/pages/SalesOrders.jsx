import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const SalesOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };

    try {
      const res = await fetch('http://localhost:5000/api/orders', { headers });
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch orders', err);
      Swal.fire('Error', 'Could not sync sales registry', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, currentStatus, currentPaymentStatus) => {
    const { value: formValues } = await Swal.fire({
      title: 'Update Order Lifecycle',
      html:
        `<div class="flex flex-col gap-4">
          <div>
            <label class="text-xs uppercase tracking-widest text-primary/70 block mb-2 font-bold">Logistics Status</label>
            <select id="swal-status" class="swal2-input !m-0 !w-full">
              <option value="Pending" ${currentStatus === 'Pending' ? 'selected' : ''}>Pending Approval</option>
              <option value="Processing" ${currentStatus === 'Processing' ? 'selected' : ''}>Crafting / Processing</option>
              <option value="Shipped" ${currentStatus === 'Shipped' ? 'selected' : ''}>In Transit</option>
              <option value="Delivered" ${currentStatus === 'Delivered' ? 'selected' : ''}>Hand Delivered</option>
              <option value="Cancelled" ${currentStatus === 'Cancelled' ? 'selected' : ''}>Rescinded / Cancelled</option>
            </select>
          </div>
          <div>
            <label class="text-xs uppercase tracking-widest text-primary/70 block mb-2 font-bold">Financial Status</label>
            <select id="swal-payment" class="swal2-input !m-0 !w-full">
              <option value="Unpaid" ${currentPaymentStatus === 'Unpaid' ? 'selected' : ''}>Awaiting Settlement</option>
              <option value="Paid" ${currentPaymentStatus === 'Paid' ? 'selected' : ''}>Funds Secured</option>
              <option value="Refunded" ${currentPaymentStatus === 'Refunded' ? 'selected' : ''}>Reverted / Refunded</option>
            </select>
          </div>
        </div>`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Affirm Changes',
      confirmButtonColor: '#1e1e1e',
      preConfirm: () => {
        return {
          status: document.getElementById('swal-status').value,
          payment_status: document.getElementById('swal-payment').value
        }
      }
    });

    if (formValues) {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formValues)
        });
        const data = await res.json();
        if (data.success) {
          Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Transaction refined', showConfirmButton: false, timer: 2000 });
          if (selectedOrder?.id === orderId) {
             setSelectedOrder({ ...selectedOrder, ...formValues });
          }
          fetchOrders();
        }
      } catch (err) {
        Swal.fire('Error', 'Failed to refine transaction', 'error');
      }
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const totalRevenue = orders.filter(o => o.payment_status === 'Paid').reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);

  return (
    <div className="min-h-screen bg-white">
      <main className="w-full bg-gray-50/30 overflow-y-auto mt-20">
        <header className="px-12 py-10 flex justify-between items-center bg-white/80 backdrop-blur-xl border-b border-gray-100">
          <div>
            <h1 className="text-3xl font-serif text-primary capitalize">Sales & Orders</h1>
            <p className="text-primary/70 text-sm font-light tracking-wide mt-1">Real-time oversight of the Lucky Gems transaction history.</p>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="w-px h-8 bg-gray-200"></div>
             <div className="flex items-center gap-3">
               <span className="text-xs uppercase tracking-widest font-bold text-primary/60">Lead Admin</span>
               <div className="w-10 h-10 rounded-full bg-secondary text-primary flex items-center justify-center font-serif text-lg">A</div>
             </div>
          </div>
        </header>

        <div className="p-12">
          {/* Stats Summary for Sales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100 group hover:border-secondary/30 transition-all duration-700">
              <div className="flex justify-between items-start mb-6">
                <span className="text-2xl opacity-40 group-hover:opacity-100 transition-opacity">✨</span>
                <div className="w-2 h-2 rounded-full bg-secondary/30"></div>
              </div>
              <h3 className="text-primary/60 text-xs uppercase tracking-[0.2em] mb-2 font-bold">Secured Revenue</h3>
              <p className="text-3xl font-serif text-primary">${totalRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100 group hover:border-secondary/30 transition-all duration-700">
              <div className="flex justify-between items-start mb-6">
                <span className="text-2xl opacity-40 group-hover:opacity-100 transition-opacity">📜</span>
                <div className="w-2 h-2 rounded-full bg-secondary/30"></div>
              </div>
              <h3 className="text-primary/60 text-xs uppercase tracking-[0.2em] mb-2 font-bold">Total Orders</h3>
              <p className="text-3xl font-serif text-primary">{orders.length}</p>
            </div>
            <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100 group hover:border-secondary/30 transition-all duration-700">
              <div className="flex justify-between items-start mb-6">
                <span className="text-2xl opacity-40 group-hover:opacity-100 transition-opacity">📈</span>
                <div className="w-2 h-2 rounded-full bg-secondary/30"></div>
              </div>
              <h3 className="text-primary/60 text-xs uppercase tracking-[0.2em] mb-2 font-bold">Avg. Investment</h3>
              <p className="text-3xl font-serif text-primary">${orders.length > 0 ? (totalRevenue / orders.length).toLocaleString(undefined, {maximumFractionDigits: 0}) : '0'}</p>
            </div>
          </div>

          <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-1000">
             <table className="w-full text-left">
              <thead className="bg-gray-50/50 text-xs uppercase tracking-[0.2em] text-primary/60 font-bold border-b border-gray-100">
                <tr>
                  <th className="px-8 py-6">Reference</th>
                  <th className="px-8 py-6">Client Identity</th>
                  <th className="px-8 py-6">Value / Status</th>
                  <th className="px-8 py-6">Acquisition Date</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                   <tr><td colSpan="5" className="px-8 py-20 text-center italic text-primary/60 font-serif">Retrieving transaction logs...</td></tr>
                ) : orders.length === 0 ? (
                   <tr><td colSpan="5" className="px-8 py-20 text-center italic text-primary/60 font-serif">No sales recorded yet.</td></tr>
                ) : orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-6 font-mono text-sm text-primary/80 group-hover:text-primary transition-colors">#LG-{order.id.toString().padStart(5, '0')}</td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-serif text-primary">{order.User?.name}</span>
                        <span className="text-xs text-primary/70 tracking-wider lowercase">{order.User?.email}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex flex-col">
                         <span className="text-sm font-serif text-secondary">${parseFloat(order.total_amount).toLocaleString()}</span>
                         <div className="flex gap-2 mt-1">
                            <span className={`text-xs uppercase tracking-widest font-bold px-2 py-0.5 rounded-full border ${
                              order.payment_status === 'Paid' ? 'border-green-100 text-green-600 bg-green-50' : 'border-orange-100 text-orange-600 bg-orange-50'
                            }`}>{order.payment_status}</span>
                            <span className="text-xs uppercase tracking-widest font-bold px-2 py-0.5 rounded-full border border-gray-100 text-primary/70">{order.status}</span>
                         </div>
                       </div>
                    </td>
                    <td className="px-8 py-6 text-xs uppercase tracking-widest text-primary/70">
                      {new Date(order.order_date).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-6 text-right">
                       <button 
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsModalOpen(true);
                        }}
                        className="text-xs uppercase tracking-widest font-bold text-secondary hover:underline"
                       >
                         Oversee
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Order Oversight Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-[60] flex justify-center items-center animate-in fade-in duration-300 p-6">
          <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-3xl bg-white shadow-2xl animate-in zoom-in-95 duration-500 overflow-hidden rounded-sm">
             <div className="flex h-[80vh]">
                {/* Left Sidebar - Order Info */}
                <div className="w-1/3 bg-gray-50 p-10 border-r border-gray-100 overflow-y-auto">
                   <h2 className="text-2xl font-serif text-primary mb-2">#LG-{selectedOrder.id.toString().padStart(5, '0')}</h2>
                   <p className="text-xs uppercase tracking-widest text-secondary font-bold mb-8">Acquisition Summary</p>
                   
                   <div className="space-y-6">
                      <div>
                        <span className="text-xs uppercase tracking-widest text-primary/60 font-bold block mb-1">Client</span>
                        <span className="text-xs font-serif text-primary block">{selectedOrder.User?.name}</span>
                        <span className="text-xs text-primary/70 lowercase font-mono">{selectedOrder.User?.email}</span>
                      </div>
                      <div>
                        <span className="text-xs uppercase tracking-widest text-primary/60 font-bold block mb-1">Investment Date</span>
                        <span className="text-xs text-primary">{new Date(selectedOrder.order_date).toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-xs uppercase tracking-widest text-primary/60 font-bold block mb-1">Total Value</span>
                        <span className="text-xl font-serif text-secondary">${parseFloat(selectedOrder.total_amount).toLocaleString()}</span>
                      </div>
                      <div className="pt-6 border-t border-gray-200">
                         <span className="text-xs uppercase tracking-widest text-primary/60 font-bold block mb-3">Lifecycle Control</span>
                         <button 
                          onClick={() => handleUpdateStatus(selectedOrder.id, selectedOrder.status, selectedOrder.payment_status)}
                          className="w-full py-3 bg-primary text-white text-xs uppercase tracking-widest font-bold hover:bg-primary/90 transition-all"
                         >
                           Update Status
                         </button>
                      </div>
                   </div>
                </div>

                {/* Right Content - Gems in Order */}
                <div className="flex-1 p-10 overflow-y-auto">
                   <header className="flex justify-between items-center mb-10">
                      <h3 className="text-xs uppercase tracking-[0.2em] text-primary/60 font-bold">Acquired Assets</h3>
                      <button onClick={() => setIsModalOpen(false)} className="text-primary/80 hover:text-primary transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                   </header>

                   <div className="space-y-6">
                      {selectedOrder.OrderItems?.map((item) => (
                        <div key={item.id} className="flex gap-6 pb-6 border-b border-gray-50 group">
                           <div className="w-20 h-20 bg-gray-50 flex-shrink-0 flex items-center justify-center border border-gray-100 group-hover:border-secondary/20 transition-all overflow-hidden rounded-sm">
                              {item.Gemstone?.image ? (
                                <img src={`/images/${item.Gemstone.image}`} alt={item.Gemstone.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                              ) : (
                                <span className="text-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-700">💎</span>
                              )}
                           </div>
                           <div className="flex-1">
                              <span className="text-xs uppercase tracking-widest text-secondary font-bold block mb-1">{item.Gemstone?.variety}</span>
                              <h4 className="text-sm font-serif text-primary mb-1">{item.Gemstone?.name}</h4>
                              <div className="flex gap-4 text-xs text-primary/70 font-light italic">
                                 <span>{item.Gemstone?.carat} Carats</span>
                                 <span>{item.Gemstone?.cut} Cut</span>
                              </div>
                           </div>
                           <div className="text-right">
                              <span className="text-xs text-primary/60 block mb-1">x{item.quantity}</span>
                              <span className="text-xs font-serif text-primary">${parseFloat(item.Gemstone?.price || 0).toLocaleString()}</span>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesOrders;


