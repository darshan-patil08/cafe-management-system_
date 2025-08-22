// client/src/pages/Menu.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import { Container, Card, Button } from '../components/styled/StyledComponents';
import axios from 'axios';
import './Menu.css';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  const categories = ['all', 'coffee', 'tea', 'pastry', 'sandwich', 'salad', 'dessert'];

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get('/api/menu');
      setMenuItems(response.data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  if (loading) {
    return (
      <Container>
        <div className="loading-spinner">Loading menu...</div>
      </Container>
    );
  }

  return (
    <Container>
      <motion.h1 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="menu-title"
      >
        Our Menu
      </motion.h1>

      {/* Category Filter */}
      <motion.div 
        className="category-filter"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'primary' : 'secondary'}
            onClick={() => setSelectedCategory(category)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Button>
        ))}
      </motion.div>

      {/* Menu Items Grid */}
      <motion.div 
        className="menu-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {filteredItems.map(item => (
            <motion.div
              key={item._id}
              variants={itemVariants}
              layout
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Card className="menu-item">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="item-image"
                />
                <div className="item-content">
                  <h3 className="item-name">{item.name}</h3>
                  <p className="item-description">{item.description}</p>
                  <div className="item-footer">
                    <span className="item-price">${item.price.toFixed(2)}</span>
                    <Button
                      variant="primary"
                      onClick={() => addToCart(item)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={!item.isAvailable}
                    >
                      {item.isAvailable ? 'Add to Cart' : 'Unavailable'}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </Container>
  );
};

export default Menu;
