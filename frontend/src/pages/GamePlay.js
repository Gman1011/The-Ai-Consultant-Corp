import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const GamePlay = () => {
  const { gameType } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [hint, setHint] = useState('');
  const [streak, setStreak] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    startGameSession();
  }, [gameType]);

  useEffect(() => {
    if (session && currentProblemIndex < session.problems.length) {
      const problem = session.problems[currentProblemIndex];
      setTimeRemaining(problem.timeLimit);
      setSelectedAnswer(null);
      setFeedback(null);
      setShowHint(false);
    }
  }, [currentProblemIndex, session]);

  useEffect(() => {
    if (timeRemaining === null) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          handleTimeout();
          return 0;
        }
        return prev - 100;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  const startGameSession = async () => {
    try {
      setLoading(true);
      const response = await api.post('/games/start', { gameType });
      setSession(response.data.session);
    } catch (error) {
      console.error('Error starting game session:', error);
      setError('Failed to start game session');
    } finally {
      setLoading(false);
    }
  };

  const handleTimeout = () => {
    setFeedback({
      correct: false,
      message: '⏰ Time\'s up! Moving to next question.'
    });
    setTimeout(() => {
      handleNext(null);
    }, 2000);
  };

  const handleAnswerSelect = (answer) => {
    if (feedback) return; // Already answered
    setSelectedAnswer(answer);
  };

  const handleSubmit = async () => {
    if (selectedAnswer === null || feedback) return;

    try {
      setSubmitting(true);
      const problem = session.problems[currentProblemIndex];

      const response = await api.post(`/games/${session._id}/answer`, {
        problemId: problem.id,
        answer: selectedAnswer
      });

      const result = response.data.result;
      setFeedback({
        correct: result.correct,
        correctAnswer: result.correctAnswer,
        message: result.correct
          ? ['🎉 Correct!', '✅ Great job!', '🌟 Perfect!', '💯 Excellent!'][Math.floor(Math.random() * 4)]
          : '❌ Not quite right'
      });

      setStreak(result.currentStreak || 0);

    } catch (error) {
      console.error('Error submitting answer:', error);
      setError('Failed to submit answer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = async (answer = selectedAnswer) => {
    if (!feedback && answer !== null) {
      await handleSubmit();
      setTimeout(() => handleNext(answer), 2000);
      return;
    }

    if (currentProblemIndex < session.problems.length - 1) {
      setCurrentProblemIndex(currentProblemIndex + 1);
    } else {
      completeSession();
    }
  };

  const completeSession = async () => {
    try {
      setLoading(true);
      const response = await api.post(`/games/${session._id}/complete`);
      setResults(response.data);
    } catch (error) {
      console.error('Error completing session:', error);
      setError('Failed to complete session');
    } finally {
      setLoading(false);
    }
  };

  const requestHint = async () => {
    try {
      const problem = session.problems[currentProblemIndex];
      const response = await api.get(`/games/${session._id}/hint/${problem.id}`);
      setHint(response.data.hint);
      setShowHint(true);
    } catch (error) {
      console.error('Error getting hint:', error);
      alert('No more hints available for this problem');
    }
  };

  const renderProblem = () => {
    if (!session || currentProblemIndex >= session.problems.length) return null;

    const problem = session.problems[currentProblemIndex];

    switch (session.gameType) {
      case 'visual-pattern':
        return renderVisualPattern(problem);
      case 'sequence':
        return renderSequence(problem);
      case 'memory':
        return renderMemory(problem);
      case 'speed':
        return renderSpeed(problem);
      case 'logical':
        return renderLogical(problem);
      case 'spatial':
        return renderSpatial(problem);
      case 'ai-collaboration':
        return renderAICollaboration(problem);
      default:
        return renderGeneric(problem);
    }
  };

  const renderVisualPattern = (problem) => {
    return (
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-center text-gray-900">
          {problem.question}
        </h3>

        {problem.data?.pattern && (
          <div className="bg-gray-100 rounded-lg p-8">
            <div className="flex items-center justify-center flex-wrap gap-4">
              {problem.data.pattern.map((element, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center"
                  style={{
                    width: element.size === 'large' ? '80px' : element.size === 'small' ? '40px' : '60px',
                    height: element.size === 'large' ? '80px' : element.size === 'small' ? '40px' : '60px'
                  }}
                >
                  <div
                    className="rounded-lg flex items-center justify-center"
                    style={{
                      backgroundColor: element.color || 'transparent',
                      border: `3px solid ${element.color || '#999'}`,
                      width: '100%',
                      height: '100%'
                    }}
                  >
                    {getShapeSymbol(element.shape)}
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-center w-16 h-16">
                <span className="text-4xl font-bold text-gray-400">?</span>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {problem.options?.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={feedback !== null}
              className={`p-6 rounded-lg border-2 transition-all ${
                selectedAnswer === index
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300 bg-white'
              } ${feedback ? 'cursor-not-allowed opacity-75' : ''}`}
            >
              <div
                className="w-16 h-16 mx-auto flex items-center justify-center rounded-lg"
                style={{
                  backgroundColor: option.color || 'transparent',
                  border: `2px solid ${option.color || '#999'}`
                }}
              >
                {getShapeSymbol(option.shape)}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderSequence = (problem) => {
    return (
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-center text-gray-900">
          {problem.question}
        </h3>

        {problem.data?.sequence && (
          <div className="bg-gray-100 rounded-lg p-8">
            <div className="flex items-center justify-center flex-wrap gap-4">
              {problem.data.sequence.map((num, index) => (
                <div key={index} className="text-3xl font-bold text-gray-800">
                  {num}
                </div>
              ))}
              <div className="text-3xl font-bold text-gray-400">,</div>
              <div className="text-4xl font-bold text-gray-400">?</div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {problem.options?.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option.value)}
              disabled={feedback !== null}
              className={`p-6 rounded-lg border-2 transition-all ${
                selectedAnswer === option.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300 bg-white'
              } ${feedback ? 'cursor-not-allowed opacity-75' : ''}`}
            >
              <div className="text-3xl font-bold text-gray-900">
                {option.label}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderSpeed = (problem) => {
    return (
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-center text-gray-900">
          {problem.question}
        </h3>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-100 rounded-lg p-8">
            <h4 className="text-center text-sm text-gray-600 mb-4">Pattern 1</h4>
            <div className="flex justify-center gap-2">
              {problem.data?.pattern1?.map((color, index) => (
                <div
                  key={index}
                  className="w-16 h-16 rounded-lg"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="bg-gray-100 rounded-lg p-8">
            <h4 className="text-center text-sm text-gray-600 mb-4">Pattern 2</h4>
            <div className="flex justify-center gap-2">
              {problem.data?.pattern2?.map((color, index) => (
                <div
                  key={index}
                  className="w-16 h-16 rounded-lg"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {problem.options?.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option.value)}
              disabled={feedback !== null}
              className={`p-8 rounded-lg border-2 transition-all ${
                selectedAnswer === option.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300 bg-white'
              } ${feedback ? 'cursor-not-allowed opacity-75' : ''}`}
            >
              <div className="text-2xl font-bold text-gray-900">
                {option.label}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderGeneric = (problem) => {
    return (
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-center text-gray-900">
          {problem.question}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {problem.options?.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option.value)}
              disabled={feedback !== null}
              className={`p-6 rounded-lg border-2 transition-all ${
                selectedAnswer === option.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300 bg-white'
              } ${feedback ? 'cursor-not-allowed opacity-75' : ''}`}
            >
              <div className="text-lg font-medium text-gray-900">
                {option.label}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderMemory = renderGeneric;
  const renderLogical = renderGeneric;
  const renderSpatial = renderGeneric;
  const renderAICollaboration = renderGeneric;

  const getShapeSymbol = (shape) => {
    const shapes = {
      'circle': '●',
      'square': '■',
      'triangle': '▲',
      'hexagon': '⬡',
      'star': '★',
      'diamond': '◆'
    };
    return <span className="text-2xl">{shapes[shape] || shapes.circle}</span>;
  };

  const renderResults = () => {
    if (!results) return null;

    return (
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Session Complete! 🎉
          </h2>
          <p className="text-gray-600">
            {results.performance?.message || results.recommendations?.message}
          </p>
        </div>

        {/* Results Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">
                {results.results?.accuracy?.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600 mt-1">Accuracy</div>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold text-green-600">
                {results.results?.correctAnswers}/{results.results?.totalProblems}
              </div>
              <div className="text-sm text-gray-600 mt-1">Correct</div>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600">
                +{results.results?.xpEarned}
              </div>
              <div className="text-sm text-gray-600 mt-1">XP Earned</div>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600">
                {results.results?.streakBest}
              </div>
              <div className="text-sm text-gray-600 mt-1">Best Streak</div>
            </div>
          </div>

          {results.levelUp && (
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg p-6 mb-6">
              <div className="text-center">
                <div className="text-6xl mb-2">🎊</div>
                <h3 className="text-2xl font-bold mb-2">Level Up!</h3>
                <p className="text-lg">
                  You reached Level {results.levelUp.newLevel}!
                </p>
              </div>
            </div>
          )}

          {/* Performance Metrics */}
          {results.performance && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-bold text-gray-900 mb-4">Performance Analysis</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Response Time:</span>
                  <span className="font-medium">
                    {(results.performance.avgResponseTime / 1000).toFixed(2)}s
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fastest Response:</span>
                  <span className="font-medium">
                    {(results.performance.fastestResponse / 1000).toFixed(2)}s
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Consistency:</span>
                  <span className="font-medium">
                    {results.performance.consistency > 0.8 ? 'Excellent' :
                     results.performance.consistency > 0.6 ? 'Good' : 'Needs Improvement'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recommendations */}
        {results.recommendations?.nextSteps && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="font-bold text-gray-900 mb-3">Next Steps</h3>
            <ul className="space-y-2">
              {results.recommendations.nextSteps.map((step, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span className="text-gray-700">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => startGameSession()}
            className="flex-1 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Play Again
          </button>
          <button
            onClick={() => navigate('/games')}
            className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Choose Different Game
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium"
          >
            Dashboard
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading game...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/games')}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Back to Games
          </button>
        </div>
      </div>
    );
  }

  if (results) {
    return (
      <div className="container mx-auto px-4 py-8">
        {renderResults()}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/games')}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 capitalize">
              {session?.gameType?.replace('-', ' ')}
            </h1>
            <p className="text-sm text-gray-600">
              Problem {currentProblemIndex + 1} of {session?.problems?.length}
            </p>
          </div>
        </div>

        {streak > 0 && (
          <div className="flex items-center space-x-2 bg-orange-100 px-4 py-2 rounded-full">
            <span className="text-2xl">🔥</span>
            <span className="font-bold text-orange-700">{streak} Streak</span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((currentProblemIndex + 1) / (session?.problems?.length || 1)) * 100}%`
            }}
          />
        </div>
      </div>

      {/* Timer and Difficulty */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Difficulty:</span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            Level {session?.difficulty || 1}
          </span>
        </div>

        {timeRemaining !== null && (
          <div className="flex items-center space-x-2">
            <span className="text-2xl">⏱️</span>
            <span className={`text-lg font-bold ${
              timeRemaining < 5000 ? 'text-red-600' : 'text-gray-700'
            }`}>
              {(timeRemaining / 1000).toFixed(1)}s
            </span>
          </div>
        )}
      </div>

      {/* Problem Card */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
        {renderProblem()}
      </div>

      {/* Feedback */}
      {feedback && (
        <div className={`mb-6 p-4 rounded-lg ${
          feedback.correct ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          <p className={`text-lg font-medium ${
            feedback.correct ? 'text-green-700' : 'text-red-700'
          }`}>
            {feedback.message}
          </p>
          {!feedback.correct && feedback.correctAnswer !== undefined && (
            <p className="text-sm text-gray-600 mt-1">
              Correct answer: {JSON.stringify(feedback.correctAnswer)}
            </p>
          )}
        </div>
      )}

      {/* Hint */}
      {showHint && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <span className="text-xl">💡</span>
            <div>
              <p className="font-medium text-gray-900">Hint:</p>
              <p className="text-gray-700">{hint}</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={requestHint}
          disabled={feedback !== null || showHint}
          className={`px-4 py-2 rounded-lg transition-colors ${
            feedback || showHint
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
          }`}
        >
          💡 Get Hint
        </button>

        {!feedback ? (
          <button
            onClick={handleSubmit}
            disabled={selectedAnswer === null || submitting}
            className={`px-8 py-3 rounded-lg font-medium transition-colors ${
              selectedAnswer === null || submitting
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {submitting ? 'Submitting...' : 'Submit Answer'}
          </button>
        ) : (
          <button
            onClick={() => handleNext()}
            className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
          >
            {currentProblemIndex < session.problems.length - 1 ? 'Next →' : 'Finish'}
          </button>
        )}
      </div>
    </div>
  );
};

export default GamePlay;
