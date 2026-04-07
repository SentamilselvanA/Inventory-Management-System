const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
const Product = require('../models/Product');

// Get all inventory movements
router.get('/', async (req, res) => {
  try {
    const movements = await Inventory.find().populate('product').populate('processedBy').sort({ createdAt: -1 });
    res.json(movements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create an inventory movement (Stock IN or OUT)
router.post('/', async (req, res) => {
  try {
    const { type, product, amount, processedBy, productName, processedByName } = req.body;
    
    // Find the product
    const productRecord = await Product.findById(product);
    if (!productRecord) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (type === 'OUT' && productRecord.stock < amount) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    // Create the movement
    const movement = await Inventory.create({
      type,
      product,
      productName: productName || productRecord.name,
      amount,
      processedBy,
      processedByName,
      status: 'Completed'
    });

    // Update product stock
    if (type === 'IN') {
      productRecord.stock += Number(amount);
    } else if (type === 'OUT') {
      productRecord.stock -= Number(amount);
    }
    await productRecord.save();

    res.status(201).json(movement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
