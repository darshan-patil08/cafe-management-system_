import React from 'react';

const AboutPage = () => {
  return (
    <div className="about-page">
      {/* About Hero */}
      <section className="about-hero" data-aos="fade-up">
        <div className="container">
          <h1>Our Story</h1>
          <p>Discover the passion behind every cup</p>
        </div>
      </section>

      {/* Story Section */}
      <section className="story-section" data-aos="fade-up">
        <div className="container">
          <div className="story-content">
            <div className="story-text" data-aos="fade-right">
              <h2>Born from Passion</h2>
              <p>
                CafeDeluxe began in 2020 with a simple mission: to serve the perfect cup of coffee. 
                Our founders, Maria and John, traveled the world to discover the finest coffee beans 
                and bring that authentic experience to your neighborhood.
              </p>
              <p>
                Today, we're proud to be your local coffee destination, serving premium beverages 
                and fresh pastries made with love and dedication to quality.
              </p>
            </div>
            <div className="story-image" data-aos="fade-left">
              <img 
                src="https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=800&q=80" 
                alt="Coffee shop interior"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section" data-aos="fade-up">
        <div className="container">
          <h2>Our Values</h2>
          <div className="values-grid">
            {[
              {
                title: "Quality First",
                description: "We never compromise on the quality of our ingredients",
                icon: "⭐"
              },
              {
                title: "Community",
                description: "Building connections one cup at a time",
                icon: "🤝"
              },
              {
                title: "Sustainability",
                description: "Caring for our planet and future generations",
                icon: "🌍"
              }
            ].map((value, index) => (
              <div 
                key={index}
                className="value-card"
                data-aos="fade-up"
                data-aos-delay={index * 200}
              >
                <div className="value-icon">{value.icon}</div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
