import { useState, useEffect } from "react";
import { Plus, Search, MoreVertical, Edit2, Trash2 } from "lucide-react";

export default function Products({ user }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    sku: "",
    category: "Electronics",
    price: "",
    stock: "",
    supplier: ""
  });

  useEffect(() => {
    fetchProducts();
    fetchSuppliers();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setIsLoading(false);
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

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const selectedSup = suppliers.find(s => s._id === newProduct.supplier);
      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newProduct,
          price: Number(newProduct.price),
          stock: Math.floor(Number(newProduct.stock)),
          supplierName: selectedSup?.name
        })
      });

      if (res.ok) {
        setNotification({ message: "Product added successfully!", type: "success" });
        fetchProducts();
        setShowAddModal(false);
        setNewProduct({ name: "", sku: "", category: "Electronics", price: "", stock: "", supplier: "" });
      } else {
        const err = await res.json();
        setNotification({ message: err.message || "Failed to add product", type: "error" });
      }
    } catch (err) {
      setNotification({ message: "Network error", type: "error" });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`http://localhost:5000/api/products/${productToEdit._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...productToEdit,
          price: Number(productToEdit.price),
          stock: Number(productToEdit.stock)
        })
      });

      if (res.ok) {
        setNotification({ message: "Product updated successfully!", type: "success" });
        fetchProducts();
        setProductToEdit(null);
      } else {
        const err = await res.json();
        setNotification({ message: err.message || "Failed to update product", type: "error" });
      }
    } catch (err) {
      setNotification({ message: "Network error", type: "error" });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setProducts(products.filter(p => p._id !== id));
        setNotification({ message: "Product deleted", type: "success" });
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "" || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const canManageProducts = user?.role === 'admin' || user?.role === 'manager';

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

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 border border-black/10 dark:border-white/10 p-8 rounded-2xl shadow-2xl max-w-lg w-full mx-4 outline-none">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Add New Product</h3>
            
            <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Product Name</label>
                <input 
                  type="text" required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-gray-900 dark:text-white"
                  placeholder="e.g. Mechanical Keyboard"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">SKU</label>
                <input 
                  type="text" required
                  value={newProduct.sku}
                  onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-gray-900 dark:text-white font-mono"
                  placeholder="KBD-001"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Main Supplier</label>
                <select 
                  required
                  value={newProduct.supplier}
                  onChange={(e) => {
                    const sup = suppliers.find(s => s._id === e.target.value);
                    setNewProduct({
                      ...newProduct, 
                      supplier: e.target.value,
                      category: sup ? sup.category : newProduct.category
                    });
                  }}
                  className="dropdown-field"
                >
                  <option value="">Select a vendor</option>
                  {suppliers.map(s => (
                    <option key={s._id} value={s._id}>{s.name} ({s.category})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Category (Auto-fill)</label>
                <input 
                  type="text" disabled
                  value={newProduct.category}
                  className="w-full bg-gray-100 dark:bg-gray-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 outline-none text-gray-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Price (₹)</label>
                <input 
                  type="number" step="0.01" required
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-gray-900 dark:text-white"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Initial Stock (Integer Only)</label>
                <input 
                  type="number" required step="1"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({...newProduct, stock: Math.floor(e.target.value)})}
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-gray-900 dark:text-white font-bold"
                  placeholder="0"
                />
              </div>

              <div className="md:col-span-2 flex gap-3 pt-4">
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
                  {isSubmitting ? 'Creating...' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {productToEdit && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 border border-black/10 dark:border-white/10 p-8 rounded-2xl shadow-2xl max-w-lg w-full mx-4 outline-none">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Edit Product Details</h3>
            
            <form onSubmit={handleEditSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Product Name</label>
                <input 
                  type="text" required
                  value={productToEdit.name}
                  onChange={(e) => setProductToEdit({...productToEdit, name: e.target.value})}
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">SKU</label>
                <input 
                  type="text" required
                  value={productToEdit.sku}
                  onChange={(e) => setProductToEdit({...productToEdit, sku: e.target.value})}
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-gray-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Category (Read Only)</label>
                <select 
                  disabled
                  value={productToEdit.category}
                  className="dropdown-field opacity-60 cursor-not-allowed bg-gray-100 dark:bg-gray-800"
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Price (₹)</label>
                <input 
                  type="number" step="0.01" required
                  value={productToEdit.price}
                  onChange={(e) => setProductToEdit({...productToEdit, price: e.target.value})}
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Stock Level (Read Only)</label>
                <input 
                  type="number" disabled
                  value={productToEdit.stock}
                  className="w-full bg-gray-100 dark:bg-gray-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 outline-none text-gray-500 cursor-not-allowed font-bold"
                />
              </div>

              <div className="md:col-span-2 flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setProductToEdit(null)}
                  className="flex-1 px-4 py-3 font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 font-bold text-white bg-primary hover:bg-blue-600 rounded-xl shadow-lg shadow-primary/25 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Update Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">Products Master</h1>
          <p className="text-gray-600 dark:text-gray-400">View and manage your product catalogue.</p>
        </div>
        
        {canManageProducts && (
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 text-white font-medium py-2.5 px-5 rounded-xl transition-all shadow-lg shadow-primary/25 active:scale-95"
          >
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-black/5 dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="dropdown-field !w-auto"
          >
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
            {isLoading ? (
              <tr>
                <td colSpan="7" className="py-8 text-center text-gray-500">Loading products...</td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-8 text-center text-gray-500">No products found matching your search.</td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product._id} className="text-gray-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <td className="py-4 px-6 font-medium text-gray-900 dark:text-white">{product.name}</td>
                  <td className="py-4 px-6 font-mono text-sm">{product.sku}</td>
                  <td className="py-4 px-6">{product.category}</td>
                  <td className="py-4 px-6">₹{product.price.toFixed(2)}</td>
                  <td className="py-4 px-6 font-semibold">{product.stock}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border
                      ${product.stock > 20 ? 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20' : 
                        product.stock > 0 ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20' : 
                        'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'}`}
                    >
                      {product.stock > 20 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  {canManageProducts && (
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setProductToEdit(product)}
                          className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteProduct(product._id)}
                          className="p-2 hover:bg-red-500/10 rounded-lg text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
