import { Package, AlertCircle, ShoppingCart, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";

export default function Dashboard({ user }) {
  const [stats, setStats] = useState([
    { name: "Total Products", value: "...", icon: Package, change: "", color: "text-blue-500 dark:text-blue-400" },
    { name: "Low Stock Items", value: "...", icon: AlertCircle, change: "", color: "text-red-500 dark:text-red-400" },
    { name: "Total Suppliers", value: "N/A", icon: ShoppingCart, change: "", color: "text-purple-500 dark:text-purple-400" },
    { name: "Monthly Stock Moving", value: "...", icon: TrendingUp, change: "", color: "text-green-500 dark:text-green-400" },
  ]);
  const [recentMovements, setRecentMovements] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [notification, setNotification] = useState(null);
  const [restockingId, setRestockingId] = useState(null);
  const [restockAmount, setRestockAmount] = useState("");
  const [restockSupplier, setRestockSupplier] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [isRestocking, setIsRestocking] = useState(false);

  const fetchData = async () => {
    try {
      const [productsRes, inventoryRes, suppliersRes] = await Promise.all([
        fetch("http://localhost:5000/api/products"),
        fetch("http://localhost:5000/api/inventory"),
        fetch("http://localhost:5000/api/suppliers")
      ]);
      
      const products = await productsRes.json();
      const inventory = await inventoryRes.json();
      const suppliersData = await suppliersRes.json();
      
      const lowStock = products.filter(p => p.stock < 20);
      
      setSuppliers(suppliersData);
      const dashboardStats = [
        { name: "Total Products", value: products.length, icon: Package, change: "", color: "text-blue-500 dark:text-blue-400" },
        { name: "Low Stock Items", value: lowStock.length, icon: AlertCircle, change: "", color: "text-red-500 dark:text-red-400" },
        { name: "Total Suppliers", value: suppliersData.length, icon: ShoppingCart, change: "", color: "text-purple-500 dark:text-purple-400" },
        { name: "Total Movements", value: inventory.length, icon: TrendingUp, change: "", color: "text-green-500 dark:text-green-400" },
      ];

      setStats(user?.role === 'staff' ? dashboardStats.filter(s => s.name !== "Total Suppliers") : dashboardStats);

      setRecentMovements(inventory.slice(0, 5));
      setLowStockProducts(lowStock.slice(0, 3));
    } catch (err) {
      console.error("Dashboard failed to load stats");
    }
  };

  const handleRestock = async (e) => {
    e.preventDefault();
    if (!restockingId || !restockAmount) return;
    
    const product = lowStockProducts.find(p => p._id === restockingId);
    const selectedSupplier = suppliers.find(s => s._id === restockSupplier);
    setIsRestocking(true);
    
    try {
      const res = await fetch("http://localhost:5000/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "IN",
          product: restockingId,
          amount: Number(restockAmount),
          supplier: restockSupplier,
          supplierName: selectedSupplier?.name,
          processedBy: user?._id || "69d49898227b38d8583f0ddf",
          processedByName: user?.name || "System",
          date: new Date() // Explicitly storing date and time
        })
      });

      if (res.ok) {
        setNotification({ message: `Successfully restocked ${restockAmount} units of ${product?.name}`, type: "success" });
        fetchData();
        setRestockingId(null);
        setRestockAmount("");
        setRestockSupplier("");
      } else {
        setNotification({ message: "Failed to restock", type: "error" });
      }
    } catch (err) {
      setNotification({ message: "Network error", type: "error" });
    } finally {
      setIsRestocking(false);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      {/* Restock Prompt Modal */}
      {restockingId && !isRestocking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 border border-black/10 dark:border-white/10 p-8 rounded-2xl shadow-2xl max-w-sm w-full mx-4 outline-none">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Restock Product</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
              Enter quantity to add for <strong>{lowStockProducts.find(p => p._id === restockingId)?.name}</strong>.
            </p>
            
            <form onSubmit={handleRestock} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Select Supplier</label>
                <select 
                  required
                  value={restockSupplier}
                  onChange={(e) => setRestockSupplier(e.target.value)}
                  className="dropdown-field"
                >
                  <option value="" className="dark:bg-gray-900">Select a supplier</option>
                  {suppliers.map(s => (
                    <option key={s._id} value={s._id} className="dark:bg-gray-900">{s.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Quantity</label>
                <input 
                  type="number"
                  required
                  min="1"
                  placeholder="Quantity"
                  value={restockAmount}
                  onChange={(e) => setRestockAmount(e.target.value)}
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-gray-900 dark:text-white font-bold"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => { setRestockingId(null); setRestockAmount(""); }}
                  className="flex-1 px-4 py-3 font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-3 font-bold text-white bg-primary hover:bg-blue-600 rounded-xl shadow-lg shadow-primary/25 transition-all active:scale-95"
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-24 right-8 z-50 p-4 rounded-xl shadow-2xl animate-in slide-in-from-right-4 duration-300 flex items-center gap-3 border
          ${notification.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'}`}
        >
          <div className={`w-2 h-2 rounded-full ${notification.type === 'success' ? 'bg-green-500' : notification.type === 'error' ? 'bg-red-500' : 'bg-primary'}`} />
          <span className="font-medium text-sm">{notification.message}</span>
        </div>
      )}
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">Overview</h1>
        <p className="text-gray-600 dark:text-gray-400">Here's what's happening in your warehouse today.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="glass-panel p-6 rounded-2xl hover-glass">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-black/5 dark:bg-white/5 ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                  {stat.change}
                </span>
              </div>
              <div>
                <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</h3>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.name}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Recent Stock Movements</h2>
          <div className="space-y-4">
            {recentMovements.length === 0 ? (
              <p className="text-gray-500">No recent movements.</p>
            ) : recentMovements.map((mov, i) => (
              <div key={mov._id} className="flex items-center justify-between p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${mov.type === 'OUT' ? 'bg-red-500/10 text-red-500 dark:bg-red-500/20 dark:text-red-400' : 'bg-green-500/10 text-green-500 dark:bg-green-500/20 dark:text-green-400'}`}>
                    {mov.type === 'OUT' ? <TrendingUp className="w-5 h-5 rotate-180" /> : <TrendingUp className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-gray-900 dark:text-white font-medium">{mov.productName || (mov.product && mov.product.name)}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Processed By: {mov.processedByName || 'System'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${mov.type === 'OUT' ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400'}`}>
                    {mov.type === 'OUT' ? '-' : '+'}{mov.amount} units
                  </p>
                  <p className="text-sm text-gray-500">{new Date(mov.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Low Stock Alerts</h2>
          <div className="space-y-4">
            {lowStockProducts.length === 0 ? (
              <p className="text-gray-500">No low stock items.</p>
            ) : lowStockProducts.map((p) => (
              <div key={p._id} className="flex items-center justify-between p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                <div>
                  <h4 className="text-gray-900 dark:text-white font-medium">{p.name}</h4>
                  <p className="text-sm text-red-600 dark:text-red-300">Only {p.stock} left in stock</p>
                </div>
                <button 
                  onClick={() => setRestockingId(p._id)}
                  disabled={restockingId === p._id}
                  className="text-xs font-medium bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {restockingId === p._id && isRestocking ? '...' : 'Restock'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
