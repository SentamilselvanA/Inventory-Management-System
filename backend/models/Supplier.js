const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contactPerson: { type: String },
  email: { type: String, unique: true },
  phone: { type: String },
  category: { type: String }, // e.g., Electronics, Furniture
  address: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Supplier', supplierSchema);
