const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Menu item name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
    max: [10000, 'Price cannot exceed $10,000']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['coffee', 'tea', 'pastry', 'sandwich', 'salad', 'dessert', 'beverage', 'snack'],
      message: 'Category must be one of: coffee, tea, pastry, sandwich, salad, dessert, beverage, snack'
    }
  },
  image: {
    type: String,
    default: '/images/default-food.jpg'
  },
  images: [{
    url: String,
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  isAvailable: {
    type: Boolean,
    default: true
  },
  ingredients: [{
    type: String,
    trim: true
  }],
  allergens: [{
    type: String,
    enum: ['gluten', 'dairy', 'nuts', 'soy', 'eggs', 'shellfish', 'fish', 'sesame']
  }],
  nutritionalInfo: {
    calories: {
      type: Number,
      min: 0
    },
    protein: {
      type: Number,
      min: 0
    },
    carbs: {
      type: Number,
      min: 0
    },
    fat: {
      type: Number,
      min: 0
    },
    fiber: {
      type: Number,
      min: 0
    }
  },
  preparationTime: {
    type: Number, // in minutes
    min: [1, 'Preparation time must be at least 1 minute'],
    max: [120, 'Preparation time cannot exceed 120 minutes']
  },
  customizations: [{
    name: {
      type: String,
      required: true
    },
    options: [{
      name: String,
      priceModifier: {
        type: Number,
        default: 0
      }
    }]
  }],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  isSpecial: {
    type: Boolean,
    default: false
  },
  specialOffer: {
    isActive: {
      type: Boolean,
      default: false
    },
    discountPercentage: {
      type: Number,
      min: 0,
      max: 100
    },
    validUntil: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for discounted price
menuItemSchema.virtual('discountedPrice').get(function() {
  if (this.specialOffer.isActive && this.specialOffer.discountPercentage > 0) {
    return this.price * (1 - this.specialOffer.discountPercentage / 100);
  }
  return this.price;
});

// Index for better search performance
menuItemSchema.index({ name: 'text', description: 'text', tags: 'text' });
menuItemSchema.index({ category: 1, isAvailable: 1 });
menuItemSchema.index({ isSpecial: 1 });
menuItemSchema.index({ 'rating.average': -1 });

// Instance method to check if item is on special offer
menuItemSchema.methods.isOnSpecialOffer = function() {
  return this.specialOffer.isActive && 
         this.specialOffer.validUntil && 
         this.specialOffer.validUntil > new Date();
};

module.exports = mongoose.model('MenuItem', menuItemSchema);
