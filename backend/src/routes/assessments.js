const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Assessment = require('../models/Assessment');
const UserProgress = require('../models/UserProgress');
const { body, validationResult } = require('express-validator');

// @desc    Get initial assessment questions
// @route   GET /api/assessments/questions
// @access  Private
router.get('/questions', protect, async (req, res) => {
  try {
    const user = req.user;
    const ageGroup = user.profile.ageGroup;

    // Generate age-appropriate questions
    const questions = generateAssessmentQuestions(ageGroup);

    res.json({
      success: true,
      questions,
      estimatedTime: questions.length * 45 // 45 seconds per question
    });
  } catch (error) {
    console.error('Error fetching assessment questions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching assessment questions',
      error: error.message
    });
  }
});

// @desc    Submit initial assessment
// @route   POST /api/assessments/initial
// @access  Private
router.post('/initial', [
  protect,
  body('responses').isArray().withMessage('Responses must be an array'),
  body('responses.*.questionId').notEmpty(),
  body('responses.*.answer').exists()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { responses } = req.body;
    const userId = req.user._id;

    // Calculate scores from responses
    const scores = calculateScores(responses);

    // Create assessment
    const assessment = new Assessment({
      userId,
      assessmentType: 'initial',
      scores,
      responses,
      completedAt: new Date()
    });

    // Calculate overall scores
    assessment.calculateOverallCognitive();
    assessment.calculateOverallAIReadiness();

    // Generate recommendations and insights
    assessment.generateRecommendations();
    assessment.generateInsights();

    await assessment.save();

    // Update or create user progress with baseline
    let userProgress = await UserProgress.findOne({ userId });

    if (!userProgress) {
      userProgress = new UserProgress({ userId });
    }

    userProgress.setInitialBaseline(scores.cognitive);
    await userProgress.save();

    // Mark user as having completed initial assessment
    req.user.hasCompletedInitialAssessment = true;
    await req.user.save();

    res.status(201).json({
      success: true,
      assessment: {
        _id: assessment._id,
        scores: assessment.scores,
        recommendations: assessment.recommendations,
        insights: assessment.insights
      }
    });
  } catch (error) {
    console.error('Error submitting assessment:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting assessment',
      error: error.message
    });
  }
});

// @desc    Get assessment history
// @route   GET /api/assessments/history
// @access  Private
router.get('/history', protect, async (req, res) => {
  try {
    const userId = req.user._id;

    const assessments = await Assessment.find({ userId })
      .sort({ completedAt: -1 })
      .select('-responses');

    res.json({
      success: true,
      count: assessments.length,
      assessments
    });
  } catch (error) {
    console.error('Error fetching assessment history:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching assessment history',
      error: error.message
    });
  }
});

// @desc    Get latest assessment
// @route   GET /api/assessments/latest
// @access  Private
router.get('/latest', protect, async (req, res) => {
  try {
    const userId = req.user._id;

    const assessment = await Assessment.findOne({ userId })
      .sort({ completedAt: -1 })
      .select('-responses');

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'No assessment found'
      });
    }

    res.json({
      success: true,
      assessment
    });
  } catch (error) {
    console.error('Error fetching latest assessment:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching latest assessment',
      error: error.message
    });
  }
});

// @desc    Trigger periodic reassessment
// @route   POST /api/assessments/reassess
// @access  Private
router.post('/reassess', [
  protect,
  body('responses').isArray().withMessage('Responses must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { responses } = req.body;
    const userId = req.user._id;

    // Get previous assessment
    const previousAssessment = await Assessment.findOne({ userId })
      .sort({ completedAt: -1 });

    // Calculate scores from responses
    const scores = calculateScores(responses);

    // Create new assessment
    const assessment = new Assessment({
      userId,
      assessmentType: 'monthly',
      scores,
      responses,
      completedAt: new Date()
    });

    assessment.calculateOverallCognitive();
    assessment.calculateOverallAIReadiness();
    assessment.generateRecommendations();
    assessment.generateInsights();

    // Compare to previous
    if (previousAssessment) {
      assessment.comparisonToPrevious = Assessment.compareAssessments(
        previousAssessment,
        assessment
      );
    } else {
      assessment.comparisonToPrevious = { overallTrend: 'first-assessment' };
    }

    await assessment.save();

    // Update user progress cognitive levels
    const userProgress = await UserProgress.findOne({ userId });
    if (userProgress) {
      userProgress.updateCognitiveLevels(scores.cognitive);
      await userProgress.save();
    }

    res.status(201).json({
      success: true,
      assessment: {
        _id: assessment._id,
        scores: assessment.scores,
        recommendations: assessment.recommendations,
        insights: assessment.insights,
        comparison: assessment.comparisonToPrevious
      }
    });
  } catch (error) {
    console.error('Error submitting reassessment:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting reassessment',
      error: error.message
    });
  }
});

// Helper function to generate age-appropriate assessment questions
function generateAssessmentQuestions(ageGroup) {
  const baseQuestions = {
    cognitive: [
      // Working Memory
      {
        questionId: 'wm1',
        category: 'cognitive',
        subcategory: 'workingMemory',
        type: 'digit-span',
        question: 'Remember this sequence: 7, 3, 9, 2. What was the sequence?',
        options: [
          { value: [7, 3, 9, 2], label: '7, 3, 9, 2' },
          { value: [7, 9, 3, 2], label: '7, 9, 3, 2' },
          { value: [3, 7, 9, 2], label: '3, 7, 9, 2' },
          { value: [7, 3, 2, 9], label: '7, 3, 2, 9' }
        ],
        correctAnswer: [7, 3, 9, 2],
        timeLimit: 30000
      },
      // Processing Speed
      {
        questionId: 'ps1',
        category: 'cognitive',
        subcategory: 'processingSpeed',
        type: 'pattern-match',
        question: 'Are these patterns the same?',
        pattern1: ['red', 'blue', 'green'],
        pattern2: ['red', 'blue', 'green'],
        options: [
          { value: true, label: 'Yes' },
          { value: false, label: 'No' }
        ],
        correctAnswer: true,
        timeLimit: 10000
      },
      // Visual-Spatial
      {
        questionId: 'vs1',
        category: 'cognitive',
        subcategory: 'visualSpatial',
        type: 'pattern-completion',
        question: 'Which shape completes the pattern?',
        pattern: ['circle', 'square', 'triangle', 'circle', 'square', '?'],
        options: [
          { value: 'triangle', label: 'Triangle' },
          { value: 'circle', label: 'Circle' },
          { value: 'square', label: 'Square' },
          { value: 'hexagon', label: 'Hexagon' }
        ],
        correctAnswer: 'triangle',
        timeLimit: 30000
      },
      // Logical Reasoning
      {
        questionId: 'lr1',
        category: 'cognitive',
        subcategory: 'logicalReasoning',
        type: 'sequence',
        question: 'What comes next in the sequence: 2, 4, 6, 8, ?',
        options: [
          { value: 9, label: '9' },
          { value: 10, label: '10' },
          { value: 12, label: '12' },
          { value: 14, label: '14' }
        ],
        correctAnswer: 10,
        timeLimit: 30000
      },
      // Attention
      {
        questionId: 'att1',
        category: 'cognitive',
        subcategory: 'attention',
        type: 'focus',
        question: 'Count how many times the letter "A" appears: A B C A D E A F A',
        options: [
          { value: 3, label: '3' },
          { value: 4, label: '4' },
          { value: 5, label: '5' },
          { value: 6, label: '6' }
        ],
        correctAnswer: 4,
        timeLimit: 20000
      }
    ],
    personality: [
      {
        questionId: 'per1',
        category: 'personality',
        subcategory: 'openness',
        type: 'likert',
        question: 'I enjoy trying new and different things.',
        scale: [1, 2, 3, 4, 5],
        labels: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      },
      {
        questionId: 'per2',
        category: 'personality',
        subcategory: 'conscientiousness',
        type: 'likert',
        question: 'I am organized and like to plan ahead.',
        scale: [1, 2, 3, 4, 5],
        labels: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      },
      {
        questionId: 'per3',
        category: 'personality',
        subcategory: 'growthMindset',
        type: 'likert',
        question: 'I believe I can improve my abilities with effort and practice.',
        scale: [1, 2, 3, 4, 5],
        labels: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      }
    ],
    aiReadiness: [
      {
        questionId: 'ai1',
        category: 'aiReadiness',
        subcategory: 'technologicalAdaptability',
        type: 'likert',
        question: 'I feel comfortable learning new technology tools.',
        scale: [1, 2, 3, 4, 5],
        labels: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      },
      {
        questionId: 'ai2',
        category: 'aiReadiness',
        subcategory: 'patternRecognitionBaseline',
        type: 'pattern',
        question: 'Identify the pattern in: 1, 1, 2, 3, 5, 8, ?',
        options: [
          { value: 11, label: '11' },
          { value: 13, label: '13' },
          { value: 15, label: '15' },
          { value: 16, label: '16' }
        ],
        correctAnswer: 13,
        timeLimit: 45000
      },
      {
        questionId: 'ai3',
        category: 'aiReadiness',
        subcategory: 'abstractThinking',
        type: 'analogy',
        question: 'Cat is to Kitten as Dog is to ?',
        options: [
          { value: 'puppy', label: 'Puppy' },
          { value: 'pet', label: 'Pet' },
          { value: 'bark', label: 'Bark' },
          { value: 'animal', label: 'Animal' }
        ],
        correctAnswer: 'puppy',
        timeLimit: 30000
      }
    ]
  };

  // Adapt questions based on age group
  let questions = [
    ...baseQuestions.cognitive,
    ...baseQuestions.personality,
    ...baseQuestions.aiReadiness
  ];

  // Simplify for younger age groups
  if (ageGroup === '3-6' || ageGroup === '7-12') {
    questions = questions.filter(q => {
      // Remove complex questions for children
      return !['analogy', 'advanced-logic'].includes(q.type);
    });
  }

  return questions;
}

// Helper function to calculate scores from responses
function calculateScores(responses) {
  const scores = {
    cognitive: {
      workingMemory: 0,
      processingSpeed: 0,
      visualSpatial: 0,
      logicalReasoning: 0,
      attention: 0
    },
    personality: {
      openness: 0,
      conscientiousness: 0,
      extraversion: 0,
      agreeableness: 0,
      neuroticism: 0,
      growthMindset: 0
    },
    aiReadiness: {
      technologicalAdaptability: 0,
      patternRecognitionBaseline: 0,
      abstractThinking: 0,
      problemSolving: 0,
      ambiguityTolerance: 0
    }
  };

  const counters = {
    cognitive: {
      workingMemory: 0,
      processingSpeed: 0,
      visualSpatial: 0,
      logicalReasoning: 0,
      attention: 0
    },
    personality: {
      openness: 0,
      conscientiousness: 0,
      extraversion: 0,
      agreeableness: 0,
      neuroticism: 0,
      growthMindset: 0
    },
    aiReadiness: {
      technologicalAdaptability: 0,
      patternRecognitionBaseline: 0,
      abstractThinking: 0,
      problemSolving: 0,
      ambiguityTolerance: 0
    }
  };

  // Calculate scores based on responses
  responses.forEach(response => {
    const category = response.category;
    const subcategory = response.subcategory;

    if (!scores[category] || !scores[category][subcategory]) {
      return;
    }

    counters[category][subcategory]++;

    if (category === 'cognitive' || category === 'aiReadiness') {
      // For cognitive and AI readiness, check if answer is correct
      if (response.isCorrect) {
        // Base score of 100 for correct answer
        let score = 100;

        // Adjust for response time if available
        if (response.responseTime && response.timeLimit) {
          const speedRatio = response.responseTime / response.timeLimit;
          if (speedRatio < 0.5) {
            score += 20; // Very fast
          } else if (speedRatio < 0.75) {
            score += 10; // Fast
          }
        }

        scores[category][subcategory] += score;
      } else {
        // Partial credit for attempting
        scores[category][subcategory] += 20;
      }
    } else if (category === 'personality') {
      // For personality, Likert scale (1-5) converted to 0-100
      const likertScore = ((response.answer - 1) / 4) * 100;
      scores[category][subcategory] += likertScore;
    }
  });

  // Average the scores
  Object.keys(scores).forEach(category => {
    Object.keys(scores[category]).forEach(subcategory => {
      if (counters[category][subcategory] > 0) {
        scores[category][subcategory] = Math.round(
          scores[category][subcategory] / counters[category][subcategory]
        );
      } else {
        scores[category][subcategory] = 50; // Default middle score
      }
    });
  });

  return scores;
}

module.exports = router;
