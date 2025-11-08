const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const vendorSchema = new mongoose.Schema({
  // Authentication
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },

  // Business Information
  businessName: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    maxlength: 500,
  },
  cuisine: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },

  // Menu & Pricing
  menuItems: [{
    name: String,
    description: String,
    price: Number,
  }],

  // Operating Information
  operatingHours: {
    type: String,
    default: '11:00 AM - 8:00 PM',
  },

  // Social Media & Website
  website: String,
  instagram: String,
  facebook: String,
  twitter: String,

  // Vendor Image
  imageUrl: {
    type: String,
    default: 'https://via.placeholder.com/300x200?text=Food+Truck',
  },

  // Status
  isActive: {
    type: Boolean,
    default: true,
  },

  // Verification
  isVerified: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
vendorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
vendorSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Update timestamp on modification
vendorSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

module.exports = mongoose.model('Vendor', vendorSchema);
