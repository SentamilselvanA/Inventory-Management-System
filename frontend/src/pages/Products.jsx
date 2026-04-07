import { useState } from "react";
import { Plus, Search, MoreVertical, Edit2, Trash2 } from "lucide-react";

export default function Products({ user }) {
  const [products] = useState([
    { id: 1, name: "Mechanical Keyboard X-Pro", sku: "KBD-001", category: "Electronics", price: "$129.99", stock: 145, status: "In Stock" },
    { id: 2, name: "Wireless Mouse Precision", sku: "MOU-023", category: "Electronics", price: "$79.99", stock: 12, status: "Low Stock" },
    { id: 3, name: "Ergonomic Office Chair", sku: "CHR-105", category: "Furniture", price: "$349.00", stock: 45, status: "In Stock" },
    { id: 4, name: "USB-C Hub Multiport", sku: "HUB-088", category: "Accessories", price: "$45.50", stock: 0, status: "Out of Stock" },
    { id: 5, name: "4K Monitor 27-inch", sku: "MON-210", category: "Electronics", price: "$299.00", stock: 32, status: "In Stock" },
  ]);

  const canManageProducts = user?.role === 'admin' || user?.role === 'manager';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">Products Master</h1>
          <p className="text-gray-600 dark:text-gray-400">View and manage your product catalogue.</p>
        </div>
        
        {canManageProducts && (
          <button className="flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 text-white font-medium py-2.5 px-5 rounded-xl transition-all shadow-lg shadow-primary/25">
            <Plus className="w-5 h-5" />
            Add New Product
          </button>
        )}
      </header>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-2xl">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search products by name or SKU..." 
            className="w-full pl-10 pr-4 py-2.5 bg-black/5 dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <select className="flex-1 sm:w-40 px-4 py-2.5 bg-black/5 dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50">
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Furniture">Furniture</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel rounded-2xl overflow-hidden overflow-x-auto border border-black/10 dark:border-white/10">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/5 dark:bg-black/40 text-gray-500 dark:text-gray-400 text-sm font-medium border-b border-black/10 dark:border-white/10">
              <th className="py-4 px-6">Product</th>
              <th className="py-4 px-6">SKU</th>
              <th className="py-4 px-6">Category</th>
              <th className="py-4 px-6">Price</th>
              <th className="py-4 px-6">Stock</th>
              <th className="py-4 px-6">Status</th>
              {canManageProducts && <th className="py-4 px-6 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 dark:divide-white/5">
            {products.map((product) => (
              <tr key={product.id} className="text-gray-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <td className="py-4 px-6 font-medium text-gray-900 dark:text-white">{product.name}</td>
                <td className="py-4 px-6 font-mono text-sm">{product.sku}</td>
                <td className="py-4 px-6">{product.category}</td>
                <td className="py-4 px-6">{product.price}</td>
                <td className="py-4 px-6 font-semibold">{product.stock}</td>
                <td className="py-4 px-6">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border
                    ${product.status === 'In Stock' ? 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20' : 
                      product.status === 'Low Stock' ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20' : 
                      'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'}`}
                  >
                    {product.status}
                  </span>
                </td>
                {canManageProducts && (
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-red-500/10 rounded-lg text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
