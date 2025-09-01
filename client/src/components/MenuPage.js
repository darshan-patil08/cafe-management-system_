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

  // Ensure Menu page always starts at the top and disable browser's automatic scroll restoration
  useEffect(() => {
    let prevRestoration;
    if (typeof window !== 'undefined' && window.history && 'scrollRestoration' in window.history) {
      prevRestoration = window.history.scrollRestoration;
      try { window.history.scrollRestoration = 'manual'; } catch {}
    }
    // Scroll to top immediately and again in a microtask to cover different mount timings
    try { window.scrollTo({ top: 0, left: 0, behavior: 'auto' }); } catch {}
    const id = setTimeout(() => { try { window.scrollTo(0, 0); } catch {} }, 0);
    return () => {
      clearTimeout(id);
      if (typeof window !== 'undefined' && prevRestoration) {
        try { window.history.scrollRestoration = prevRestoration; } catch {}
      }
    };
  }, []);

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
      price: 199,
      category: 'coffee',
      image: "https://images.unsplash.com/photo-1579992357154-faf4bde95b3d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZXNwcmVzc298ZW58MHx8MHx8fDA%3D",
      description: "Rich, concentrated coffee shot with perfect crema",
      prepTime: "1–2",
      ingredients: ["Finely ground coffee", "Hot water"],
      nutrition: { calories: '5 kcal', protein: '0g', carbs: '1g', fat: '0g', sugar: '0g', caffeine: '80mg' }
    },
    {
      id: 2,
      name: "Cappuccino",
      price: 259,
      category: 'coffee',
      image: "https://images.unsplash.com/photo-1710173472469-9d28e977914c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fENhcHB1Y2Npbm98ZW58MHx8MHx8fDA%3D",
      description: "Espresso with steamed milk and thick foam",
      prepTime: "3–5",
      ingredients: ["Espresso", "Steamed milk", "Thick milk foam"],
      nutrition: { calories: '120 kcal', protein: '6g', carbs: '10g', fat: '6g', sugar: '9g', caffeine: '80mg' }
    },
    {
      id: 3,
      name: "Latte",
      price: 289,
      category: 'coffee',
      image: "https://images.unsplash.com/photo-1561882468-9110e03e0f78?auto=format&fit=crop&w=1200&q=90",
      description: "Smooth espresso with steamed milk and light foam",
      prepTime: "3–5",
      ingredients: ["Espresso shot", "Steamed milk", "Milk foam"],
      nutrition: { calories: '190 kcal', protein: '12g', carbs: '19g', fat: '7g', sugar: '18g', caffeine: '80mg' }
    },
    {
      id: 4,
      name: "Americano",
      price: 215,
      category: 'coffee',
      image: "https://images.unsplash.com/photo-1551030173-122aabc4489c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Espresso with hot water for a clean, strong taste",
      prepTime: "2–3",
      ingredients: ["Espresso shot", "Hot water"],
      nutrition: { calories: '15 kcal', protein: '0g', carbs: '2g', fat: '0g', sugar: '0g', caffeine: '80mg' }
    },
    {
      id: 5,
      name: "Iced Coffee",
      price: 239,
      category: 'coffee',
      image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=1200&q=90",
      description: "Refreshing cold brew coffee served over ice",
      prepTime: "2–3",
      ingredients: ["Brewed coffee", "Ice cubes", "Optional milk/syrup"],
      nutrition: { calories: '80 kcal', protein: '1g', carbs: '20g', fat: '0g', sugar: '15g', caffeine: '150mg' }
    },
    {
      id: 6,
      name: "Mocha",
      price: 349,
      category: 'coffee',
      image: "https://plus.unsplash.com/premium_photo-1668970851336-6c81cc888ba7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8TW9jaGF8ZW58MHx8MHx8fDA%3D",
      description: "Rich espresso with chocolate and steamed milk",
      prepTime: "4–6",
      ingredients: ["Espresso", "Steamed milk", "Chocolate syrup", "Whipped cream"],
      nutrition: { calories: '290 kcal', protein: '10g', carbs: '35g', fat: '12g', sugar: '27g', caffeine: '90mg' }
    },
    {
      id: 7,
      name: "Macchiato",
      price: 359,
      category: 'coffee',
      image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=1200&q=90",
      description: "Espresso with a dollop of foamed milk",
      prepTime: "2–3",
      ingredients: ["Espresso", "Small amount of milk foam"],
      nutrition: { calories: '100 kcal', protein: '5g', carbs: '10g', fat: '5g', sugar: '8g', caffeine: '80mg' }
    },
    
    // Tea Items
    {
      id: 8,
      name: "Earl Grey Tea",
      price: 249,
      category: 'tea',
      image: "https://images.unsplash.com/photo-1744160252607-1f195a3564c2?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Classic black tea with bergamot oil",
      prepTime: "3–4",
      ingredients: ["Black tea leaves", "Bergamot oil", "Hot water"],
      nutrition: { calories: '0 kcal', protein: '0g', carbs: '0g', fat: '0g', sugar: '0g', caffeine: '40mg' }
    },
    {
      id: 9,
      name: "Green Tea Latte",
      price: 299,
      category: 'tea',
      image: "https://plus.unsplash.com/premium_photo-1673459683998-c6f7e2804f92?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8R3JlZW4lMjBUZWElMjBMYXR0ZXxlbnwwfHwwfHx8MA%3D%3D",
      description: "Matcha green tea with steamed milk",
      prepTime: "3–4",
      ingredients: ["Matcha green tea powder", "Steamed milk", "Sweetener"],
      nutrition: { calories: '190 kcal', protein: '8g', carbs: '28g', fat: '5g', sugar: '25g', caffeine: '70mg' }
    },
    {
      id: 10,
      name: "Chamomile Tea",
      price: 250,
      category: 'tea',
      image: "https://images.unsplash.com/photo-1654713803623-3d2b9d39f6b3?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Soothing herbal tea perfect for relaxation",
      prepTime: "4–5",
      ingredients: ["Chamomile flowers", "Hot water"],
      nutrition: { calories: '0–2 kcal', protein: '0g', carbs: '0g', fat: '0g', sugar: '0g', caffeine: '0mg' }
    },
    {
      id: 11,
      name: "Chai Latte",
      price: 99,
      category: 'tea',
      image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=1200&q=90",
      description: "Spiced tea blend with steamed milk and foam",
      prepTime: "4–6",
      ingredients: ["Black tea", "Milk", "Chai spices (cinnamon, ginger, cardamom)", "Sugar"],
      nutrition: { calories: '200 kcal', protein: '7g', carbs: '33g', fat: '5g', sugar: '32g', caffeine: '50mg' }
    },
    
    // Pastries
    {
      id: 12,
      name: "Croissant",
      price: 350,
      category: 'pastry',
      image: "https://plus.unsplash.com/premium_photo-1670333242784-46b220ef90a2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fENyb2lzc2FudHxlbnwwfHwwfHx8MA%3D%3D",
      description: "Buttery, flaky French pastry",
      prepTime: "5–7",
      ingredients: ["Flour", "Butter", "Yeast", "Milk", "Sugar", "Salt"],
      nutrition: { calories: '~270 kcal', protein: '6g', carbs: '31g', fat: '14g', sugar: '6g', caffeine: '0mg' }
    },
    {
      id: 13,
      name: "Blueberry Muffin",
      price: 270,
      category: 'pastry',
      image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Qmx1ZWJlcnJ5JTIwTXVmZmlufGVufDB8fDB8fHww",
      description: "Fresh baked muffin with wild blueberries",
      prepTime: "2–3",
      ingredients: ["Flour", "Blueberries", "Sugar", "Butter", "Eggs", "Baking powder"],
      nutrition: { calories: '~380 kcal', protein: '6g', carbs: '53g', fat: '16g', sugar: '35g', caffeine: '0mg' }
    },
    {
      id: 14,
      name: "Chocolate Croissant",
      price: 299,
      category: 'pastry',
      image: "https://media.istockphoto.com/id/624138466/photo/chocolate-drizzled-croissants.webp?a=1&b=1&s=612x612&w=0&k=20&c=I0R-kLso9c3BVgsvrLCg3QEqLKXt5Aek8ZVSPLdmBuM=",
      description: "Flaky pastry filled with rich dark chocolate",
      prepTime: "5–7",
      ingredients: ["Croissant dough", "Dark chocolate", "Butter", "Sugar"],
      nutrition: { calories: '~320 kcal', protein: '6g', carbs: '36g', fat: '17g', sugar: '14g', caffeine: '6mg' }
    },
    {
      id: 15,
      name: "Cinnamon Roll",
      price: 360,
      category: 'pastry',
      image: "https://images.unsplash.com/photo-1645995575875-ea6511c9d127?q=80&w=715&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Warm, sweet roll with cinnamon and glaze",
      prepTime: "3–5",
      ingredients: ["Dough", "Cinnamon-sugar filling", "Cream cheese glaze"],
      nutrition: { calories: '~420 kcal', protein: '7g', carbs: '65g', fat: '16g', sugar: '39g', caffeine: '0mg' }
    },
    {
      id: 16,
      name: "Danish Pastry",
      price: 199,
      category: 'pastry',
      image: "https://images.unsplash.com/photo-1633785587635-a5c1df91fa90?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8RGFuaXNoJTIwUGFzdHJ5fGVufDB8fDB8fHww",
      description: "Light, flaky pastry with fruit filling",
      prepTime: "4–5",
      ingredients: ["Puff pastry dough", "Fruit/jam/cream cheese filling"],
      nutrition: { calories: '~370 kcal', protein: '6g', carbs: '45g', fat: '18g', sugar: '20g', caffeine: '0mg' }
    },
    
    // Sandwiches
    {
      id: 17,
      name: "Club Sandwich",
      price: 780,
      category: 'sandwich',
      image: "https://media.istockphoto.com/id/2182311758/photo/ultimate-club-sandwich-with-french-fries-and-sauce-served-in-basket-isolated-on-dark.webp?a=1&b=1&s=612x612&w=0&k=20&c=zuPyNW-HYMHW_S3b99ESXRPmf9bE3MUa0zay4zf1oWo=",
      description: "Triple-decker with turkey, bacon, lettuce and tomato",
      prepTime: "8–10",
      ingredients: ["Bread", "Chicken/Turkey", "Bacon", "Lettuce", "Tomato", "Mayo"],
      nutrition: { calories: '~500 kcal', protein: '28g', carbs: '45g', fat: '22g', sugar: '6g' }
    },
    {
      id: 18,
      name: "Grilled Cheese",
      price: 569,
      category: 'sandwich',
      image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=1200&q=90",
      description: "Classic grilled cheese with premium cheddar",
      prepTime: "5–7",
      ingredients: ["Bread", "Butter", "Cheese"],
      nutrition: { calories: '~400 kcal', protein: '14g', carbs: '33g', fat: '24g', sugar: '5g' }
    },
    {
      id: 19,
      name: "BLT Sandwich",
      price: 699,
      category: 'sandwich',
      image: "https://images.unsplash.com/photo-1722041220514-f6a26e286f2e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8QkxUJTIwU2FuZHdpY2h8ZW58MHx8MHx8fDA%3D",
      description: "Crispy bacon, lettuce, and tomato on toasted bread",
      prepTime: "6–8",
      ingredients: ["Bread", "Bacon", "Lettuce", "Tomato", "Mayo"],
      nutrition: { calories: '~420 kcal', protein: '19g', carbs: '37g', fat: '22g', sugar: '6g' }
    },
    {
      id: 20,
      name: "Avocado Toast",
      price: 350,
      category: 'sandwich',
      image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=1200&q=90",
      description: "Fresh avocado on artisan sourdough bread",
      prepTime: "5–7",
      ingredients: ["Whole-grain bread", "Ripe avocado", "Lemon", "Olive oil", "Salt", "Pepper"],
      nutrition: { calories: '~350 kcal', protein: '9g', carbs: '30g', fat: '22g', sugar: '5g' }
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
    // admin items merge with seed (fill missing fields)
    adminItems
      .filter(it => it && it.isAvailable !== false)
      .forEach(it => {
        const key = (it.name || '').trim().toLowerCase();
        if (!key) return;
        const base = byName.get(key) || {};
        const merged = {
          ...base,
          ...it
        };
        // Only backfill when admin field is undefined or null (not for empty arrays/strings)
        if (it.ingredients === undefined || it.ingredients === null) merged.ingredients = base.ingredients;
        if (it.nutrition === undefined || it.nutrition === null) merged.nutrition = base.nutrition;
        if (it.prepTime === undefined || it.prepTime === null) merged.prepTime = base.prepTime;
        if (it.description === undefined || it.description === null) merged.description = base.description;
        // Always prefer seed image so admin adopts menu image
        if (base.image !== undefined && base.image !== null) {
          merged.image = base.image;
        }
        if (it.category === undefined || it.category === null) merged.category = base.category;
        // Always prefer seed price so admin adopts menu price
        if (base.price !== undefined && base.price !== null) {
          merged.price = base.price;
        }
        byName.set(key, merged);
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
                      <button 
                        className="view-details-btn ripple"
                        type="button"
                        onClick={() => openDetails(item)}
                      >
                        View Details
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
                  <div className="modal-body-content">
                    <h3>{detailsItem.name}</h3>
                    {detailsItem.description && (
                      <p className="modal-desc">{detailsItem.description}</p>
                    )}
                    <div className="modal-meta">
                      {detailsItem.category && (
                        <span className="badge category">{detailsItem.category}</span>
                      )}
                      {typeof detailsItem.prepTime !== 'undefined' && detailsItem.prepTime !== null && (
                        <span className="badge prep">Prep: {detailsItem.prepTime} min</span>
                      )}
                      <span className="badge allergens">Allergens: {(detailsItem.allergens && detailsItem.allergens.length)
                        ? detailsItem.allergens.join(', ')
                        : 'N/A'}</span>
                    </div>

                    <div className="modal-section">
                      <h4>Ingredients</h4>
                      {detailsItem.ingredients && detailsItem.ingredients.length ? (
                        <ul>
                          {detailsItem.ingredients.map((ing, idx) => (
                            <li key={idx}>{ing}</li>
                          ))}
                        </ul>
                      ) : (
                        <ul>
                          <li>Information not available</li>
                        </ul>
                      )}
                    </div>

                    <div className="modal-section nutrition">
                      <h4>Nutrition Facts</h4>
                      <div className="nutrition-grid">
                        {detailsItem.nutrition && Object.keys(detailsItem.nutrition).length ? (
                          Object.entries(detailsItem.nutrition).map(([k, v]) => (
                            <div key={k} className="nutrition-item">
                              <span className="label">{k.charAt(0).toUpperCase() + k.slice(1)}</span>
                              <span className="value">{v}{typeof v === 'number' && k !== 'caffeine' ? 'g' : ''}</span>
                            </div>
                          ))
                        ) : (
                          <div className="nutrition-item">
                            <span className="label">Details</span>
                            <span className="value">Not available</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <div className="price">{formatINR(Number(detailsItem.price))}</div>
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
