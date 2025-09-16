    import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useCart } from '../context/AppContext';
import { useMenu } from '../context/MenuContext';
import { formatINR } from '../utils/currency';
import CheckoutModal from './CheckoutModal';

const MenuPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleItems, setVisibleItems] = useState(new Set());
  const [showCheckout, setShowCheckout] = useState(false);
  const { addToCart, cartItems, updateQuantity, clearCart } = useCart();
  const { menuItems } = useMenu();
  const observerRef = useRef();
  
  const handleUpdateQuantity = (item, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(item, newQuantity);
  };
  
  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty. Please add items before checkout.');
      return;
    }
    setShowCheckout(true);
  };

  // Ensure Menu page always starts at the top and disable browser's automatic scroll restoration
  useEffect(() => {
    let prevRestoration;
    if (typeof window !== 'undefined' && window.history && 'scrollRestoration' in window.history) {
      prevRestoration = window.history.scrollRestoration;
      try { window.history.scrollRestoration = 'manual'; } catch {}
    }
    return () => {
      if (typeof window !== 'undefined' && prevRestoration) {
        try { window.history.scrollRestoration = prevRestoration; } catch {}
      }
    };
  }, []);


  // Items from shared MenuContext
  const combinedItems = useMemo(() => {
    // Include all items; availability will be shown via badge
    return (menuItems || []);
  }, [menuItems]);

  // Build dynamic categories based on combined items
  const iconMap = {
    coffee: '☕',
    tea: '🍵',
    pastry: '🥐',
    sandwich: '🥪'
  };

  const categories = useMemo(() => {
    const set = new Set(combinedItems.map(i => i.category));

    const dynamic = Array.from(set).filter(Boolean).map(id => ({
      id,
      name: id.charAt(0).toUpperCase() + id.slice(1),
      icon: iconMap[id] || '🍽️'
    }));
    return [{ id: 'all', name: 'All Items', icon: '🍽️' }, ...dynamic];
  }, [combinedItems]);

  const filteredItems = useMemo(() => {
    return combinedItems.filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [combinedItems, selectedCategory, searchTerm]);

  // Refresh AOS when filtered items change so first two animate without delay
  useEffect(() => {
    if (typeof window !== 'undefined' && window.AOS && typeof window.AOS.refresh === 'function') {
      // small microtask to ensure DOM is updated
      setTimeout(() => window.AOS.refresh(), 0);
    }
  }, [filteredItems]);

  // Intersection Observer for scroll animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const itemId = entry.target.getAttribute('data-item-id');
            if (itemId) {
              setVisibleItems(prev => {
                if (prev.has(itemId)) return prev;
                const next = new Set(prev);
                next.add(itemId);
                return next;
              });
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Note: We intentionally do NOT use an effect to force-show first two items to avoid timing/flicker.
  // We render first two as visible by default; observer will reveal the rest smoothly.

  // Observe items when they mount
  const handleItemRef = (element, itemId) => {
    if (element) {
      element.setAttribute('data-item-id', itemId);
      if (observerRef.current) {
        observerRef.current.observe(element);
      }
    }
  };

  // Debug render log
  console.log('[RENDER] MenuPage');

  return (
    <div className="kaffix-menu">
      <div className="container">
        {/* Menu Header */}
        <div className="menu-header" data-aos="fade-up">
          <span className="section-badge">Our Menu</span>
          <h1>Discover Our Collection</h1>
          <p>Premium beverages and fresh pastries made with love</p>
        </div>

        {/* Search Bar */}
        <div className="menu-search" data-aos="fade-up" data-aos-delay="100">
          <input
            type="text"
            placeholder="Search for your favorite..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Category Filter */}
        <div className="category-filter" data-aos="fade-up" data-aos-delay="150">
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
        <div className="menu-items">
          <div className="menu-grid">
            {filteredItems.map((item, index) => {
              const itemId = item.id || item._id || `${item.name}-${index}`;
              const isFirstTwo = index < 2;
              const isVisible = isFirstTwo || visibleItems.has(itemId);

              return (
                <div 
                  key={itemId} 
                  ref={(el) => handleItemRef(el, itemId)}
                  className={`menu-item-card ${isVisible ? 'animate-in' : 'animate-out'}`}
                  style={{
                    animationDelay: index < 2 ? '0ms' : `${index * 50}ms`
                  }}
                  {...(index < 2 
                    ? { 'data-aos': 'zoom-in', 'data-aos-delay': 0, 'data-aos-offset': 0, 'data-aos-once': 'true' } 
                    : { 'data-aos': 'zoom-in', 'data-aos-delay': (index % 6) * 75 })}
                  data-first-two={index < 2}
                >
                  <div className="menu-item-image">
                    <img src={item.image} alt={item.name} loading="lazy" />
                    {typeof item.isAvailable !== 'undefined' && (
                      <span
                        className={`availability-badge ${item.isAvailable ? 'available' : 'unavailable'}`}
                      >
                        {item.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    )}
                  </div>
                  <div className="item-content">
                    <div className="item-category">{item.category}</div>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                      {item.name}
                    </h3>
                    <p>{item.description}</p>
                    <div className="item-footer">
                      <span className="item-price">{formatINR(Number(item.price))}</span>
                      <button 
                        className="add-cart-btn"
                        onClick={() => addToCart(item)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
      
      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        cartItems={cartItems}
        updateQuantity={handleUpdateQuantity}
      />
    </div>
  );
};

export default MenuPage;
