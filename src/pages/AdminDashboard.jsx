import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const AdminDashboard = ({ defaultTab = 'orders' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGem, setEditingGem] = useState(null);
  
  const navigate = useNavigate();

  // Update tab when prop changes (from Navbar navigation)
  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  // Modal State for New/Edit Gem
  const [formData, setFormData] = useState({
    name: '',
    variety: '',
    color: '',
    carat: '',
    shape: '',
    cut: '',
    treatment: 'Natural',
    price: '',
    image: 'gem-placeholder.png',
    stock: 1,
    status: 'In Stock'
  });

  const stats = [
    { label: 'Revenue', value: `$${orders.reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0).toLocaleString()}`, icon: '✨' },
    { label: 'Orders', value: orders.length, icon: '📜' },
    { label: 'Clients', value: users.length, icon: '👑' },
  ];

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };

    try {
      const [invRes, ordRes, usrRes] = await Promise.all([
        fetch('http://localhost:5000/api/gemstones'),
        fetch('http://localhost:5000/api/orders', { headers }),
        fetch('http://localhost:5000/api/auth/users', { headers })
      ]);

      const invData = await invRes.json();
      const ordData = await ordRes.json();
      const usrData = await usrRes.json();

      if (invData.success) setInventory(invData.data);
      if (ordData.success) setOrders(ordData.data);
      if (usrData.success) setUsers(usrData.data);
    } catch (err) {
      console.error('Data sync failed', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  };

  const handleGemAction = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const method = editingGem ? 'PUT' : 'POST';
    const url = editingGem 
      ? `http://localhost:5000/api/gemstones/${editingGem.id}` 
      : 'http://localhost:5000/api/gemstones';

    try {
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: editingGem ? 'Updated' : 'Created', showConfirmButton: false, timer: 2000 });
        setIsModalOpen(false);
        setEditingGem(null);
        fetchData();
      }
    } catch (err) {
      Swal.fire('Error', 'Operation failed', 'error');
    }
  };

  const deleteGem = async (id) => {
    const result = await Swal.fire({
      title: 'De-list Masterpiece?',
      text: "This item will be permanently removed from the public gallery.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e1e1e',
      confirmButtonText: 'Yes, remove it'
    });

    if (result.isConfirmed) {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/gemstones/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchData();
      Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Removed', showConfirmButton: false, timer: 2000 });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Sidebar removed as requested, now using Navbar links */}

      {/* Main Content */}
      <main className="w-full bg-gray-50/30 overflow-y-auto mt-20">
        <header className="px-12 py-10 flex justify-between items-center bg-white/80 backdrop-blur-xl border-b border-gray-100">
          <div>
            <h1 className="text-3xl font-serif text-primary capitalize">{activeTab} management</h1>
            <p className="text-primary/40 text-xs font-light tracking-wide mt-1">Real-time oversight of the Lucky Gems sanctuary.</p>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="w-px h-8 bg-gray-200"></div>
             <div className="flex items-center gap-3">
               <span className="text-[10px] uppercase tracking-widest font-bold text-primary/60">Lead Admin</span>
               <div className="w-10 h-10 rounded-full bg-secondary text-primary flex items-center justify-center font-serif text-lg">A</div>
             </div>
          </div>
        </header>

        <div className="p-12">
          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white p-8 rounded-sm shadow-sm border border-gray-100 group hover:border-secondary/30 transition-all duration-700">
                <div className="flex justify-between items-start mb-6">
                  <span className="text-2xl opacity-40 group-hover:opacity-100 transition-opacity">{stat.icon}</span>
                  <div className="w-2 h-2 rounded-full bg-secondary/30"></div>
                </div>
                <h3 className="text-primary/30 text-[10px] uppercase tracking-[0.2em] mb-2 font-bold">{stat.label}</h3>
                <p className="text-3xl font-serif text-primary">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Dynamic Sections */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-1000">
               <table className="w-full text-left">
                <thead className="bg-gray-50/50 text-[10px] uppercase tracking-[0.2em] text-primary/30 font-bold border-b border-gray-100">
                  <tr>
                    <th className="px-8 py-6">Order ID</th>
                    <th className="px-8 py-6">Client</th>
                    <th className="px-8 py-6">Amount</th>
                    <th className="px-8 py-6 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-6 font-mono text-xs text-primary/50">#LG-{order.id.toString().padStart(5, '0')}</td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-serif text-primary">{order.User?.name}</span>
                          <span className="text-[10px] text-primary/40">{order.User?.email}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 font-serif text-secondary">${parseFloat(order.total_amount).toLocaleString()}</td>
                      <td className="px-8 py-6 text-right text-[10px] uppercase tracking-widest text-primary/40">
                        {new Date(order.order_date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'users' && (
             <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-1000">
             <table className="w-full text-left">
              <thead className="bg-gray-50/50 text-[10px] uppercase tracking-[0.2em] text-primary/30 font-bold border-b border-gray-100">
                <tr>
                  <th className="px-8 py-6">Member Profile</th>
                  <th className="px-8 py-6">Privacy Tier</th>
                  <th className="px-8 py-6 text-right">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-serif text-primary">{client.name}</span>
                        <span className="text-[10px] text-primary/40">{client.email}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] uppercase tracking-widest font-bold ${
                        client.role === 'admin' ? 'bg-purple-50 text-purple-600 border border-purple-100' : 'bg-gray-50 text-primary/40 border border-gray-100'
                      }`}>
                        {client.role} Member
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right text-[10px] uppercase tracking-widest text-primary/40">
                      {new Date(client.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
        </div>
      </main>

      {/* Modern Side Modal for Add/Edit Gem */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-xl bg-white shadow-2xl animate-in slide-in-from-right duration-500 overflow-y-auto">
            <div className="p-12">
              <header className="mb-12 flex justify-between items-center">
                <h2 className="text-3xl font-serif text-primary">{editingGem ? 'Refine Masterpiece' : 'Register New Gem'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-primary/20 hover:text-primary transition-colors">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                   </svg>
                </button>
              </header>

              <form onSubmit={handleGemAction} className="space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  <div className="col-span-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-primary/40 mb-3 block">Display Name</label>
                    <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 border-gray-100 p-4 rounded-sm text-sm focus:border-secondary outline-none transition-all" required />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold text-primary/40 mb-3 block">Variety</label>
                    <input type="text" value={formData.variety} onChange={e => setFormData({...formData, variety: e.target.value})} className="w-full bg-gray-50 border-gray-100 p-4 rounded-sm text-sm focus:border-secondary outline-none transition-all" required />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold text-primary/40 mb-3 block">Price (with symbol)</label>
                    <input type="text" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-gray-50 border-gray-100 p-4 rounded-sm text-sm focus:border-secondary outline-none transition-all" placeholder="$0.00" required />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold text-primary/40 mb-3 block">Carat Weight</label>
                    <input type="number" step="0.01" value={formData.carat} onChange={e => setFormData({...formData, carat: e.target.value})} className="w-full bg-gray-50 border-gray-100 p-4 rounded-sm text-sm focus:border-secondary outline-none transition-all" required />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold text-primary/40 mb-3 block">Color</label>
                    <input type="text" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} className="w-full bg-gray-50 border-gray-100 p-4 rounded-sm text-sm focus:border-secondary outline-none transition-all" required />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold text-primary/40 mb-3 block">Shape</label>
                    <input type="text" value={formData.shape} onChange={e => setFormData({...formData, shape: e.target.value})} className="w-full bg-gray-50 border-gray-100 p-4 rounded-sm text-sm focus:border-secondary outline-none transition-all" required />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold text-primary/40 mb-3 block">Stock Available</label>
                    <input type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})} className="w-full bg-gray-50 border-gray-100 p-4 rounded-sm text-sm focus:border-secondary outline-none transition-all" required />
                  </div>
                </div>

                <button type="submit" className="w-full py-5 bg-primary text-white text-[10px] uppercase tracking-[0.2em] font-bold shadow-2xl hover:bg-secondary transition-all">
                  {editingGem ? 'Commit Changes' : 'Publish to Vault'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
