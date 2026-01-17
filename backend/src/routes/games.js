const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const GameSession = require('../models/GameSession');
const UserProgress = require('../models/UserProgress');
const { body, validationResult } = require('express-validator');
const { generateGameProblems } = require('../utils/gameGenerator');

// @desc    Get all available game types
// @route   GET /api/games/types
// @access  Private
router.get('/types', protect, async (req, res) => {
  try {
    const gameTypes = [
      {
        id: 'visual-pattern',
        name: 'Visual Patterns',
        description: 'Recognize and complete visual patterns with shapes and colors',
        difficulty: 'Easy to Hard',
        estimatedTime: '5-10 minutes',
        skillTree: 'visualProcessing',
        icon: '👁️',
        unlocked: true
      },
      {
        id: 'sequence',
        name: 'Sequence Recognition',
        description: 'Identify patterns in number and letter sequences',
        difficulty: 'Easy to Hard',
        estimatedTime: '5-10 minutes',
        skillTree: 'logicalReasoning',
        icon: '🔢',
        unlocked: true
      },
      {
        id: 'spatial',
        name: 'Spatial Reasoning',
        description: 'Mental rotation and 3D visualization challenges',
        difficulty: 'Medium to Hard',
        estimatedTime: '10-15 minutes',
        skillTree: 'visualProcessing',
        icon: '🎲',
        unlocked: req.user.currentLevel >= 5
      },
      {
        id: 'logical',
        name: 'Logical Patterns',
        description: 'Complex logical reasoning and rule inference',
        difficulty: 'Medium to Hard',
        estimatedTime: '10-15 minutes',
        skillTree: 'logicalReasoning',
        icon: '🧩',
        unlocked: true
      },
      {
        id: 'memory',
        name: 'Working Memory',
        description: 'N-back tasks and memory span exercises',
        difficulty: 'Easy to Expert',
        estimatedTime: '5-10 minutes',
        skillTree: 'memoryEnhancement',
        icon: '🧠',
        unlocked: true
      },
      {
        id: 'speed',
        name: 'Speed Challenge',
        description: 'Fast-paced pattern matching for processing speed',
        difficulty: 'Easy to Expert',
        estimatedTime: '3-5 minutes',
        skillTree: 'speedOptimization',
        icon: '⚡',
        unlocked: req.user.currentLevel >= 3
      },
      {
        id: 'ai-collaboration',
        name: 'AI Collaboration',
        description: 'Learn to work effectively with AI through pattern recognition',
        difficulty: 'Medium to Expert',
        estimatedTime: '10-20 minutes',
        skillTree: 'aiCollaboration',
        icon: '🤖',
        unlocked: req.user.currentLevel >= 10
      },
      {
        id: 'system-builder',
        name: 'System Builder',
        description: 'Pattern → Rule → System → AI Critique: Build cognitive systems for the AGI age',
        difficulty: 'All Levels',
        estimatedTime: '15-30 minutes',
        skillTree: 'systemsThinking',
        icon: '🏗️',
        unlocked: true, // Available to all - this is the core differentiator
        featured: true,
        tagline: 'The difference between a brain game and cognitive retooling'
      }
    ];

    res.json({
      success: true,
      gameTypes
    });
  } catch (error) {
    console.error('Error fetching game types:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching game types',
      error: error.message
    });
  }
});

// @desc    Start new game session
// @route   POST /api/games/start
// @access  Private
router.post('/start', [
  protect,
  body('gameType').isIn([
    'visual-pattern', 'sequence', 'spatial', 'logical',
    'memory', 'speed', 'ai-collaboration', 'system-builder'
  ]).withMessage('Invalid game type')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { gameType, requestedDifficulty } = req.body;
    const userId = req.user._id;

    // Get user progress to determine appropriate difficulty
    let userProgress = await UserProgress.findOne({ userId });
    if (!userProgress) {
      userProgress = new UserProgress({ userId });
      await userProgress.save();
    }

    // Determine starting difficulty
    let difficulty = requestedDifficulty || await calculateStartingDifficulty(userId, gameType);

    // Create game session
    const gameSession = new GameSession({
      userId,
      gameType,
      difficulty,
      level: userProgress.currentLevel,
      stage: userProgress.currentStage,
      startTime: new Date(),
      status: 'in-progress'
    });

    gameSession.adaptiveAdjustments.startingDifficulty = difficulty;

    // Generate initial problems (10 problems per session)
    const problems = await generateGameProblems(gameType, difficulty, 10, req.user.profile.ageGroup);

    problems.forEach(problem => {
      gameSession.addProblem({
        problemId: problem.id,
        difficulty: problem.difficulty,
        correctAnswer: problem.correctAnswer,
        presented: new Date()
      });
    });

    await gameSession.save();

    // Return session data with problems (without correct answers)
    const problemsForClient = problems.map(p => ({
      id: p.id,
      type: p.type,
      question: p.question,
      options: p.options,
      data: p.data,
      timeLimit: p.timeLimit
    }));

    res.status(201).json({
      success: true,
      session: {
        _id: gameSession._id,
        gameType: gameSession.gameType,
        difficulty: gameSession.difficulty,
        level: gameSession.level,
        problems: problemsForClient
      }
    });
  } catch (error) {
    console.error('Error starting game session:', error);
    res.status(500).json({
      success: false,
      message: 'Error starting game session',
      error: error.message
    });
  }
});

// @desc    Submit answer to problem
// @route   POST /api/games/:sessionId/answer
// @access  Private
router.post('/:sessionId/answer', [
  protect,
  body('problemId').notEmpty().withMessage('Problem ID is required'),
  body('answer').exists().withMessage('Answer is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { sessionId } = req.params;
    const { problemId, answer } = req.body;
    const userId = req.user._id;

    // Find game session
    const gameSession = await GameSession.findOne({
      _id: sessionId,
      userId,
      status: 'in-progress'
    });

    if (!gameSession) {
      return res.status(404).json({
        success: false,
        message: 'Game session not found or already completed'
      });
    }

    // Submit answer
    const problem = gameSession.submitAnswer(problemId, answer);
    await gameSession.save();

    // Check if we need to adjust difficulty (every 3 problems)
    const answeredCount = gameSession.problems.filter(p => p.answered).length;
    if (answeredCount % 3 === 0 && answeredCount < gameSession.problems.length) {
      const recentPerformance = {
        accuracy: (gameSession.problems.slice(-3).filter(p => p.correct).length / 3) * 100,
        avgResponseTime: gameSession.problems.slice(-3).reduce((sum, p) => sum + (p.responseTime || 0), 0) / 3,
        variance: calculateVariance(gameSession.problems.slice(-3).map(p => p.responseTime || 0))
      };

      const adjustment = calculateDifficultyAdjustment(recentPerformance, gameSession.difficulty);

      if (adjustment !== 0) {
        gameSession.difficulty = Math.max(1, Math.min(100, gameSession.difficulty + adjustment));
        gameSession.adaptiveAdjustments.adjustmentsMade++;
        gameSession.adaptiveAdjustments.difficultyHistory.push({
          problemNumber: answeredCount,
          difficulty: gameSession.difficulty,
          reason: adjustment > 0 ? 'Performance above target' : 'Performance below target'
        });
        await gameSession.save();
      }
    }

    res.json({
      success: true,
      result: {
        correct: problem.correct,
        correctAnswer: problem.correctAnswer,
        responseTime: problem.responseTime,
        currentStreak: gameSession.results.currentStreak,
        accuracy: gameSession.results.accuracy
      }
    });
  } catch (error) {
    console.error('Error submitting answer:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting answer',
      error: error.message
    });
  }
});

// @desc    Complete game session
// @route   POST /api/games/:sessionId/complete
// @access  Private
router.post('/:sessionId/complete', protect, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user._id;

    // Find game session
    const gameSession = await GameSession.findOne({
      _id: sessionId,
      userId
    });

    if (!gameSession) {
      return res.status(404).json({
        success: false,
        message: 'Game session not found'
      });
    }

    if (gameSession.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Game session already completed'
      });
    }

    // Complete the session
    gameSession.completeSession();
    gameSession.adaptiveAdjustments.endingDifficulty = gameSession.difficulty;
    await gameSession.save();

    // Update user progress
    const userProgress = await UserProgress.findOne({ userId });
    if (userProgress) {
      // Add XP
      const levelUpResult = userProgress.addXP(gameSession.results.xpEarned);

      // Add skill tree XP
      const skillTreeMap = {
        'visual-pattern': 'visualProcessing',
        'sequence': 'logicalReasoning',
        'spatial': 'visualProcessing',
        'logical': 'logicalReasoning',
        'memory': 'memoryEnhancement',
        'speed': 'speedOptimization',
        'ai-collaboration': 'aiCollaboration'
      };

      const skillTree = skillTreeMap[gameSession.gameType];
      if (skillTree) {
        const skillTreeResult = userProgress.addSkillTreeXP(skillTree, Math.floor(gameSession.results.xpEarned / 2));
      }

      // Update statistics
      userProgress.statistics.totalSessionsCompleted++;
      userProgress.statistics.totalTimeSpent += gameSession.duration / 60; // Convert to minutes
      userProgress.statistics.totalProblemsAttempted += gameSession.results.totalProblems;
      userProgress.statistics.totalCorrectAnswers += gameSession.results.correctAnswers;

      // Update average accuracy
      const totalAccuracy = userProgress.statistics.averageAccuracy * (userProgress.statistics.totalSessionsCompleted - 1);
      userProgress.statistics.averageAccuracy = (totalAccuracy + gameSession.results.accuracy) / userProgress.statistics.totalSessionsCompleted;

      // Update best streak
      if (gameSession.results.streakBest > userProgress.statistics.bestStreak) {
        userProgress.statistics.bestStreak = gameSession.results.streakBest;
      }

      // Update fastest response time
      if (!userProgress.statistics.fastestResponseTime || gameSession.results.fastestResponse < userProgress.statistics.fastestResponseTime) {
        userProgress.statistics.fastestResponseTime = gameSession.results.fastestResponse;
      }

      // Update games played by type
      const currentCount = userProgress.statistics.gamesPlayedByType.get(gameSession.gameType) || 0;
      userProgress.statistics.gamesPlayedByType.set(gameSession.gameType, currentCount + 1);

      // Update daily stats
      userProgress.updateDailyStats({
        duration: gameSession.duration,
        accuracy: gameSession.results.accuracy,
        xpEarned: gameSession.results.xpEarned,
        gameType: gameSession.gameType
      });

      // Update login streak
      userProgress.updateLoginStreak();

      await userProgress.save();

      // Calculate next difficulty recommendation
      const nextDifficulty = gameSession.calculateNextDifficulty();

      res.json({
        success: true,
        results: gameSession.results,
        performance: gameSession.performanceMetrics,
        levelUp: levelUpResult.leveledUp ? {
          newLevel: levelUpResult.newLevel,
          levelsGained: levelUpResult.levelsGained
        } : null,
        nextDifficulty: nextDifficulty.nextDifficulty,
        recommendations: {
          message: getPerformanceFeedback(gameSession),
          nextSteps: getNextSteps(gameSession, userProgress)
        }
      });
    }
  } catch (error) {
    console.error('Error completing game session:', error);
    res.status(500).json({
      success: false,
      message: 'Error completing game session',
      error: error.message
    });
  }
});

// @desc    Get hint for current problem
// @route   GET /api/games/:sessionId/hint/:problemId
// @access  Private
router.get('/:sessionId/hint/:problemId', protect, async (req, res) => {
  try {
    const { sessionId, problemId } = req.params;
    const userId = req.user._id;

    // Find game session
    const gameSession = await GameSession.findOne({
      _id: sessionId,
      userId,
      status: 'in-progress'
    });

    if (!gameSession) {
      return res.status(404).json({
        success: false,
        message: 'Game session not found'
      });
    }

    const problem = gameSession.problems.id(problemId);
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    // Check if max hints reached
    if (problem.hintsUsed >= 2) {
      return res.status(400).json({
        success: false,
        message: 'Maximum hints already used for this problem'
      });
    }

    // Generate hint based on problem type and current hint count
    const hint = generateHint(problem, gameSession.gameType, problem.hintsUsed);

    problem.hintsUsed++;
    await gameSession.save();

    res.json({
      success: true,
      hint,
      hintsRemaining: 2 - problem.hintsUsed
    });
  } catch (error) {
    console.error('Error getting hint:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting hint',
      error: error.message
    });
  }
});

// @desc    Get recommended games for user
// @route   GET /api/games/recommended
// @access  Private
router.get('/recommended', protect, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user progress
    const userProgress = await UserProgress.findOne({ userId });

    if (!userProgress) {
      return res.json({
        success: true,
        recommended: ['visual-pattern', 'sequence', 'memory']
      });
    }

    // Get recent performance
    const recentSessions = await GameSession.find({
      userId,
      status: 'completed'
    }).sort({ createdAt: -1 }).limit(10);

    // Recommend games based on weakest skill trees and least played games
    const skillTrees = userProgress.skillTrees;
    const lowestSkillTree = Object.entries(skillTrees)
      .sort((a, b) => a[1].level - b[1].level])[0];

    const gameTypeMap = {
      visualProcessing: ['visual-pattern', 'spatial'],
      logicalReasoning: ['sequence', 'logical'],
      memoryEnhancement: ['memory'],
      speedOptimization: ['speed'],
      aiCollaboration: ['ai-collaboration']
    };

    const recommended = gameTypeMap[lowestSkillTree[0]] || ['visual-pattern'];

    // Add variety - least played games
    const gameCounts = {};
    recentSessions.forEach(session => {
      gameCounts[session.gameType] = (gameCounts[session.gameType] || 0) + 1;
    });

    const leastPlayed = Object.keys(gameTypeMap)
      .flatMap(key => gameTypeMap[key])
      .filter(game => !gameCounts[game] || gameCounts[game] < 3)
      .slice(0, 2);

    res.json({
      success: true,
      recommended: [...new Set([...recommended, ...leastPlayed])].slice(0, 3),
      reason: `Focus on ${lowestSkillTree[0].replace(/([A-Z])/g, ' $1').trim()} skill tree`
    });
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting recommendations',
      error: error.message
    });
  }
});

// Helper functions

async function calculateStartingDifficulty(userId, gameType) {
  // Get user's recent performance in this game type
  const recentSessions = await GameSession.find({
    userId,
    gameType,
    status: 'completed'
  }).sort({ createdAt: -1 }).limit(5);

  if (recentSessions.length === 0) {
    // New to this game type, start with beginner difficulty
    return 20;
  }

  // Calculate average difficulty and accuracy
  const avgDifficulty = recentSessions.reduce((sum, s) => sum + s.difficulty, 0) / recentSessions.length;
  const avgAccuracy = recentSessions.reduce((sum, s) => sum + s.results.accuracy, 0) / recentSessions.length;

  // Adjust based on performance
  let difficulty = avgDifficulty;

  if (avgAccuracy > 85) {
    difficulty += 5; // Increase difficulty
  } else if (avgAccuracy < 65) {
    difficulty -= 5; // Decrease difficulty
  }

  return Math.max(10, Math.min(90, Math.round(difficulty)));
}

function calculateDifficultyAdjustment(recentPerformance, currentDifficulty) {
  const { accuracy, avgResponseTime, variance } = recentPerformance;

  let adjustment = 0;

  // Target accuracy: 75%
  if (accuracy > 90) {
    adjustment = 3; // Too easy
  } else if (accuracy > 80) {
    adjustment = 1;
  } else if (accuracy < 60) {
    adjustment = -3; // Too hard
  } else if (accuracy < 70) {
    adjustment = -1;
  }

  // Consider response time (fast responses with high accuracy = increase difficulty)
  if (accuracy > 80 && avgResponseTime < 3000) {
    adjustment += 1;
  }

  // Consider consistency (high variance = decrease difficulty)
  if (variance > 5000) {
    adjustment = Math.min(adjustment - 1, -1);
  }

  return adjustment;
}

function calculateVariance(numbers) {
  if (numbers.length === 0) return 0;
  const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
  return numbers.reduce((sum, num) => sum + Math.pow(num - mean, 2), 0) / numbers.length;
}

function generateHint(problem, gameType, hintNumber) {
  // Generate appropriate hint based on game type and hint number
  const hints = {
    'visual-pattern': [
      'Look for repeating shapes or colors in the pattern.',
      'Try to identify the rule that governs how the pattern changes.'
    ],
    'sequence': [
      'Check if there\'s a mathematical relationship between numbers.',
      'Look for addition, subtraction, multiplication, or more complex patterns.'
    ],
    'logical': [
      'Break down the problem into smaller steps.',
      'Consider what rules might apply to each element.'
    ],
    'memory': [
      'Try grouping items together to remember them better.',
      'Use visualization or create a story with the items.'
    ],
    'speed': [
      'Focus on the most distinctive features first.',
      'Trust your first instinct and move quickly.'
    ]
  };

  const gameHints = hints[gameType] || hints['visual-pattern'];
  return gameHints[hintNumber] || 'Take your time and think through the pattern carefully.';
}

function getPerformanceFeedback(gameSession) {
  const accuracy = gameSession.results.accuracy;
  const flowState = gameSession.performanceMetrics.flowStateAchieved;

  if (flowState) {
    return '🌟 Excellent! You were in the flow state - perfectly challenged and engaged!';
  } else if (accuracy >= 90) {
    return '🎯 Outstanding accuracy! Consider increasing difficulty for more challenge.';
  } else if (accuracy >= 75) {
    return '✅ Great job! You\'re making solid progress.';
  } else if (accuracy >= 60) {
    return '💪 Good effort! Keep practicing to improve your accuracy.';
  } else {
    return '📚 This was challenging! Try the same difficulty again or try an easier level.';
  }
}

function getNextSteps(gameSession, userProgress) {
  const steps = [];

  // Based on accuracy
  if (gameSession.results.accuracy < 70) {
    steps.push('Try this game type again at the same or easier difficulty');
  } else if (gameSession.results.accuracy > 85) {
    steps.push('Challenge yourself with a higher difficulty level');
  }

  // Based on skill tree progress
  const skillTreeMap = {
    'visual-pattern': 'visualProcessing',
    'sequence': 'logicalReasoning',
    'spatial': 'visualProcessing',
    'logical': 'logicalReasoning',
    'memory': 'memoryEnhancement',
    'speed': 'speedOptimization',
    'ai-collaboration': 'aiCollaboration'
  };

  const skillTree = skillTreeMap[gameSession.gameType];
  if (skillTree && userProgress.skillTrees[skillTree]) {
    const level = userProgress.skillTrees[skillTree].level;
    if (level < 5) {
      steps.push(`Continue building your ${skillTree.replace(/([A-Z])/g, ' $1').toLowerCase()} foundation`);
    }
  }

  // Add variety recommendation
  steps.push('Try a different game type for balanced cognitive development');

  return steps;
}

// ============================================================================
// SYSTEM BUILDER ENDPOINTS
// Pattern → Rule → System → AI Critique
// ============================================================================

const SystemBuilderService = require('../services/systemBuilderService');

// @desc    Start System Builder challenge
// @route   POST /api/games/system-builder/start
// @access  Private
router.post('/system-builder/start', protect, async (req, res) => {
  try {
    const { difficulty } = req.body;
    const userId = req.user._id;
    const ageGroup = req.user.profile?.ageGroup || 'adult';

    // Get user progress
    let userProgress = await UserProgress.findOne({ userId });
    if (!userProgress) {
      userProgress = new UserProgress({ userId });
      await userProgress.save();
    }

    // Determine difficulty (default to user level or requested)
    const challengeDifficulty = difficulty || Math.min(20 + (userProgress.currentLevel * 2), 100);

    // Generate challenge
    const challenge = SystemBuilderService.generatePatternChallenge(challengeDifficulty, ageGroup);

    // Create game session
    const gameSession = new GameSession({
      userId,
      gameType: 'system-builder',
      difficulty: challengeDifficulty,
      level: userProgress.currentLevel,
      startTime: new Date(),
      status: 'in-progress'
    });

    // Add the challenge as a problem
    gameSession.addProblem({
      problemId: challenge.problemId,
      difficulty: challengeDifficulty,
      correctAnswer: null, // No single correct answer in system building
      presented: new Date()
    });

    // Store challenge data in the problem's systemBuilder field
    const problem = gameSession.problems[0];
    problem.systemBuilder = {
      patternPhase: {
        examples: challenge.examples,
        userObservations: null
      },
      rulePhase: {
        userRule: null,
        ruleQuality: 0
      },
      systemPhase: {
        systemDescription: null,
        systemType: null,
        systemComponents: [],
        systemCreated: null
      },
      critiquePhase: {
        aiCritique: null,
        strengths: [],
        improvements: [],
        novelty: 0,
        completeness: 0,
        effectiveness: 0,
        overallScore: 0
      }
    };

    await gameSession.save();

    // Return challenge without hidden answers
    res.status(201).json({
      success: true,
      session: {
        _id: gameSession._id,
        gameType: 'system-builder',
        difficulty: challengeDifficulty,
        problemId: challenge.problemId,
        challenge: {
          context: challenge.context,
          examples: challenge.examples,
          systemPrompt: challenge.systemPrompt,
          patternType: challenge.patternType
        },
        currentPhase: 'pattern' // Start with pattern observation
      }
    });
  } catch (error) {
    console.error('Error starting system builder:', error);
    res.status(500).json({
      success: false,
      message: 'Error starting system builder challenge',
      error: error.message
    });
  }
});

// @desc    Submit pattern observations (Phase 1)
// @route   POST /api/games/system-builder/:sessionId/pattern
// @access  Private
router.post('/system-builder/:sessionId/pattern', [
  protect,
  body('observations').isString().isLength({ min: 10 }).withMessage('Observations must be at least 10 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { sessionId } = req.params;
    const { observations } = req.body;

    const gameSession = await GameSession.findOne({
      _id: sessionId,
      userId: req.user._id,
      status: 'in-progress',
      gameType: 'system-builder'
    });

    if (!gameSession) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    const problem = gameSession.problems[0];
    if (!problem.systemBuilder) {
      return res.status(400).json({ success: false, message: 'Invalid session structure' });
    }

    problem.systemBuilder.patternPhase.userObservations = observations;
    await gameSession.save();

    res.json({
      success: true,
      message: 'Pattern observations recorded',
      nextPhase: 'rule'
    });
  } catch (error) {
    console.error('Error submitting pattern observations:', error);
    res.status(500).json({ success: false, message: 'Error recording observations', error: error.message });
  }
});

// @desc    Submit articulated rule (Phase 2)
// @route   POST /api/games/system-builder/:sessionId/rule
// @access  Private
router.post('/system-builder/:sessionId/rule', [
  protect,
  body('rule').isString().isLength({ min: 10 }).withMessage('Rule must be at least 10 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { sessionId } = req.params;
    const { rule } = req.body;

    const gameSession = await GameSession.findOne({
      _id: sessionId,
      userId: req.user._id,
      status: 'in-progress',
      gameType: 'system-builder'
    });

    if (!gameSession) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    const problem = gameSession.problems[0];
    if (!problem.systemBuilder || !problem.systemBuilder.patternPhase.userObservations) {
      return res.status(400).json({
        success: false,
        message: 'Must complete pattern phase first'
      });
    }

    // Evaluate rule quality (basic evaluation, AI will do deeper critique later)
    const ruleEvaluation = SystemBuilderService.evaluateRule(rule, null, null);

    problem.systemBuilder.rulePhase.userRule = rule;
    problem.systemBuilder.rulePhase.ruleQuality = ruleEvaluation.score;

    await gameSession.save();

    res.json({
      success: true,
      message: 'Rule articulated successfully',
      ruleQuality: ruleEvaluation.score,
      feedback: ruleEvaluation.feedback,
      nextPhase: 'system'
    });
  } catch (error) {
    console.error('Error submitting rule:', error);
    res.status(500).json({ success: false, message: 'Error recording rule', error: error.message });
  }
});

// @desc    Submit system creation (Phase 3 - MANDATORY)
// @route   POST /api/games/system-builder/:sessionId/system
// @access  Private
router.post('/system-builder/:sessionId/system', [
  protect,
  body('systemDescription').isString().isLength({ min: 50 }).withMessage('System description must be at least 50 characters'),
  body('systemType').isIn(['process', 'algorithm', 'framework', 'strategy']).withMessage('Invalid system type'),
  body('systemComponents').isArray({ min: 1 }).withMessage('Must include at least one system component')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { sessionId } = req.params;
    const { systemDescription, systemType, systemComponents, systemCreated } = req.body;

    const gameSession = await GameSession.findOne({
      _id: sessionId,
      userId: req.user._id,
      status: 'in-progress',
      gameType: 'system-builder'
    });

    if (!gameSession) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    const problem = gameSession.problems[0];
    if (!problem.systemBuilder || !problem.systemBuilder.rulePhase.userRule) {
      return res.status(400).json({
        success: false,
        message: 'Must complete rule phase first'
      });
    }

    // Record system creation
    problem.systemBuilder.systemPhase.systemDescription = systemDescription;
    problem.systemBuilder.systemPhase.systemType = systemType;
    problem.systemBuilder.systemPhase.systemComponents = systemComponents;
    problem.systemBuilder.systemPhase.systemCreated = systemCreated || null;

    await gameSession.save();

    res.json({
      success: true,
      message: 'System created successfully! Preparing AI critique...',
      nextPhase: 'critique'
    });
  } catch (error) {
    console.error('Error submitting system:', error);
    res.status(500).json({ success: false, message: 'Error recording system', error: error.message });
  }
});

// @desc    Get AI critique (Phase 4 - Final)
// @route   POST /api/games/system-builder/:sessionId/critique
// @access  Private
router.post('/system-builder/:sessionId/critique', protect, async (req, res) => {
  try {
    const { sessionId } = req.params;

    const gameSession = await GameSession.findOne({
      _id: sessionId,
      userId: req.user._id,
      status: 'in-progress',
      gameType: 'system-builder'
    });

    if (!gameSession) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    const problem = gameSession.problems[0];
    if (!problem.systemBuilder || !problem.systemBuilder.systemPhase.systemDescription) {
      return res.status(400).json({
        success: false,
        message: 'Must complete system phase first'
      });
    }

    // Get the original challenge data (we need to reconstruct it)
    const challenge = {
      context: 'Challenge context from pattern examples',
      pattern: 'Pattern identified from examples',
      rule: 'Rule from expected evaluation',
      evaluationCriteria: {}
    };

    // Generate AI critique
    const critique = await SystemBuilderService.generateAICritique(
      problem.systemBuilder.systemPhase.systemDescription,
      problem.systemBuilder.systemPhase.systemType,
      problem.systemBuilder.systemPhase.systemComponents,
      challenge,
      problem.systemBuilder.rulePhase.userRule
    );

    // Store critique
    problem.systemBuilder.critiquePhase = critique;
    problem.answered = new Date();
    problem.responseTime = problem.answered - problem.presented;

    // Calculate overall success based on critique scores
    const overallSuccess = critique.overallScore >= 60;
    problem.correct = overallSuccess;

    // Complete the session
    gameSession.status = 'completed';
    gameSession.results.totalProblems = 1;
    gameSession.results.correctAnswers = overallSuccess ? 1 : 0;
    gameSession.results.accuracy = overallSuccess ? 100 : critique.overallScore;

    // Award XP based on quality of system
    const baseXP = 100;
    const qualityBonus = Math.round(critique.overallScore * 2); // Up to 200 bonus XP
    gameSession.results.xpEarned = baseXP + qualityBonus;

    gameSession.endTime = new Date();
    gameSession.duration = Math.round((gameSession.endTime - gameSession.startTime) / 1000);

    await gameSession.save();

    // Update user progress
    const userProgress = await UserProgress.findOne({ userId: gameSession.userId });
    if (userProgress) {
      await userProgress.addXP(gameSession.results.xpEarned);
      await userProgress.save();
    }

    res.json({
      success: true,
      critique: critique,
      xpEarned: gameSession.results.xpEarned,
      sessionComplete: true,
      message: critique.overallScore >= 70
        ? '🎉 Excellent systems thinking! This is AGI-era cognitive work.'
        : critique.overallScore >= 50
        ? '💡 Good foundation. Keep building deeper systems.'
        : '🔧 This is a start. Focus on creating implementable systems, not just ideas.'
    });
  } catch (error) {
    console.error('Error generating critique:', error);
    res.status(500).json({ success: false, message: 'Error generating AI critique', error: error.message });
  }
});

module.exports = router;
