/**
 * Achievement Seed Data
 * 50+ predefined achievements across multiple categories and rarity levels
 */

const achievements = [
  // MILESTONE ACHIEVEMENTS
  {
    achievementId: 'first-steps',
    name: 'First Steps',
    description: 'Complete your first game session',
    category: 'milestone',
    rarity: 'common',
    criteria: {
      type: 'sessions_completed',
      value: 1
    },
    reward: {
      xp: 50,
      badge: 'first-steps',
      unlocks: []
    },
    order: 1,
    isActive: true
  },
  {
    achievementId: 'getting-started',
    name: 'Getting Started',
    description: 'Complete 10 game sessions',
    category: 'milestone',
    rarity: 'common',
    criteria: {
      type: 'sessions_completed',
      value: 10
    },
    reward: {
      xp: 100,
      badge: 'getting-started',
      unlocks: []
    },
    order: 2,
    isActive: true
  },
  {
    achievementId: 'dedicated-learner',
    name: 'Dedicated Learner',
    description: 'Complete 50 game sessions',
    category: 'milestone',
    rarity: 'rare',
    criteria: {
      type: 'sessions_completed',
      value: 50
    },
    reward: {
      xp: 250,
      badge: 'dedicated-learner',
      unlocks: ['special-theme-blue']
    },
    order: 3,
    isActive: true
  },
  {
    achievementId: 'centurion',
    name: 'Centurion',
    description: 'Complete 100 game sessions',
    category: 'milestone',
    rarity: 'epic',
    criteria: {
      type: 'sessions_completed',
      value: 100
    },
    reward: {
      xp: 500,
      badge: 'centurion',
      unlocks: ['special-theme-purple']
    },
    order: 4,
    isActive: true
  },
  {
    achievementId: 'training-master',
    name: 'Training Master',
    description: 'Complete 500 game sessions',
    category: 'milestone',
    rarity: 'legendary',
    criteria: {
      type: 'sessions_completed',
      value: 500
    },
    reward: {
      xp: 1000,
      badge: 'training-master',
      unlocks: ['special-theme-gold']
    },
    order: 5,
    isActive: true
  },

  // LEVEL ACHIEVEMENTS
  {
    achievementId: 'level-5',
    name: 'Level 5',
    description: 'Reach Level 5',
    category: 'milestone',
    rarity: 'common',
    criteria: {
      type: 'level_reached',
      value: 5
    },
    reward: {
      xp: 100,
      badge: 'level-5',
      unlocks: []
    },
    order: 10,
    isActive: true
  },
  {
    achievementId: 'level-10',
    name: 'Level 10',
    description: 'Reach Level 10',
    category: 'milestone',
    rarity: 'common',
    criteria: {
      type: 'level_reached',
      value: 10
    },
    reward: {
      xp: 200,
      badge: 'level-10',
      unlocks: ['ai-collaboration-game']
    },
    order: 11,
    isActive: true
  },
  {
    achievementId: 'level-25',
    name: 'Quarter Century',
    description: 'Reach Level 25',
    category: 'milestone',
    rarity: 'rare',
    criteria: {
      type: 'level_reached',
      value: 25
    },
    reward: {
      xp: 500,
      badge: 'level-25',
      unlocks: []
    },
    order: 12,
    isActive: true
  },
  {
    achievementId: 'level-50',
    name: 'Half Century',
    description: 'Reach Level 50',
    category: 'milestone',
    rarity: 'epic',
    criteria: {
      type: 'level_reached',
      value: 50
    },
    reward: {
      xp: 1000,
      badge: 'level-50',
      unlocks: ['advanced-analytics']
    },
    order: 13,
    isActive: true
  },
  {
    achievementId: 'level-100',
    name: 'Grandmaster',
    description: 'Reach Level 100',
    category: 'milestone',
    rarity: 'legendary',
    criteria: {
      type: 'level_reached',
      value: 100
    },
    reward: {
      xp: 5000,
      badge: 'grandmaster',
      unlocks: ['grandmaster-title', 'special-avatar-frame']
    },
    order: 14,
    isActive: true
  },

  // MASTERY ACHIEVEMENTS
  {
    achievementId: 'perfect-score',
    name: 'Perfect Score',
    description: 'Achieve 100% accuracy in a game',
    category: 'mastery',
    rarity: 'rare',
    criteria: {
      type: 'perfect_game',
      value: 1
    },
    reward: {
      xp: 200,
      badge: 'perfect-score',
      unlocks: []
    },
    order: 20,
    isActive: true
  },
  {
    achievementId: 'accuracy-expert',
    name: 'Accuracy Expert',
    description: 'Maintain 90% average accuracy across 25 games',
    category: 'mastery',
    rarity: 'epic',
    criteria: {
      type: 'accuracy_threshold',
      value: 90,
      minGames: 25
    },
    reward: {
      xp: 500,
      badge: 'accuracy-expert',
      unlocks: []
    },
    order: 21,
    isActive: true
  },
  {
    achievementId: 'visual-master',
    name: 'Visual Pattern Master',
    description: 'Complete 25 visual pattern games',
    category: 'mastery',
    rarity: 'rare',
    criteria: {
      type: 'sessions_completed',
      value: 25,
      gameType: 'visual-pattern'
    },
    reward: {
      xp: 300,
      badge: 'visual-master',
      unlocks: []
    },
    order: 22,
    isActive: true
  },
  {
    achievementId: 'sequence-master',
    name: 'Sequence Master',
    description: 'Complete 25 sequence recognition games',
    category: 'mastery',
    rarity: 'rare',
    criteria: {
      type: 'sessions_completed',
      value: 25,
      gameType: 'sequence'
    },
    reward: {
      xp: 300,
      badge: 'sequence-master',
      unlocks: []
    },
    order: 23,
    isActive: true
  },
  {
    achievementId: 'memory-master',
    name: 'Memory Master',
    description: 'Complete 25 memory training games',
    category: 'mastery',
    rarity: 'rare',
    criteria: {
      type: 'sessions_completed',
      value: 25,
      gameType: 'memory'
    },
    reward: {
      xp: 300,
      badge: 'memory-master',
      unlocks: []
    },
    order: 24,
    isActive: true
  },
  {
    achievementId: 'logical-master',
    name: 'Logic Master',
    description: 'Complete 25 logical reasoning games',
    category: 'mastery',
    rarity: 'rare',
    criteria: {
      type: 'sessions_completed',
      value: 25,
      gameType: 'logical'
    },
    reward: {
      xp: 300,
      badge: 'logical-master',
      unlocks: []
    },
    order: 25,
    isActive: true
  },
  {
    achievementId: 'spatial-master',
    name: 'Spatial Master',
    description: 'Complete 25 spatial reasoning games',
    category: 'mastery',
    rarity: 'epic',
    criteria: {
      type: 'sessions_completed',
      value: 25,
      gameType: 'spatial'
    },
    reward: {
      xp: 400,
      badge: 'spatial-master',
      unlocks: []
    },
    order: 26,
    isActive: true
  },
  {
    achievementId: 'speed-demon',
    name: 'Speed Demon',
    description: 'Complete 25 speed challenge games',
    category: 'mastery',
    rarity: 'epic',
    criteria: {
      type: 'sessions_completed',
      value: 25,
      gameType: 'speed'
    },
    reward: {
      xp: 400,
      badge: 'speed-demon',
      unlocks: []
    },
    order: 27,
    isActive: true
  },
  {
    achievementId: 'ai-collaborator',
    name: 'AI Collaborator',
    description: 'Complete 25 AI collaboration games',
    category: 'mastery',
    rarity: 'legendary',
    criteria: {
      type: 'sessions_completed',
      value: 25,
      gameType: 'ai-collaboration'
    },
    reward: {
      xp: 500,
      badge: 'ai-collaborator',
      unlocks: ['ai-certification']
    },
    order: 28,
    isActive: true
  },
  {
    achievementId: 'polymath',
    name: 'Polymath',
    description: 'Master all 7 game types (25+ games each)',
    category: 'mastery',
    rarity: 'legendary',
    criteria: {
      type: 'all_games_mastery',
      value: 25
    },
    reward: {
      xp: 2000,
      badge: 'polymath',
      unlocks: ['polymath-title', 'rainbow-theme']
    },
    order: 29,
    isActive: true
  },

  // CONSISTENCY ACHIEVEMENTS
  {
    achievementId: 'week-warrior',
    name: 'Week Warrior',
    description: 'Maintain a 7-day login streak',
    category: 'consistency',
    rarity: 'common',
    criteria: {
      type: 'consecutive_days',
      value: 7
    },
    reward: {
      xp: 150,
      badge: 'week-warrior',
      unlocks: []
    },
    order: 30,
    isActive: true
  },
  {
    achievementId: 'month-champion',
    name: 'Month Champion',
    description: 'Maintain a 30-day login streak',
    category: 'consistency',
    rarity: 'rare',
    criteria: {
      type: 'consecutive_days',
      value: 30
    },
    reward: {
      xp: 500,
      badge: 'month-champion',
      unlocks: ['streak-multiplier-1.5x']
    },
    order: 31,
    isActive: true
  },
  {
    achievementId: 'year-legend',
    name: 'Year Legend',
    description: 'Maintain a 365-day login streak',
    category: 'consistency',
    rarity: 'legendary',
    criteria: {
      type: 'consecutive_days',
      value: 365
    },
    reward: {
      xp: 5000,
      badge: 'year-legend',
      unlocks: ['legendary-title', 'diamond-avatar']
    },
    order: 32,
    isActive: true
  },
  {
    achievementId: 'unstoppable',
    name: 'Unstoppable Streak',
    description: 'Achieve a 10-game correct answer streak',
    category: 'consistency',
    rarity: 'rare',
    criteria: {
      type: 'streak_achieved',
      value: 10
    },
    reward: {
      xp: 300,
      badge: 'unstoppable',
      unlocks: []
    },
    order: 33,
    isActive: true
  },
  {
    achievementId: 'flawless',
    name: 'Flawless Performance',
    description: 'Achieve a 20-game correct answer streak',
    category: 'consistency',
    rarity: 'epic',
    criteria: {
      type: 'streak_achieved',
      value: 20
    },
    reward: {
      xp: 750,
      badge: 'flawless',
      unlocks: []
    },
    order: 34,
    isActive: true
  },

  // SPEED ACHIEVEMENTS
  {
    achievementId: 'lightning-fast',
    name: 'Lightning Fast',
    description: 'Complete a game with average response time under 2 seconds',
    category: 'speed',
    rarity: 'rare',
    criteria: {
      type: 'fast_completion',
      value: 2000 // milliseconds
    },
    reward: {
      xp: 250,
      badge: 'lightning-fast',
      unlocks: []
    },
    order: 40,
    isActive: true
  },
  {
    achievementId: 'speed-master',
    name: 'Speed Master',
    description: 'Complete 10 games with 90%+ accuracy and sub-3s average time',
    category: 'speed',
    rarity: 'epic',
    criteria: {
      type: 'speed_accuracy_combo',
      accuracy: 90,
      avgTime: 3000,
      count: 10
    },
    reward: {
      xp: 500,
      badge: 'speed-master',
      unlocks: []
    },
    order: 41,
    isActive: true
  },
  {
    achievementId: 'flash',
    name: 'The Flash',
    description: 'Achieve fastest response time under 500ms with correct answer',
    category: 'speed',
    rarity: 'legendary',
    criteria: {
      type: 'fastest_response',
      value: 500
    },
    reward: {
      xp: 1000,
      badge: 'flash',
      unlocks: ['speed-boost-powerup']
    },
    order: 42,
    isActive: true
  },

  // SPECIAL ACHIEVEMENTS
  {
    achievementId: 'early-bird',
    name: 'Early Bird',
    description: 'Complete a game session before 6 AM',
    category: 'special',
    rarity: 'rare',
    criteria: {
      type: 'time_of_day',
      startHour: 0,
      endHour: 6
    },
    reward: {
      xp: 200,
      badge: 'early-bird',
      unlocks: []
    },
    order: 50,
    isActive: true
  },
  {
    achievementId: 'night-owl',
    name: 'Night Owl',
    description: 'Complete a game session after midnight',
    category: 'special',
    rarity: 'rare',
    criteria: {
      type: 'time_of_day',
      startHour: 0,
      endHour: 4
    },
    reward: {
      xp: 200,
      badge: 'night-owl',
      unlocks: []
    },
    order: 51,
    isActive: true
  },
  {
    achievementId: 'comeback-kid',
    name: 'Comeback Kid',
    description: 'Improve accuracy by 20% or more in reassessment',
    category: 'special',
    rarity: 'epic',
    criteria: {
      type: 'improvement',
      metric: 'accuracy',
      change: 20
    },
    reward: {
      xp: 500,
      badge: 'comeback-kid',
      unlocks: []
    },
    order: 52,
    isActive: true
  },
  {
    achievementId: 'cognitive-growth',
    name: 'Cognitive Growth',
    description: 'Increase overall cognitive score by 15 points',
    category: 'special',
    rarity: 'epic',
    criteria: {
      type: 'cognitive_improvement',
      value: 15
    },
    reward: {
      xp: 750,
      badge: 'cognitive-growth',
      unlocks: []
    },
    order: 53,
    isActive: true
  },
  {
    achievementId: 'ai-ready',
    name: 'AI Ready',
    description: 'Achieve AI Readiness score of 80 or higher',
    category: 'special',
    rarity: 'legendary',
    criteria: {
      type: 'ai_readiness',
      value: 80
    },
    reward: {
      xp: 1000,
      badge: 'ai-ready',
      unlocks: ['ai-ready-certification']
    },
    order: 54,
    isActive: true
  },
  {
    achievementId: 'explorer',
    name: 'Explorer',
    description: 'Try all 7 game types at least once',
    category: 'special',
    rarity: 'common',
    criteria: {
      type: 'all_games_tried',
      value: 1
    },
    reward: {
      xp: 200,
      badge: 'explorer',
      unlocks: []
    },
    order: 55,
    isActive: true
  },
  {
    achievementId: 'well-rounded',
    name: 'Well Rounded',
    description: 'Complete at least 5 games in each game type',
    category: 'special',
    rarity: 'rare',
    criteria: {
      type: 'balanced_training',
      value: 5
    },
    reward: {
      xp: 400,
      badge: 'well-rounded',
      unlocks: []
    },
    order: 56,
    isActive: true
  },
  {
    achievementId: 'skill-tree-master',
    name: 'Skill Tree Master',
    description: 'Reach level 10 in any skill tree',
    category: 'mastery',
    rarity: 'epic',
    criteria: {
      type: 'skill_tree_mastery',
      skillTree: 'any',
      level: 10
    },
    reward: {
      xp: 600,
      badge: 'skill-tree-master',
      unlocks: []
    },
    order: 57,
    isActive: true
  },
  {
    achievementId: 'skill-tree-legend',
    name: 'Skill Tree Legend',
    description: 'Reach level 20 in any skill tree',
    category: 'mastery',
    rarity: 'legendary',
    criteria: {
      type: 'skill_tree_mastery',
      skillTree: 'any',
      level: 20
    },
    reward: {
      xp: 1500,
      badge: 'skill-tree-legend',
      unlocks: ['master-title']
    },
    order: 58,
    isActive: true
  },
  {
    achievementId: 'no-hints-needed',
    name: 'No Hints Needed',
    description: 'Complete 10 games without using any hints',
    category: 'mastery',
    rarity: 'rare',
    criteria: {
      type: 'no_hints',
      value: 10
    },
    reward: {
      xp: 350,
      badge: 'no-hints-needed',
      unlocks: []
    },
    order: 59,
    isActive: true
  },
  {
    achievementId: 'leaderboard-top-10',
    name: 'Top 10',
    description: 'Reach top 10 on global leaderboard',
    category: 'special',
    rarity: 'legendary',
    criteria: {
      type: 'leaderboard_rank',
      value: 10
    },
    reward: {
      xp: 2000,
      badge: 'top-10',
      unlocks: ['champion-title', 'gold-avatar-frame']
    },
    order: 60,
    isActive: true
  },
  {
    achievementId: 'number-one',
    name: 'Number One',
    description: 'Reach #1 on global leaderboard',
    category: 'special',
    rarity: 'legendary',
    criteria: {
      type: 'leaderboard_rank',
      value: 1
    },
    reward: {
      xp: 5000,
      badge: 'number-one',
      unlocks: ['world-champion-title', 'platinum-avatar-frame']
    },
    order: 61,
    isActive: true
  },
  {
    achievementId: 'social-butterfly',
    name: 'Social Butterfly',
    description: 'Connect with 10 friends',
    category: 'special',
    rarity: 'common',
    criteria: {
      type: 'friends_count',
      value: 10
    },
    reward: {
      xp: 100,
      badge: 'social-butterfly',
      unlocks: []
    },
    order: 62,
    isActive: true
  },
  {
    achievementId: 'mentor',
    name: 'Mentor',
    description: 'Help 5 friends complete their first assessment',
    category: 'special',
    rarity: 'epic',
    criteria: {
      type: 'referrals',
      value: 5
    },
    reward: {
      xp: 500,
      badge: 'mentor',
      unlocks: []
    },
    order: 63,
    isActive: true
  }
];

module.exports = achievements;
