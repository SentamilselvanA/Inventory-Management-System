require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const Inventory = require('./models/Inventory');
const Supplier = require('./models/Supplier');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/inventory_db';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB. Starting rich seed with Suppliers...');

    // Clear existing
    await User.deleteMany({});
    await Product.deleteMany({});
    await Inventory.deleteMany({});
    await Supplier.deleteMany({});
    console.log('Cleared existing data.');

    // Suppliers
    const suppliers = await Supplier.insertMany([
      { name: 'Global Tech Solutions', contactPerson: 'Jane Smith', email: 'jane@globaltech.com', phone: '555-0101', category: 'Electronics' },
      { name: 'Office Depot Prime', contactPerson: 'Bob Jones', email: 'bob@officedepot.com', phone: '555-0202', category: 'Furniture' },
      { name: 'Gadget Wholesale Co.', contactPerson: 'Lucy Brown', email: 'lucy@gadgetwholesale.com', phone: '555-0303', category: 'Accessories' }
    ]);
    console.log('Seeded 3 Suppliers.');

    // Users
    const users = await User.insertMany([
      { name: 'Sarah Admin', email: 'admin@nexusims.com', password: 'password123', role: 'admin' },
      { name: 'Mike Manager', email: 'manager@nexusims.com', password: 'password123', role: 'manager' },
      { name: 'Alex Staff', email: 'staff@nexusims.com', password: 'password123', role: 'staff' },
      { name: 'Emily Logistics', email: 'emily@nexusims.com', password: 'password123', role: 'manager' },
      { name: 'John Inventory', email: 'john@nexusims.com', password: 'password123', role: 'staff' },
    ]);
    console.log('Seeded 5 Users.');

    // Products
    const products = await Product.insertMany([
      { name: 'Mechanical Keyboard X-Pro', sku: 'KBD-001', category: 'Electronics', price: 129.99, stock: 145 },
      { name: 'Wireless Mouse Precision', sku: 'MOU-023', category: 'Electronics', price: 79.99, stock: 12 },
      { name: 'Ergonomic Office Chair', sku: 'CHR-105', category: 'Furniture', price: 349.00, stock: 45 },
      { name: 'USB-C Hub Multiport', sku: 'HUB-088', category: 'Accessories', price: 45.50, stock: 0 },
      { name: '4K Monitor 27-inch', sku: 'MON-210', category: 'Electronics', price: 299.00, stock: 32 },
      { name: 'Noise Cancelling Headphones', sku: 'AUD-502', category: 'Electronics', price: 199.99, stock: 88 },
      { name: 'Thunderbolt Docking Station', sku: 'ACC-112', category: 'Accessories', price: 249.00, stock: 15 },
      { name: 'LED Desk Lamp', sku: 'LGT-009', category: 'Accessories', price: 49.99, stock: 120 },
      { name: 'Standing Desk Frame', sku: 'FUR-882', category: 'Furniture', price: 499.00, stock: 8 },
      { name: 'Webcam 1080p Plus', sku: 'CAM-045', category: 'Electronics', price: 89.00, stock: 54 },
    ]);
    console.log('Seeded 10 Products.');

    // Movements (Mapping each movement to a supplier)
    const now = new Date();
    const movements = await Inventory.insertMany([
      { type: 'IN', product: products[0]._id, productName: products[0].name, amount: 50, supplier: suppliers[0]._id, supplierName: suppliers[0].name, processedBy: users[1]._id, processedByName: users[1].name, date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000) },
      { type: 'OUT', product: products[1]._id, productName: products[1].name, amount: 15, supplier: suppliers[2]._id, supplierName: suppliers[2].name, processedBy: users[2]._id, processedByName: users[2].name, date: new Date(now.getTime() - 24 * 60 * 60 * 1000) },
      { type: 'IN', product: products[4]._id, productName: products[4].name, amount: 20, supplier: suppliers[0]._id, supplierName: suppliers[0].name, processedBy: users[0]._id, processedByName: users[0].name, date: new Date(now.getTime() - 12 * 60 * 60 * 1000) },
      { type: 'OUT', product: products[3]._id, productName: products[3].name, amount: 5, supplier: suppliers[1]._id, supplierName: suppliers[1].name, processedBy: users[3]._id, processedByName: users[3].name, date: new Date(now.getTime() - 6 * 60 * 60 * 1000) },
      { type: 'IN', product: products[7]._id, productName: products[7].name, amount: 100, supplier: suppliers[2]._id, supplierName: suppliers[2].name, processedBy: users[4]._id, processedByName: users[4].name, date: new Date(now.getTime() - 2 * 60 * 60 * 1000) },
      { type: 'OUT', product: products[0]._id, productName: products[0].name, amount: 10, supplier: suppliers[0]._id, supplierName: suppliers[0].name, processedBy: users[2]._id, processedByName: users[2].name, date: new Date() },
      { type: 'IN', product: products[9]._id, productName: products[9].name, amount: 30, supplier: suppliers[0]._id, supplierName: suppliers[0].name, processedBy: users[1]._id, processedByName: users[1].name, date: new Date() },
    ]);
    console.log('Seeded 7 Inventory Movements.');

    console.log('✅ Rich Seeding with Suppliers complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
