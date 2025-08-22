const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  items: [{
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem',
      required: true
    },
    name: {
      type: String,
      required: true // Store name in case menu item is deleted
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
      max: [99, 'Quantity cannot exceed 99']
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0
    },
    customizations: [{
      name: String,
      option: String,
      priceModifier: {
        type: Number,
        default: 0
      }
    }],
    specialInstructions: {
      type: String,
      maxlength: [200, 'Special instructions cannot exceed 200 characters']
    }
  }],
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  tax: {
    type: Number,
    default: 0,
    min: 0
  },
  discount: {
    amount: {
      type: Number,
      default: 0,
      min: 0
    },
    reason: String,
    appliedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'],
      message: 'Status must be one of: pending, confirmed, preparing, ready, completed, cancelled'
    },
    default: 'pending'
  },
  orderType: {
    type: String,
    enum: {
      values: ['dine-in', 'takeaway', 'delivery'],
      message: 'Order type must be one of: dine-in, takeaway, delivery'
    },
    required: true
  },
  tableNumber: {
    type: Number,
    min: 1,
    max: 100,
    required: function() {
      return this.orderType === 'dine-in';
    }
  },
  deliveryAddress: {
    street: String,
    city: String,
    zipCode: String,
    phone: String,
    instructions: String
  },
  customerInfo: {
    name: {
      type: String,
      required: function() {
        return this.orderType === 'takeaway' || this.orderType === 'delivery';
      }
    },
    phone: {
      type: String,
      required: function() {
        return this.orderType === 'takeaway' || this.orderType === 'delivery';
      }
    },
    email: String
  },
  paymentInfo: {
    method: {
      type: String,
      enum: ['cash', 'card', 'digital-wallet', 'online'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    paidAt: Date
  },
  timing: {
    orderPlaced: {
      type: Date,
      default: Date.now
    },
    estimatedReady: Date,
    actualReady: Date,
    completed: Date,
    cancelled: Date
  },
  specialInstructions: {
    type: String,
    maxlength: [500, 'Special instructions cannot exceed 500 characters']
  },
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      maxlength: [500, 'Feedback comment cannot exceed 500 characters']
    },
    submittedAt: Date
  },
  assignedStaff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for order age
orderSchema.virtual('orderAge').get(function() {
  return Date.now() - this.createdAt;
});

// Pre-save middleware to generate order number and calculate totals
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber && this.isNew) {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.orderNumber = `ORD-${dateStr}-${randomNum}`;
  }
  
  // Calculate totals
  if (this.isModified('items') || this.isNew) {
    this.subtotal = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
    this.totalAmount = this.subtotal + this.tax - this.discount.amount;
  }
  
  next();
});

// Index for better performance
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1, orderType: 1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ 'timing.orderPlaced': -1 });

// Instance method to update status
orderSchema.methods.updateStatus = function(newStatus, userId) {
  const oldStatus = this.status;
  this.status = newStatus;
  
  // Update timing based on status
  switch (newStatus) {
    case 'ready':
      this.timing.actualReady = new Date();
      break;
    case 'completed':
      this.timing.completed = new Date();
      break;
    case 'cancelled':
      this.timing.cancelled = new Date();
      break;
  }
  
  return this.save();
};

// Static method to get order statistics
orderSchema.statics.getOrderStats = function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      }
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalRevenue: { $sum: '$totalAmount' }
      }
    }
  ]);
};

module.exports = mongoose.model('Order', orderSchema);
