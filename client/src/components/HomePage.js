import React, { useContext } from 'react';
import { AppContext } from '../App';

const HomePage = () => {
  const { setCurrentView } = useContext(AppContext);

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section kaffix-hero" data-aos="fade-in" data-aos-duration="800">
        <div className="hero-background hero-bg">
          <img 
            src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1920&q=80" 
            alt="Coffee background"
          />
          <div className="hero-overlay"></div>
        </div>
        <div className="container">
          <div className="hero-content" data-aos="fade-up" data-aos-delay="150">
            <h1>Where Every Sip<br />Truly Matters</h1>
            <p>Experience the perfect blend of quality, taste, and passion in every cup we serve</p>
            <div className="cta-group">
              <button 
                className="cta-btn primary"
                onClick={() => setCurrentView('customer-menu')}
              >
                Order Now
              </button>
            </div>
          </div>
          <div className="hero-stats">
            <div className="stat-item" data-aos="zoom-in" data-aos-delay="100">
              <span className="stat-number">15K+</span>
              <span className="stat-label">Happy Customers</span>
            </div>
            <div className="stat-item" data-aos="zoom-in" data-aos-delay="200">
              <span className="stat-number">10Y</span>
              <span className="stat-label">Experience</span>
            </div>
            <div className="stat-item" data-aos="zoom-in" data-aos-delay="300">
              <span className="stat-number">100%</span>
              <span className="stat-label">Fresh Coffee</span>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section" data-aos="fade-up" data-aos-offset="120">
        <div className="container">
          <div className="about-grid">
            <div className="about-image" data-aos="fade-right" data-aos-delay="100">
              <img 
                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80" 
                alt="Crafted coffee"
              />
            </div>
            <div className="about-content" data-aos="fade-left" data-aos-delay="200">
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
      <section className="services-section" data-aos="fade-up">
        <div className="container">
          <div className="section-header">
            <h2>Designed to Serve You Better</h2>
            <p>Experience excellence in every aspect of our service</p>
          </div>
          <div className="services-image" data-aos="zoom-in" data-aos-delay="100">
            <img 
              src="https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1200&q=80" 
              alt="Coffee shop interior"
            />
          </div>
          <div className="services-grid">
            <div className="service-card" data-aos="fade-up" data-aos-delay="100">
              <div className="service-icon">🏆</div>
              <h3>Quality Assurance</h3>
              <p>Every bean is carefully selected and roasted to perfection</p>
            </div>
            <div className="service-card" data-aos="fade-up" data-aos-delay="200">
              <div className="service-icon">🎨</div>
              <h3>Artisan Brewing</h3>
              <p>Our skilled baristas craft each cup with artistic precision</p>
            </div>
            <div className="service-card" data-aos="fade-up" data-aos-delay="300">
              <div className="service-icon">👥</div>
              <h3>Friendly Service</h3>
              <p>Warm hospitality that makes you feel right at home</p>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section className="menu-section" data-aos="fade-up">
        <div className="container">
          <div className="section-header">
            <h2>Made fresh, made for you.</h2>
            <p>Discover our signature beverages and artisanal treats</p>
          </div>
          <div className="menu-grid">
            {[
              {
                name: "Iced Coffee",
                price: "$3.50",
                image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=400&q=80"
              },
              {
                name: "Hot Latte",
                price: "$4.00", 
                image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&q=80"
              },
              {
                name: "Milk Shake",
                price: "$5.00",
                image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=400&q=80"
              },
              {
                name: "Cappucino",
                price: "$4.50",
                image: "https://images.unsplash.com/photo-1558618047-fd816ddef6cd?auto=format&fit=crop&w=400&q=80"
              },
              {
                name: "Americano",
                price: "$3.00",
                image: "https://images.unsplash.com/photo-1497636577773-f1231844b336?auto=format&fit=crop&w=400&q=80"
              },
              {
                name: "Espresso",
                price: "$2.50",
                image: "https://images.unsplash.com/photo-1510591509098-f4e7ad7d3136?auto=format&fit=crop&w=400&q=80"
              },
              {
                name: "Mocha Latte",
                price: "$4.80",
                image: "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=400&q=80"
              },
              {
                name: "Black Coffee",
                price: "$3.00",
                image: "https://images.unsplash.com/photo-1559496417-e7f25cb247f3?auto=format&fit=crop&w=400&q=80"
              }
            ].map((item, index) => (
              <div key={index} className="menu-item" data-aos="zoom-in" data-aos-delay={(index % 4) * 100}>
                <div className="menu-item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="menu-item-content">
                  <h4>{item.name}</h4>
                  <span className="menu-price">{item.price}</span>
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
      <section className="offers-section" data-aos="fade-up">
        <div className="container">
          <div className="section-header">
            <h2>Limited offers just for you</h2>
            <p>Don't miss out on these amazing deals</p>
          </div>
          <div className="offers-grid">
            <div className="offer-card large" data-aos="fade-right" data-aos-delay="100">
              <img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80" alt="Special offer" />
              <div className="offer-content">
                <span className="offer-badge">Today Only</span>
                <h3>Buy 2 Get 1 Free</h3>
                <p>On all coffee drinks</p>
              </div>
            </div>
            <div className="offer-card" data-aos="fade-up" data-aos-delay="150">
              <img src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=80" alt="Weekend special" />
              <div className="offer-content">
                <span className="offer-badge">Weekend</span>
                <h3>20% Off Pastries</h3>
              </div>
            </div>
            <div className="offer-card" data-aos="fade-left" data-aos-delay="200">
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
      <section className="team-section" data-aos="fade-up">
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
              <div key={index} className="team-member" data-aos="zoom-in" data-aos-delay={(index % 4) * 100}>
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
      <section className="faq-section" data-aos="fade-up">
        <div className="container">
          <div className="faq-grid">
            <div className="faq-image" data-aos="fade-right" data-aos-delay="100">
              <img 
                src="https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=600&q=80" 
                alt="Barista at work"
              />
            </div>
            <div className="faq-content" data-aos="fade-left" data-aos-delay="200">
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
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;