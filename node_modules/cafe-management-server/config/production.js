// server/config/production.js
const helmet = require('helmet');
const compression = require('compression');

module.exports = (app) => {
  // Enable trust proxy for accurate client IP
  app.set('trust proxy', 1);
  
  // Compression middleware
  app.use(compression());
  
  // Enhanced security headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        scriptSrc: ["'self'"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", process.env.CLIENT_URL]
      }
    }
  }));
  
  // Static file serving
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  // Catch all handler for React Router
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
};
