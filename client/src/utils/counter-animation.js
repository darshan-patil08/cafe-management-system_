/**
 * Enhanced Animated Counter System
 * Provides smooth, accessible, and performance-optimized number animations
 */

class AnimatedCounter {
  constructor(element, options = {}) {
    this.element = element;
    this.target = parseInt(element.dataset.target) || 0;
    this.suffix = element.dataset.suffix || '';
    this.prefix = element.dataset.prefix || '';
    
    // Configuration options
    this.options = {
      duration: options.duration || 2000, // Animation duration in ms
      easing: options.easing || 'easeOutCubic', // Easing function
      startDelay: options.startDelay || 0, // Delay before starting
      useGrouping: options.useGrouping || false, // Use number grouping (1,000)
      ...options
    };
    
    this.current = 0;
    this.startTime = null;
    this.animationId = null;
    this.isAnimating = false;
    this.hasCompleted = false;
    
    // Bind methods
    this.animate = this.animate.bind(this);
    this.update = this.update.bind(this);
    
    // Initialize
    this.init();
  }
  
  init() {
    // Set initial state
    this.element.textContent = this.formatNumber(0);
    this.element.classList.add('loading');
    
    // Add progress bar if not exists
    if (!this.element.parentNode.querySelector('.progress-bar')) {
      this.addProgressBar();
    }
    
    // Set up intersection observer for trigger
    this.setupIntersectionObserver();
  }
  
  addProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.innerHTML = '<div class="progress-fill"></div>';
    this.element.parentNode.appendChild(progressBar);
  }
  
  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.hasCompleted) {
          setTimeout(() => {
            this.start();
          }, this.options.startDelay);
          observer.unobserve(this.element);
        }
      });
    }, {
      threshold: 0.5,
      rootMargin: '0px 0px -100px 0px'
    });
    
    observer.observe(this.element);
  }
  
  start() {
    if (this.isAnimating) return;
    
    this.isAnimating = true;
    this.startTime = performance.now();
    this.element.classList.remove('loading');
    this.element.classList.add('animating');
    
    // Start progress bar animation
    const progressFill = this.element.parentNode.querySelector('.progress-fill');
    if (progressFill) {
      this.element.parentNode.classList.add('counting');
    }
    
    this.animationId = requestAnimationFrame(this.animate);
  }
  
  animate(currentTime) {
    if (!this.startTime) this.startTime = currentTime;
    
    const elapsed = currentTime - this.startTime;
    const progress = Math.min(elapsed / this.options.duration, 1);
    
    // Apply easing function
    const easedProgress = this.applyEasing(progress);
    
    // Calculate current value
    this.current = this.target * easedProgress;
    
    // Update display
    this.update();
    
    // Continue animation or complete
    if (progress < 1) {
      this.animationId = requestAnimationFrame(this.animate);
    } else {
      this.complete();
    }
  }
  
  update() {
    const displayValue = Math.round(this.current);
    this.element.textContent = this.formatNumber(displayValue);
    
    // Announce progress to screen readers (throttled)
    if (Math.round(this.current) % 5 === 0) {
      this.announceProgress(displayValue);
    }
  }
  
  complete() {
    this.isAnimating = false;
    this.hasCompleted = true;
    this.current = this.target;
    
    // Final update
    this.element.textContent = this.formatNumber(this.target);
    
    // Update classes
    this.element.classList.remove('animating');
    this.element.classList.add('completed');
    
    // Announce completion
    this.announceCompletion();
    
    // Trigger completion callback
    if (this.options.onComplete) {
      this.options.onComplete(this);
    }
    
    // Add celebration effect
    setTimeout(() => {
      this.addCelebrationEffect();
    }, 100);
  }
  
  formatNumber(value) {
    let formatted = value.toString();
    
    if (this.options.useGrouping && value >= 1000) {
      formatted = value.toLocaleString();
    }
    
    return `${this.prefix}${formatted}${this.suffix}`;
  }
  
  applyEasing(t) {
    switch (this.options.easing) {
      case 'easeOutCubic':
        return 1 - Math.pow(1 - t, 3);
      case 'easeOutQuart':
        return 1 - Math.pow(1 - t, 4);
      case 'easeOutExpo':
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      case 'easeOutBounce':
        const n1 = 7.5625;
        const d1 = 2.75;
        if (t < 1 / d1) {
          return n1 * t * t;
        } else if (t < 2 / d1) {
          return n1 * (t -= 1.5 / d1) * t + 0.75;
        } else if (t < 2.5 / d1) {
          return n1 * (t -= 2.25 / d1) * t + 0.9375;
        } else {
          return n1 * (t -= 2.625 / d1) * t + 0.984375;
        }
      default:
        return t; // Linear
    }
  }
  
  announceProgress(value) {
    // Create or update screen reader announcement
    if (!this.srAnnouncer) {
      this.srAnnouncer = document.createElement('div');
      this.srAnnouncer.setAttribute('aria-live', 'polite');
      this.srAnnouncer.setAttribute('aria-atomic', 'true');
      this.srAnnouncer.className = 'sr-only';
      this.srAnnouncer.style.position = 'absolute';
      this.srAnnouncer.style.left = '-9999px';
      this.srAnnouncer.style.width = '1px';
      this.srAnnouncer.style.height = '1px';
      this.srAnnouncer.style.overflow = 'hidden';
      document.body.appendChild(this.srAnnouncer);
    }
    
    // Throttle announcements
    if (this.lastAnnouncement && Date.now() - this.lastAnnouncement < 500) {
      return;
    }
    
    this.srAnnouncer.textContent = `${this.formatNumber(value)} and counting`;
    this.lastAnnouncement = Date.now();
  }
  
  announceCompletion() {
    if (this.srAnnouncer) {
      const label = this.element.getAttribute('aria-label') || 
                   this.element.parentNode.querySelector('.stat-label')?.textContent || 
                   'Counter';
      this.srAnnouncer.textContent = `${label}: ${this.formatNumber(this.target)} final count`;
    }
  }
  
  addCelebrationEffect() {
    // Create particle effect
    const particles = [];
    const colors = ['#8B4513', '#A0522D', '#D2691E', '#F5E6D3'];
    
    for (let i = 0; i < 12; i++) {
      const particle = document.createElement('div');
      particle.style.position = 'absolute';
      particle.style.width = '6px';
      particle.style.height = '6px';
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      particle.style.borderRadius = '50%';
      particle.style.pointerEvents = 'none';
      particle.style.zIndex = '1000';
      
      const rect = this.element.getBoundingClientRect();
      particle.style.left = (rect.left + rect.width / 2) + 'px';
      particle.style.top = (rect.top + rect.height / 2) + 'px';
      
      document.body.appendChild(particle);
      particles.push(particle);
      
      // Animate particle
      const angle = (i / 12) * Math.PI * 2;
      const velocity = 50 + Math.random() * 50;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity;
      
      particle.animate([
        { transform: 'translate(0, 0) scale(1)', opacity: 1 },
        { transform: `translate(${vx}px, ${vy}px) scale(0)`, opacity: 0 }
      ], {
        duration: 800,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      }).onfinish = () => {
        particle.remove();
      };
    }
  }
  
  reset() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    this.current = 0;
    this.isAnimating = false;
    this.hasCompleted = false;
    this.startTime = null;
    
    this.element.textContent = this.formatNumber(0);
    this.element.classList.remove('animating', 'completed');
    this.element.classList.add('loading');
    
    const progressFill = this.element.parentNode.querySelector('.progress-fill');
    if (progressFill) {
      this.element.parentNode.classList.remove('counting');
    }
  }
  
  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    if (this.srAnnouncer) {
      this.srAnnouncer.remove();
    }
  }
}

// Global counter manager
class CounterManager {
  constructor() {
    this.counters = new Map();
    this.init();
  }
  
  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupCounters());
    } else {
      this.setupCounters();
    }
  }
  
  setupCounters() {
    const counterElements = document.querySelectorAll('[data-target]');
    
    counterElements.forEach((element, index) => {
      const options = {
        duration: 2000 + (index * 200), // Stagger animation timing
        easing: 'easeOutCubic',
        startDelay: index * 300, // Stagger start delays
        onComplete: (counter) => {
          console.log(`Counter ${counter.element.id} completed!`);
        }
      };
      
      // Custom options based on element
      if (element.id === 'happy-customers') {
        options.useGrouping = false; // Keep as "15k+" not "15,000+"
      } else if (element.id === 'experience') {
        options.easing = 'easeOutBounce';
      } else if (element.id === 'fresh-coffee') {
        options.duration = 2500; // Slower for 100%
      }
      
      const counter = new AnimatedCounter(element, options);
      this.counters.set(element.id, counter);
    });
  }
  
  startAll() {
    this.counters.forEach(counter => {
      if (!counter.hasCompleted) {
        counter.start();
      }
    });
  }
  
  resetAll() {
    this.counters.forEach(counter => counter.reset());
  }
  
  getCounter(id) {
    return this.counters.get(id);
  }
}

// Initialize the counter manager when the script loads
const counterManager = new CounterManager();

// Expose to global scope for debugging/manual control
window.counterManager = counterManager;

// Additional utility functions
window.triggerCounters = () => counterManager.startAll();
window.resetCounters = () => counterManager.resetAll();

// Performance monitoring
if (typeof performance !== 'undefined' && performance.mark) {
  performance.mark('counters-script-loaded');
}

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    // Resume animations if needed
    counterManager.counters.forEach(counter => {
      if (counter.isAnimating) {
        counter.startTime = performance.now() - (counter.current / counter.target) * counter.options.duration;
      }
    });
  }
});
