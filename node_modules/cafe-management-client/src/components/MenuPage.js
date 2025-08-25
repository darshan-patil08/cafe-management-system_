  import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useCart } from '../context/AppContext';
import { formatINR } from '../utils/currency';

const MenuPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleItems, setVisibleItems] = useState(new Set());
  const [detailsItem, setDetailsItem] = useState(null); // modal item
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToCart } = useCart();
  const observerRef = useRef();

  // Modal controls
  const openDetails = (item) => {
    setDetailsItem(item);
    setIsModalOpen(true);
    // prevent background scroll
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  };

  const closeDetails = () => {
    setIsModalOpen(false);
    setDetailsItem(null);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  };

  // Close on ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') closeDetails();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);
  

  // Default seed items (shown alongside admin-created items)
  const menuItems = useMemo(() => ([
    // Coffee Items
    {
      id: 1,
      name: "Espresso",
      price: 3.99,
      category: 'coffee',
      image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=1200&q=90",
      description: "Rich, concentrated coffee shot with perfect crema"
    },
    {
      id: 2,
      name: "Cappuccino",
      price: 4.49,
      category: 'coffee',
      image: "https://images.unsplash.com/photo-1473923377535-0002805f57e8?q=80&w=1308&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Espresso with steamed milk and thick foam"
    },
    {
      id: 3,
      name: "Latte",
      price: 4.99,
      category: 'coffee',
      image: "https://images.unsplash.com/photo-1561882468-9110e03e0f78?auto=format&fit=crop&w=1200&q=90",
      description: "Smooth espresso with steamed milk and light foam"
    },
    {
      id: 4,
      name: "Americano",
      price: 3.49,
      category: 'coffee',
      image: "https://images.unsplash.com/photo-1551030173-122aabc4489c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Espresso with hot water for a clean, strong taste"
    },
    {
      id: 5,
      name: "Iced Coffee",
      price: 3.99,
      category: 'coffee',
      image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=1200&q=90",
      description: "Refreshing cold brew coffee served over ice"
    },
    {
      id: 6,
      name: "Mocha",
      price: 5.49,
      category: 'coffee',
      image: "https://plus.unsplash.com/premium_photo-1668970851336-6c81cc888ba7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8TW9jaGF8ZW58MHx8MHx8fDA%3D",
      description: "Rich espresso with chocolate and steamed milk"
    },
    {
      id: 7,
      name: "Macchiato",
      price: 4.29,
      category: 'coffee',
      image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=1200&q=90",
      description: "Espresso with a dollop of foamed milk"
    },
    
    // Tea Items
    {
      id: 8,
      name: "Earl Grey Tea",
      price: 3.29,
      category: 'tea',
      image: "https://images.unsplash.com/photo-1744160252607-1f195a3564c2?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Classic black tea with bergamot oil"
    },
    {
      id: 9,
      name: "Green Tea Latte",
      price: 4.49,
      category: 'tea',
      image: "https://plus.unsplash.com/premium_photo-1673459683998-c6f7e2804f92?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8R3JlZW4lMjBUZWElMjBMYXR0ZXxlbnwwfHwwfHx8MA%3D%3D",
      description: "Matcha green tea with steamed milk"
    },
    {
      id: 10,
      name: "Chamomile Tea",
      price: 3.19,
      category: 'tea',
      image: "https://images.unsplash.com/photo-1654713803623-3d2b9d39f6b3?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Soothing herbal tea perfect for relaxation"
    },
    {
      id: 11,
      name: "Chai Latte",
      price: 4.79,
      category: 'tea',
      image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=1200&q=90",
      description: "Spiced tea blend with steamed milk and foam"
    },
    
    // Pastries
    {
      id: 12,
      name: "Croissant",
      price: 3.99,
      category: 'pastry',
      image: "https://plus.unsplash.com/premium_photo-1670333242784-46b220ef90a2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fENyb2lzc2FudHxlbnwwfHwwfHx8MA%3D%3D",
      description: "Buttery, flaky French pastry"
    },
    {
      id: 13,
      name: "Blueberry Muffin",
      price: 3.49,
      category: 'pastry',
      image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Qmx1ZWJlcnJ5JTIwTXVmZmlufGVufDB8fDB8fHww",
      description: "Fresh baked muffin with wild blueberries"
    },
    {
      id: 14,
      name: "Chocolate Croissant",
      price: 4.29,
      category: 'pastry',
      image: "https://media.istockphoto.com/id/624138466/photo/chocolate-drizzled-croissants.webp?a=1&b=1&s=612x612&w=0&k=20&c=I0R-kLso9c3BVgsvrLCg3QEqLKXt5Aek8ZVSPLdmBuM=",
      description: "Flaky pastry filled with rich dark chocolate"
    },
    {
      id: 15,
      name: "Cinnamon Roll",
      price: 4.49,
      category: 'pastry',
      image: "https://images.unsplash.com/photo-1645995575875-ea6511c9d127?q=80&w=715&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Warm, sweet roll with cinnamon and glaze"
    },
    {
      id: 16,
      name: "Danish Pastry",
      price: 3.79,
      category: 'pastry',
      image: "https://images.unsplash.com/photo-1633785587635-a5c1df91fa90?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8RGFuaXNoJTIwUGFzdHJ5fGVufDB8fDB8fHww",
      description: "Light, flaky pastry with fruit filling"
    },
    
    // Sandwiches
    {
      id: 17,
      name: "Club Sandwich",
      price: 8.99,
      category: 'sandwich',
      image: "https://media.istockphoto.com/id/2182311758/photo/ultimate-club-sandwich-with-french-fries-and-sauce-served-in-basket-isolated-on-dark.webp?a=1&b=1&s=612x612&w=0&k=20&c=zuPyNW-HYMHW_S3b99ESXRPmf9bE3MUa0zay4zf1oWo=",
      description: "Triple-decker with turkey, bacon, lettuce and tomato"
    },
    {
      id: 18,
      name: "Grilled Cheese",
      price: 6.49,
      category: 'sandwich',
      image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=1200&q=90",
      description: "Classic grilled cheese with premium cheddar"
    },
    {
      id: 19,
      name: "BLT Sandwich",
      price: 7.99,
      category: 'sandwich',
      image: "https://images.unsplash.com/photo-1722041220514-f6a26e286f2e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8QkxUJTIwU2FuZHdpY2h8ZW58MHx8MHx8fDA%3D",
      description: "Crispy bacon, lettuce, and tomato on toasted bread"
    },
    {
      id: 20,
      name: "Avocado Toast",
      price: 7.49,
      category: 'sandwich',
      image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=1200&q=90",
      description: "Fresh avocado on artisan sourdough bread"
    }
  ]), []);

  // Load admin-created items from localStorage
  const [adminItems, setAdminItems] = useState([]);

  useEffect(() => {
    const load = () => {
      try {
        const saved = localStorage.getItem('admin_menu_items');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setAdminItems(parsed);
        } else {
          setAdminItems([]);
        }
      } catch (e) {
        console.error('Failed to load admin menu items for customer menu', e);
      }
    };

    load();

    const onStorage = (e) => {
      if (e.key === 'admin_menu_items') load();
    };
    const onFocus = () => load();
    const onVisibility = () => { if (!document.hidden) load(); };

    window.addEventListener('storage', onStorage);
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);


  // Combine defaults with admin items; hide explicitly unavailable; de-dupe by name (admin overrides)
  const combinedItems = useMemo(() => {
    const byName = new Map();
    // seed defaults first
    menuItems.forEach(it => {
      const key = (it.name || '').trim().toLowerCase();
      if (key) byName.set(key, it);
    });
    // admin items override if same name
    adminItems
      .filter(it => it && it.isAvailable !== false)
      .forEach(it => {
        const key = (it.name || '').trim().toLowerCase();
        if (key) byName.set(key, it);
      });
    return Array.from(byName.values());
  }, [adminItems, menuItems]);

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
              const itemId = item._id || item.id || `${item.name}-${index}`;
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
                  <div className="item-image">
                    <img src={item.image} alt={item.name} loading="lazy" />
                    <div className="item-overlay">
                      <button 
                        className="view-details-btn ripple"
                        type="button"
                        onClick={() => openDetails(item)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                  <div className="item-content">
                    <div className="item-category">{item.category}</div>
                    <h3>{item.name}</h3>
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

        {/* Details Modal */}
        {isModalOpen && detailsItem && (
          <div className="modal-backdrop" onClick={(e) => {
            if (e.target.classList.contains('modal-backdrop')) closeDetails();
          }}>
            <div className="modal-card" role="dialog" aria-modal="true" aria-label={`${detailsItem.name} details`}>
              <button className="modal-close" aria-label="Close" onClick={closeDetails}>×</button>
              <div className="modal-content">
                <div className="modal-image">
                  <img src={detailsItem.image} alt={detailsItem.name} />
                </div>
                <div className="modal-body">
                  <h3>{detailsItem.name}</h3>
                  {detailsItem.description && (
                    <p className="modal-desc">{detailsItem.description}</p>
                  )}
                  <div className="modal-meta">
                    {detailsItem.category && (
                      <span className="badge category">{detailsItem.category}</span>
                    )}
                    {detailsItem.prepTime && (
                      <span className="badge prep">Prep: {detailsItem.prepTime} min</span>
                    )}
                    {detailsItem.allergens && detailsItem.allergens.length > 0 && (
                      <span className="badge allergens">Allergens: {detailsItem.allergens.join(', ')}</span>
                    )}
                  </div>
                  <div className="modal-footer">
                    <div className="price">₹{Number(detailsItem.price).toFixed(2)}</div>
                    <div className="modal-actions">
                      <button
                        className="primary-btn ripple"
                        type="button"
                        onMouseDown={(e) => {
                          const r = e.currentTarget.getBoundingClientRect();
                          e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`);
                          e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`);
                        }}
                        onClick={() => { addToCart(detailsItem); closeDetails(); }}
                      >
                        Add to Cart
                      </button>
                      <button className="secondary-btn" type="button" onClick={closeDetails}>Close</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;
