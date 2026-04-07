const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  type: { type: String, enum: ['IN', 'OUT'], required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: { type: String }, // Snapshot of name
  amount: { type: Number, required: true },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
  supplierName: { type: String }, // Snapshot of supplier name
  processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  processedByName: { type: String }, // Snapshot of user name
  status: { type: String, default: 'Completed' },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Inventory', inventorySchema);
