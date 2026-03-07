import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const GemstoneRegistry = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGem, setEditingGem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const itemsPerPage = 8;
  const navigate = useNavigate();

  // Form State for New/Edit Gem
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
    status: 'In Stock',
    description: ''
  });

  const getGemImage = (img) => {
    if (!img) return '/images/gem-placeholder.png';
    if (img.includes('gem_') || img.includes('placeholder')) return `/images/${img}`;
    return `http://localhost:5000/uploads/${img}`;
  };

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/gemstones');
      const data = await res.json();
      if (data.success) {
        setInventory(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch inventory', err);
      Swal.fire('Error', 'Could not sync gemstone registry', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleGemAction = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const method = editingGem ? 'PUT' : 'POST';
    const url = editingGem 
      ? `http://localhost:5000/api/gemstones/${editingGem.id}` 
      : 'http://localhost:5000/api/gemstones';

    try {
      const formDataToSend = new FormData();
      
      // Append all text fields
      Object.keys(formData).forEach(key => {
        if (key !== 'image' && key !== 'carat' && key !== 'stock') {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Special handling for numeric fields (must be sent as strings in FormData)
      formDataToSend.append('carat', parseFloat(formData.carat) || 0);
      formDataToSend.append('stock', parseInt(formData.stock) || 0);

      // Append image if new file selected, otherwise send the current image string
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      } else {
        formDataToSend.append('image', formData.image);
      }

      console.log('DEBUG: Submitting FormData...');

      const res = await fetch(url, {
        method,
        headers: { 
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });
      const data = await res.json();
      if (data.success) {
        Swal.fire({ 
          toast: true, 
          position: 'top-end', 
          icon: 'success', 
          title: editingGem ? 'Masterpiece Refined' : 'Asset Registered', 
          showConfirmButton: false, 
          timer: 2000,
          background: '#1e1e1e',
          color: '#fff'
        });
        setIsModalOpen(false);
        setEditingGem(null);
        setImageFile(null);
        setImagePreview(null);
        setFormData({
            name: '', variety: '', color: '', carat: '', shape: '', cut: '',
            treatment: 'Natural', price: '', image: 'gem-placeholder.png', stock: 1, status: 'In Stock', description: ''
        });
        fetchInventory();
      } else {
        Swal.fire('Error', data.message || 'Operation failed', 'error');
      }
    } catch (err) {
      Swal.fire('Error', 'Server connection failure', 'error');
    }
  };

  const deleteGem = async (id) => {
    const result = await Swal.fire({
      title: 'De-list Masterpiece?',
      text: "This item will be permanently removed from the public gallery.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e1e1e',
      confirmButtonText: 'Yes, remove it',
      background: '#ffffff',
      customClass: {
        title: 'font-serif text-primary',
        popup: 'rounded-xl border border-gray-100 shadow-2xl'
      }
    });

    if (result.isConfirmed) {
      const token = localStorage.getItem('token');
      try {
        await fetch(`http://localhost:5000/api/gemstones/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchInventory();
        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Asset De-listed', showConfirmButton: false, timer: 2000 });
      } catch (err) {
        Swal.fire('Error', 'Failed to remove asset', 'error');
      }
    }
  };

  const openEditModal = (gem) => {
    setEditingGem(gem);
    setFormData({
      name: gem.name || '',
      variety: gem.variety || '',
      color: gem.color || '',
      carat: gem.carat || '',
      shape: gem.shape || '',
      cut: gem.cut || '',
      treatment: gem.treatment || 'Natural',
      price: gem.price || '',
      image: gem.image || 'gem-placeholder.png',
      stock: gem.stock || 1,
      status: gem.status || 'In Stock',
      description: gem.description || ''
    });
    setIsModalOpen(true);
    setImageFile(null);
    setImagePreview(getGemImage(gem.image));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="w-full bg-gray-50/30 overflow-y-auto mt-20">
        <header className="px-12 py-10 flex justify-between items-center bg-white/80 backdrop-blur-xl border-b border-gray-100">
          <div>
            <h1 className="text-3xl font-serif text-primary">Gemstone Registry</h1>
            <p className="text-primary/70 text-sm font-light tracking-wide mt-1">Curate and manage the Lucky Gems investment gallery.</p>
          </div>
          
          <div className="flex items-center gap-6">
             <button 
              onClick={() => {
                setEditingGem(null);
                setImagePreview(null);
                setImageFile(null);
                setFormData({
                  name: '', variety: '', color: '', carat: '', shape: '', cut: '',
                  treatment: 'Natural', price: '', image: 'gem-placeholder.png', stock: 1, status: 'In Stock', description: ''
                });
                setIsModalOpen(true);
              }}
              className="bg-primary hover:bg-secondary text-white px-8 py-3 text-[10px] font-bold uppercase tracking-widest transition-all shadow-xl"
             >
               Add New Asset
             </button>
             <div className="w-px h-8 bg-gray-200"></div>
             <div className="flex items-center gap-3">
               <span className="text-sm uppercase tracking-widest font-bold text-primary/60">Lead Admin</span>
               <div className="w-10 h-10 rounded-full bg-secondary text-primary flex items-center justify-center font-serif text-lg">A</div>
             </div>
          </div>
        </header>

        <div className="p-12">
          {/* Stats Summary for Inventory */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100 group hover:border-secondary/30 transition-all duration-700">
              <div className="flex justify-between items-start mb-6">
                <span className="text-2xl opacity-40 group-hover:opacity-100 transition-opacity">💎</span>
                <div className="w-2 h-2 rounded-full bg-secondary/30"></div>
              </div>
              <h3 className="text-primary/70 text-sm uppercase tracking-[0.2em] mb-2 font-bold">Total Assets</h3>
              <p className="text-3xl font-serif text-primary">{inventory.length}</p>
            </div>
            <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100 group hover:border-secondary/30 transition-all duration-700">
              <div className="flex justify-between items-start mb-6">
                <span className="text-2xl opacity-40 group-hover:opacity-100 transition-opacity">📦</span>
                <div className="w-2 h-2 rounded-full bg-secondary/30"></div>
              </div>
              <h3 className="text-primary/70 text-sm uppercase tracking-[0.2em] mb-2 font-bold">In-Vault Stock</h3>
              <p className="text-3xl font-serif text-primary">{inventory.reduce((sum, g) => sum + g.stock, 0)}</p>
            </div>
            <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100 group hover:border-secondary/30 transition-all duration-700">
              <div className="flex justify-between items-start mb-6">
                <span className="text-2xl opacity-40 group-hover:opacity-100 transition-opacity">✨</span>
                <div className="w-2 h-2 rounded-full bg-secondary/30"></div>
              </div>
              <h3 className="text-primary/70 text-sm uppercase tracking-[0.2em] mb-2 font-bold">Varieties</h3>
              <p className="text-3xl font-serif text-primary">{new Set(inventory.map(g => g.variety)).size}</p>
            </div>
          </div>

          <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-1000">
             <table className="w-full text-left">
              <thead className="bg-gray-50/50 text-sm uppercase tracking-[0.2em] text-primary/70 font-bold border-b border-gray-100">
                <tr>
                  <th className="px-8 py-6">Gemstone Asset</th>
                  <th className="px-8 py-6">Specifications</th>
                  <th className="px-8 py-6">Valuation</th>
                  <th className="px-8 py-6">Status</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                   <tr><td colSpan="5" className="px-8 py-20 text-center italic text-primary/70 font-serif">Retrieving inventory records...</td></tr>
                ) : inventory.length === 0 ? (
                   <tr><td colSpan="5" className="px-8 py-20 text-center italic text-primary/70 font-serif">No gemstones currently registered.</td></tr>
                ) : inventory.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((gem) => (
                  <tr key={gem.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-gray-50 flex items-center justify-center border border-gray-100 overflow-hidden rounded-sm group-hover:border-secondary/20 transition-all">
                          <img src={getGemImage(gem.image)} alt={gem.variety} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        <div>
                          <span className="text-sm font-serif text-primary block">{gem.name || gem.variety}</span>
                          <span className="text-xs text-primary/70 tracking-wider uppercase">{gem.variety}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex flex-col gap-1">
                          <span className="text-sm text-primary/70 italic">{gem.carat}ct • {gem.color}</span>
                          <span className="text-[10px] uppercase tracking-widest text-primary/40">{gem.shape} • {gem.cut}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <span className="text-sm font-serif text-secondary">{gem.price}</span>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex flex-col gap-1">
                          <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full border w-fit ${
                            gem.stock > 0 ? 'border-green-100 text-green-600 bg-green-50' : 'border-red-100 text-red-600 bg-red-50'
                          }`}>
                            {gem.stock > 0 ? 'In Stock' : 'Sold Out'}
                          </span>
                          <span className="text-[10px] text-primary/40 font-bold uppercase tracking-widest">Qty: {gem.stock}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex justify-end gap-6">
                          <button 
                            onClick={() => openEditModal(gem)}
                            className="text-[10px] uppercase tracking-widest font-bold text-secondary hover:underline"
                          >
                            Refine
                          </button>
                          <button 
                            onClick={() => deleteGem(gem.id)}
                            className="text-[10px] uppercase tracking-widest font-bold text-red-300 hover:text-red-500 transition-colors"
                          >
                            De-list
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Luxury Pagination Controls */}
          {inventory.length > itemsPerPage && (
            <div className="mt-12 flex justify-center items-center gap-4 animate-in fade-in duration-1000">
               <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-primary/40 hover:text-secondary hover:border-secondary transition-all disabled:opacity-20 disabled:hover:border-gray-100 disabled:hover:text-primary/40"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                 </svg>
               </button>

               <div className="flex gap-2">
                 {[...Array(Math.ceil(inventory.length / itemsPerPage))].map((_, i) => (
                   <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-full text-xs font-bold transition-all ${
                      currentPage === i + 1 
                        ? 'bg-primary text-white shadow-lg' 
                        : 'text-primary/40 hover:text-primary hover:bg-gray-50'
                    }`}
                   >
                     {(i + 1).toString().padStart(2, '0')}
                   </button>
                 ))}
               </div>

               <button 
                disabled={currentPage === Math.ceil(inventory.length / itemsPerPage)}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-primary/40 hover:text-secondary hover:border-secondary transition-all disabled:opacity-20 disabled:hover:border-gray-100 disabled:hover:text-primary/40"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                 </svg>
               </button>
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
                <h2 className="text-3xl font-serif text-primary">{editingGem ? 'Refine Masterpiece' : 'Register New Asset'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-primary/80 hover:text-primary transition-colors">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                   </svg>
                </button>
              </header>

              <form onSubmit={handleGemAction} className="space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  <div className="col-span-2 group">
                    <label className="text-sm uppercase tracking-widest font-bold text-primary/70 mb-3 block group-focus-within:text-secondary transition-colors">Asset Display Name</label>
                    <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 border-b border-gray-100 p-4 focus:outline-none focus:border-secondary outline-none transition-all text-sm text-primary" placeholder="e.g. Royal Blue Sapphire Specimen" required />
                  </div>
                  <div className="group">
                    <label className="text-sm uppercase tracking-widest font-bold text-primary/70 mb-3 block group-focus-within:text-secondary transition-colors">Variety</label>
                    <input type="text" value={formData.variety} onChange={e => setFormData({...formData, variety: e.target.value})} className="w-full bg-gray-50 border-b border-gray-100 p-4 focus:outline-none focus:border-secondary outline-none transition-all text-sm text-primary" placeholder="e.g. Sapphire" required />
                  </div>
                  <div className="group">
                    <label className="text-sm uppercase tracking-widest font-bold text-primary/70 mb-3 block group-focus-within:text-secondary transition-colors">Price</label>
                    <input type="text" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-gray-50 border-b border-gray-100 p-4 focus:outline-none focus:border-secondary outline-none transition-all text-sm text-primary" placeholder="$0.00" required />
                  </div>
                  <div className="group">
                    <label className="text-sm uppercase tracking-widest font-bold text-primary/70 mb-3 block group-focus-within:text-secondary transition-colors">Carat Weight</label>
                    <input type="number" step="0.01" value={formData.carat} onChange={e => setFormData({...formData, carat: e.target.value})} className="w-full bg-gray-50 border-b border-gray-100 p-4 focus:outline-none focus:border-secondary outline-none transition-all text-sm text-primary" required />
                  </div>
                  <div className="group">
                    <label className="text-sm uppercase tracking-widest font-bold text-primary/70 mb-3 block group-focus-within:text-secondary transition-colors">Color Grade</label>
                    <input type="text" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} className="w-full bg-gray-50 border-b border-gray-100 p-4 focus:outline-none focus:border-secondary outline-none transition-all text-sm text-primary" placeholder="e.g. Intense Blue" required />
                  </div>
                  <div className="group">
                    <label className="text-sm uppercase tracking-widest font-bold text-primary/70 mb-3 block group-focus-within:text-secondary transition-colors">Shape</label>
                    <input type="text" value={formData.shape} onChange={e => setFormData({...formData, shape: e.target.value})} className="w-full bg-gray-50 border-b border-gray-100 p-4 focus:outline-none focus:border-secondary outline-none transition-all text-sm text-primary" placeholder="e.g. Oval" required />
                  </div>
                  <div className="group">
                    <label className="text-sm uppercase tracking-widest font-bold text-primary/70 mb-3 block group-focus-within:text-secondary transition-colors">Cut Style</label>
                    <input type="text" value={formData.cut} onChange={e => setFormData({...formData, cut: e.target.value})} className="w-full bg-gray-50 border-b border-gray-100 p-4 focus:outline-none focus:border-secondary outline-none transition-all text-sm text-primary" placeholder="e.g. Brilliant" required />
                  </div>
                  <div className="group">
                    <label className="text-sm uppercase tracking-widest font-bold text-primary/70 mb-3 block group-focus-within:text-secondary transition-colors">Stock Level</label>
                    <input type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})} className="w-full bg-gray-50 border-b border-gray-100 p-4 focus:outline-none focus:border-secondary outline-none transition-all text-sm text-primary" required />
                  </div>
                  <div className="group">
                    <label className="text-sm uppercase tracking-widest font-bold text-primary/70 mb-3 block group-focus-within:text-secondary transition-colors">Treatment</label>
                    <select value={formData.treatment} onChange={e => setFormData({...formData, treatment: e.target.value})} className="w-full bg-gray-50 border-b border-gray-100 p-4 focus:outline-none focus:border-secondary outline-none transition-all text-sm text-primary">
                        <option value="Natural">Natural</option>
                        <option value="Heat Treated">Heat Treated</option>
                        <option value="Enhanced">Enhanced</option>
                    </select>
                  </div>
                  <div className="col-span-2 group">
                    <label className="text-sm uppercase tracking-widest font-bold text-primary/70 mb-3 block group-focus-within:text-secondary transition-colors">Heritage Description</label>
                    <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-gray-50 border-b border-gray-100 p-4 focus:outline-none focus:border-secondary outline-none transition-all text-sm text-primary min-h-[100px]" placeholder="Brief history or unique features of this specimen..."></textarea>
                  </div>

                  {/* Image Upload Field */}
                  <div className="col-span-2">
                    <label className="text-sm uppercase tracking-widest font-bold text-primary/70 mb-6 block">Visual Representation</label>
                    <div className="flex items-center gap-10 bg-gray-50 p-8 border border-dashed border-gray-200 rounded-sm hover:border-secondary/30 transition-all">
                        <div className="w-32 h-32 bg-white flex items-center justify-center border border-gray-100 overflow-hidden rounded-sm shadow-inner shrink-0">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                            ) : (
                                <span className="text-4xl opacity-20">📸</span>
                            )}
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] text-primary/40 uppercase tracking-widest mb-4 leading-relaxed font-bold">
                                Upload a high-resolution specimen portrait.<br/>Supported formats: WEBP, PNG, JPG (Max 5MB)
                            </p>
                            <input 
                                type="file" 
                                id="gem-image"
                                className="hidden" 
                                onChange={handleImageChange}
                                accept="image/*"
                            />
                            <label 
                                htmlFor="gem-image" 
                                className="inline-block px-6 py-3 border border-primary text-[9px] font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all cursor-pointer shadow-sm"
                            >
                                {imagePreview ? 'Update Portrait' : 'Select Masterpiece Image'}
                            </label>
                        </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                    <button type="submit" className="w-full py-5 bg-primary text-white text-[10px] uppercase tracking-[0.3em] font-bold shadow-2xl hover:bg-secondary transition-all">
                    {editingGem ? 'Commit Refinement' : 'Publish to Vault'}
                    </button>
                    <p className="text-[10px] text-primary/30 text-center mt-6 italic tracking-widest">
                        Values will be reflected immediately in the Master Collection.
                    </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GemstoneRegistry;
