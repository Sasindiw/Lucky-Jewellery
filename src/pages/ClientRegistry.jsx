import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ClientRegistry = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };

    try {
      const res = await fetch('http://localhost:5000/api/auth/users', { headers });
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch clients', err);
      Swal.fire('Error', 'Could not sync client registry', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserOrders = async (userId) => {
    setLoadingOrders(true);
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };

    try {
      const res = await fetch(`http://localhost:5000/api/orders?userId=${userId}`, { headers });
      const data = await res.json();
      if (data.success) {
        setUserOrders(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch user orders', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleResetPassword = async (userId) => {
    const { value: password } = await Swal.fire({
      title: 'Reset Client Credentials',
      input: 'password',
      inputLabel: 'Enter premium new password',
      inputPlaceholder: 'Enter new password',
      inputAttributes: {
        autocapitalize: 'off',
        autocorrect: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Reset Credentials',
      confirmButtonColor: '#1e1e1e'
    });

    if (password) {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`http://localhost:5000/api/auth/users/${userId}/reset-password`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ password })
        });
        const data = await res.json();
        if (data.success) {
          Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Credentials reset', showConfirmButton: false, timer: 2000 });
        }
      } catch (err) {
        Swal.fire('Error', 'Failed to reset password', 'error');
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    const result = await Swal.fire({
      title: 'Delete Member Account?',
      text: "This client will be removed from the sanctuary registry permanently.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete account'
    });

    if (result.isConfirmed) {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`http://localhost:5000/api/auth/users/${userId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Account deleted', showConfirmButton: false, timer: 2000 });
          setIsModalOpen(false);
          fetchUsers();
        }
      } catch (err) {
        Swal.fire('Error', 'Failed to delete account', 'error');
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <main className="w-full bg-gray-50/30 overflow-y-auto mt-20">
        <header className="px-12 py-10 flex justify-between items-center bg-white/80 backdrop-blur-xl border-b border-gray-100">
          <div>
            <h1 className="text-3xl font-serif text-primary capitalize">Client Registry</h1>
            <p className="text-primary/40 text-xs font-light tracking-wide mt-1">Management of the Lucky Gems esteemed clientele.</p>
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
          {/* Stats Summary for Clients */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100 group hover:border-secondary/30 transition-all duration-700">
              <div className="flex justify-between items-start mb-6">
                <span className="text-2xl opacity-40 group-hover:opacity-100 transition-opacity">👑</span>
                <div className="w-2 h-2 rounded-full bg-secondary/30"></div>
              </div>
              <h3 className="text-primary/30 text-[10px] uppercase tracking-[0.2em] mb-2 font-bold">Total Members</h3>
              <p className="text-3xl font-serif text-primary">{users.length}</p>
            </div>
            <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100 group hover:border-secondary/30 transition-all duration-700">
              <div className="flex justify-between items-start mb-6">
                <span className="text-2xl opacity-40 group-hover:opacity-100 transition-opacity">✨</span>
                <div className="w-2 h-2 rounded-full bg-secondary/30"></div>
              </div>
              <h3 className="text-primary/30 text-[10px] uppercase tracking-[0.2em] mb-2 font-bold">New This Month</h3>
              <p className="text-3xl font-serif text-primary">
                {users.filter(u => new Date(u.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
              </p>
            </div>
            <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100 group hover:border-secondary/30 transition-all duration-700">
              <div className="flex justify-between items-start mb-6">
                <span className="text-2xl opacity-40 group-hover:opacity-100 transition-opacity">🛡️</span>
                <div className="w-2 h-2 rounded-full bg-secondary/30"></div>
              </div>
              <h3 className="text-primary/30 text-[10px] uppercase tracking-[0.2em] mb-2 font-bold">Admins</h3>
              <p className="text-3xl font-serif text-primary">{users.filter(u => u.role === 'admin').length}</p>
            </div>
          </div>

          <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-1000">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 text-[10px] uppercase tracking-[0.2em] text-primary/30 font-bold border-b border-gray-100">
                <tr>
                  <th className="px-8 py-6">Member Profile</th>
                  <th className="px-8 py-6">Status / Role</th>
                  <th className="px-8 py-6">Joined</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr><td colSpan="4" className="px-8 py-20 text-center italic text-primary/30 font-serif">Synchronizing member records...</td></tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan="4" className="px-8 py-20 text-center italic text-primary/30 font-serif">No members registered in the sanctuary.</td></tr>
                ) : users.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-serif text-primary group-hover:text-secondary transition-colors">{client.name}</span>
                        <span className="text-[10px] text-primary/40 tracking-wider font-mono">{client.email}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] uppercase tracking-widest font-bold ${
                        client.role === 'admin' ? 'bg-purple-50 text-purple-600 border border-purple-100' : 'bg-gray-50 text-primary/40 border border-gray-100'
                      }`}>
                        {client.role} Status
                      </span>
                    </td>
                    <td className="px-8 py-6 text-xs text-primary/40">
                      {new Date(client.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-6 text-right">
                       <button 
                        onClick={() => {
                          setSelectedUser(client);
                          fetchUserOrders(client.id);
                          setIsModalOpen(true);
                        }}
                        className="text-[10px] uppercase tracking-widest font-bold text-secondary hover:underline"
                       >
                         Manage Profile
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Profile Details & Management Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 z-[60] flex justify-end animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-2xl bg-white shadow-2xl animate-in slide-in-from-right duration-500 overflow-y-auto">
            <div className="p-12">
              <header className="mb-12 flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-serif text-primary">{selectedUser.name}</h2>
                  <p className="text-[10px] uppercase tracking-widest text-secondary font-bold mt-2">{selectedUser.role} Registry Details</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-primary/20 hover:text-primary transition-colors">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                   </svg>
                </button>
              </header>

              <div className="grid grid-cols-2 gap-8 mb-16">
                 <div className="bg-gray-50 p-6 rounded-sm border border-gray-100">
                    <span className="text-[9px] uppercase tracking-widest text-primary/30 font-bold block mb-2">Digital Address</span>
                    <span className="text-sm font-mono text-primary">{selectedUser.email}</span>
                 </div>
                 <div className="bg-gray-50 p-6 rounded-sm border border-gray-100">
                    <span className="text-[9px] uppercase tracking-widest text-primary/30 font-bold block mb-2">Sanctuary Entrance</span>
                    <span className="text-sm text-primary">{new Date(selectedUser.created_at).toLocaleString()}</span>
                 </div>
              </div>

              <div className="mb-16">
                 <h3 className="text-[10px] uppercase tracking-[0.2em] text-primary/30 font-bold mb-6 border-b border-gray-100 pb-4">Acquisition History</h3>
                 {loadingOrders ? (
                   <p className="text-center py-10 italic text-primary/30 font-serif">Retrieving transaction logs...</p>
                 ) : userOrders.length === 0 ? (
                   <p className="text-center py-10 italic text-primary/30 font-serif">No acquisitions recorded for this member.</p>
                 ) : (
                   <div className="space-y-4">
                     {userOrders.map(order => (
                       <div key={order.id} className="flex justify-between items-center p-6 bg-white border border-gray-100 rounded-sm hover:border-secondary/20 transition-all">
                          <div>
                             <span className="text-[10px] font-mono text-primary/40 block">#LG-{order.id.toString().padStart(5, '0')}</span>
                             <span className="text-[11px] uppercase tracking-widest text-primary/60">{new Date(order.order_date).toLocaleDateString()}</span>
                          </div>
                          <div className="text-right">
                             <span className="text-sm font-serif text-secondary block">${parseFloat(order.total_amount).toLocaleString()}</span>
                             <span className="text-[9px] uppercase tracking-widest text-primary/30">Finalized</span>
                          </div>
                       </div>
                     ))}
                   </div>
                 )}
              </div>

              <div className="space-y-4 pt-10 border-t border-gray-100">
                 <button 
                  onClick={async () => {
                    const { value: formValues } = await Swal.fire({
                      title: 'Refine Member Profile',
                      html:
                        `<input id="swal-input1" class="swal2-input" placeholder="Member Name" value="${selectedUser.name}">` +
                        `<input id="swal-input2" class="swal2-input" placeholder="Digital Address" value="${selectedUser.email}">`,
                      focusConfirm: false,
                      showCancelButton: true,
                      confirmButtonText: 'Update Profile',
                      confirmButtonColor: '#1e1e1e',
                      preConfirm: () => {
                        return [
                          document.getElementById('swal-input1').value,
                          document.getElementById('swal-input2').value
                        ]
                      }
                    });

                    if (formValues) {
                      const [name, email] = formValues;
                      const token = localStorage.getItem('token');
                      try {
                        const res = await fetch(`http://localhost:5000/api/auth/users/${selectedUser.id}`, {
                          method: 'PUT',
                          headers: { 
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                          },
                          body: JSON.stringify({ name, email })
                        });
                        const data = await res.json();
                        if (data.success) {
                          Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Profile refined', showConfirmButton: false, timer: 2000 });
                          setSelectedUser(data.data);
                          fetchUsers();
                        }
                      } catch (err) {
                        Swal.fire('Error', 'Failed to refine profile', 'error');
                      }
                    }
                  }}
                  className="w-full py-5 border border-primary text-primary text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-primary hover:text-white transition-all shadow-lg"
                 >
                   Refine Member Identity (Edit)
                 </button>
                 <button 
                  onClick={() => handleResetPassword(selectedUser.id)}
                  className="w-full py-5 border border-primary text-primary text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-primary hover:text-white transition-all shadow-lg"
                 >
                   Reset Client Credentials
                 </button>
                 <button 
                  onClick={() => handleDeleteUser(selectedUser.id)}
                  className="w-full py-5 text-red-500 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-red-50 transition-all border border-red-100 rounded-sm"
                 >
                   Delete Member Account
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientRegistry;
