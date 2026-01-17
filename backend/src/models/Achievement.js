const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  achievementId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['milestone', 'mastery', 'consistency', 'speed', 'special', 'social'],
    required: true
  },
  criteria: {
    type: {
      type: String,
      enum: [
        'sessions_completed',
        'accuracy_threshold',
        'streak_achieved',
        'level_reached',
        'xp_earned',
        'time_spent',
        'perfect_session',
        'speed_record',
        'skill_tree_mastery',
        'specific_game_completion',
        'cognitive_improvement',
        'consecutive_days'
      ],
      required: true
    },
    value: mongoose.Schema.Types.Mixed, // Can be number, object, etc.
    gameType: String, // Optional, for game-specific achievements
    comparison: {
      type: String,
      enum: ['equals', 'greater_than', 'less_than', 'greater_or_equal', 'less_or_equal'],
      default: 'greater_or_equal'
    }
  },
  reward: {
    xp: {
      type: Number,
      default: 0,
      min: 0
    },
    badge: {
      type: String,
      required: true
    },
    unlocks: [String], // Features, themes, or content unlocked
    title: String // Optional title badge for user profile
  },
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  isSecret: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Static method to check if user meets criteria for an achievement
achievementSchema.statics.checkCriteria = function(criteria, userStats) {
  const { type, value, comparison, gameType } = criteria;

  let userValue;

  switch (type) {
    case 'sessions_completed':
      userValue = gameType
        ? (userStats.gamesPlayedByType?.get(gameType) || 0)
        : userStats.totalSessionsCompleted;
      break;

    case 'accuracy_threshold':
      userValue = userStats.averageAccuracy;
      break;

    case 'streak_achieved':
      userValue = userStats.bestStreak;
      break;

    case 'level_reached':
      userValue = userStats.currentLevel;
      break;

    case 'xp_earned':
      userValue = userStats.totalXP;
      break;

    case 'time_spent':
      userValue = userStats.totalTimeSpent;
      break;

    case 'consecutive_days':
      userValue = userStats.currentLoginStreak;
      break;

    case 'speed_record':
      userValue = userStats.fastestResponseTime;
      return comparison === 'less_than' ? userValue < value : userValue <= value;

    case 'perfect_session':
      // This requires session-specific check
      return userStats.lastSessionAccuracy === 100;

    case 'skill_tree_mastery':
      userValue = userStats.skillTrees?.[value.skillTree]?.level || 0;
      return userValue >= value.level;

    case 'cognitive_improvement':
      userValue = userStats.cognitiveGrowthRate;
      break;

    default:
      return false;
  }

  // Compare based on comparison operator
  switch (comparison) {
    case 'equals':
      return userValue === value;
    case 'greater_than':
      return userValue > value;
    case 'less_than':
      return userValue < value;
    case 'greater_or_equal':
      return userValue >= value;
    case 'less_or_equal':
      return userValue <= value;
    default:
      return false;
  }
};

// Static method to initialize default achievements
achievementSchema.statics.initializeDefaultAchievements = async function() {
  const defaultAchievements = [
    // Milestone Achievements
    {
      achievementId: 'first_session',
      name: 'First Steps',
      description: 'Complete your first game session',
      category: 'milestone',
      criteria: {
        type: 'sessions_completed',
        value: 1,
        comparison: 'greater_or_equal'
      },
      reward: {
        xp: 50,
        badge: '🎯',
        unlocks: [],
        title: 'Beginner'
      },
      rarity: 'common',
      order: 1
    },
    {
      achievementId: 'ten_sessions',
      name: 'Getting Started',
      description: 'Complete 10 game sessions',
      category: 'milestone',
      criteria: {
        type: 'sessions_completed',
        value: 10,
        comparison: 'greater_or_equal'
      },
      reward: {
        xp: 100,
        badge: '🌟',
        unlocks: ['custom_themes']
      },
      rarity: 'common',
      order: 2
    },
    {
      achievementId: 'fifty_sessions',
      name: 'Dedicated Learner',
      description: 'Complete 50 game sessions',
      category: 'milestone',
      criteria: {
        type: 'sessions_completed',
        value: 50,
        comparison: 'greater_or_equal'
      },
      reward: {
        xp: 500,
        badge: '🏆',
        unlocks: ['advanced_stats']
      },
      rarity: 'rare',
      order: 3
    },
    {
      achievementId: 'hundred_sessions',
      name: 'Century Club',
      description: 'Complete 100 game sessions',
      category: 'milestone',
      criteria: {
        type: 'sessions_completed',
        value: 100,
        comparison: 'greater_or_equal'
      },
      reward: {
        xp: 1000,
        badge: '💯',
        unlocks: ['expert_mode'],
        title: 'Centurion'
      },
      rarity: 'epic',
      order: 4
    },

    // Mastery Achievements
    {
      achievementId: 'accuracy_master',
      name: 'Accuracy Master',
      description: 'Maintain 90% average accuracy',
      category: 'mastery',
      criteria: {
        type: 'accuracy_threshold',
        value: 90,
        comparison: 'greater_or_equal'
      },
      reward: {
        xp: 500,
        badge: '🎯',
        unlocks: [],
        title: 'Sharpshooter'
      },
      rarity: 'epic',
      order: 10
    },
    {
      achievementId: 'perfect_game',
      name: 'Perfection',
      description: 'Complete a session with 100% accuracy',
      category: 'mastery',
      criteria: {
        type: 'perfect_session',
        value: true,
        comparison: 'equals'
      },
      reward: {
        xp: 200,
        badge: '✨',
        unlocks: []
      },
      rarity: 'rare',
      order: 11
    },

    // Consistency Achievements
    {
      achievementId: 'streak_3',
      name: 'On a Roll',
      description: 'Maintain a 3-day login streak',
      category: 'consistency',
      criteria: {
        type: 'consecutive_days',
        value: 3,
        comparison: 'greater_or_equal'
      },
      reward: {
        xp: 100,
        badge: '🔥',
        unlocks: []
      },
      rarity: 'common',
      order: 20
    },
    {
      achievementId: 'streak_7',
      name: 'Week Warrior',
      description: 'Maintain a 7-day login streak',
      category: 'consistency',
      criteria: {
        type: 'consecutive_days',
        value: 7,
        comparison: 'greater_or_equal'
      },
      reward: {
        xp: 300,
        badge: '🔥🔥',
        unlocks: [],
        title: 'Consistent'
      },
      rarity: 'rare',
      order: 21
    },
    {
      achievementId: 'streak_30',
      name: 'Month Master',
      description: 'Maintain a 30-day login streak',
      category: 'consistency',
      criteria: {
        type: 'consecutive_days',
        value: 30,
        comparison: 'greater_or_equal'
      },
      reward: {
        xp: 1000,
        badge: '🔥🔥🔥',
        unlocks: ['streak_protector'],
        title: 'Unstoppable'
      },
      rarity: 'legendary',
      order: 22
    },

    // Speed Achievements
    {
      achievementId: 'speed_demon',
      name: 'Speed Demon',
      description: 'Answer a question in under 2 seconds',
      category: 'speed',
      criteria: {
        type: 'speed_record',
        value: 2000,
        comparison: 'less_than'
      },
      reward: {
        xp: 150,
        badge: '⚡',
        unlocks: []
      },
      rarity: 'rare',
      order: 30
    },
    {
      achievementId: 'lightning_fast',
      name: 'Lightning Fast',
      description: 'Answer a question in under 1 second',
      category: 'speed',
      criteria: {
        type: 'speed_record',
        value: 1000,
        comparison: 'less_than'
      },
      reward: {
        xp: 300,
        badge: '⚡⚡',
        unlocks: [],
        title: 'Lightning'
      },
      rarity: 'epic',
      order: 31
    },

    // Level Achievements
    {
      achievementId: 'level_10',
      name: 'Rising Star',
      description: 'Reach level 10',
      category: 'milestone',
      criteria: {
        type: 'level_reached',
        value: 10,
        comparison: 'greater_or_equal'
      },
      reward: {
        xp: 200,
        badge: '⭐',
        unlocks: []
      },
      rarity: 'common',
      order: 40
    },
    {
      achievementId: 'level_25',
      name: 'Apprentice Graduate',
      description: 'Reach level 25',
      category: 'milestone',
      criteria: {
        type: 'level_reached',
        value: 25,
        comparison: 'greater_or_equal'
      },
      reward: {
        xp: 500,
        badge: '🌟',
        unlocks: [],
        title: 'Apprentice'
      },
      rarity: 'rare',
      order: 41
    },
    {
      achievementId: 'level_50',
      name: 'Adept Master',
      description: 'Reach level 50',
      category: 'milestone',
      criteria: {
        type: 'level_reached',
        value: 50,
        comparison: 'greater_or_equal'
      },
      reward: {
        xp: 1000,
        badge: '💫',
        unlocks: ['adept_games'],
        title: 'Adept'
      },
      rarity: 'epic',
      order: 42
    },
    {
      achievementId: 'level_100',
      name: 'Grandmaster',
      description: 'Reach level 100',
      category: 'milestone',
      criteria: {
        type: 'level_reached',
        value: 100,
        comparison: 'greater_or_equal'
      },
      reward: {
        xp: 5000,
        badge: '👑',
        unlocks: ['grandmaster_mode', 'custom_challenges'],
        title: 'Grandmaster'
      },
      rarity: 'legendary',
      order: 43
    },

    // Special Achievements
    {
      achievementId: 'ai_ready',
      name: 'AI Ready',
      description: 'Achieve 80+ AI Readiness Score',
      category: 'special',
      criteria: {
        type: 'cognitive_improvement',
        value: 80,
        comparison: 'greater_or_equal'
      },
      reward: {
        xp: 1000,
        badge: '🤖',
        unlocks: ['ai_certification'],
        title: 'AI Ready'
      },
      rarity: 'epic',
      order: 50
    },
    {
      achievementId: 'cognitive_growth',
      name: 'Brain Booster',
      description: 'Improve cognitive score by 15+ points',
      category: 'special',
      criteria: {
        type: 'cognitive_improvement',
        value: 15,
        comparison: 'greater_or_equal'
      },
      reward: {
        xp: 500,
        badge: '🧠',
        unlocks: []
      },
      rarity: 'rare',
      order: 51
    },

    // Skill Tree Achievements
    {
      achievementId: 'visual_master',
      name: 'Visual Master',
      description: 'Reach level 15 in Visual Processing',
      category: 'mastery',
      criteria: {
        type: 'skill_tree_mastery',
        value: { skillTree: 'visualProcessing', level: 15 }
      },
      reward: {
        xp: 500,
        badge: '👁️',
        unlocks: [],
        title: 'Visual Master'
      },
      rarity: 'epic',
      order: 60
    },
    {
      achievementId: 'logic_master',
      name: 'Logic Master',
      description: 'Reach level 15 in Logical Reasoning',
      category: 'mastery',
      criteria: {
        type: 'skill_tree_mastery',
        value: { skillTree: 'logicalReasoning', level: 15 }
      },
      reward: {
        xp: 500,
        badge: '🧩',
        unlocks: [],
        title: 'Logic Master'
      },
      rarity: 'epic',
      order: 61
    }
  ];

  // Insert achievements if they don't exist
  for (const achievement of defaultAchievements) {
    await this.findOneAndUpdate(
      { achievementId: achievement.achievementId },
      achievement,
      { upsert: true, new: true }
    );
  }

  return defaultAchievements.length;
};

// Indexes
achievementSchema.index({ achievementId: 1 }, { unique: true });
achievementSchema.index({ category: 1 });
achievementSchema.index({ rarity: 1 });
achievementSchema.index({ isActive: 1 });
achievementSchema.index({ order: 1 });

const Achievement = mongoose.model('Achievement', achievementSchema);

module.exports = Achievement;
