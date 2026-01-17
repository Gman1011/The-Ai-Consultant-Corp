const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  profile: {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    dateOfBirth: {
      type: Date,
      required: true
    },
    ageGroup: {
      type: String,
      enum: ['3-6', '7-12', '13-18', '19-64', '65+'],
      required: true
    },
    avatar: {
      type: String,
      default: 'default-avatar.png'
    },
    timezone: {
      type: String,
      default: 'America/New_York'
    }
  },
  role: {
    type: String,
    enum: ['child', 'teen', 'adult', 'parent', 'educator'],
    default: 'adult'
  },
  parentGuardian: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  preferences: {
    learningStyle: {
      type: String,
      enum: ['visual', 'auditory', 'kinesthetic', 'read-write', 'undetermined'],
      default: 'undetermined'
    },
    sessionLength: {
      type: Number,
      default: 20,
      min: 5,
      max: 60
    },
    notificationsEnabled: {
      type: Boolean,
      default: true
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto', 'high-contrast'],
      default: 'light'
    },
    soundEnabled: {
      type: Boolean,
      default: true
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard', 'adaptive'],
      default: 'adaptive'
    }
  },
  subscription: {
    tier: {
      type: String,
      enum: ['free', 'premium', 'family', 'enterprise'],
      default: 'free'
    },
    startDate: Date,
    endDate: Date,
    stripeCustomerId: String,
    stripeSubscriptionId: String
  },
  hasCompletedOnboarding: {
    type: Boolean,
    default: false
  },
  hasCompletedInitialAssessment: {
    type: Boolean,
    default: false
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Pre-save hook to hash password
userSchema.pre('save', async function(next) {
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

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to calculate age from dateOfBirth
userSchema.methods.getAge = function() {
  const today = new Date();
  const birthDate = new Date(this.profile.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

// Method to determine age group automatically
userSchema.methods.updateAgeGroup = function() {
  const age = this.getAge();

  if (age >= 3 && age <= 6) {
    this.profile.ageGroup = '3-6';
    this.role = 'child';
  } else if (age >= 7 && age <= 12) {
    this.profile.ageGroup = '7-12';
    this.role = 'child';
  } else if (age >= 13 && age <= 18) {
    this.profile.ageGroup = '13-18';
    this.role = 'teen';
  } else if (age >= 19 && age <= 64) {
    this.profile.ageGroup = '19-64';
    this.role = 'adult';
  } else if (age >= 65) {
    this.profile.ageGroup = '65+';
    this.role = 'adult';
  }
};

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.profile.firstName} ${this.profile.lastName}`;
});

// Ensure virtuals are included in JSON
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

// Method to check if user needs parent permission
userSchema.methods.needsParentPermission = function() {
  const age = this.getAge();
  return age < 13;
};

// Method to check if subscription is active
userSchema.methods.hasActiveSubscription = function() {
  if (this.subscription.tier === 'free') return false;
  if (!this.subscription.endDate) return false;
  return new Date() < new Date(this.subscription.endDate);
};

// Method to get sanitized user object (no password)
userSchema.methods.toSafeObject = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ 'profile.ageGroup': 1 });
userSchema.index({ lastActive: -1 });
userSchema.index({ createdAt: -1 });

const User = mongoose.model('User', userSchema);

module.exports = User;
