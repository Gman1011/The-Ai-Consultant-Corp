const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  problemId: {
    type: String,
    required: true
  },
  difficulty: {
    type: Number,
    min: 1,
    max: 100,
    required: true
  },
  presented: {
    type: Date,
    default: Date.now
  },
  answered: Date,
  responseTime: Number, // milliseconds
  correct: Boolean,
  userAnswer: mongoose.Schema.Types.Mixed,
  correctAnswer: mongoose.Schema.Types.Mixed,
  hintsUsed: {
    type: Number,
    default: 0
  },
  skipped: {
    type: Boolean,
    default: false
  }
});

const gameSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  gameType: {
    type: String,
    enum: [
      'visual-pattern',
      'sequence',
      'spatial',
      'logical',
      'memory',
      'speed',
      'ai-collaboration',
      'n-back',
      'working-memory',
      'data-patterns'
    ],
    required: true
  },
  difficulty: {
    type: Number,
    min: 1,
    max: 100,
    default: 20
  },
  level: {
    type: Number,
    min: 1,
    default: 1
  },
  stage: {
    type: Number,
    min: 1,
    default: 1
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: Date,
  duration: Number, // seconds
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'abandoned'],
    default: 'in-progress'
  },
  problems: [problemSchema],
  results: {
    totalProblems: {
      type: Number,
      default: 0
    },
    correctAnswers: {
      type: Number,
      default: 0
    },
    accuracy: {
      type: Number,
      default: 0
    },
    averageResponseTime: Number,
    fastestResponse: Number,
    slowestResponse: Number,
    streakBest: {
      type: Number,
      default: 0
    },
    currentStreak: {
      type: Number,
      default: 0
    },
    score: {
      type: Number,
      default: 0
    },
    xpEarned: {
      type: Number,
      default: 0
    },
    bonusXP: {
      type: Number,
      default: 0
    }
  },
  adaptiveAdjustments: {
    startingDifficulty: Number,
    endingDifficulty: Number,
    adjustmentsMade: {
      type: Number,
      default: 0
    },
    difficultyHistory: [{
      problemNumber: Number,
      difficulty: Number,
      reason: String
    }]
  },
  performanceMetrics: {
    consistencyScore: Number, // 0-100, measures variance
    focusScore: Number, // based on response time stability
    improvementRate: Number, // compared to previous sessions
    flowStateAchieved: Boolean,
    cognitiveLoad: String // 'low', 'optimal', 'high'
  }
}, {
  timestamps: true
});

// Method to add a problem to the session
gameSessionSchema.methods.addProblem = function(problem) {
  this.problems.push(problem);
  this.results.totalProblems = this.problems.length;
};

// Method to submit an answer
gameSessionSchema.methods.submitAnswer = function(problemId, userAnswer) {
  const problem = this.problems.id(problemId);
  if (!problem) {
    throw new Error('Problem not found');
  }

  problem.answered = new Date();
  problem.responseTime = problem.answered - problem.presented;
  problem.userAnswer = userAnswer;
  problem.correct = this.checkAnswer(problem.correctAnswer, userAnswer);

  // Update results
  if (problem.correct) {
    this.results.correctAnswers++;
    this.results.currentStreak++;
    if (this.results.currentStreak > this.results.streakBest) {
      this.results.streakBest = this.results.currentStreak;
    }
  } else {
    this.results.currentStreak = 0;
  }

  this.results.accuracy = (this.results.correctAnswers / this.results.totalProblems) * 100;

  return problem;
};

// Helper method to check if answer is correct
gameSessionSchema.methods.checkAnswer = function(correctAnswer, userAnswer) {
  // Deep comparison for objects and arrays
  if (typeof correctAnswer === 'object') {
    return JSON.stringify(correctAnswer) === JSON.stringify(userAnswer);
  }
  return correctAnswer === userAnswer;
};

// Method to calculate final results
gameSessionSchema.methods.calculateResults = function() {
  const answeredProblems = this.problems.filter(p => p.answered && !p.skipped);

  if (answeredProblems.length === 0) {
    return this.results;
  }

  // Calculate response times
  const responseTimes = answeredProblems.map(p => p.responseTime);
  this.results.averageResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
  this.results.fastestResponse = Math.min(...responseTimes);
  this.results.slowestResponse = Math.max(...responseTimes);

  // Calculate score (accuracy + speed bonus + streak bonus)
  const accuracyScore = this.results.accuracy * 10; // 0-1000
  const speedBonus = this.calculateSpeedBonus();
  const streakBonus = this.results.streakBest * 50;
  const difficultyMultiplier = 1 + (this.difficulty / 100);

  this.results.score = Math.round(
    (accuracyScore + speedBonus + streakBonus) * difficultyMultiplier
  );

  // Calculate XP
  this.results.xpEarned = this.calculateXP();

  // Calculate performance metrics
  this.calculatePerformanceMetrics();

  return this.results;
};

// Method to calculate speed bonus
gameSessionSchema.methods.calculateSpeedBonus = function() {
  const answeredProblems = this.problems.filter(p => p.answered && !p.skipped && p.correct);
  if (answeredProblems.length === 0) return 0;

  // Fast responses get bonus (under 5 seconds = good)
  const fastResponses = answeredProblems.filter(p => p.responseTime < 5000).length;
  return fastResponses * 100;
};

// Method to calculate XP earned
gameSessionSchema.methods.calculateXP = function() {
  // Base XP from correct answers
  const baseXP = this.results.correctAnswers * 10;

  // Accuracy bonus
  const accuracyBonus = this.results.accuracy > 80 ? 50 : 0;

  // Streak bonus
  const streakBonus = this.results.streakBest >= 5 ? this.results.streakBest * 10 : 0;

  // Difficulty multiplier
  const difficultyMultiplier = 1 + (this.difficulty / 50);

  // Completion bonus
  const completionBonus = this.status === 'completed' ? 20 : 0;

  const totalXP = Math.round(
    (baseXP + accuracyBonus + streakBonus + completionBonus) * difficultyMultiplier
  );

  this.results.bonusXP = totalXP - baseXP;

  return totalXP;
};

// Method to calculate performance metrics
gameSessionSchema.methods.calculatePerformanceMetrics = function() {
  const answeredProblems = this.problems.filter(p => p.answered && !p.skipped);
  if (answeredProblems.length === 0) return;

  // Consistency score (inverse of variance)
  const responseTimes = answeredProblems.map(p => p.responseTime);
  const mean = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
  const variance = responseTimes.reduce((sum, rt) => sum + Math.pow(rt - mean, 2), 0) / responseTimes.length;
  const stdDev = Math.sqrt(variance);
  const coefficientOfVariation = stdDev / mean;
  this.performanceMetrics.consistencyScore = Math.max(0, Math.min(100, 100 - (coefficientOfVariation * 100)));

  // Focus score (stable response times indicate focus)
  this.performanceMetrics.focusScore = this.performanceMetrics.consistencyScore;

  // Flow state (accuracy 70-85% + good consistency)
  const inFlowAccuracy = this.results.accuracy >= 70 && this.results.accuracy <= 85;
  const inFlowConsistency = this.performanceMetrics.consistencyScore >= 70;
  this.performanceMetrics.flowStateAchieved = inFlowAccuracy && inFlowConsistency;

  // Cognitive load assessment
  if (this.results.accuracy < 60) {
    this.performanceMetrics.cognitiveLoad = 'high';
  } else if (this.results.accuracy > 90) {
    this.performanceMetrics.cognitiveLoad = 'low';
  } else {
    this.performanceMetrics.cognitiveLoad = 'optimal';
  }
};

// Method to determine next difficulty
gameSessionSchema.methods.calculateNextDifficulty = function() {
  const accuracy = this.results.accuracy;
  const avgResponseTime = this.results.averageResponseTime;
  const consistency = this.performanceMetrics.consistencyScore;

  let adjustment = 0;
  const reasons = [];

  // Accuracy-based adjustment
  if (accuracy > 90 && avgResponseTime < 5000) {
    adjustment = 3;
    reasons.push('High accuracy with fast responses');
  } else if (accuracy > 85) {
    adjustment = 2;
    reasons.push('High accuracy');
  } else if (accuracy > 75) {
    adjustment = 1;
    reasons.push('Good accuracy');
  } else if (accuracy < 60) {
    adjustment = -3;
    reasons.push('Low accuracy');
  } else if (accuracy < 70) {
    adjustment = -1;
    reasons.push('Below target accuracy');
  }

  // Consistency adjustment
  if (consistency < 50) {
    adjustment = Math.min(adjustment - 1, -1);
    reasons.push('Inconsistent performance');
  }

  // Response time consideration
  if (avgResponseTime > 15000) {
    adjustment = Math.min(adjustment - 1, -1);
    reasons.push('Slow response times');
  }

  const nextDifficulty = Math.max(1, Math.min(100, this.difficulty + adjustment));

  return {
    nextDifficulty,
    adjustment,
    reasons: reasons.join(', ')
  };
};

// Method to complete the session
gameSessionSchema.methods.completeSession = function() {
  this.endTime = new Date();
  this.duration = Math.round((this.endTime - this.startTime) / 1000);
  this.status = 'completed';
  this.calculateResults();

  return this.results;
};

// Static method to get user's recent performance
gameSessionSchema.statics.getRecentPerformance = async function(userId, gameType = null, limit = 10) {
  const query = { userId, status: 'completed' };
  if (gameType) {
    query.gameType = gameType;
  }

  const sessions = await this.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('results difficulty gameType createdAt');

  return sessions;
};

// Static method to calculate user's improvement rate
gameSessionSchema.statics.calculateImprovementRate = async function(userId, gameType = null, days = 7) {
  const dateThreshold = new Date();
  dateThreshold.setDate(dateThreshold.getDate() - days);

  const query = {
    userId,
    status: 'completed',
    createdAt: { $gte: dateThreshold }
  };

  if (gameType) {
    query.gameType = gameType;
  }

  const sessions = await this.find(query).sort({ createdAt: 1 });

  if (sessions.length < 2) {
    return { improvementRate: 0, dataPoints: sessions.length };
  }

  // Calculate linear regression on accuracy over time
  const accuracies = sessions.map((s, i) => ({ x: i, y: s.results.accuracy }));
  const n = accuracies.length;
  const sumX = accuracies.reduce((sum, p) => sum + p.x, 0);
  const sumY = accuracies.reduce((sum, p) => sum + p.y, 0);
  const sumXY = accuracies.reduce((sum, p) => sum + (p.x * p.y), 0);
  const sumX2 = accuracies.reduce((sum, p) => sum + (p.x * p.x), 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);

  return {
    improvementRate: Math.round(slope * 100) / 100,
    dataPoints: n,
    averageAccuracy: sumY / n
  };
};

// Indexes for performance
gameSessionSchema.index({ userId: 1, createdAt: -1 });
gameSessionSchema.index({ userId: 1, gameType: 1, createdAt: -1 });
gameSessionSchema.index({ status: 1 });
gameSessionSchema.index({ createdAt: -1 });

const GameSession = mongoose.model('GameSession', gameSessionSchema);

module.exports = GameSession;
