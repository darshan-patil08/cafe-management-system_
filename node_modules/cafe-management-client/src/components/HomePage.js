import React, { useContext, useMemo, useState } from 'react';
import { AppContext } from '../App';
import { useMenu } from '../context/MenuContext';
import { formatINR } from '../utils/currency';

const HomePage = () => {
  const { setCurrentView, user } = useContext(AppContext);
  const [contactData, setContactData] = useState({
    name: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || user?.mobile || '',
    message: ''
  });

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Placeholder submit action. Replace with API call if needed.
    alert('✅ Thank you! We\'ll get back to you shortly.');
    setContactData({
      name: user?.username || '',
      email: user?.email || '',
      phone: user?.phone || user?.mobile || '',
      message: ''
    });
  };

  const { menuItems } = useMenu();
  const featuredItems = useMemo(() => (menuItems || []).filter(i => i.isAvailable !== false).slice(0, 8), [menuItems]);

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-background">
          <img 
            src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1920&q=80" 
            alt="Coffee background"
          />
          <div className="hero-overlay"></div>
        </div>
        <div className="container">
          <div className="hero-content">
            <h1>Where Every Sip<br />Truly Matters</h1>
            <p>Experience the perfect blend of quality, taste, and passion in every cup we serve</p>
            <button 
              className="hero-cta-btn"
              onClick={() => setCurrentView('customer-menu')}
            >
              Order Now
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">15K+</span>
              <span className="stat-label">Happy Customers</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">10Y</span>
              <span className="stat-label">Experience</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">Fresh Coffee</span>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="container">
          <div className="about-grid">
            <div className="about-image">
              <img 
                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80" 
                alt="Crafted coffee"
              />
            </div>
            <div className="about-content">
              <h2>Crafted with Purpose</h2>
              <ul className="about-features">
                <li>✓ Premium Quality Beans</li>
                <li>✓ Expert Roasting Process</li>
                <li>✓ Sustainable Sourcing</li>
                <li>✓ Artisan Brewing Methods</li>
              </ul>
              <p>Our commitment to excellence drives everything we do. From bean selection to the final pour, we ensure every cup meets our highest standards.</p>
              <button 
                className="about-btn"
                onClick={() => setCurrentView('customer-about')}
              >
                Learn More
              </button>
              <div className="testimonial-mini">
                <div className="testimonial-avatar">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="Customer" />
                </div>
                <div className="testimonial-text">
                  <p>"Best coffee experience in the city!"</p>
                  <span>- Sarah Johnson</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="container">
          <div className="section-header">
            <h2>Designed to Serve You Better</h2>
            <p>Experience excellence in every aspect of our service</p>
          </div>
          <div className="services-image">
            <img 
              src="https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1200&q=80" 
              alt="Coffee shop interior"
            />
          </div>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">🏆</div>
              <h3>Quality Assurance</h3>
              <p>Every bean is carefully selected and roasted to perfection</p>
            </div>
            <div className="service-card">
              <div className="service-icon">🎨</div>
              <h3>Artisan Brewing</h3>
              <p>Our skilled baristas craft each cup with artistic precision</p>
            </div>
            <div className="service-card">
              <div className="service-icon">👥</div>
              <h3>Friendly Service</h3>
              <p>Warm hospitality that makes you feel right at home</p>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="menu-section">
        <div className="container">
          <div className="section-header">
            <h2>Made fresh, made for you.</h2>
            <p>Discover our signature beverages and artisanal treats</p>
          </div>
          <div className="menu-grid">
            {featuredItems.map((item, index) => (
              <div key={item.id || item._id || index} className="menu-item">
                <div className="menu-item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="menu-item-content">
                  <h4>{item.name}</h4>
                  <span className="menu-price">{formatINR(Number(item.price))}</span>
                  {item.nutritionFacts && (
                    <div className="menu-nutrition-label" title="Nutrition Facts">
                      {item.nutritionFacts}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="menu-cta">
            <button 
              className="view-menu-btn"
              onClick={() => setCurrentView('customer-menu')}
            >
              View Full Menu
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <div className="newsletter-text">
              <h2>Get exclusive deals & news</h2>
              <p>Subscribe to our newsletter and never miss our special offers</p>
            </div>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email address" />
              <button>Subscribe</button>
            </div>
          </div>
        </div>
      </section>

      {/* Limited Offers Section */}
      <section className="offers-section">
        <div className="container">
          <div className="section-header">
            <h2>Limited offers just for you</h2>
            <p>Don't miss out on these amazing deals</p>
          </div>
          <div className="offers-grid">
            <div className="offer-card large">
              <img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80" alt="Special offer" />
              <div className="offer-content">
                <span className="offer-badge">Today Only</span>
                <h3>Buy 2 Get 1 Free</h3>
                <p>On all coffee drinks</p>
              </div>
            </div>
            <div className="offer-card">
              <img src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=80" alt="Weekend special" />
              <div className="offer-content">
                <span className="offer-badge">Weekend</span>
                <h3>20% Off Pastries</h3>
              </div>
            </div>
            <div className="offer-card">
              <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=400&q=80" alt="Morning deal" />
              <div className="offer-content">
                <span className="offer-badge">Morning</span>
                <h3>Breakfast Combo</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <div className="section-header">
            <h2>Crafting every cup with passion and love.</h2>
            <p>Meet our talented team of coffee artisans</p>
          </div>
          <div className="team-grid">
            {[
              { name: "Maria Santos", role: "Head Barista", rating: 5, image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
              { name: "Darshan Patil", role: "Coffee Roaster", rating: 5, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80" },
              { name: "Manish ravtole", role: "Pastry Chef", rating: 5, image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80" },
              { name: "Sahil Patel", role: "Store Manager", rating: 5, image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80" }
            ].map((member, index) => (
              <div key={index} className="team-member">
                <div className="member-image">
                  <img src={member.image} alt={member.name} />
                </div>
                <div className="member-info">
                  <h4>{member.name}</h4>
                  <p>{member.role}</p>
                  <div className="rating">
                    {'★'.repeat(member.rating)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <div className="faq-grid">
            <div className="faq-image">
              <img 
                src="https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=600&q=80" 
                alt="Barista at work"
              />
            </div>
            <div className="faq-content">
              <h2>Frequently Ask Question</h2>
              <div className="faq-list">
                <div className="faq-item active">
                  <div className="faq-question">
                    <span>What makes your coffee special?</span>
                    <span className="faq-toggle">+</span>
                  </div>
                  <div className="faq-answer">
                    <p>We source premium beans directly from farmers and roast them fresh daily using traditional methods.</p>
                  </div>
                </div>
                <div className="faq-item">
                  <div className="faq-question">
                    <span>Do you offer dairy-free alternatives?</span>
                    <span className="faq-toggle">+</span>
                  </div>
                </div>
                <div className="faq-item">
                  <div className="faq-question">
                    <span>What are your operating hours?</span>
                    <span className="faq-toggle">+</span>
                  </div>
                </div>
                <div className="faq-item">
                  <div className="faq-question">
                    <span>Do you cater for events?</span>
                    <span className="faq-toggle">+</span>
                  </div>
                </div>
              </div>
              {/* Contact info moved to the Contact section below */}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="container">
          <div className="contact-grid">
            {/* Left: Send us a Message */}
            <div className="contact-form">
              <h2>Send us a Message</h2>
              <form onSubmit={handleContactSubmit}>
                <div className="form-group">
                  <input type="text" placeholder="Your Name" value={contactData.name} onChange={(e) => setContactData({ ...contactData, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <input type="email" placeholder="Your Email" value={contactData.email} onChange={(e) => setContactData({ ...contactData, email: e.target.value })} required />
                </div>
                <div className="form-group">
                  <textarea rows="5" placeholder="Your Message" value={contactData.message} onChange={(e) => setContactData({ ...contactData, message: e.target.value })} />
                </div>
                <button type="submit" className="submit-btn">Send Message</button>
              </form>
            </div>

            {/* Right: Visit Us info cards */}
            <div className="contact-info">
              <h2>Visit Us</h2>
              <div className="info-item">
                <div className="info-icon">📍</div>
                <div>
                  <h3>Address</h3>
                  <p>123 Coffee Street, Brew City, BC 12345</p>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">📞</div>
                <div>
                  <h3>Phone</h3>
                  <p>(555) 123-CAFE</p>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">📧</div>
                <div>
                  <h3>Email</h3>
                  <p>hello@cafedeluxe.com</p>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">🕒</div>
                <div>
                  <h3>Hours</h3>
                  <p>Mon-Sun: 7:00 AM - 10:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;