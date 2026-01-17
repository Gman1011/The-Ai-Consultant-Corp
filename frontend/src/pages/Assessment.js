import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Assessment = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      setStartTime(Date.now());
    }
  }, [currentQuestionIndex, questions]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/assessments/questions');
      setQuestions(response.data.questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setError('Failed to load assessment questions');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNext = () => {
    if (selectedAnswer === null) {
      alert('Please select an answer before continuing');
      return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    const responseTime = Date.now() - startTime;

    // Determine if answer is correct
    let isCorrect = false;
    if (currentQuestion.category === 'cognitive' || currentQuestion.category === 'aiReadiness') {
      isCorrect = JSON.stringify(selectedAnswer) === JSON.stringify(currentQuestion.correctAnswer);
    }

    const response = {
      questionId: currentQuestion.questionId,
      question: currentQuestion.question,
      answer: selectedAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
      responseTime,
      category: currentQuestion.category,
      subcategory: currentQuestion.subcategory,
      timeLimit: currentQuestion.timeLimit
    };

    setResponses([...responses, response]);
    setSelectedAnswer(null);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      submitAssessment([...responses, response]);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      // Restore previous answer
      const previousResponse = responses[currentQuestionIndex - 1];
      if (previousResponse) {
        setSelectedAnswer(previousResponse.answer);
      }
    }
  };

  const submitAssessment = async (finalResponses) => {
    try {
      setSubmitting(true);
      const response = await api.post('/assessments/initial', {
        responses: finalResponses
      });
      setResults(response.data.assessment);
    } catch (error) {
      console.error('Error submitting assessment:', error);
      setError('Failed to submit assessment');
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestion = () => {
    if (questions.length === 0) return null;

    const question = questions[currentQuestionIndex];

    switch (question.type) {
      case 'likert':
        return renderLikertQuestion(question);
      case 'digit-span':
      case 'pattern-match':
      case 'pattern-completion':
      case 'sequence':
      case 'focus':
      case 'pattern':
      case 'analogy':
        return renderMultipleChoice(question);
      default:
        return renderMultipleChoice(question);
    }
  };

  const renderLikertQuestion = (question) => {
    return (
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
          {question.question}
        </h3>

        <div className="flex flex-col space-y-3">
          {question.labels.map((label, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(question.scale[index])}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedAnswer === question.scale[index]
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-lg">{label}</span>
                <div className={`w-6 h-6 rounded-full border-2 ${
                  selectedAnswer === question.scale[index]
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}>
                  {selectedAnswer === question.scale[index] && (
                    <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderMultipleChoice = (question) => {
    return (
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
          {question.question}
        </h3>

        {question.pattern && (
          <div className="bg-gray-100 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-center space-x-4">
              {question.pattern.map((item, index) => (
                <React.Fragment key={index}>
                  {item === '?' ? (
                    <div className="w-16 h-16 flex items-center justify-center text-4xl font-bold text-gray-400">
                      ?
                    </div>
                  ) : (
                    <div className="w-16 h-16 flex items-center justify-center bg-white rounded-lg shadow">
                      <span className="text-2xl">{getShapeEmoji(item)}</span>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option.value)}
              className={`p-6 rounded-lg border-2 transition-all ${
                selectedAnswer === option.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300 bg-white'
              }`}
            >
              <div className="text-lg font-medium text-center">
                {typeof option.label === 'string' && getShapeEmoji(option.label)
                  ? <span className="text-4xl">{getShapeEmoji(option.label)}</span>
                  : option.label
                }
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const getShapeEmoji = (shape) => {
    const shapes = {
      'circle': '⭕',
      'square': '⬜',
      'triangle': '🔺',
      'hexagon': '⬡',
      'star': '⭐',
      'diamond': '💠'
    };
    return shapes[shape.toLowerCase()] || null;
  };

  const renderResults = () => {
    if (!results) return null;

    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Assessment Complete! 🎉
          </h2>
          <p className="text-gray-600">
            Here are your cognitive assessment results
          </p>
        </div>

        {/* Cognitive Scores */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Cognitive Abilities
          </h3>

          <div className="space-y-6">
            {Object.entries(results.scores.cognitive)
              .filter(([key]) => key !== 'overall')
              .map(([key, value]) => (
                <div key={key}>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="font-bold text-gray-900">{value}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-gray-900">Overall Score</span>
              <span className="text-3xl font-bold text-blue-600">
                {results.scores.cognitive.overall}/100
              </span>
            </div>
          </div>
        </div>

        {/* AI Readiness */}
        {results.scores.aiReadiness && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              AI Readiness Score
            </h3>

            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                <span className="text-4xl font-bold">
                  {results.scores.aiReadiness.overall}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {Object.entries(results.scores.aiReadiness)
                .filter(([key]) => key !== 'overall')
                .map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="font-medium">{value}/100</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Insights */}
        {results.insights && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Personalized Insights
            </h3>

            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-green-600 mb-2">💪 Your Strengths</h4>
                <ul className="list-disc list-inside space-y-1">
                  {results.insights.strengths.map((strength, index) => (
                    <li key={index} className="text-gray-700">{strength}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-blue-600 mb-2">📈 Areas for Growth</h4>
                <ul className="list-disc list-inside space-y-1">
                  {results.insights.areasForGrowth.map((area, index) => (
                    <li key={index} className="text-gray-700">{area}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-purple-600 mb-2">🎯 Learning Style</h4>
                <p className="text-gray-700">{results.insights.learningStyleDetected}</p>
              </div>
            </div>
          </div>
        )}

        {/* Recommendations */}
        {results.recommendations && results.recommendations.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Recommended Next Steps
            </h3>

            <div className="space-y-4">
              {results.recommendations.map((rec, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                  <h4 className="font-bold text-gray-900 mb-1">{rec.title}</h4>
                  <p className="text-gray-600 mb-2">{rec.description}</p>
                  {rec.suggestedGames && rec.suggestedGames.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {rec.suggestedGames.map((game, gIndex) => (
                        <span
                          key={gIndex}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                        >
                          {game}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-center space-x-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => navigate('/games')}
            className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium"
          >
            Start Training
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
          <p className="text-gray-600">Loading assessment...</p>
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
            onClick={fetchQuestions}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Retry
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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <span className="text-sm text-gray-600">
            {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Category Badge */}
      <div className="mb-6 flex justify-center">
        <span className={`px-4 py-2 rounded-full text-sm font-medium ${
          questions[currentQuestionIndex]?.category === 'cognitive'
            ? 'bg-blue-100 text-blue-700'
            : questions[currentQuestionIndex]?.category === 'personality'
            ? 'bg-purple-100 text-purple-700'
            : 'bg-green-100 text-green-700'
        }`}>
          {questions[currentQuestionIndex]?.category === 'cognitive' && '🧠 Cognitive'}
          {questions[currentQuestionIndex]?.category === 'personality' && '👤 Personality'}
          {questions[currentQuestionIndex]?.category === 'aiReadiness' && '🤖 AI Readiness'}
        </span>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        {renderQuestion()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            currentQuestionIndex === 0
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          ← Previous
        </button>

        <button
          onClick={handleNext}
          disabled={selectedAnswer === null || submitting}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            selectedAnswer === null || submitting
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {submitting ? 'Submitting...' : currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next →'}
        </button>
      </div>
    </div>
  );
};

export default Assessment;
