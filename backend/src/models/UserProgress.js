const mongoose = require('mongoose');

const skillTreeSchema = new mongoose.Schema({
  level: {
    type: Number,
    default: 1,
    min: 1
  },
  xp: {
    type: Number,
    default: 0,
    min: 0
  },
  unlockedSkills: [String],
  masteryLevel: {
    type: String,
    enum: ['novice', 'apprentice', 'adept', 'expert', 'master'],
    default: 'novice'
  }
});

const achievementRecordSchema = new mongoose.Schema({
  achievementId: {
    type: String,
    required: true
  },
  name: String,
  description: String,
  category: String,
  unlockedAt: {
    type: Date,
    default: Date.now
  },
  rarity: String
});

const dailyStatsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  sessionsCompleted: {
    type: Number,
    default: 0
  },
  timeSpent: {
    type: Number,
    default: 0
  },
  averageAccuracy: {
    type: Number,
    default: 0
  },
  xpEarned: {
    type: Number,
    default: 0
  },
  gamesPlayed: {
    type: Map,
    of: Number,
    default: {}
  }
});

const userProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  currentLevel: {
    type: Number,
    default: 1,
    min: 1
  },
  currentStage: {
    type: Number,
    default: 1,
    min: 1
  },
  totalXP: {
    type: Number,
    default: 0,
    min: 0
  },
  rank: {
    type: String,
    enum: ['novice', 'apprentice', 'adept', 'expert', 'master', 'grandmaster'],
    default: 'novice'
  },
  skillTrees: {
    visualProcessing: {
      type: skillTreeSchema,
      default: () => ({})
    },
    logicalReasoning: {
      type: skillTreeSchema,
      default: () => ({})
    },
    memoryEnhancement: {
      type: skillTreeSchema,
      default: () => ({})
    },
    speedOptimization: {
      type: skillTreeSchema,
      default: () => ({})
    },
    aiCollaboration: {
      type: skillTreeSchema,
      default: () => ({})
    }
  },
  achievements: [achievementRecordSchema],
  statistics: {
    totalSessionsCompleted: {
      type: Number,
      default: 0
    },
    totalTimeSpent: {
      type: Number,
      default: 0
    },
    averageAccuracy: {
      type: Number,
      default: 0
    },
    bestStreak: {
      type: Number,
      default: 0
    },
    currentLoginStreak: {
      type: Number,
      default: 0
    },
    longestLoginStreak: {
      type: Number,
      default: 0
    },
    gamesPlayedByType: {
      type: Map,
      of: Number,
      default: {}
    },
    favoriteGameType: String,
    totalProblemsAttempted: {
      type: Number,
      default: 0
    },
    totalCorrectAnswers: {
      type: Number,
      default: 0
    },
    fastestResponseTime: Number,
    lastSevenDays: [dailyStatsSchema]
  },
  cognitiveGrowth: {
    initialBaseline: {
      workingMemory: Number,
      processingSpeed: Number,
      visualSpatial: Number,
      logicalReasoning: Number,
      attention: Number,
      overall: Number,
      assessmentDate: Date
    },
    currentLevels: {
      workingMemory: Number,
      processingSpeed: Number,
      visualSpatial: Number,
      logicalReasoning: Number,
      attention: Number,
      overall: Number,
      lastUpdated: Date
    },
    growthRate: {
      workingMemory: Number,
      processingSpeed: Number,
      visualSpatial: Number,
      logicalReasoning: Number,
      attention: Number,
      overall: Number
    },
    projectedGrowth: {
      oneMonth: Number,
      threeMonths: Number,
      sixMonths: Number,
      confidenceLevel: String
    }
  },
  preferences: {
    dailyGoalMinutes: {
      type: Number,
      default: 20
    },
    dailyGoalSessions: {
      type: Number,
      default: 2
    },
    preferredGameTypes: [String],
    difficultyPreference: {
      type: String,
      enum: ['easy', 'medium', 'hard', 'adaptive'],
      default: 'adaptive'
    }
  },
  streaks: {
    lastActiveDate: Date,
    currentStreak: {
      type: Number,
      default: 0
    },
    longestStreak: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Method to add XP and handle level ups
userProgressSchema.methods.addXP = function(amount) {
  this.totalXP += amount;

  // Calculate new level
  const newLevel = this.calculateLevelFromXP(this.totalXP);

  if (newLevel > this.currentLevel) {
    const levelsGained = newLevel - this.currentLevel;
    this.currentLevel = newLevel;
    this.updateStage();
    this.updateRank();

    return {
      leveledUp: true,
      newLevel: this.currentLevel,
      levelsGained
    };
  }

  return { leveledUp: false };
};

// Calculate level from total XP
userProgressSchema.methods.calculateLevelFromXP = function(xp) {
  // Formula: XP = 100 * (level ^ 1.5)
  // Inverse: level = (XP / 100) ^ (1/1.5)
  return Math.floor(Math.pow(xp / 100, 1 / 1.5)) + 1;
};

// Calculate XP required for next level
userProgressSchema.methods.getXPForNextLevel = function() {
  const nextLevel = this.currentLevel + 1;
  const xpRequired = Math.floor(100 * Math.pow(nextLevel, 1.5));
  const currentLevelXP = Math.floor(100 * Math.pow(this.currentLevel, 1.5));
  const xpNeeded = xpRequired - this.totalXP;
  const progressPercent = ((this.totalXP - currentLevelXP) / (xpRequired - currentLevelXP)) * 100;

  return {
    nextLevel,
    xpRequired,
    xpNeeded: Math.max(0, xpNeeded),
    progressPercent: Math.min(100, progressPercent)
  };
};

// Update stage based on level
userProgressSchema.methods.updateStage = function() {
  this.currentStage = Math.floor((this.currentLevel - 1) / 10) + 1;
};

// Update rank based on level
userProgressSchema.methods.updateRank = function() {
  if (this.currentLevel >= 100) {
    this.rank = 'grandmaster';
  } else if (this.currentLevel >= 76) {
    this.rank = 'master';
  } else if (this.currentLevel >= 51) {
    this.rank = 'expert';
  } else if (this.currentLevel >= 26) {
    this.rank = 'adept';
  } else if (this.currentLevel >= 11) {
    this.rank = 'apprentice';
  } else {
    this.rank = 'novice';
  }
};

// Add XP to specific skill tree
userProgressSchema.methods.addSkillTreeXP = function(skillTree, amount) {
  if (!this.skillTrees[skillTree]) {
    throw new Error(`Invalid skill tree: ${skillTree}`);
  }

  this.skillTrees[skillTree].xp += amount;

  // Calculate skill tree level
  const newLevel = Math.floor(Math.sqrt(this.skillTrees[skillTree].xp / 50)) + 1;

  if (newLevel > this.skillTrees[skillTree].level) {
    this.skillTrees[skillTree].level = newLevel;
    this.updateSkillTreeMastery(skillTree);

    return {
      leveledUp: true,
      newLevel: this.skillTrees[skillTree].level,
      skillTree
    };
  }

  return { leveledUp: false };
};

// Update skill tree mastery level
userProgressSchema.methods.updateSkillTreeMastery = function(skillTree) {
  const level = this.skillTrees[skillTree].level;

  if (level >= 20) {
    this.skillTrees[skillTree].masteryLevel = 'master';
  } else if (level >= 15) {
    this.skillTrees[skillTree].masteryLevel = 'expert';
  } else if (level >= 10) {
    this.skillTrees[skillTree].masteryLevel = 'adept';
  } else if (level >= 5) {
    this.skillTrees[skillTree].masteryLevel = 'apprentice';
  } else {
    this.skillTrees[skillTree].masteryLevel = 'novice';
  }
};

// Unlock achievement
userProgressSchema.methods.unlockAchievement = function(achievement) {
  // Check if already unlocked
  const alreadyUnlocked = this.achievements.some(a => a.achievementId === achievement.achievementId);

  if (alreadyUnlocked) {
    return { unlocked: false, reason: 'already-unlocked' };
  }

  this.achievements.push({
    achievementId: achievement.achievementId,
    name: achievement.name,
    description: achievement.description,
    category: achievement.category,
    rarity: achievement.rarity
  });

  return { unlocked: true, achievement };
};

// Update daily stats
userProgressSchema.methods.updateDailyStats = function(sessionData) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let todayStats = this.statistics.lastSevenDays.find(
    day => day.date.getTime() === today.getTime()
  );

  if (!todayStats) {
    todayStats = {
      date: today,
      sessionsCompleted: 0,
      timeSpent: 0,
      averageAccuracy: 0,
      xpEarned: 0,
      gamesPlayed: new Map()
    };
    this.statistics.lastSevenDays.push(todayStats);

    // Keep only last 7 days
    if (this.statistics.lastSevenDays.length > 7) {
      this.statistics.lastSevenDays.sort((a, b) => b.date - a.date);
      this.statistics.lastSevenDays = this.statistics.lastSevenDays.slice(0, 7);
    }
  }

  todayStats.sessionsCompleted++;
  todayStats.timeSpent += sessionData.duration || 0;
  todayStats.xpEarned += sessionData.xpEarned || 0;

  // Update average accuracy
  todayStats.averageAccuracy = (
    (todayStats.averageAccuracy * (todayStats.sessionsCompleted - 1) + (sessionData.accuracy || 0)) /
    todayStats.sessionsCompleted
  );

  // Update games played
  const gameCount = todayStats.gamesPlayed.get(sessionData.gameType) || 0;
  todayStats.gamesPlayed.set(sessionData.gameType, gameCount + 1);
};

// Update login streak
userProgressSchema.methods.updateLoginStreak = function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!this.streaks.lastActiveDate) {
    this.streaks.currentStreak = 1;
    this.streaks.lastActiveDate = today;
    return;
  }

  const lastActive = new Date(this.streaks.lastActiveDate);
  lastActive.setHours(0, 0, 0, 0);

  const daysDiff = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));

  if (daysDiff === 0) {
    // Same day, no change
    return;
  } else if (daysDiff === 1) {
    // Consecutive day
    this.streaks.currentStreak++;
    if (this.streaks.currentStreak > this.streaks.longestStreak) {
      this.streaks.longestStreak = this.streaks.currentStreak;
    }
  } else {
    // Streak broken
    this.streaks.currentStreak = 1;
  }

  this.streaks.lastActiveDate = today;
};

// Set initial cognitive baseline
userProgressSchema.methods.setInitialBaseline = function(assessmentScores) {
  this.cognitiveGrowth.initialBaseline = {
    workingMemory: assessmentScores.workingMemory,
    processingSpeed: assessmentScores.processingSpeed,
    visualSpatial: assessmentScores.visualSpatial,
    logicalReasoning: assessmentScores.logicalReasoning,
    attention: assessmentScores.attention,
    overall: assessmentScores.overall,
    assessmentDate: new Date()
  };

  // Initialize current levels to baseline
  this.cognitiveGrowth.currentLevels = { ...this.cognitiveGrowth.initialBaseline };
  this.cognitiveGrowth.currentLevels.lastUpdated = new Date();
};

// Update current cognitive levels
userProgressSchema.methods.updateCognitiveLevels = function(assessmentScores) {
  this.cognitiveGrowth.currentLevels = {
    workingMemory: assessmentScores.workingMemory,
    processingSpeed: assessmentScores.processingSpeed,
    visualSpatial: assessmentScores.visualSpatial,
    logicalReasoning: assessmentScores.logicalReasoning,
    attention: assessmentScores.attention,
    overall: assessmentScores.overall,
    lastUpdated: new Date()
  };

  this.calculateGrowthRates();
};

// Calculate growth rates
userProgressSchema.methods.calculateGrowthRates = function() {
  if (!this.cognitiveGrowth.initialBaseline.overall) {
    return;
  }

  const initial = this.cognitiveGrowth.initialBaseline;
  const current = this.cognitiveGrowth.currentLevels;
  const daysSinceBaseline = Math.max(1,
    (current.lastUpdated - initial.assessmentDate) / (1000 * 60 * 60 * 24)
  );

  const metrics = ['workingMemory', 'processingSpeed', 'visualSpatial', 'logicalReasoning', 'attention', 'overall'];

  metrics.forEach(metric => {
    const change = current[metric] - initial[metric];
    const dailyRate = change / daysSinceBaseline;
    this.cognitiveGrowth.growthRate[metric] = Math.round(dailyRate * 100) / 100;
  });

  // Project future growth
  const avgDailyRate = this.cognitiveGrowth.growthRate.overall;
  this.cognitiveGrowth.projectedGrowth = {
    oneMonth: Math.round((current.overall + avgDailyRate * 30) * 10) / 10,
    threeMonths: Math.round((current.overall + avgDailyRate * 90) * 10) / 10,
    sixMonths: Math.round((current.overall + avgDailyRate * 180) * 10) / 10,
    confidenceLevel: daysSinceBaseline > 30 ? 'high' : daysSinceBaseline > 14 ? 'medium' : 'low'
  };
};

// Get progress summary
userProgressSchema.methods.getProgressSummary = function() {
  return {
    level: this.currentLevel,
    stage: this.currentStage,
    rank: this.rank,
    totalXP: this.totalXP,
    nextLevel: this.getXPForNextLevel(),
    achievements: this.achievements.length,
    totalSessions: this.statistics.totalSessionsCompleted,
    averageAccuracy: Math.round(this.statistics.averageAccuracy * 10) / 10,
    currentStreak: this.streaks.currentStreak,
    cognitiveGrowth: this.cognitiveGrowth.growthRate?.overall || 0
  };
};

// Indexes for performance
userProgressSchema.index({ userId: 1 }, { unique: true });
userProgressSchema.index({ currentLevel: -1 });
userProgressSchema.index({ totalXP: -1 });
userProgressSchema.index({ rank: 1 });

const UserProgress = mongoose.model('UserProgress', userProgressSchema);

module.exports = UserProgress;
