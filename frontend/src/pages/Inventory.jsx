import { useState, useEffect } from "react";
import { ArrowDownToLine, ArrowUpFromLine, RefreshCcw } from "lucide-react";

export default function Inventory({ user }) {
  const [movements, setMovements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showModal, setShowModal] = useState(null); // 'IN' or 'OUT'
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [formData, setFormData] = useState({ product: '', supplier: '', amount: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchMovements = async (isManual = false) => {
    if (isManual) setIsSyncing(true);
    else setIsLoading(true);
    
    try {
      const res = await fetch("http://localhost:5000/api/inventory");
      const data = await res.json();
      setMovements(data);
      if (isManual) {
        setNotification({ message: "Inventory synced successfully!", type: "success" });
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (error) {
      console.error("Failed to fetch inventory movements:", error);
      if (isManual) {
        setNotification({ message: "Failed to sync inventory.", type: "error" });
        setTimeout(() => setNotification(null), 3000);
      }
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products");
    }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/suppliers");
      const data = await res.json();
      setSuppliers(data);
    } catch (err) {
      console.error("Failed to fetch suppliers");
    }
  };

  const handleStockAction = (type) => {
    setShowModal(type);
    setFormData({ product: '', supplier: '', amount: '' });
  };

  const handleStockSubmit = async (e) => {
    e.preventDefault();
    const isOut = showModal === 'OUT';
    
    // Check validation based on type
    if (!formData.product || !formData.amount) return;
    if (!isOut && !formData.supplier) {
      setNotification({ message: "Please select a supplier for Stock In", type: "error" });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    const selectedSupplier = isOut ? null : suppliers.find(s => s._id === formData.supplier);

    setIsSubmitting(true);
    try {
      const res = await fetch("http://localhost:5000/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: showModal,
          product: formData.product,
          amount: Number(formData.amount),
          supplier: isOut ? null : formData.supplier,
          supplierName: isOut ? "Internal Action" : selectedSupplier?.name,
          processedBy: user?._id || "69d49898227b38d8583f0ddf",
          processedByName: user?.name || "System"
        })
      });

      if (res.ok) {
        setNotification({ message: `Stock ${showModal === 'IN' ? 'added' : 'removed'} successfully!`, type: "success" });
        fetchMovements();
        setShowModal(null);
      } else {
        const error = await res.json();
        setNotification({ message: error.message || "Failed to update stock", type: "error" });
      }
    } catch (err) {
      setNotification({ message: "Network error occurred", type: "error" });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  useEffect(() => {
    fetchMovements();
    fetchProducts();
    fetchSuppliers();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      {/* Dynamic Notification Toast */}
      {notification && (
        <div className={`fixed top-24 right-8 z-50 p-4 rounded-xl shadow-2xl animate-in slide-in-from-right-4 duration-300 flex items-center gap-3 border
          ${notification.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400' : 
            notification.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400' : 
            'bg-primary/10 border-primary/20 text-primary'}`}
        >
          <div className={`w-2 h-2 rounded-full ${notification.type === 'success' ? 'bg-green-500' : notification.type === 'error' ? 'bg-red-500' : 'bg-primary'}`} />
          <span className="font-medium text-sm">{notification.message}</span>
        </div>
      )}

      {/* Stock Movement Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 border border-black/10 dark:border-white/10 p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 outline-none">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Stock {showModal === 'IN' ? 'In (Add)' : 'Out (Remove)'}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 font-medium">Log a new inventory movement record.</p>
            
            <form onSubmit={handleStockSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Product</label>
                <select 
                  required
                  value={formData.product}
                  onChange={(e) => setFormData({...formData, product: e.target.value})}
                  className="dropdown-field"
                >
                  <option value="" className="dark:bg-gray-900">Select a product</option>
                  {products.map(p => (
                    <option key={p._id} value={p._id} className="dark:bg-gray-900">{p.name} (SKU: {p.sku})</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Quantity (Units)</label>
                <input 
                  type="number"
                  required
                  min="1"
                  placeholder="e.g. 10"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-gray-900 dark:text-white"
                />
              </div>

              {showModal === 'IN' && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Supplier <span className="text-red-500 font-normal">(Required)</span></label>
                  <select 
                    required
                    value={formData.supplier}
                    onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                    className="dropdown-field"
                  >
                    <option value="" className="dark:bg-gray-900">Select a supplier</option>
                    {suppliers.map(s => (
                      <option key={s._id} value={s._id} className="dark:bg-gray-900">{s.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowModal(null)}
                  className="flex-1 px-4 py-3 font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 px-4 py-3 font-bold text-white rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50
                    ${showModal === 'IN' ? 'bg-primary hover:bg-blue-600 shadow-primary/25' : 'bg-red-500 hover:bg-red-600 shadow-red-500/25'}`}
                >
                  {isSubmitting ? 'Processing...' : 'Confirm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">Inventory Operations</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage stock movements and view history.</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => fetchMovements(true)}
            disabled={isSyncing}
            className="flex items-center justify-center gap-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 text-gray-900 dark:text-white font-medium py-2.5 px-5 rounded-xl transition-all disabled:opacity-50"
          >
            <RefreshCcw className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync'}
          </button>
          <button 
            onClick={() => handleStockAction('OUT')}
            className="flex items-center justify-center gap-2 bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 dark:border-red-500/30 hover:bg-red-500/20 dark:hover:bg-red-500/30 font-medium py-2.5 px-5 rounded-xl transition-all active:scale-95"
          >
            <ArrowUpFromLine className="w-5 h-5" />
            Stock Out
          </button>
          <button 
            onClick={() => handleStockAction('IN')}
            className="flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 text-white font-medium py-2.5 px-5 rounded-xl transition-all shadow-lg shadow-primary/25 active:scale-95"
          >
            <ArrowDownToLine className="w-5 h-5" />
            Stock In
          </button>
        </div>
      </header>

      {/* Movement Log Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-black/10 dark:border-white/10">
        <div className="p-6 border-b border-black/10 dark:border-white/10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Movements Log</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/5 dark:bg-black/40 text-gray-500 dark:text-gray-400 text-sm font-medium border-b border-black/10 dark:border-white/10">
                <th className="py-4 px-6">Type</th>
                <th className="py-4 px-6">Product</th>
                <th className="py-4 px-6 text-right">Amount</th>
                <th className="py-4 px-6">Supplier</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Processed By</th>
                <th className="py-4 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-gray-500">Loading inventory logs...</td>
                </tr>
              ) : movements.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-gray-500">No movements recorded yet.</td>
                </tr>
              ) : (
                movements.map((mov) => (
                  <tr key={mov._id} className="text-gray-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold
                        ${mov.type === 'IN' ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20' : 
                          'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'}`}
                      >
                        {mov.type === 'IN' ? <ArrowDownToLine className="w-3 h-3" /> : <ArrowUpFromLine className="w-3 h-3" />}
                        {mov.type}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-medium text-gray-900 dark:text-white">{mov.productName || (mov.product && mov.product.name)}</td>
                    <td className={`py-4 px-6 text-right font-bold ${mov.type === 'IN' ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                      {mov.type === 'IN' ? '+' : '-'}{mov.amount}
                    </td>
                    <td className="py-4 px-6 text-sm italic">
                      {mov.type === 'OUT' ? (
                        <span className="text-gray-400 dark:text-gray-500">Internal Action</span>
                      ) : (
                        mov.supplierName || 'N/A'
                      )}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500 dark:text-gray-400">{new Date(mov.date).toLocaleString()}</td>
                    <td className="py-4 px-6 text-sm">{mov.processedByName || (mov.processedBy && mov.processedBy.name)}</td>
                    <td className="py-4 px-6 text-sm text-gray-500 dark:text-gray-400">{mov.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
