import React, { useState } from 'react';
import { useCart } from '../App';

const MenuPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { addToCart } = useCart();

  const menuItems = [
    // Coffee Items
    {
      id: 1,
      name: "Espresso",
      price: 3.99,
      category: 'coffee',
      image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=800&q=80",
      description: "Rich, concentrated coffee shot with perfect crema"
    },
    {
      id: 2,
      name: "Cappuccino",
      price: 4.49,
      category: 'coffee',
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80",
      description: "Espresso with steamed milk and thick foam"
    },
    {
      id: 3,
      name: "Latte",
      price: 4.99,
      category: 'coffee',
      image: "https://images.unsplash.com/photo-1561882468-9110e03e0f78?auto=format&fit=crop&w=800&q=80",
      description: "Smooth espresso with steamed milk and light foam"
    },
    {
      id: 4,
      name: "Americano",
      price: 3.49,
      category: 'coffee',
      image: "https://images.unsplash.com/photo-1497636577773-f1231844b336?auto=format&fit=crop&w=800&q=80",
      description: "Espresso with hot water for a clean, strong taste"
    },
    
    // Tea Items
    {
      id: 5,
      name: "Earl Grey Tea",
      price: 3.29,
      category: 'tea',
      image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80",
      description: "Classic black tea with bergamot oil"
    },
    {
      id: 6,
      name: "Green Tea Latte",
      price: 4.49,
      category: 'tea',
      image: "https://images.unsplash.com/photo-1563822249548-bee6269d4177?auto=format&fit=crop&w=800&q=80",
      description: "Matcha green tea with steamed milk"
    },
    
    // Pastries
    {
      id: 7,
      name: "Croissant",
      price: 3.99,
      category: 'pastry',
      image: "https://images.unsplash.com/photo-1555507036-ab794f4ec4d7?auto=format&fit=crop&w=800&q=80",
      description: "Buttery, flaky French pastry"
    },
    {
      id: 8,
      name: "Blueberry Muffin",
      price: 3.49,
      category: 'pastry',
      image: "https://images.unsplash.com/photo-1586985289906-406988974504?auto=format&fit=crop&w=800&q=80",
      description: "Fresh baked muffin with wild blueberries"
    }
  ];

  const categories = [
    { id: 'all', name: 'All Items', icon: '🍽️' },
    { id: 'coffee', name: 'Coffee', icon: '☕' },
    { id: 'tea', name: 'Tea', icon: '🍵' },
    { id: 'pastry', name: 'Pastries', icon: '🥐' },
    { id: 'sandwich', name: 'Sandwiches', icon: '🥪' }
  ];

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="kaffix-menu">
      <div className="container">
        {/* Menu Header */}
        <div className="menu-header">
          <span className="section-badge">Our Menu</span>
          <h1>Discover Our Collection</h1>
          <p>Premium beverages and fresh pastries made with love</p>
        </div>

        {/* Search Bar */}
        <div className="menu-search">
          <input
            type="text"
            placeholder="Search for your favorite..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Category Filter */}
        <div className="category-filter">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
              data-aos="zoom-in"
              data-aos-delay="100"
            >
              <span className="category-icon">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>

        {/* Menu Items Grid */}
        <div className="menu-items" data-aos="fade-up">
          <div className="menu-grid">
            {filteredItems.map((item, index) => (
              <div 
                key={item.id} 
                className="menu-item-card"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="item-image">
                  <img src={item.image} alt={item.name} />
                  <div className="item-overlay">
                    <button className="view-details-btn">View Details</button>
                  </div>
                </div>
                <div className="item-content">
                  <div className="item-category">{item.category}</div>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <div className="item-footer">
                    <span className="item-price">${item.price}</span>
                    <button 
                      className="add-cart-btn"
                      onClick={() => addToCart(item)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
