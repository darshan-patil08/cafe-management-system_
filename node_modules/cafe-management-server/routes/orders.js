// server/routes/orders.js
const express = require('express');
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Orders routes working!' });
});

// Create order
router.post('/', authenticate, async (req, res) => {
  try {
    const { items, orderType, tableNumber, specialInstructions } = req.body;
    
    const orderItems = [];
    let subtotal = 0;
    
    for (let item of items) {
      const menuItem = await MenuItem.findById(item.menuItem);
      if (!menuItem || !menuItem.isAvailable) {
        return res.status(400).json({ 
          message: `Item ${menuItem ? menuItem.name : 'unknown'} is not available` 
        });
      }
      
      const totalPrice = menuItem.price * item.quantity;
      subtotal += totalPrice;
      
      orderItems.push({
        menuItem: item.menuItem,
        name: menuItem.name,           // Required by your Order model
        quantity: item.quantity,
        unitPrice: menuItem.price,     // Required by your Order model  
        totalPrice: totalPrice         // Required by your Order model
      });
    }
    
    // Calculate tax (8%)
    const tax = subtotal * 0.08;
    const totalAmount = subtotal + tax;
    
    const order = new Order({
      user: req.user._id,              // Use _id consistently
      items: orderItems,
      subtotal: subtotal,              // Required by your Order model
      tax: tax,                        // Required by your Order model
      totalAmount: totalAmount,        // This will be calculated in pre-save hook
      orderType,
      tableNumber,
      specialInstructions,
      paymentInfo: {                   // Set default payment method
        method: 'cash',
        status: 'pending'
      }
    });
    
    await order.save();
    await order.populate('items.menuItem user');
    
    res.status(201).json(order);
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
});

// Get user orders
router.get('/my-orders', authenticate, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })  // Use _id consistently
      .populate('items.menuItem')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    console.error('Fetch user orders error:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// Admin: Get all orders (FIXED - don't filter by user)
router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find()                        // Get ALL orders, not filtered by user
      .populate('items.menuItem user')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    console.error('Fetch all orders error:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// Admin: Update order status
router.patch('/:id/status', authenticate, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        // Update timing based on status
        ...(status === 'ready' && { 'timing.actualReady': new Date() }),
        ...(status === 'completed' && { 'timing.completed': new Date() }),
        ...(status === 'cancelled' && { 'timing.cancelled': new Date() })
      },
      { new: true }
    ).populate('items.menuItem user');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Error updating order status' });
  }
});

// Admin: Get order statistics
router.get('/stats', authenticate, requireAdmin, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const [todayOrders, totalRevenue, statusStats] = await Promise.all([
      Order.countDocuments({ createdAt: { $gte: today, $lt: tomorrow } }),
      Order.aggregate([
        { $match: { status: { $in: ['completed'] } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      Order.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ])
    ]);
    
    res.json({
      todayOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      statusStats: statusStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {})
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Error fetching statistics' });
  }
});

module.exports = router;
