import { useState, useEffect } from "react";
import { UserPlus, Settings, Trash2, Shield, UserCircle, Briefcase } from "lucide-react";

export default function Users({ user }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff"
  });

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchUsers();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser)
      });

      if (res.ok) {
        setNotification({ message: "User created successfully!", type: "success" });
        fetchUsers();
        setShowAddModal(false);
        setNewUser({ name: "", email: "", password: "", role: "staff" });
      } else {
        const err = await res.json();
        setNotification({ message: err.message || "Failed to create user", type: "error" });
      }
    } catch (err) {
      setNotification({ message: "Network error", type: "error" });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`http://localhost:5000/api/auth/users/${userToEdit._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userToEdit)
      });

      if (res.ok) {
        setNotification({ message: "User updated successfully!", type: "success" });
        fetchUsers();
        setUserToEdit(null);
      } else {
        const err = await res.json();
        setNotification({ message: err.message || "Failed to update user", type: "error" });
      }
    } catch (err) {
      setNotification({ message: "Network error", type: "error" });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const executeDelete = async (id) => {
    setIsDeleting(true);
    try {
      const res = await fetch(`http://localhost:5000/api/auth/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setUsers(users.filter(u => u._id !== id));
        setNotification({ message: "User deleted", type: "success" });
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (err) {
      console.error("Failed to delete user", err);
    } finally {
      setIsDeleting(false);
      setUserToDelete(null);
    }
  };

  if (user?.role !== 'admin') {
    return <div className="text-center text-red-500 mt-20">Access Denied. Admin privileges required.</div>;
  }

  const getRoleIcon = (role) => {
    switch(role) {
      case 'admin': return <Shield className="w-4 h-4 text-primary" />;
      case 'manager': return <Briefcase className="w-4 h-4 text-purple-500 dark:text-purple-400" />;
      case 'staff': return <UserCircle className="w-4 h-4 text-green-500 dark:text-green-400" />;
      default: return <UserCircle className="w-4 h-4 text-gray-500 dark:text-gray-400" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-24 right-8 z-50 p-4 rounded-xl shadow-2xl animate-in slide-in-from-right-4 duration-300 flex items-center gap-3 border
          ${notification.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'}`}
        >
          <div className={`w-2 h-2 rounded-full ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="font-medium text-sm">{notification.message}</span>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 border border-black/10 dark:border-white/10 p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 outline-none">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Create New User</h3>
            
            <form onSubmit={handleAddUser} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Display Name</label>
                <input 
                  type="text" required
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-gray-900 dark:text-white"
                  placeholder="e.g. Robert Fox"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                <input 
                  type="email" required
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-gray-900 dark:text-white"
                  placeholder="robert@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Password</label>
                <input 
                  type="password" required
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-gray-900 dark:text-white"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">System Role</label>
                <select 
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  className="dropdown-field"
                >
                  <option value="staff">Staff</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 font-bold text-white bg-primary hover:bg-blue-600 rounded-xl shadow-lg shadow-primary/25 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">User Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage system access and roles.</p>
        </div>
        
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 text-white font-medium py-2.5 px-5 rounded-xl transition-all shadow-lg shadow-primary/25 active:scale-95"
        >
          <UserPlus className="w-5 h-5" />
          Add New User
        </button>
      </header>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading ? (
          <p className="text-gray-500">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="text-gray-500">No users found.</p>
        ) : (
          users.map((u) => (
            <div key={u._id} className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:border-primary/50 transition-colors">
              {/* Background Glow based on role */}
              <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] opacity-10 dark:opacity-20 pointer-events-none transition-opacity group-hover:opacity-20 dark:group-hover:opacity-40
                ${u.role === 'admin' ? 'bg-primary' : u.role === 'manager' ? 'bg-purple-500' : 'bg-green-500'}`} 
              />
              
              <div className="flex items-start justify-between mb-6 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-xl font-bold text-gray-900 dark:text-white">
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{u.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{u.email}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setUserToEdit(u)}
                    className="p-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                  {u.role !== 'admin' && (
                    <button 
                      onClick={() => setUserToDelete(u._id)}
                      className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-600 dark:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-black/10 dark:border-white/10 pt-4 relative z-10">
                <div className="flex items-center gap-2">
                  {getRoleIcon(u.role)}
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{u.role}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]`} />
                  <span className="text-sm text-gray-500 dark:text-gray-400">Active</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit User Modal */}
      {userToEdit && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 border border-black/10 dark:border-white/10 p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 outline-none">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">User Settings</h3>
            
            <form onSubmit={handleEditUser} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Display Name</label>
                <input 
                  type="text" required
                  value={userToEdit.name}
                  onChange={(e) => setUserToEdit({...userToEdit, name: e.target.value})}
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                <input 
                  type="email" required
                  value={userToEdit.email}
                  onChange={(e) => setUserToEdit({...userToEdit, email: e.target.value})}
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">System Role</label>
                <select 
                  value={userToEdit.role}
                  onChange={(e) => setUserToEdit({...userToEdit, role: e.target.value})}
                  className="dropdown-field"
                >
                  <option value="staff">Staff</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setUserToEdit(null)}
                  className="flex-1 px-4 py-3 font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 font-bold text-white bg-primary hover:bg-blue-600 rounded-xl shadow-lg shadow-primary/25 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? 'Updating...' : 'Save Settings'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 border border-black/10 dark:border-white/10 p-6 rounded-2xl shadow-xl max-w-sm w-full mx-4 outline-none">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Delete User?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Are you sure you want to delete this user? This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => executeDelete(userToDelete)}
                disabled={isDeleting}
                className="px-4 py-2 font-medium text-white bg-red-500 hover:bg-red-600 rounded-xl shadow-lg shadow-red-500/25 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
