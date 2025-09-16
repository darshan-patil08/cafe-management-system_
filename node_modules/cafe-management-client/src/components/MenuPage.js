    import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { useCart } from '../context/AppContext';
import { useMenu } from '../context/MenuContext';
import { formatINR } from '../utils/currency';

const MenuPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleItems, setVisibleItems] = useState(new Set());
  const [detailsItem, setDetailsItem] = useState(null); // modal item
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToCart } = useCart();
  const { menuItems } = useMenu();
  const observerRef = useRef();

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

  // Close on ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') closeDetails();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
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
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      {detailsItem.name}
                    </h3>
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
                        ) : detailsItem.nutritionFacts ? (
                          <div className="nutrition-item">
                            <span className="label">Label</span>
                            <span className="value">{detailsItem.nutritionFacts}</span>
                          </div>
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

// Add responsive styles to Modal
const ModalContent = styled.div`
  flex-direction: row;
  @media (max-width: 768px) {
    flex-direction: column;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
  }
`;

const ModalInfo = styled.div`
  padding: 0.5rem;
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ModalActions = styled.div`
  flex-direction: row;
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.5rem;
    
    & > button {
      width: 100%;
    }
  }
`;

const NutritionInfo = styled.div`
  margin: 1rem 0;
  p {
    margin-top: 0.5rem;
    white-space: pre-wrap;
  }
`;