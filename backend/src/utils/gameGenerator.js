/**
 * Game Problem Generator
 * Generates adaptive pattern recognition problems for different game types
 */

// Generate problems based on game type, difficulty, and count
async function generateGameProblems(gameType, difficulty, count, ageGroup) {
  const generators = {
    'visual-pattern': generateVisualPatternProblems,
    'sequence': generateSequenceProblems,
    'spatial': generateSpatialProblems,
    'logical': generateLogicalProblems,
    'memory': generateMemoryProblems,
    'speed': generateSpeedProblems,
    'ai-collaboration': generateAICollaborationProblems
  };

  const generator = generators[gameType];
  if (!generator) {
    throw new Error(`Unknown game type: ${gameType}`);
  }

  const problems = [];
  for (let i = 0; i < count; i++) {
    const problem = await generator(difficulty, i, ageGroup);
    problems.push(problem);
  }

  return problems;
}

// Visual Pattern Recognition Problems
function generateVisualPatternProblems(difficulty, index, ageGroup) {
  const shapes = ['circle', 'square', 'triangle', 'hexagon', 'star', 'diamond'];
  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink'];
  const sizes = ['small', 'medium', 'large'];

  // Adjust complexity based on difficulty
  const patternLength = Math.floor(3 + (difficulty / 20)); // 3-8 elements
  const attributes = difficulty < 30 ? 1 : difficulty < 60 ? 2 : 3; // shape, color, size

  // Generate pattern
  const pattern = [];
  const rules = generatePatternRules(attributes, difficulty);

  for (let i = 0; i < patternLength; i++) {
    const element = {
      shape: shapes[i % shapes.length],
      color: colors[i % colors.length],
      size: sizes[i % sizes.length]
    };

    // Apply rules to create pattern
    if (rules.shapeRule === 'alternating' && i > 0) {
      element.shape = pattern[i - 1].shape === shapes[0] ? shapes[1] : shapes[0];
    }
    if (rules.colorRule === 'sequential') {
      element.color = colors[i % colors.length];
    }

    pattern.push(element);
  }

  // Remove last element to create the question
  const answer = pattern[pattern.length - 1];
  const questionPattern = pattern.slice(0, -1);

  // Generate options
  const options = generateVisualPatternOptions(answer, shapes, colors, sizes, attributes);

  return {
    id: `visual-${index}`,
    type: 'visual-pattern',
    difficulty,
    question: 'What comes next in the pattern?',
    data: {
      pattern: questionPattern,
      attributes: attributes,
      rules: rules
    },
    options: options,
    correctAnswer: options.findIndex(opt =>
      opt.shape === answer.shape &&
      opt.color === answer.color &&
      opt.size === answer.size
    ),
    timeLimit: Math.max(10000, 30000 - (difficulty * 100)) // 30s to 10s
  };
}

function generatePatternRules(attributes, difficulty) {
  const rules = {};

  if (difficulty < 40) {
    rules.shapeRule = 'repeating';
    rules.colorRule = 'repeating';
    rules.sizeRule = 'constant';
  } else if (difficulty < 70) {
    rules.shapeRule = Math.random() > 0.5 ? 'alternating' : 'sequential';
    rules.colorRule = 'sequential';
    rules.sizeRule = 'alternating';
  } else {
    rules.shapeRule = 'complex';
    rules.colorRule = 'complex';
    rules.sizeRule = 'pattern-based';
  }

  return rules;
}

function generateVisualPatternOptions(correctAnswer, shapes, colors, sizes, attributes) {
  const options = [correctAnswer];

  // Generate 3 distractors
  while (options.length < 4) {
    const distractor = {
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      size: sizes[Math.floor(Math.random() * sizes.length)]
    };

    // Ensure distractor is not identical to correct answer
    if (!options.some(opt =>
      opt.shape === distractor.shape &&
      opt.color === distractor.color &&
      opt.size === distractor.size
    )) {
      options.push(distractor);
    }
  }

  // Shuffle options
  return shuffleArray(options);
}

// Sequence Recognition Problems
function generateSequenceProblems(difficulty, index, ageGroup) {
  const sequenceTypes = ['arithmetic', 'geometric', 'fibonacci', 'prime', 'alternating', 'custom'];
  const typeIndex = Math.min(Math.floor(difficulty / 20), sequenceTypes.length - 1);
  const type = sequenceTypes[typeIndex];

  let sequence = [];
  let answer = 0;

  switch (type) {
    case 'arithmetic':
      const diff = Math.floor(2 + difficulty / 10);
      const start = Math.floor(Math.random() * 10) + 1;
      sequence = Array.from({ length: 5 }, (_, i) => start + i * diff);
      answer = sequence[sequence.length - 1] + diff;
      break;

    case 'geometric':
      const ratio = 2;
      const base = Math.floor(Math.random() * 3) + 1;
      sequence = Array.from({ length: 5 }, (_, i) => base * Math.pow(ratio, i));
      answer = sequence[sequence.length - 1] * ratio;
      break;

    case 'fibonacci':
      sequence = [1, 1];
      for (let i = 2; i < 6; i++) {
        sequence.push(sequence[i - 1] + sequence[i - 2]);
      }
      answer = sequence[sequence.length - 1] + sequence[sequence.length - 2];
      break;

    case 'alternating':
      const seq1 = [2, 4, 6];
      const seq2 = [1, 3, 5];
      sequence = [seq1[0], seq2[0], seq1[1], seq2[1], seq1[2]];
      answer = seq2[2];
      break;

    default:
      // Custom complex pattern
      const operation = Math.random() > 0.5 ? 'add' : 'multiply';
      sequence = [1, 2];
      for (let i = 2; i < 6; i++) {
        if (operation === 'add') {
          sequence.push(sequence[i - 1] + sequence[i - 2]);
        } else {
          sequence.push(sequence[i - 1] * 2);
        }
      }
      answer = operation === 'add'
        ? sequence[sequence.length - 1] + sequence[sequence.length - 2]
        : sequence[sequence.length - 1] * 2;
  }

  const questionSequence = sequence.slice(0, 5);

  // Generate options
  const options = [
    answer,
    answer + Math.floor(Math.random() * 5) + 1,
    answer - Math.floor(Math.random() * 5) - 1,
    answer * 2
  ];

  return {
    id: `sequence-${index}`,
    type: 'sequence',
    difficulty,
    question: `What comes next in the sequence: ${questionSequence.join(', ')}, ?`,
    data: {
      sequence: questionSequence,
      type: type
    },
    options: shuffleArray(options.map(opt => ({ value: opt, label: opt.toString() }))),
    correctAnswer: answer,
    timeLimit: Math.max(15000, 45000 - (difficulty * 200))
  };
}

// Spatial Reasoning Problems
function generateSpatialProblems(difficulty, index, ageGroup) {
  const problemTypes = ['mental-rotation', 'paper-folding', 'block-counting'];
  const type = problemTypes[index % problemTypes.length];

  if (type === 'mental-rotation') {
    const shape = generateComplexShape(difficulty);
    const rotationAngles = [0, 90, 180, 270];
    const correctRotation = rotationAngles[Math.floor(Math.random() * rotationAngles.length)];

    const options = rotationAngles.map(angle => ({
      shape: shape,
      rotation: angle
    }));

    return {
      id: `spatial-${index}`,
      type: 'spatial',
      difficulty,
      question: `Which shape is the same as the original, just rotated?`,
      data: {
        originalShape: shape,
        originalRotation: 0,
        problemType: 'mental-rotation'
      },
      options: options,
      correctAnswer: correctRotation,
      timeLimit: Math.max(20000, 60000 - (difficulty * 300))
    };
  }

  // Simplified for now - can be expanded with more complex spatial problems
  return {
    id: `spatial-${index}`,
    type: 'spatial',
    difficulty,
    question: 'Spatial reasoning problem',
    data: {},
    options: [],
    correctAnswer: 0,
    timeLimit: 30000
  };
}

// Logical Pattern Problems
function generateLogicalProblems(difficulty, index, ageGroup) {
  const problemTypes = ['matrix-pattern', 'analogy', 'set-theory'];
  const type = problemTypes[Math.floor(difficulty / 35)];

  if (type === 'analogy') {
    const analogies = [
      { a: 'cat', b: 'kitten', c: 'dog', d: 'puppy', distractors: ['pet', 'bark', 'animal'] },
      { a: 'hot', b: 'cold', c: 'light', d: 'dark', distractors: ['bright', 'sun', 'shadow'] },
      { a: 'book', b: 'read', c: 'music', d: 'listen', distractors: ['song', 'hear', 'sound'] },
      { a: 'car', b: 'road', c: 'plane', d: 'sky', distractors: ['fly', 'airport', 'pilot'] }
    ];

    const analogy = analogies[index % analogies.length];
    const options = [analogy.d, ...analogy.distractors];

    return {
      id: `logical-${index}`,
      type: 'logical',
      difficulty,
      question: `${analogy.a} is to ${analogy.b} as ${analogy.c} is to ?`,
      data: {
        type: 'analogy',
        relationship: 'analogical reasoning'
      },
      options: shuffleArray(options.map(opt => ({ value: opt, label: opt }))),
      correctAnswer: analogy.d,
      timeLimit: Math.max(20000, 45000 - (difficulty * 150))
    };
  }

  // Matrix pattern (3x3 grid with missing element)
  const matrix = generateMatrixPattern(difficulty);

  return {
    id: `logical-${index}`,
    type: 'logical',
    difficulty,
    question: 'Which option completes the pattern?',
    data: {
      type: 'matrix-pattern',
      matrix: matrix.grid
    },
    options: matrix.options,
    correctAnswer: matrix.answer,
    timeLimit: Math.max(25000, 60000 - (difficulty * 250))
  };
}

// Memory Problems (N-Back)
function generateMemoryProblems(difficulty, index, ageGroup) {
  const nBackLevel = Math.min(Math.floor(1 + difficulty / 25), 4); // 1-back to 4-back
  const sequenceLength = 10 + Math.floor(difficulty / 10);

  const stimuli = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const sequence = [];

  // Generate random sequence with controlled matches
  for (let i = 0; i < sequenceLength; i++) {
    if (i >= nBackLevel && Math.random() < 0.3) {
      // 30% chance of n-back match
      sequence.push(sequence[i - nBackLevel]);
    } else {
      sequence.push(stimuli[Math.floor(Math.random() * stimuli.length)]);
    }
  }

  return {
    id: `memory-${index}`,
    type: 'memory',
    difficulty,
    question: `Remember items and indicate when you see a ${nBackLevel}-back match`,
    data: {
      nBackLevel,
      sequence,
      sequenceLength
    },
    options: [
      { value: 'match', label: 'Match' },
      { value: 'no-match', label: 'No Match' }
    ],
    correctAnswer: 'computed-per-stimulus', // This requires step-by-step checking
    timeLimit: sequenceLength * 2000 // 2 seconds per stimulus
  };
}

// Speed Problems
function generateSpeedProblems(difficulty, index, ageGroup) {
  const patterns = [
    ['red', 'red', 'red'],
    ['blue', 'blue', 'blue'],
    ['red', 'blue', 'red'],
    ['red', 'red', 'blue']
  ];

  const pattern1 = patterns[Math.floor(Math.random() * patterns.length)];
  const isMatch = Math.random() > 0.5;
  const pattern2 = isMatch
    ? [...pattern1]
    : patterns.find(p => JSON.stringify(p) !== JSON.stringify(pattern1));

  return {
    id: `speed-${index}`,
    type: 'speed',
    difficulty,
    question: 'Are these patterns the same? (Quick!)',
    data: {
      pattern1,
      pattern2
    },
    options: [
      { value: true, label: 'Same' },
      { value: false, label: 'Different' }
    ],
    correctAnswer: isMatch,
    timeLimit: Math.max(2000, 5000 - (difficulty * 30)) // 5s to 2s
  };
}

// AI Collaboration Problems
function generateAICollaborationProblems(difficulty, index, ageGroup) {
  const problemTypes = ['data-pattern', 'bias-detection', 'prompt-engineering', 'ai-verification'];
  const type = problemTypes[index % problemTypes.length];

  if (type === 'data-pattern') {
    // Show a dataset and ask to identify trend
    const data = generateTrendData(difficulty);

    return {
      id: `ai-collab-${index}`,
      type: 'ai-collaboration',
      difficulty,
      question: 'What pattern does this data show?',
      data: {
        dataset: data.values,
        visualization: 'line-chart'
      },
      options: [
        { value: 'increasing', label: 'Increasing trend' },
        { value: 'decreasing', label: 'Decreasing trend' },
        { value: 'cyclical', label: 'Cyclical pattern' },
        { value: 'random', label: 'No clear pattern' }
      ],
      correctAnswer: data.pattern,
      timeLimit: Math.max(20000, 45000 - (difficulty * 100))
    };
  }

  // Default AI collaboration problem
  return {
    id: `ai-collab-${index}`,
    type: 'ai-collaboration',
    difficulty,
    question: 'AI collaboration problem',
    data: {},
    options: [],
    correctAnswer: 0,
    timeLimit: 30000
  };
}

// Helper functions

function generateComplexShape(difficulty) {
  // Generate shape coordinates based on difficulty
  const pointCount = Math.floor(3 + difficulty / 20);
  const points = [];

  for (let i = 0; i < pointCount; i++) {
    points.push({
      x: Math.random() * 100,
      y: Math.random() * 100
    });
  }

  return { points, type: 'polygon' };
}

function generateMatrixPattern(difficulty) {
  // Simple 3x3 matrix with pattern
  const shapes = ['circle', 'square', 'triangle'];
  const grid = [];

  for (let i = 0; i < 3; i++) {
    const row = [];
    for (let j = 0; j < 3; j++) {
      if (i === 2 && j === 2) {
        row.push(null); // Missing element
      } else {
        row.push({
          shape: shapes[(i + j) % shapes.length],
          filled: (i + j) % 2 === 0
        });
      }
    }
    grid.push(row);
  }

  // The answer follows the pattern
  const answer = {
    shape: shapes[(2 + 2) % shapes.length],
    filled: (2 + 2) % 2 === 0
  };

  // Generate distractors
  const options = [
    answer,
    { shape: shapes[0], filled: !answer.filled },
    { shape: shapes[1], filled: answer.filled },
    { shape: shapes[2], filled: !answer.filled }
  ];

  return {
    grid,
    options: shuffleArray(options),
    answer
  };
}

function generateTrendData(difficulty) {
  const length = 10 + Math.floor(difficulty / 10);
  const patterns = ['increasing', 'decreasing', 'cyclical', 'random'];
  const pattern = patterns[Math.floor(Math.random() * patterns.length)];

  const values = [];
  let base = 50;

  for (let i = 0; i < length; i++) {
    switch (pattern) {
      case 'increasing':
        base += Math.random() * 5 + 2;
        break;
      case 'decreasing':
        base -= Math.random() * 5 + 2;
        break;
      case 'cyclical':
        base = 50 + 20 * Math.sin(i * Math.PI / 4);
        break;
      default:
        base = 30 + Math.random() * 40;
    }
    values.push(Math.round(base));
  }

  return { values, pattern };
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

module.exports = {
  generateGameProblems
};
