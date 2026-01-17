const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  assessmentType: {
    type: String,
    enum: ['initial', 'monthly', 'milestone', 'custom'],
    default: 'initial',
    required: true
  },
  completedAt: {
    type: Date,
    default: Date.now
  },
  scores: {
    cognitive: {
      workingMemory: {
        type: Number,
        min: 0,
        max: 100,
        required: true
      },
      processingSpeed: {
        type: Number,
        min: 0,
        max: 100,
        required: true
      },
      visualSpatial: {
        type: Number,
        min: 0,
        max: 100,
        required: true
      },
      logicalReasoning: {
        type: Number,
        min: 0,
        max: 100,
        required: true
      },
      attention: {
        type: Number,
        min: 0,
        max: 100,
        required: true
      },
      overall: {
        type: Number,
        min: 0,
        max: 100
      }
    },
    personality: {
      openness: {
        type: Number,
        min: 0,
        max: 100
      },
      conscientiousness: {
        type: Number,
        min: 0,
        max: 100
      },
      extraversion: {
        type: Number,
        min: 0,
        max: 100
      },
      agreeableness: {
        type: Number,
        min: 0,
        max: 100
      },
      neuroticism: {
        type: Number,
        min: 0,
        max: 100
      },
      growthMindset: {
        type: Number,
        min: 0,
        max: 100
      }
    },
    aiReadiness: {
      technologicalAdaptability: {
        type: Number,
        min: 0,
        max: 100
      },
      patternRecognitionBaseline: {
        type: Number,
        min: 0,
        max: 100
      },
      abstractThinking: {
        type: Number,
        min: 0,
        max: 100
      },
      problemSolving: {
        type: Number,
        min: 0,
        max: 100
      },
      ambiguityTolerance: {
        type: Number,
        min: 0,
        max: 100
      },
      overall: {
        type: Number,
        min: 0,
        max: 100
      }
    }
  },
  responses: [{
    questionId: String,
    question: String,
    answer: mongoose.Schema.Types.Mixed,
    correctAnswer: mongoose.Schema.Types.Mixed,
    isCorrect: Boolean,
    responseTime: Number, // milliseconds
    category: String // cognitive, personality, aiReadiness
  }],
  recommendations: [{
    category: String,
    priority: {
      type: String,
      enum: ['high', 'medium', 'low']
    },
    title: String,
    description: String,
    suggestedGames: [String]
  }],
  comparisonToPrevious: {
    assessmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assessment'
    },
    timeBetween: Number, // days
    improvements: [{
      metric: String,
      previousScore: Number,
      currentScore: Number,
      change: Number,
      percentChange: Number
    }],
    overallTrend: {
      type: String,
      enum: ['improving', 'stable', 'declining', 'first-assessment']
    }
  },
  insights: {
    strengths: [String],
    areasForGrowth: [String],
    learningStyleDetected: String,
    recommendedPath: String,
    estimatedGrowthPotential: Number
  }
}, {
  timestamps: true
});

// Method to calculate overall cognitive score
assessmentSchema.methods.calculateOverallCognitive = function() {
  const cognitive = this.scores.cognitive;
  this.scores.cognitive.overall = (
    cognitive.workingMemory +
    cognitive.processingSpeed +
    cognitive.visualSpatial +
    cognitive.logicalReasoning +
    cognitive.attention
  ) / 5;
  return this.scores.cognitive.overall;
};

// Method to calculate overall AI readiness score
assessmentSchema.methods.calculateOverallAIReadiness = function() {
  const ai = this.scores.aiReadiness;
  this.scores.aiReadiness.overall = (
    ai.technologicalAdaptability +
    ai.patternRecognitionBaseline +
    ai.abstractThinking +
    ai.problemSolving +
    ai.ambiguityTolerance
  ) / 5;
  return this.scores.aiReadiness.overall;
};

// Method to generate recommendations based on scores
assessmentSchema.methods.generateRecommendations = function() {
  const recommendations = [];
  const cognitive = this.scores.cognitive;

  // Working Memory recommendations
  if (cognitive.workingMemory < 60) {
    recommendations.push({
      category: 'cognitive',
      priority: 'high',
      title: 'Strengthen Working Memory',
      description: 'Focus on memory training games to improve your ability to hold and manipulate information.',
      suggestedGames: ['n-back', 'digit-span', 'spatial-span']
    });
  }

  // Processing Speed recommendations
  if (cognitive.processingSpeed < 60) {
    recommendations.push({
      category: 'cognitive',
      priority: 'high',
      title: 'Increase Processing Speed',
      description: 'Practice speed-based pattern recognition to improve your reaction time.',
      suggestedGames: ['rapid-matching', 'speed-patterns', 'quick-decision']
    });
  }

  // Visual-Spatial recommendations
  if (cognitive.visualSpatial < 60) {
    recommendations.push({
      category: 'cognitive',
      priority: 'medium',
      title: 'Enhance Visual-Spatial Skills',
      description: 'Engage with spatial reasoning and pattern visualization exercises.',
      suggestedGames: ['mental-rotation', 'pattern-matrices', 'spatial-puzzles']
    });
  }

  // Logical Reasoning recommendations
  if (cognitive.logicalReasoning < 60) {
    recommendations.push({
      category: 'cognitive',
      priority: 'high',
      title: 'Develop Logical Reasoning',
      description: 'Practice logical pattern recognition and rule inference.',
      suggestedGames: ['sequence-logic', 'rule-inference', 'analogical-reasoning']
    });
  }

  // AI Readiness recommendations
  const ai = this.scores.aiReadiness;
  if (ai.overall < 70) {
    recommendations.push({
      category: 'aiReadiness',
      priority: 'high',
      title: 'Improve AI Readiness',
      description: 'Build skills for effective human-AI collaboration through specialized training.',
      suggestedGames: ['ai-patterns', 'data-analysis', 'algorithm-understanding']
    });
  }

  this.recommendations = recommendations;
  return recommendations;
};

// Method to identify strengths and areas for growth
assessmentSchema.methods.generateInsights = function() {
  const cognitive = this.scores.cognitive;
  const scores = [
    { name: 'Working Memory', value: cognitive.workingMemory },
    { name: 'Processing Speed', value: cognitive.processingSpeed },
    { name: 'Visual-Spatial', value: cognitive.visualSpatial },
    { name: 'Logical Reasoning', value: cognitive.logicalReasoning },
    { name: 'Attention', value: cognitive.attention }
  ];

  scores.sort((a, b) => b.value - a.value);

  this.insights.strengths = scores.slice(0, 2).map(s => s.name);
  this.insights.areasForGrowth = scores.slice(-2).map(s => s.name);

  // Detect learning style from personality
  const personality = this.scores.personality;
  if (personality.openness > 70) {
    this.insights.learningStyleDetected = 'Exploratory - thrives with variety and creative challenges';
  } else if (personality.conscientiousness > 70) {
    this.insights.learningStyleDetected = 'Structured - benefits from clear progression and systematic practice';
  } else {
    this.insights.learningStyleDetected = 'Balanced - adapts well to various learning approaches';
  }

  // Estimate growth potential
  this.insights.estimatedGrowthPotential = Math.min(100, cognitive.overall + 20);

  return this.insights;
};

// Static method to compare two assessments
assessmentSchema.statics.compareAssessments = function(previousAssessment, currentAssessment) {
  const timeBetween = Math.floor(
    (currentAssessment.completedAt - previousAssessment.completedAt) / (1000 * 60 * 60 * 24)
  );

  const improvements = [];
  const metrics = [
    'workingMemory', 'processingSpeed', 'visualSpatial', 'logicalReasoning', 'attention'
  ];

  metrics.forEach(metric => {
    const previous = previousAssessment.scores.cognitive[metric];
    const current = currentAssessment.scores.cognitive[metric];
    const change = current - previous;
    const percentChange = previous > 0 ? (change / previous) * 100 : 0;

    improvements.push({
      metric: metric.charAt(0).toUpperCase() + metric.slice(1).replace(/([A-Z])/g, ' $1'),
      previousScore: previous,
      currentScore: current,
      change: Math.round(change * 10) / 10,
      percentChange: Math.round(percentChange * 10) / 10
    });
  });

  // Determine overall trend
  const avgChange = improvements.reduce((sum, imp) => sum + imp.change, 0) / improvements.length;
  let overallTrend;
  if (avgChange > 3) overallTrend = 'improving';
  else if (avgChange < -3) overallTrend = 'declining';
  else overallTrend = 'stable';

  return {
    assessmentId: previousAssessment._id,
    timeBetween,
    improvements,
    overallTrend
  };
};

// Indexes for performance
assessmentSchema.index({ userId: 1, completedAt: -1 });
assessmentSchema.index({ userId: 1, assessmentType: 1 });
assessmentSchema.index({ completedAt: -1 });

const Assessment = mongoose.model('Assessment', assessmentSchema);

module.exports = Assessment;
