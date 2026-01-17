const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const UserProgress = require('../models/UserProgress');
const GameSession = require('../models/GameSession');
const Assessment = require('../models/Assessment');
const Achievement = require('../models/Achievement');

// @desc    Get user progress overview
// @route   GET /api/progress/overview
// @access  Private
router.get('/overview', protect, async (req, res) => {
  try {
    const userId = req.user._id;

    let userProgress = await UserProgress.findOne({ userId });

    if (!userProgress) {
      userProgress = new UserProgress({ userId });
      await userProgress.save();
    }

    const summary = userProgress.getProgressSummary();

    // Get recent sessions for activity graph
    const recentSessions = await GameSession.find({
      userId,
      status: 'completed',
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    }).sort({ createdAt: -1 });

    // Get latest assessment
    const latestAssessment = await Assessment.findOne({ userId })
      .sort({ completedAt: -1 })
      .select('scores completedAt');

    res.json({
      success: true,
      progress: {
        ...summary,
        skillTrees: userProgress.skillTrees,
        streaks: userProgress.streaks,
        recentActivity: recentSessions.map(s => ({
          date: s.createdAt,
          gameType: s.gameType,
          accuracy: s.results.accuracy,
          xpEarned: s.results.xpEarned
        })),
        latestAssessment: latestAssessment ? {
          cognitive: latestAssessment.scores.cognitive,
          aiReadiness: latestAssessment.scores.aiReadiness,
          date: latestAssessment.completedAt
        } : null
      }
    });
  } catch (error) {
    console.error('Error fetching progress overview:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching progress overview',
      error: error.message
    });
  }
});

// @desc    Get detailed statistics
// @route   GET /api/progress/stats
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const userId = req.user._id;

    const userProgress = await UserProgress.findOne({ userId });

    if (!userProgress) {
      return res.status(404).json({
        success: false,
        message: 'Progress data not found'
      });
    }

    // Get all completed sessions for detailed analysis
    const allSessions = await GameSession.find({
      userId,
      status: 'completed'
    }).sort({ createdAt: 1 });

    // Calculate performance trends
    const trends = calculatePerformanceTrends(allSessions);

    // Calculate game type breakdown
    const gameTypeStats = calculateGameTypeStats(allSessions);

    // Calculate time of day performance
    const timeOfDayStats = calculateTimeOfDayStats(allSessions);

    res.json({
      success: true,
      statistics: {
        overall: userProgress.statistics,
        trends,
        gameTypeBreakdown: gameTypeStats,
        timeOfDayPerformance: timeOfDayStats,
        skillTrees: userProgress.skillTrees
      }
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
});

// @desc    Get cognitive growth metrics
// @route   GET /api/progress/cognitive-growth
// @access  Private
router.get('/cognitive-growth', protect, async (req, res) => {
  try {
    const userId = req.user._id;

    const userProgress = await UserProgress.findOne({ userId });

    if (!userProgress || !userProgress.cognitiveGrowth.initialBaseline.overall) {
      return res.status(404).json({
        success: false,
        message: 'No baseline assessment found. Please complete initial assessment.'
      });
    }

    // Get all assessments for detailed growth tracking
    const assessments = await Assessment.find({ userId })
      .sort({ completedAt: 1 })
      .select('scores completedAt assessmentType');

    // Calculate growth trajectory
    const growthTrajectory = assessments.map(assessment => ({
      date: assessment.completedAt,
      type: assessment.assessmentType,
      cognitive: assessment.scores.cognitive,
      aiReadiness: assessment.scores.aiReadiness
    }));

    res.json({
      success: true,
      cognitiveGrowth: {
        baseline: userProgress.cognitiveGrowth.initialBaseline,
        current: userProgress.cognitiveGrowth.currentLevels,
        growthRates: userProgress.cognitiveGrowth.growthRate,
        projections: userProgress.cognitiveGrowth.projectedGrowth,
        history: growthTrajectory
      }
    });
  } catch (error) {
    console.error('Error fetching cognitive growth:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching cognitive growth',
      error: error.message
    });
  }
});

// @desc    Get achievements
// @route   GET /api/progress/achievements
// @access  Private
router.get('/achievements', protect, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all available achievements
    const allAchievements = await Achievement.find({ isActive: true }).sort({ order: 1 });

    // Get user progress
    const userProgress = await UserProgress.findOne({ userId });

    // Check for newly unlocked achievements
    if (userProgress) {
      const userStats = {
        totalSessionsCompleted: userProgress.statistics.totalSessionsCompleted,
        averageAccuracy: userProgress.statistics.averageAccuracy,
        bestStreak: userProgress.statistics.bestStreak,
        currentLevel: userProgress.currentLevel,
        totalXP: userProgress.totalXP,
        totalTimeSpent: userProgress.statistics.totalTimeSpent,
        currentLoginStreak: userProgress.streaks.currentStreak,
        fastestResponseTime: userProgress.statistics.fastestResponseTime,
        gamesPlayedByType: userProgress.statistics.gamesPlayedByType,
        skillTrees: userProgress.skillTrees,
        cognitiveGrowthRate: userProgress.cognitiveGrowth.growthRate?.overall || 0
      };

      // Check each achievement
      const newlyUnlocked = [];
      for (const achievement of allAchievements) {
        const meetsСriteria = Achievement.checkCriteria(achievement.criteria, userStats);
        const alreadyUnlocked = userProgress.achievements.some(
          a => a.achievementId === achievement.achievementId
        );

        if (meetsСriteria && !alreadyUnlocked) {
          const result = userProgress.unlockAchievement(achievement);
          if (result.unlocked) {
            newlyUnlocked.push(achievement);
            userProgress.addXP(achievement.reward.xp);
          }
        }
      }

      if (newlyUnlocked.length > 0) {
        await userProgress.save();
      }

      // Format achievements for response
      const achievementsWithStatus = allAchievements.map(achievement => ({
        ...achievement.toObject(),
        unlocked: userProgress.achievements.some(a => a.achievementId === achievement.achievementId),
        unlockedAt: userProgress.achievements.find(a => a.achievementId === achievement.achievementId)?.unlockedAt,
        progress: calculateAchievementProgress(achievement, userStats)
      }));

      res.json({
        success: true,
        achievements: achievementsWithStatus,
        newlyUnlocked,
        unlockedCount: userProgress.achievements.length,
        totalCount: allAchievements.length
      });
    } else {
      res.json({
        success: true,
        achievements: allAchievements.map(a => ({ ...a.toObject(), unlocked: false })),
        unlockedCount: 0,
        totalCount: allAchievements.length
      });
    }
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching achievements',
      error: error.message
    });
  }
});

// @desc    Get leaderboard
// @route   GET /api/progress/leaderboard
// @access  Private
router.get('/leaderboard', protect, async (req, res) => {
  try {
    const { type = 'global', limit = 100 } = req.query;
    const userId = req.user._id;
    const userAgeGroup = req.user.profile.ageGroup;

    let query = {};

    // Filter by age group if requested
    if (type === 'age-group') {
      const users = await require('../models/User').find({
        'profile.ageGroup': userAgeGroup
      }).select('_id');

      const userIds = users.map(u => u._id);
      query = { userId: { $in: userIds } };
    }

    // Get top users by total XP
    const topUsers = await UserProgress.find(query)
      .sort({ totalXP: -1 })
      .limit(parseInt(limit))
      .populate('userId', 'profile.firstName profile.lastName profile.ageGroup');

    // Find current user's rank
    const allUsers = await UserProgress.find(query).sort({ totalXP: -1 }).select('userId totalXP');
    const userRank = allUsers.findIndex(u => u.userId.toString() === userId.toString()) + 1;

    // Format leaderboard
    const leaderboard = topUsers.map((progress, index) => ({
      rank: index + 1,
      userId: progress.userId._id,
      name: `${progress.userId.profile.firstName} ${progress.userId.profile.lastName.charAt(0)}.`,
      level: progress.currentLevel,
      totalXP: progress.totalXP,
      rank: progress.rank,
      ageGroup: progress.userId.profile.ageGroup,
      isCurrentUser: progress.userId._id.toString() === userId.toString()
    }));

    res.json({
      success: true,
      leaderboard,
      userRank,
      type
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching leaderboard',
      error: error.message
    });
  }
});

// @desc    Get AI readiness score and report
// @route   GET /api/progress/ai-readiness
// @access  Private
router.get('/ai-readiness', protect, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get latest assessment
    const latestAssessment = await Assessment.findOne({ userId })
      .sort({ completedAt: -1 });

    if (!latestAssessment) {
      return res.status(404).json({
        success: false,
        message: 'No assessment found. Please complete initial assessment.'
      });
    }

    // Get AI collaboration game performance
    const aiGames = await GameSession.find({
      userId,
      gameType: 'ai-collaboration',
      status: 'completed'
    }).sort({ createdAt: -1 }).limit(10);

    const avgAIGameAccuracy = aiGames.length > 0
      ? aiGames.reduce((sum, game) => sum + game.results.accuracy, 0) / aiGames.length
      : 0;

    // Calculate overall AI readiness
    const assessmentScore = latestAssessment.scores.aiReadiness.overall;
    const practicalScore = avgAIGameAccuracy;
    const overallScore = Math.round((assessmentScore * 0.6 + practicalScore * 0.4));

    // Generate readiness report
    const report = generateAIReadinessReport(overallScore, latestAssessment.scores.aiReadiness, aiGames.length);

    res.json({
      success: true,
      aiReadiness: {
        overallScore,
        assessmentScore,
        practicalScore,
        breakdown: latestAssessment.scores.aiReadiness,
        report,
        lastAssessment: latestAssessment.completedAt,
        aiGamesCompleted: aiGames.length
      }
    });
  } catch (error) {
    console.error('Error fetching AI readiness:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching AI readiness',
      error: error.message
    });
  }
});

// @desc    Get personalized recommendations
// @route   GET /api/progress/recommendations
// @access  Private
router.get('/recommendations', protect, async (req, res) => {
  try {
    const userId = req.user._id;

    const userProgress = await UserProgress.findOne({ userId });
    const latestAssessment = await Assessment.findOne({ userId }).sort({ completedAt: -1 });

    if (!userProgress) {
      return res.status(404).json({
        success: false,
        message: 'Progress data not found'
      });
    }

    // Generate recommendations based on performance
    const recommendations = [];

    // Skill tree recommendations
    const skillTrees = Object.entries(userProgress.skillTrees).sort((a, b) => a[1].level - b[1].level);
    const weakestSkillTree = skillTrees[0];

    recommendations.push({
      type: 'skill-development',
      priority: 'high',
      title: `Focus on ${formatSkillTreeName(weakestSkillTree[0])}`,
      description: `Your ${formatSkillTreeName(weakestSkillTree[0])} skill tree is at level ${weakestSkillTree[1].level}. Try games that develop this area.`,
      suggestedGames: getGamesForSkillTree(weakestSkillTree[0])
    });

    // Consistency recommendation
    if (userProgress.streaks.currentStreak < 3) {
      recommendations.push({
        type: 'consistency',
        priority: 'medium',
        title: 'Build a Daily Habit',
        description: 'Try to play at least one game per day to build your streak and see consistent improvement.',
        action: 'Set a daily reminder'
      });
    }

    // Challenge recommendation
    if (userProgress.statistics.averageAccuracy > 85) {
      recommendations.push({
        type: 'challenge',
        priority: 'medium',
        title: 'Increase Difficulty',
        description: 'Your high accuracy suggests you\'re ready for more challenging content.',
        action: 'Try advanced difficulty levels'
      });
    }

    // AI readiness recommendation
    if (latestAssessment && latestAssessment.scores.aiReadiness.overall < 70) {
      recommendations.push({
        type: 'ai-readiness',
        priority: 'high',
        title: 'Improve AI Collaboration Skills',
        description: 'Focus on AI collaboration games to prepare for the future of work.',
        suggestedGames: ['ai-collaboration']
      });
    }

    // Variety recommendation
    const gamesPlayed = Array.from(userProgress.statistics.gamesPlayedByType.keys());
    if (gamesPlayed.length < 4) {
      recommendations.push({
        type: 'variety',
        priority: 'low',
        title: 'Try New Game Types',
        description: 'Diversify your cognitive training by exploring different game types.',
        suggestedGames: ['visual-pattern', 'sequence', 'memory', 'logical'].filter(g => !gamesPlayed.includes(g))
      });
    }

    res.json({
      success: true,
      recommendations
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating recommendations',
      error: error.message
    });
  }
});

// Helper functions

function calculatePerformanceTrends(sessions) {
  if (sessions.length < 2) {
    return { accuracy: 'stable', speed: 'stable', consistency: 'stable' };
  }

  const recentSessions = sessions.slice(-10);
  const olderSessions = sessions.slice(-20, -10);

  const recentAvgAccuracy = recentSessions.reduce((sum, s) => sum + s.results.accuracy, 0) / recentSessions.length;
  const olderAvgAccuracy = olderSessions.length > 0
    ? olderSessions.reduce((sum, s) => sum + s.results.accuracy, 0) / olderSessions.length
    : recentAvgAccuracy;

  const accuracyTrend = recentAvgAccuracy > olderAvgAccuracy + 5 ? 'improving'
    : recentAvgAccuracy < olderAvgAccuracy - 5 ? 'declining'
    : 'stable';

  return {
    accuracy: accuracyTrend,
    accuracyChange: Math.round((recentAvgAccuracy - olderAvgAccuracy) * 10) / 10,
    recentAvgAccuracy: Math.round(recentAvgAccuracy * 10) / 10,
    olderAvgAccuracy: Math.round(olderAvgAccuracy * 10) / 10
  };
}

function calculateGameTypeStats(sessions) {
  const stats = {};

  sessions.forEach(session => {
    if (!stats[session.gameType]) {
      stats[session.gameType] = {
        count: 0,
        totalAccuracy: 0,
        totalTime: 0,
        totalXP: 0
      };
    }

    stats[session.gameType].count++;
    stats[session.gameType].totalAccuracy += session.results.accuracy;
    stats[session.gameType].totalTime += session.duration;
    stats[session.gameType].totalXP += session.results.xpEarned;
  });

  Object.keys(stats).forEach(gameType => {
    stats[gameType].avgAccuracy = Math.round((stats[gameType].totalAccuracy / stats[gameType].count) * 10) / 10;
    stats[gameType].avgTime = Math.round((stats[gameType].totalTime / stats[gameType].count) * 10) / 10;
    stats[gameType].avgXP = Math.round((stats[gameType].totalXP / stats[gameType].count) * 10) / 10;
  });

  return stats;
}

function calculateTimeOfDayStats(sessions) {
  const timeSlots = {
    morning: { sessions: [], label: 'Morning (6am-12pm)' },
    afternoon: { sessions: [], label: 'Afternoon (12pm-6pm)' },
    evening: { sessions: [], label: 'Evening (6pm-12am)' },
    night: { sessions: [], label: 'Night (12am-6am)' }
  };

  sessions.forEach(session => {
    const hour = new Date(session.startTime).getHours();
    if (hour >= 6 && hour < 12) {
      timeSlots.morning.sessions.push(session);
    } else if (hour >= 12 && hour < 18) {
      timeSlots.afternoon.sessions.push(session);
    } else if (hour >= 18 && hour < 24) {
      timeSlots.evening.sessions.push(session);
    } else {
      timeSlots.night.sessions.push(session);
    }
  });

  Object.keys(timeSlots).forEach(slot => {
    const sessions = timeSlots[slot].sessions;
    if (sessions.length > 0) {
      timeSlots[slot].avgAccuracy = Math.round(
        (sessions.reduce((sum, s) => sum + s.results.accuracy, 0) / sessions.length) * 10
      ) / 10;
      timeSlots[slot].count = sessions.length;
    } else {
      timeSlots[slot].avgAccuracy = 0;
      timeSlots[slot].count = 0;
    }
    delete timeSlots[slot].sessions;
  });

  return timeSlots;
}

function calculateAchievementProgress(achievement, userStats) {
  const { type, value, gameType } = achievement.criteria;
  let current = 0;
  let target = value;

  switch (type) {
    case 'sessions_completed':
      current = gameType ? (userStats.gamesPlayedByType?.get(gameType) || 0) : userStats.totalSessionsCompleted;
      break;
    case 'accuracy_threshold':
      current = userStats.averageAccuracy;
      break;
    case 'streak_achieved':
      current = userStats.bestStreak;
      break;
    case 'level_reached':
      current = userStats.currentLevel;
      break;
    case 'xp_earned':
      current = userStats.totalXP;
      break;
    case 'consecutive_days':
      current = userStats.currentLoginStreak;
      break;
    case 'skill_tree_mastery':
      current = userStats.skillTrees?.[value.skillTree]?.level || 0;
      target = value.level;
      break;
    default:
      return 0;
  }

  return Math.min(100, Math.round((current / target) * 100));
}

function generateAIReadinessReport(overallScore, breakdown, gamesCompleted) {
  let readinessLevel = '';
  let recommendations = [];

  if (overallScore >= 80) {
    readinessLevel = 'Highly Prepared';
    recommendations = [
      'You are well-prepared for AI collaboration',
      'Consider mentoring others in AI literacy',
      'Stay updated with latest AI developments'
    ];
  } else if (overallScore >= 60) {
    readinessLevel = 'Moderately Prepared';
    recommendations = [
      'Continue practicing AI collaboration scenarios',
      'Focus on areas with lower scores',
      'Engage with real-world AI tools'
    ];
  } else {
    readinessLevel = 'Beginning Journey';
    recommendations = [
      'Start with fundamental AI concepts',
      'Practice pattern recognition regularly',
      'Complete more AI collaboration games'
    ];
  }

  return {
    level: readinessLevel,
    score: overallScore,
    strengths: Object.entries(breakdown)
      .filter(([key, value]) => key !== 'overall' && value >= 70)
      .map(([key]) => formatSkillName(key)),
    areasForGrowth: Object.entries(breakdown)
      .filter(([key, value]) => key !== 'overall' && value < 70)
      .map(([key]) => formatSkillName(key)),
    recommendations,
    practiceCount: gamesCompleted
  };
}

function formatSkillTreeName(skillTree) {
  return skillTree.replace(/([A-Z])/g, ' $1').trim();
}

function formatSkillName(skill) {
  return skill.replace(/([A-Z])/g, ' $1').trim();
}

function getGamesForSkillTree(skillTree) {
  const mapping = {
    visualProcessing: ['visual-pattern', 'spatial'],
    logicalReasoning: ['sequence', 'logical'],
    memoryEnhancement: ['memory'],
    speedOptimization: ['speed'],
    aiCollaboration: ['ai-collaboration']
  };

  return mapping[skillTree] || [];
}

module.exports = router;
