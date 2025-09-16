import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import CheckoutModal from './components/CheckoutModal';
import './styles/CheckoutModal.css';
import { CartContext, useCart } from './context/AppContext';
import axios from 'axios';
import './App.css';
import HomePage from './components/HomePage';
import MenuPage from './components/MenuPage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import Popup from './components/Popup';
import AOS from 'aos';
import 'aos/dist/aos.css';
import SiteLogo from './ChatGPT Image Aug 21, 2025, 07_57_24 PM.png';
import { formatINR } from './utils/currency';
import ScrollToTop from './components/ScrollToTop';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MenuProvider, useMenu } from './context/MenuContext';


const AppContext = createContext();

// Cart Provider
const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Load cart from localStorage on initial render
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cafeCart');
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cafeCart', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  // Use a stable key for identity: prefer _id, then id; ignore undefined keys
  const getItemKey = (obj) => (obj && (obj._id ?? obj.id)) ?? null;
  
  const addToCart = (item) => {
    setCartItems(prev => {
      const key = getItemKey(item);
      const existingItem = prev.find(ci => {
        const ciKey = getItemKey(ci);
        return ciKey !== null && key !== null && ciKey === key;
      });
      if (existingItem) {
        return prev.map(ci => {
          const ciKey = getItemKey(ci);
          return (ciKey !== null && key !== null && ciKey === key)
            ? { ...ci, quantity: ci.quantity + 1 }
            : ci;
        });
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };
  
  const removeFromCart = (itemId) => {
    setCartItems(prev => prev.filter(item => getItemKey(item) !== itemId));
  };
  
  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems(prev =>
      prev.map(item => (getItemKey(item) === itemId) ? { ...item, quantity } : item)
    );
  };
  
  const clearCart = () => setCartItems([]);
  
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems, addToCart, removeFromCart, updateQuantity, 
      clearCart, getCartTotal, getCartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

// useCart is imported from context/AppContext to ensure a single shared instance
 
// Authentication View
const AuthView = () => {
  const { setUser, setCurrentView } = useContext(AppContext);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
 
  // Basic email format validation for signup
  const validateEmail = (email) => {
    // Simple RFC5322-like regex for common cases
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    return re.test(String(email).trim());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    // Client-side validation for signup email format
    if (!isLogin) {
      if (!validateEmail(formData.email)) {
        setMessage('please enter email in proper manner');
        setMessageType('error');
        setLoading(false);
        return;
      }
    }
    
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;
      
      const response = await axios.post(`http://localhost:5000${endpoint}`, payload);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
      setUser(response.data.user);
      setCurrentView(response.data.user.role === 'admin' ? 'admin-dashboard' : 'customer-home');
      
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>☕ CafeDeluxe</h1>
          <p>Premium Coffee Experience</p>
        </div>
        
        <div className="auth-form-container">
          <h2>{isLogin ? 'Welcome Back' : 'Join Us Today'}</h2>
          
          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <div className="form-group">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  required
                />
              </div>
            )}
            
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
            
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>
          
          <div className="auth-switch">
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setMessage('');
                setFormData({ username: '', email: '', password: '' });
              }}
              className="switch-button"
            >
              {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
            </button>
          </div>
          
          {message && (
            <div className={`message ${messageType}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Admin Layout with Navigation
const AdminLayout = () => {
  const { user, currentView, setCurrentView, logout, theme, toggleTheme } = useContext(AppContext);

  return (
    <div className="admin-layout">
      <header className="main-header">
        <div className="header-content">
          <div className="logo">
            <img src={SiteLogo} alt="CafeDeluxe" className="site-logo" />
            <span className="brand-text">CafeDeluxe Admin</span>
          </div>
          <div className="user-info">
            <button 
              className="theme-toggle"
              aria-label="Toggle theme"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <span>Welcome, {user.username}</span>
            <button onClick={logout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      <nav className="admin-nav">
        <button 
          className={currentView === 'admin-dashboard' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setCurrentView('admin-dashboard')}
        >
          📊 Dashboard
        </button>
        <button 
          className={currentView === 'admin-menu' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setCurrentView('admin-menu')}
        >
          📋 Menu Management
        </button>
        <button 
          className={currentView === 'admin-orders' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setCurrentView('admin-orders')}
        >
          📦 Orders
        </button>
        <button 
          className={currentView === 'admin-users' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setCurrentView('admin-users')}
        >
          👥 Users
        </button>
        <button 
          className={currentView === 'admin-analytics' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setCurrentView('admin-analytics')}
        >
          📈 Analytics
        </button>
      </nav>

      <main className="admin-content">
        {currentView === 'admin-dashboard' && <AdminDashboard />}
        {currentView === 'admin-menu' && <AdminMenuManagement />}
        {currentView === 'admin-orders' && <AdminOrderManagement />}
        {currentView === 'admin-users' && <AdminUserManagement />}
        {currentView === 'admin-analytics' && <AdminAnalytics />}
      </main>

      <footer className="main-footer">
        <div className="footer-content">
          <p>&copy; 2025 CafeDeluxe Management System. All rights reserved.</p>
          <div className="footer-links">
            <span>Support</span> | <span>Privacy</span> | <span>Terms</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Customer Layout with Navigation
const CustomerLayout = () => {
  const { user, currentView, setCurrentView, logout, theme, toggleTheme } = useContext(AppContext);
  const { getCartCount } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);

  const navigateToSection = (sectionId) => {
    if (currentView === 'customer-home') {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      setCurrentView('customer-home');
      // Wait for HomePage to render, then scroll
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 0);
    }
  };

  useEffect(() => {
    if (user && currentView && currentView !== 'auth') {
      try { localStorage.setItem('last_view', currentView); } catch {}
    }
  }, [user, currentView]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="customer-layout">

      {/* Enhanced Navigation */}
      <nav className={`modern-nav ${isScrolled ? 'scrolled' : ''}`} style={{position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999}}>
        <div className="nav-container">
          <div className="nav-brand">
            <img src={SiteLogo} alt="CafeDeluxe" className="site-logo" />
          </div>
          
          <div className="nav-links">
            <button 
              className={currentView === 'customer-home' ? 'nav-link active' : 'nav-link'}
              onClick={() => navigateToSection('home')}
            >
              Home
            </button>
            <button 
              className={'nav-link'}
              onClick={() => navigateToSection('about')}
            >
              About
            </button>
            <button 
              className={'nav-link'}
              onClick={() => navigateToSection('menu')}
            >
              Menu
            </button>
            <button 
              className={'nav-link'}
              onClick={() => navigateToSection('contact')}
            >
              Contact
            </button>
            <button 
              className="nav-link cart-link"
              onClick={() => setCurrentView('customer-cart')}
            >
               Cart ({getCartCount()})
            </button>
          </div>
          
          <div className="nav-user">
            <button 
              className="theme-toggle"
              aria-label="Toggle theme"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <span>Hi, {user.username}</span>
            <button onClick={logout} className="logout-btn">Logout</button>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="page-content">
        {currentView === 'customer-home' && <HomePage />}
        {currentView === 'customer-about' && <AboutPage />}
        {currentView === 'customer-menu' && <MenuPage />}
        {currentView === 'customer-contact' && <ContactPage />}
        {currentView === 'customer-cart' && <CustomerCart />}
        {currentView === 'customer-orders' && <CustomerOrders />}
        {currentView === 'customer-profile' && <CustomerProfile />}
      </main>

      {/* Modern Footer */}
      <footer className="modern-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>☕ CafeDeluxe</h3>
            <p>Crafting perfect coffee experiences since 2020</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><button onClick={() => navigateToSection('home')}>Home</button></li>
              <li><button onClick={() => navigateToSection('about')}>About</button></li>
              <li><button onClick={() => navigateToSection('menu')}>Menu</button></li>
              <li><button onClick={() => navigateToSection('contact')}>Contact</button></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact Info</h4>
            <p>📍 123 Coffee Street,Surat City, Gujraty</p>
            <p>📞 (+91)9122013214</p>
            <p>📧 hello@cafedeluxe.com</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 CafeDeluxe. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

// Customer Components
const CustomerCart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  
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

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Your cart is empty</h2>
        <p>Add some delicious items from our menu!</p>
      </div>
    );
  }

  return (
    <div className="customer-cart">
      <div className="section-header">
        <h2>Your Order</h2>
        <button onClick={clearCart} className="clear-cart-btn">Clear Cart</button>
      </div>
      
      <div className="cart-items">
        {cartItems.map(item => (
          <div key={item._id || item.id} className="cart-item">
            <img src={item.image} alt={item.name} />
            <div className="item-details">
              <h4>{item.name}</h4>
              <p>{formatINR(item.price)} each</p>
            </div>
            <div className="quantity-controls">
              <button onClick={() => updateQuantity(item._id || item.id, item.quantity - 1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item._id || item.id, item.quantity + 1)}>+</button>
            </div>
            <div className="item-total">
              {formatINR(item.price * item.quantity)}
            </div>
            <button 
              className="remove-btn"
              onClick={() => removeFromCart(item._id || item.id)}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="total">
          <strong>Total: {formatINR(getCartTotal())}</strong>
        </div>
        <button 
          className="checkout-btn"
          onClick={handleProceedToCheckout}
          disabled={cartItems.length === 0}
        >
          Proceed to Checkout
        </button>
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

const CustomerOrders = () => {
  const orders = [
    {
      id: 'ORD-001',
      date: '2025-08-17',
      status: 'completed',
      total: 12.47,
      items: ['Cappuccino', 'Croissant']
    },
    {
      id: 'ORD-002',
      date: '2025-08-16',
      status: 'pending',
      total: 8.99,
      items: ['Espresso', 'Muffin']
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return '#28a745';
      case 'pending': return '#ffc107';
      case 'preparing': return '#17a2b8';
      default: return '#6c757d';
    }
  };

  return (
    <div className="kaffix-orders">
      <div className="container">
        <div className="orders-header">
          <span className="section-badge">Your Orders</span>
          <h1>Order History</h1>
          <p>Track and manage your recent orders</p>
        </div>

        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Order #{order.id}</h3>
                  <span className="order-date">{order.date}</span>
                </div>
                <div 
                  className="order-status"
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  {order.status.toUpperCase()}
                </div>
              </div>
              <div className="order-items">
                <p>{order.items.join(', ')}</p>
              </div>
              <div className="order-footer">
                <span className="order-total">Total: {formatINR(order.total)}</span>
                <button className="reorder-btn">Reorder</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CustomerProfile = () => {
  const { user } = useContext(AppContext);
  
  return (
    <div className="customer-profile">
      <div className="section-header">
        <h2>My Profile</h2>
      </div>
      
      <div className="profile-info">
        <div className="info-group">
          <label>Username:</label>
          <p>{user.username}</p>
        </div>
        
        <div className="info-group">
          <label>Email:</label>
          <p>{user.email}</p>
        </div>
        
        <div className="info-group">
          <label>Role:</label>
          <p>{user.role}</p>
        </div>
      </div>
      
      <div className="profile-actions">
        <button className="action-btn primary">Edit Profile</button>
        <button className="action-btn secondary">Change Password</button>
      </div>
    </div>
  );
};

// Admin Components (placeholders - replace with your existing ones)
const AdminDashboard = () => {
  const [stats, setStats] = useState({
    todayOrders: 12,
    totalRevenue: 1247.50,
    pendingOrders: 3,
    completedOrders: 9,
    totalMenuItems: 25,
    activeUsers: 156
  });

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h2>📊 Dashboard Overview</h2>
        <p>Monitor your cafe's performance at a glance</p>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <h3>Today's Orders</h3>
            <p className="stat-number">{stats.todayOrders}</p>
          </div>
        </div>
        
        <div className="stat-card success">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>Total Revenue</h3>
            <p className="stat-number">${stats.totalRevenue.toFixed(2)}</p>
          </div>
        </div>
        
        <div className="stat-card warning">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>Pending Orders</h3>
            <p className="stat-number">{stats.pendingOrders}</p>
          </div>
        </div>
        
        <div className="stat-card info">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>Completed Today</h3>
            <p className="stat-number">{stats.completedOrders}</p>
          </div>
        </div>

        <div className="stat-card secondary">
          <div className="stat-icon">🍽</div>
          <div className="stat-info">
            <h3>Menu Items</h3>
            <p className="stat-number">{stats.totalMenuItems}</p>
          </div>
        </div>

        <div className="stat-card info">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>Active Users</h3>
            <p className="stat-number">{stats.activeUsers}</p>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h3>⚡ Quick Actions</h3>
        <div className="action-buttons">
          {/* Use AppContext to navigate to key admin subpages */}
          {(() => { const { setCurrentView } = useContext(AppContext); return (
            <>
              <button className="action-btn primary" onClick={() => setCurrentView('admin-menu')}>📝 Add Menu Item</button>
              <button className="action-btn success" onClick={() => setCurrentView('admin-orders')}>👁 View Orders</button>
              <button className="action-btn info" onClick={() => setCurrentView('admin-analytics')}>📊 Generate Report</button>
              <button className="action-btn warning" onClick={() => setCurrentView('admin-users')}>👥 Manage Users</button>
            </>
          ); })()}
        </div>
      </div>

      <div className="recent-activity">
        <h3>📈 Recent Activity</h3>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">📦</div>
            <div className="activity-content">
              <p><strong>New Order:</strong> Cappuccino & Croissant</p>
              <span className="activity-time">2 minutes ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">👤</div>
            <div className="activity-content">
              <p><strong>User Registration:</strong> john.doe@email.com</p>
              <span className="activity-time">5 minutes ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">🍽</div>
            <div className="activity-content">
              <p><strong>Menu Update:</strong> Updated Latte price</p>
              <span className="activity-time">15 minutes ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminMenuManagement = () => {
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem } = useMenu();
  const formRef = useRef(null);

  // Using MenuContext for menu data; persistence handled by the provider
  
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filters, setFilters] = useState({
    category: 'all',
    availability: 'all',
    search: ''
  });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    isAvailable: true
  });

  // Compute categories dynamically from existing items
  const categories = useMemo(() => {
    const set = new Set(
      menuItems
        .map(i => (i.category || '').trim().toLowerCase())
        .filter(Boolean)
    );
    return Array.from(set).sort();
  }, [menuItems]);

  // Removed localStorage load/save; MenuContext persists and syncs

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      image: '',
      isAvailable: true
    });
    setEditingItem(null);
    setShowAddForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (editingItem) {
        const id = editingItem.id || editingItem._id;
        const updated = { ...editingItem, ...formData, id, price: parseFloat(formData.price) };
        await updateMenuItem(updated);
        alert('✅ Menu item updated successfully!');
      } else {
        const newItem = { ...formData, price: parseFloat(formData.price) };
        await addMenuItem(newItem);
        alert('✅ Menu item added successfully!');
      }
      resetForm();
    } catch (error) {
      console.error('Error saving menu item:', error);
      alert('❌ Error saving menu item');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setFormData({ ...item, price: item.price.toString() });
    setEditingItem(item);
    setShowAddForm(true);
    // Smoothly scroll to the edit form
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 0);
  };

  const handleDelete = (id) => {
    if (!window.confirm('⚠ Are you sure you want to delete this item?')) return;
    
    const targetId = id;
    deleteMenuItem(targetId);
    alert('✅ Menu item deleted successfully!');
  };

  const toggleAvailability = (id) => {
    const current = (menuItems || []).find(it => (it.id || it._id) === id);
    if (!current) return;
    const updated = { ...current, id: current.id || current._id, isAvailable: !current.isAvailable };
    updateMenuItem(updated);
  };
  const filteredItems = menuItems.filter(item => {
    const matchesCategory = filters.category === 'all' || item.category === filters.category;
    const matchesAvailability = filters.availability === 'all' || 
      (filters.availability === 'available' && item.isAvailable) ||
      (filters.availability === 'unavailable' && !item.isAvailable);
    const matchesSearch = item.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      item.description.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesCategory && matchesAvailability && matchesSearch;
  });

  return (
    <div className="menu-management">
      <div className="section-header">
        <div>
          <h2>🍽 Menu Management</h2>
          <p>Manage your cafe's menu items, categories, and availability</p>
        </div>
        <button 
          className="add-btn"
          onClick={() => setShowAddForm(true)}
        >
          ➕ Add New Item
        </button>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label>🏷 Category:</label>
          <select
            value={filters.category}
            onChange={(e) => setFilters({...filters, category: e.target.value})}
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>📋 Availability:</label>
          <select
            value={filters.availability}
            onChange={(e) => setFilters({...filters, availability: e.target.value})}
          >
            <option value="all">All Items</option>
            <option value="available">Available Only</option>
            <option value="unavailable">Unavailable Only</option>
          </select>
        </div>

        <div className="filter-group">
          <label>🔍 Search:</label>
          <input
            type="text"
            placeholder="Search items..."
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
          />
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="add-form-container" ref={formRef}>
          <h3>{editingItem ? '✏ Edit Menu Item' : '➕ Add New Menu Item'}</h3>
          <form onSubmit={handleSubmit} className="menu-form">
            <div className="form-row">
              <div className="form-group">
                <label>📝 Item Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Cappuccino"
                  required
                />
              </div>
              <div className="form-group">
                <label>🏷 Category *</label>
                {/* Allow typing a new category with suggestions from existing ones */}
                <input
                  list="categoryOptions"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g. coffee, tea, pastry..."
                  required
                />
                <datalist id="categoryOptions">
                  {categories.map(cat => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
              </div>
              <div className="form-group">
                <label>💰 Price (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  placeholder="4.99"
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>📄 Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Rich espresso with steamed milk..."
                rows="3"
                required
              />
            </div>
            
            <div className="form-group">
              <label>🖼 Image URL</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.isAvailable}
                  onChange={(e) => setFormData({...formData, isAvailable: e.target.checked})}
                />
                ✅ Item Available
              </label>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? '⏳ Saving...' : (editingItem ? '✏ Update Item' : '➕ Add Item')}
              </button>
              <button type="button" className="cancel-btn" onClick={resetForm}>
                ❌ Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Menu Items Grid */}
      <div className="menu-items-grid">
        {filteredItems.length === 0 ? (
          <div className="empty-state">
            <h3>🔍 No menu items found</h3>
            <p>Try adjusting your filters or add a new menu item!</p>
          </div>
        ) : (
          filteredItems.map(item => (
            <div key={item._id} className="menu-item-card">
              <div className="item-image-container">
                <img 
                  src={item.image || 'https://via.placeholder.com/300x200/8B4513/FFFFFF?text=No+Image'} 
                  alt={item.name}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200/8B4513/FFFFFF?text=No+Image';
                  }}
                />
                <div className={`availability-badge ${item.isAvailable ? 'available' : 'unavailable'}`}>
                  {item.isAvailable ? '✅ Available' : '❌ Unavailable'}
                </div>
              </div>
              
              <div className="item-details">
                <h4>{item.name}</h4>
                <p className="item-description">{item.description}</p>
                
                <div className="item-meta">
                  <div className="meta-row">
                    <span className="price">{formatINR(Number(item.price))}</span>
                    <span className={`category ${item.category}`}>
                      {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                    </span>
                  </div>
                </div>
                
                <div className="item-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => handleEdit(item)}
                  >
                    ✏ Edit
                  </button>
                  <button 
                    className={`availability-btn ${item.isAvailable ? 'set-unavailable' : 'set-available'}`}
                    onClick={() => toggleAvailability(item._id || item.id)}
                  >
                    {item.isAvailable ? 'Unavailable' : 'Available'}
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(item._id || item.id)}
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};


const AdminOrderManagement = () => {
  const [orders, setOrders] = useState([
    {
      _id: 'ORD-001',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      items: [
        { name: 'Cappuccino', quantity: 2, price: 4.49 },
        { name: 'Croissant', quantity: 1, price: 3.99 }
      ],
      total: 12.97,
      status: 'pending',
      orderDate: '2025-08-17T10:30:00Z',
      estimatedTime: 15
    },
    {
      _id: 'ORD-002',
      customerName: 'Jane Smith',
      customerEmail: 'jane@example.com',
      items: [
        { name: 'Latte', quantity: 1, price: 4.99 },
        { name: 'Muffin', quantity: 2, price: 3.49 }
      ],
      total: 11.97,
      status: 'preparing',
      orderDate: '2025-08-17T11:00:00Z',
      estimatedTime: 10
    },
    {
      _id: 'ORD-003',
      customerName: 'Mike Johnson',
      customerEmail: 'mike@example.com',
      items: [
        { name: 'Americano', quantity: 1, price: 3.49 }
      ],
      total: 3.49,
      status: 'ready',
      orderDate: '2025-08-17T11:15:00Z',
      estimatedTime: 0
    }
  ]);

  const [filterStatus, setFilterStatus] = useState('all');

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(order => 
      order._id === orderId ? { ...order, status: newStatus } : order
    ));
    alert(`✅ Order ${orderId} status updated to: ${newStatus}`);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#ffc107';
      case 'preparing': return '#17a2b8';
      case 'ready': return '#28a745';
      case 'completed': return '#6c757d';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return '⏳';
      case 'preparing': return '👨‍🍳';
      case 'ready': return '✅';
      case 'completed': return '📦';
      case 'cancelled': return '❌';
      default: return '📋';
    }
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  return (
    <div className="order-management">
      <div className="section-header">
        <div>
          <h2>📦 Order Management</h2>
          <p>Track and manage customer orders in real-time</p>
        </div>
        <div className="order-stats">
          <div className="stat-badge pending">
            ⏳ {orders.filter(o => o.status === 'pending').length} Pending
          </div>
          <div className="stat-badge preparing">
            👨‍🍳 {orders.filter(o => o.status === 'preparing').length} Preparing
          </div>
          <div className="stat-badge ready">
            ✅ {orders.filter(o => o.status === 'ready').length} Ready
          </div>
        </div>
      </div>

      <div className="filter-controls">
        <label>📋 Filter by Status:</label>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="preparing">Preparing</option>
          <option value="ready">Ready</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="orders-list">
        {filteredOrders.length === 0 ? (
          <div className="empty-state">
            <h3>📋 No orders found</h3>
            <p>No orders match the selected filter.</p>
          </div>
        ) : (
          filteredOrders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>🧾 Order #{order._id}</h3>
                  <div className="customer-info">
                    <p><strong>👤 Customer:</strong> {order.customerName}</p>
                    <p><strong>📧 Email:</strong> {order.customerEmail}</p>
                    <p><strong>📅 Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>
                  </div>
                </div>
                <div 
                  className="order-status-badge"
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  {getStatusIcon(order.status)} {order.status.toUpperCase()}
                </div>
              </div>

              <div className="order-items">
                <h4>🛍 Order Items:</h4>
                <div className="items-list">
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <span>{item.name}</span>
                      <span>Qty: {item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="order-footer">
                <div className="order-total">
                  <strong>💰 Total: ${order.total.toFixed(2)}</strong>
                  {order.estimatedTime > 0 && (
                    <span className="estimated-time">⏱ Est: {order.estimatedTime} mins</span>
                  )}
                </div>
                <div className="order-actions">
                  {order.status === 'pending' && (
                    <button 
                      className="status-btn preparing"
                      onClick={() => updateOrderStatus(order._id, 'preparing')}
                    >
                      👨‍🍳 Start Preparing
                    </button>
                  )}
                  {order.status === 'preparing' && (
                    <button 
                      className="status-btn ready"
                      onClick={() => updateOrderStatus(order._id, 'ready')}
                    >
                      ✅ Mark Ready
                    </button>
                  )}
                  {order.status === 'ready' && (
                    <button 
                      className="status-btn completed"
                      onClick={() => updateOrderStatus(order._id, 'completed')}
                    >
                      📦 Complete Order
                    </button>
                  )}
                  <button 
                    className="status-btn cancelled"
                    onClick={() => updateOrderStatus(order._id, 'cancelled')}
                  >
                    ❌ Cancel
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};


const AdminUserManagement = () => {
  const [users, setUsers] = useState([
    {
      _id: '1',
      username: 'john_doe',
      email: 'john@example.com',
      role: 'user',
      status: 'active',
      joinDate: '2025-01-15',
      lastLogin: '2025-08-17T09:30:00Z',
      totalOrders: 25
    },
    {
      _id: '2',
      username: 'jane_smith',
      email: 'jane@example.com',
      role: 'user',
      status: 'active',
      joinDate: '2025-02-20',
      lastLogin: '2025-08-16T14:22:00Z',
      totalOrders: 12
    },
    {
      _id: '3',
      username: 'admin_user',
      email: 'admin@example.com',
      role: 'admin',
      status: 'active',
      joinDate: '2024-12-01',
      lastLogin: '2025-08-17T11:45:00Z',
      totalOrders: 0
    }
  ]);

  const toggleUserStatus = (userId) => {
    setUsers(prev => prev.map(user => 
      user._id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
  };

  const changeUserRole = (userId, newRole) => {
    setUsers(prev => prev.map(user => 
      user._id === userId ? { ...user, role: newRole } : user
    ));
    alert(`✅ User role updated to: ${newRole}`);
  };

  return (
    <div className="user-management">
      <div className="section-header">
        <h2>👥 User Management</h2>
        <p>Manage user accounts, roles, and permissions</p>
      </div>

      <div className="users-stats">
        <div className="stat-item">
          <span className="stat-number">{users.length}</span>
          <span className="stat-label">Total Users</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{users.filter(u => u.status === 'active').length}</span>
          <span className="stat-label">Active Users</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{users.filter(u => u.role === 'admin').length}</span>
          <span className="stat-label">Admins</span>
        </div>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>👤 User</th>
              <th>📧 Email</th>
              <th>🏷 Role</th>
              <th>📊 Status</th>
              <th>📅 Join Date</th>
              <th>🕒 Last Login</th>
              <th>🛍 Orders</th>
              <th>⚙ Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>
                  <div className="user-cell">
                    <div className="user-avatar">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <span>{user.username}</span>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <select 
                    value={user.role} 
                    onChange={(e) => changeUserRole(user._id, e.target.value)}
                    className={`role-badge ${user.role}`}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>
                  <span className={`status-badge ${user.status}`}>
                    {user.status === 'active' ? '✅ Active' : '❌ Inactive'}
                  </span>
                </td>
                <td>{new Date(user.joinDate).toLocaleDateString()}</td>
                <td>{new Date(user.lastLogin).toLocaleString()}</td>
                <td className="orders-count">{user.totalOrders}</td>
                <td>
                  <div className="user-actions">
                    <button 
                      className={`toggle-status-btn ${user.status}`}
                      onClick={() => toggleUserStatus(user._id)}
                    >
                      {user.status === 'active' ? '🚫 Deactivate' : '✅ Activate'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


const AdminAnalytics = () => (
  <div className="analytics">
    <h2>Analytics</h2>
    <p>Analytics content goes here...</p>
  </div>
);

// Main App Component
function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('auth');
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });
  const [popup, setPopup] = useState({ show: false, message: '', type: 'success' });
  const [loading, setLoading] = useState(true);
  const savedTheme = localStorage.getItem('theme');
 
  // Global AOS initialization (single source of truth)
  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: 'ease-out',
      once: true,
      offset: 80,
      mirror: false,
      disable: 'phone'
    });
  }, []);

  // Refresh AOS when view/theme changes to bind animations to new DOM
  useEffect(() => {
    // Defer to after DOM updates
    const id = setTimeout(() => {
      try { AOS.refresh(); } catch {}
    }, 0);
    return () => clearTimeout(id);
  }, [currentView, theme]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    const lastView = localStorage.getItem('last_view');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      setTheme(savedTheme);
      try { document.documentElement.setAttribute('data-theme', savedTheme); } catch {}
    }
    if (token && userData) {
      setUser(JSON.parse(userData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const parsedUser = JSON.parse(userData);
      // Restore last visited view if valid for role
      if (typeof lastView === 'string' && lastView.length > 0) {
        const isAdmin = parsedUser.role === 'admin';
        const isValid = isAdmin ? lastView.startsWith('admin-') : lastView.startsWith('customer-');
        setCurrentView(isValid ? lastView : (isAdmin ? 'admin-dashboard' : 'customer-home'));
      } else {
        setCurrentView(parsedUser.role === 'admin' ? 'admin-dashboard' : 'customer-home');
      }
    } else {
      setLoading(false);
      setCurrentView('auth');
      return;
    }
    setLoading(false);
  }, []);

  // Always start at top on view change
  useEffect(() => {
    const id = setTimeout(() => {
      try {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      } catch (e) {
        // Fallback for older browsers
        window.scrollTo(0, 0);
      }
    }, 50); // A small delay to ensure the view is rendered
    return () => clearTimeout(id);
  }, [currentView]);

  const logout = () => {
    const username = user?.username || 'User';
    setPopup({
      show: true,
      message: `@${username} you log out`,
      type: 'info'
    });
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setCurrentView('auth');
  };

  // Sync theme to DOM and persist
  useEffect(() => {
    try { document.documentElement.setAttribute('data-theme', theme); } catch {}
    try { localStorage.setItem('theme', theme); } catch {}
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <AppContext.Provider value={{ user, setUser, currentView, setCurrentView, logout, theme, toggleTheme }}>
      <MenuProvider>
        <CartProvider>
          <Router>
            <ScrollToTop />
            <div className="App" data-aos="fade-in">
              {currentView === 'auth' && <AuthView />}
              {user && user.role === 'admin' && <AdminLayout />}
              {user && user.role === 'user' && <CustomerLayout />}
              <Popup 
                message={popup.message}
                type={popup.type}
                isVisible={popup.show}
                onClose={() => setPopup({...popup, show: false})}
              />
            </div>
          </Router>
        </CartProvider>
      </MenuProvider>
    </AppContext.Provider>
  );
}


// Export context and hook for use in other components
export { AppContext, useCart };
export default App;