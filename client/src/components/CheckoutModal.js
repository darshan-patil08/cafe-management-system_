import React, { useState, useEffect } from 'react';
import { useCart } from '../context/AppContext';
import { formatINR } from '../utils/currency';
import '../styles/CheckoutModal.css';

const CheckoutModal = ({ isOpen, onClose, cartItems, updateQuantity }) => {
  const [darkMode, setDarkMode] = useState(false);
  
  // Toggle dark mode
  useEffect(() => {
    // Check user's preferred color scheme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);
    
    // Apply dark mode class to body
    if (prefersDark) {
      document.body.setAttribute('data-theme', 'dark');
    } else {
      document.body.removeAttribute('data-theme');
    }
    
    // Listen for changes in color scheme preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      setDarkMode(e.matches);
      if (e.matches) {
        document.body.setAttribute('data-theme', 'dark');
      } else {
        document.body.removeAttribute('data-theme');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  // Handle quantity changes
  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity >= 1) {
      updateQuantity(item, newQuantity);
    }
  };
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    specialInstructions: ''
  });

  const { clearCart } = useCart();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (Number(item.price) * item.quantity);
    }, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the order to your backend
    console.log('Order submitted:', { customerInfo, items: cartItems, total: calculateTotal() });
    clearCart();
    onClose();
    alert('Order placed successfully! Your order will be ready soon.');
  };

  if (!isOpen) return null;

  // Calculate total including tax
  const subtotal = cartItems.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + tax;

  return (
    <div className={`checkout-modal-overlay`}>
      <div className="checkout-modal">
        <div className="checkout-header">
          <div className="logo">
            <h2>Order Summary</h2>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="checkout-content">
          <div className="order-summary">
            <h3>Your Order</h3>
            <div className="order-items">
              {cartItems.map((item) => (
                <div key={item._id || item.id} className="order-item">
                  <img 
                    src={item.image || '/placeholder-food.jpg'} 
                    alt={item.name} 
                    className="item-thumbnail"
                  />
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <div className="quantity-controls">
                      <button 
                        className="quantity-btn minus"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuantityChange(item, item.quantity - 1);
                        }}
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="quantity-display">{item.quantity}</span>
                      <button 
                        className="quantity-btn plus"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuantityChange(item, item.quantity + 1);
                        }}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="item-price">
                    {formatINR(Number(item.price) * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="price-summary">
              <div className="price-row">
                <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items):</span>
                <span>{formatINR(subtotal)}</span>
              </div>
              <div className="price-row">
                <span>Tax (5%):</span>
                <span>{formatINR(tax)}</span>
              </div>
              <div className="price-row total">
                <span>Total Amount:</span>
                <span>{formatINR(total)}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="customer-info">
            <h3>Your Information</h3>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={customerInfo.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={customerInfo.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={customerInfo.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Special Instructions (Optional)</label>
              <textarea
                name="specialInstructions"
                value={customerInfo.specialInstructions}
                onChange={handleInputChange}
                rows="3"
              />
            </div>

            <button type="submit" className="checkout-btn">
              Confirm & Checkout
            </button>
            <p className="reassurance">Your order will be ready in just a few minutes!</p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
