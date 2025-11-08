const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true,
  },

  // Geo-location
  coordinates: {
    latitude: {
      type: Number,
      required: true,
      min: 24.5,  // Southern boundary of US (approximate)
      max: 49.4,  // Northern boundary of continental US (approximate)
    },
    longitude: {
      type: Number,
      required: true,
      min: -125,  // Western boundary of US (approximate)
      max: -66,   // Eastern boundary of US (approximate)
    },
  },

  // Address Information
  address: {
    street: String,
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
      maxlength: 2,  // US state abbreviation
    },
    zipCode: String,
    country: {
      type: String,
      default: 'US',
      immutable: true,
    },
  },

  // Location Details
  locationName: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
    maxlength: 200,
  },

  // Date & Time
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },

  // Status
  isActive: {
    type: Boolean,
    default: true,
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

// Index for geospatial queries
locationSchema.index({ 'coordinates.latitude': 1, 'coordinates.longitude': 1 });
locationSchema.index({ vendor: 1, date: -1 });
locationSchema.index({ date: 1, isActive: 1 });

// Update timestamp on modification
locationSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

// Virtual for checking if location is for today
locationSchema.virtual('isToday').get(function() {
  const today = new Date();
  const locationDate = new Date(this.date);
  return today.toDateString() === locationDate.toDateString();
});

// Method to check if location is currently active based on time
locationSchema.methods.isCurrentlyActive = function() {
  if (!this.isActive) return false;

  const now = new Date();
  const locationDate = new Date(this.date);

  // Check if location is for today
  if (now.toDateString() !== locationDate.toDateString()) {
    return false;
  }

  // Simple time comparison (could be enhanced with proper time zones)
  const currentTime = now.toTimeString().slice(0, 5);
  return currentTime >= this.startTime && currentTime <= this.endTime;
};

module.exports = mongoose.model('Location', locationSchema);
