import { useState, useEffect } from "react";
import { Truck, Mail, Phone, User, Tag, Plus, Search, MapPin } from "lucide-react";

export default function Suppliers({ user }) {
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    category: "Electronics"
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/suppliers");
      const data = await res.json();
      setSuppliers(data);
    } catch (err) {
      console.error("Failed to fetch suppliers", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("http://localhost:5000/api/suppliers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSupplier)
      });
      
      if (res.ok) {
        setNotification({ message: "Supplier registered!", type: "success" });
        fetchSuppliers();
        setShowAddModal(false);
        setNewSupplier({ name: "", contactPerson: "", email: "", phone: "", category: "Electronics" });
      } else {
        const err = await res.json();
        setNotification({ message: err.message || "Failed to register", type: "error" });
      }
    } catch (err) {
      setNotification({ message: "Network error", type: "error" });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleContact = (s) => {
    window.location.href = `mailto:${s.email}?subject=Inventory Inquiry`;
    setNotification({ message: `Launching mail for ${s.name}...`, type: "success" });
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      {/* Notifications */}
      {notification && (
        <div className={`fixed top-24 right-8 z-[100] p-4 rounded-xl shadow-2xl animate-in slide-in-from-right-4 duration-300 flex items-center gap-3 border
          ${notification.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'}`}
        >
          <div className={`w-2 h-2 rounded-full ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="font-medium text-sm">{notification.message}</span>
        </div>
      )}

      {/* Add Supplier Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 border border-black/10 dark:border-white/10 p-8 rounded-2xl shadow-2xl max-w-lg w-full mx-4 outline-none overflow-y-auto max-h-[90vh]">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Register New Supplier</h3>
            
            <form onSubmit={handleAddSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Company Name</label>
                  <input 
                    type="text" required
                    value={newSupplier.name}
                    onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})}
                    className="w-full bg-black/5 dark:bg-[#1a202c] border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-all text-gray-900 dark:text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Contact Person</label>
                  <input 
                    type="text" required
                    value={newSupplier.contactPerson}
                    onChange={(e) => setNewSupplier({...newSupplier, contactPerson: e.target.value})}
                    className="w-full bg-black/5 dark:bg-[#1a202c] border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-all text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                  <input 
                    type="email" required
                    value={newSupplier.email}
                    onChange={(e) => setNewSupplier({...newSupplier, email: e.target.value})}
                    className="w-full bg-black/5 dark:bg-[#1a202c] border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-all text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                  <input 
                    type="text" required
                    value={newSupplier.phone}
                    onChange={(e) => setNewSupplier({...newSupplier, phone: e.target.value})}
                    className="w-full bg-black/5 dark:bg-[#1a202c] border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-all text-gray-900 dark:text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Category (Select or Type)</label>
                  <input 
                    list="category-suggestions"
                    required
                    value={newSupplier.category}
                    onChange={(e) => setNewSupplier({...newSupplier, category: e.target.value})}
                    className="w-full bg-black/5 dark:bg-[#1a202c] border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-all text-gray-900 dark:text-white"
                    placeholder="e.g. Logistics"
                  />
                  <datalist id="category-suggestions">
                    <option value="Electronics" />
                    <option value="Furniture" />
                    <option value="Office Supplies" />
                    <option value="Packaging" />
                    <option value="Logistics" />
                  </datalist>
                </div>
              </div>

              <div className="flex gap-3 pt-6">
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
                  {isSubmitting ? 'Registering...' : 'Add Supplier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Supplier Details Modal */}
      {showDetailsModal && selectedSupplier && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 border border-black/10 dark:border-white/10 p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 outline-none">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20">
                <Truck className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedSupplier.name}</h3>
                <span className="text-sm font-medium text-primary">Global Supplier Network</span>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Category</p>
                <span className="badge-glass px-3 py-1 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full text-sm">{selectedSupplier.category}</span>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Contact</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{selectedSupplier.contactPerson}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="font-semibold text-gray-900 dark:text-white uppercase text-xs">Active</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Communication</p>
                <div className="space-y-3">
                  <div className="bg-black/5 dark:bg-white/5 p-3 rounded-xl border border-black/5 flex items-center gap-3">
                    <Mail className="w-4 h-4 text-primary" />
                    <span className="text-sm">{selectedSupplier.email}</span>
                  </div>
                  <div className="bg-black/5 dark:bg-white/5 p-3 rounded-xl border border-black/5 flex items-center gap-3">
                    <Phone className="w-4 h-4 text-primary" />
                    <span className="text-sm">{selectedSupplier.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setShowDetailsModal(false)}
              className="w-full mt-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-blue-600 transition-all"
            >
              Close Record
            </button>
          </div>
        </div>
      )}

      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">Suppliers Directory</h1>
          <p className="text-gray-600 dark:text-gray-400">View and manage your network of global partners.</p>
        </div>
        
        {(user?.role === 'admin' || user?.role === 'manager') && (
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 text-white font-medium py-2.5 px-5 rounded-xl transition-all shadow-lg shadow-primary/25 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Add New Supplier
          </button>
        )}
      </header>

      {/* Search Bar */}
      <div className="glass-panel p-4 rounded-2xl max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search by name, category, or person..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-black/5 dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-20 text-center">
            <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-500">Loading partners...</p>
          </div>
        ) : filteredSuppliers.length === 0 ? (
          <div className="col-span-full py-20 text-center glass-panel rounded-2xl">
            <Truck className="w-12 h-12 text-gray-400 mx-auto mb-4 opacity-20" />
            <p className="text-gray-500">No suppliers found matching your query.</p>
          </div>
        ) : (
          filteredSuppliers.map((s) => (
            <div key={s._id} className="glass-panel p-6 rounded-2xl group hover:border-primary/50 transition-all duration-300 relative overflow-hidden">
              {/* Accent Glow */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <Truck className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-gray-500 dark:text-gray-400">
                  {s.category}
                </span>
              </div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-primary transition-colors">{s.name}</h3>
              <div className="flex items-center gap-2 mb-6 text-sm text-gray-500 dark:text-gray-400">
                <User className="w-4 h-4" />
                <span>{s.contactPerson}</span>
              </div>

              <div className="space-y-3 pt-4 border-t border-black/5 dark:border-white/5">
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                  <Mail className="w-4 h-4 text-primary/70" />
                  <a href={`mailto:${s.email}`} onClick={() => handleContact(s)} className="hover:text-primary transition-colors truncate">{s.email}</a>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                  <Phone className="w-4 h-4 text-primary/70" />
                  <span>{s.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                  <MapPin className="w-4 h-4 text-primary/70" />
                  <span className="truncate">Global Partner Office</span>
                </div>
              </div>

              <div className="mt-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                <button 
                  onClick={() => handleContact(s)}
                  className="flex-1 py-2 text-xs font-bold bg-primary text-white rounded-lg hover:bg-blue-600 shadow-lg shadow-primary/20 transition-all"
                >
                  Contact
                </button>
                <button 
                  onClick={() => {
                    setSelectedSupplier(s);
                    setShowDetailsModal(true);
                  }}
                  className="px-4 py-2 text-xs font-bold bg-black/5 dark:bg-white/10 rounded-lg hover:bg-black/10 dark:hover:bg-white/20 transition-all"
                >
                  Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
