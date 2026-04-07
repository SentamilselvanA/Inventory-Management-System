const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
  supplierName: { type: String }
}, { timestamps: true });

// Virtual for status based on stock level
productSchema.virtual('status').get(function() {
  if (this.stock === 0) return 'Out of Stock';
  if (this.stock < 20) return 'Low Stock';
  return 'In Stock';
});

// Ensure virtuals are included when converting document to JSON
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
