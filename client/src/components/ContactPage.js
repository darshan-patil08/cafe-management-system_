import React, { useState } from 'react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="contact-page">
      {/* Contact Header */}
      <section className="contact-header" data-aos="fade-up">
        <div className="container">
          <h1>Get in Touch</h1>
          <p>We'd love to hear from you</p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="contact-content" data-aos="fade-up">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Form */}
            <div className="contact-form" data-aos="fade-right">
              <h2>Send us a Message</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <textarea
                    placeholder="Your Message"
                    rows="5"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="submit-btn">Send Message</button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="contact-info" data-aos="fade-left">
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

export default ContactPage;
