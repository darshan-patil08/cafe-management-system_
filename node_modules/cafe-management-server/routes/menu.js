const express = require('express');
const MenuItem = require('../models/MenuItem');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Menu routes working!' });
});

// Get all available menu items (public)
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = { isAvailable: true };
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const menuItems = await MenuItem.find(query)
      .sort({ category: 1, name: 1 });
    
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching menu items' });
  }
});

// Get menu categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await MenuItem.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories' });
  }
});

// Admin: Get all menu items (including unavailable)
router.get('/admin', authenticate, requireAdmin, async (req, res) => {
  try {
    const { category, search, availability } = req.query;
    let query = {};
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (availability && availability !== 'all') {
      query.isAvailable = availability === 'available';
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const menuItems = await MenuItem.find(query)
      .sort({ createdAt: -1 });
    
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching menu items' });
  }
});

// Admin: Get single menu item
router.get('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching menu item' });
  }
});

// Admin: Create menu item
router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const menuItemData = req.body;
    
    // Validate required fields
    if (!menuItemData.name || !menuItemData.description || !menuItemData.price || !menuItemData.category) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Create menu item
    const menuItem = new MenuItem(menuItemData);
    await menuItem.save();
    
    res.status(201).json({ 
      message: 'Menu item created successfully',
      menuItem 
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: Object.keys(error.errors).map(key => ({
          field: key,
          message: error.errors[key].message
        }))
      });
    }
    res.status(500).json({ message: 'Error creating menu item' });
  }
});

// Admin: Update menu item
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    res.json({ 
      message: 'Menu item updated successfully',
      menuItem 
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: Object.keys(error.errors).map(key => ({
          field: key,
          message: error.errors[key].message
        }))
      });
    }
    res.status(500).json({ message: 'Error updating menu item' });
  }
});

// Admin: Toggle availability
router.patch('/:id/availability', authenticate, requireAdmin, async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    menuItem.isAvailable = !menuItem.isAvailable;
    await menuItem.save();
    
    res.json({ 
      message: `Menu item ${menuItem.isAvailable ? 'enabled' : 'disabled'}`,
      menuItem 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating availability' });
  }
});

// Admin: Update special offer
router.patch('/:id/special-offer', authenticate, requireAdmin, async (req, res) => {
  try {
    const { isActive, discountPercentage, validUntil } = req.body;
    
    const menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      {
        'specialOffer.isActive': isActive,
        'specialOffer.discountPercentage': discountPercentage,
        'specialOffer.validUntil': validUntil ? new Date(validUntil) : undefined
      },
      { new: true }
    );
    
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    res.json({ 
      message: 'Special offer updated successfully',
      menuItem 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating special offer' });
  }
});

// Admin: Delete menu item
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
    
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    res.json({ 
      message: 'Menu item deleted successfully',
      menuItem 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting menu item' });
  }
});

module.exports = router;
