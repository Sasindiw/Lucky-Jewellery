import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('inventory');
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  const stats = [
    { label: 'Total Sales', value: '$124,500', icon: '💰', trend: '+12%' },
    { label: 'Rare Gems', value: '42', icon: '💎', trend: '+5' },
    { label: 'Pending Analysis', value: '12', icon: '🧠', trend: '-2' },
    { label: 'Active Collectors', value: '1,204', icon: '👥', trend: '+86' },
  ];

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/gemstones');
        const result = await response.json();
        if (result.success) {
          setInventory(result.data);
        }
      } catch (err) {
        console.error('Error fetching inventory:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-white hidden lg:flex flex-col">
        <div className="p-8 border-b border-white/10">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.jpg" alt="Logo" className="h-10 w-10 rounded-full" />
            <span className="font-serif text-xl">Lucky Gems</span>
          </Link>
        </div>
        <nav className="flex-1 p-6 space-y-4">
          {['Inventory', 'Sales', 'AI Analysis', 'Customers', 'Settings'].map((item) => (
            <button
              key={item}
              onClick={() => setActiveTab(item.toLowerCase())}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm uppercase tracking-widest transition-colors ${
                activeTab === item.toLowerCase() ? 'bg-secondary text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {item}
            </button>
          ))}
        </nav>
        <div className="p-6 border-t border-white/10">
          <Link to="/login" className="text-xs uppercase tracking-widest text-white/40 hover:text-white">Logout</Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-serif text-primary">Admin Dashboard</h1>
            <p className="text-primary/50 text-sm">Welcome back, Admin. Here's what's happening today.</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-6 py-2 bg-white border border-gray-200 text-xs uppercase tracking-widest text-primary rounded-full hover:border-secondary hover:text-secondary transition-colors">
              Download Report
            </button>
            <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-white font-bold">A</div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <span className="text-2xl">{stat.icon}</span>
                <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">{stat.trend}</span>
              </div>
              <h3 className="text-primary/50 text-xs uppercase tracking-widest mb-1 font-bold">{stat.label}</h3>
              <p className="text-2xl font-serif text-primary">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Inventory Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-serif text-xl">Gemstone Inventory</h2>
            <button className="text-xs uppercase tracking-widest font-bold text-secondary hover:underline">+ Add New Gem</button>
          </div>
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-[10px] uppercase tracking-[0.2em] text-primary/40">
              <tr>
                <th className="px-6 py-4">Gemstone Name</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-primary/40 italic">
                    <div className="animate-pulse">Loading collection data from backend...</div>
                  </td>
                </tr>
              ) : inventory.length > 0 ? (
                inventory.map((gem) => (
                  <tr key={gem.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-primary">{gem.name}</td>
                    <td className="px-6 py-4 text-primary/70">{gem.price}</td>
                    <td className="px-6 py-4 text-primary/70">{gem.stock} units</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-tighter ${
                        gem.status === 'In Stock' ? 'bg-green-50 text-green-600' : 
                        gem.status === 'Low Stock' ? 'bg-yellow-50 text-yellow-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {gem.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-primary/40 hover:text-secondary px-2">Edit</button>
                      <button className="text-primary/40 hover:text-red-500 px-2">Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-primary/40">
                    No data available in the gemstone collection.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="p-4 bg-gray-50 text-center">
            <button className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary/40 hover:text-primary">View Full Inventory</button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
