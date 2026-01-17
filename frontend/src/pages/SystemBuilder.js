import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

/**
 * System Builder Game
 *
 * Implements the critical flow:
 * Pattern → Rule → Mandatory System Creation → AI Critique
 *
 * This is what separates a "brain game" from a "cognitive retooling platform for the AGI age"
 */
const SystemBuilder = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [challenge, setChallenge] = useState(null);
  const [currentPhase, setCurrentPhase] = useState('pattern'); // pattern, rule, system, critique

  // Phase inputs
  const [observations, setObservations] = useState('');
  const [rule, setRule] = useState('');
  const [systemDescription, setSystemDescription] = useState('');
  const [systemType, setSystemType] = useState('process');
  const [systemComponents, setSystemComponents] = useState(['']);

  // Results
  const [ruleQuality, setRuleQuality] = useState(null);
  const [critique, setCritique] = useState(null);
  const [xpEarned, setXpEarned] = useState(0);

  // Error handling
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    startChallenge();
  }, []);

  const startChallenge = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/games/system-builder/start`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSession(response.data.session);
      setChallenge(response.data.session.challenge);
      setCurrentPhase('pattern');
      setLoading(false);
    } catch (err) {
      console.error('Error starting challenge:', err);
      setError('Failed to start challenge. Please try again.');
      setLoading(false);
    }
  };

  const submitPatternObservations = async () => {
    if (observations.trim().length < 10) {
      setError('Please write at least 10 characters describing what patterns you see.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/games/system-builder/${session._id}/pattern`,
        { observations },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCurrentPhase('rule');
      setSubmitting(false);
    } catch (err) {
      console.error('Error submitting observations:', err);
      setError(err.response?.data?.message || 'Failed to submit observations');
      setSubmitting(false);
    }
  };

  const submitRule = async () => {
    if (rule.trim().length < 10) {
      setError('Please articulate a clear rule (at least 10 characters).');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/games/system-builder/${session._id}/rule`,
        { rule },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRuleQuality(response.data.ruleQuality);
      setCurrentPhase('system');
      setSubmitting(false);
    } catch (err) {
      console.error('Error submitting rule:', err);
      setError(err.response?.data?.message || 'Failed to submit rule');
      setSubmitting(false);
    }
  };

  const submitSystem = async () => {
    if (systemDescription.trim().length < 50) {
      setError('System description must be at least 50 characters. Be specific!');
      return;
    }

    const validComponents = systemComponents.filter(c => c.trim().length > 0);
    if (validComponents.length === 0) {
      setError('Add at least one component to your system');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/games/system-builder/${session._id}/system`,
        {
          systemDescription,
          systemType,
          systemComponents: validComponents
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Automatically request critique
      await requestCritique();
    } catch (err) {
      console.error('Error submitting system:', err);
      setError(err.response?.data?.message || 'Failed to submit system');
      setSubmitting(false);
    }
  };

  const requestCritique = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/games/system-builder/${session._id}/critique`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCritique(response.data.critique);
      setXpEarned(response.data.xpEarned);
      setCurrentPhase('critique');
      setSubmitting(false);
    } catch (err) {
      console.error('Error getting critique:', err);
      setError(err.response?.data?.message || 'Failed to get AI critique');
      setSubmitting(false);
    }
  };

  const addComponent = () => {
    setSystemComponents([...systemComponents, '']);
  };

  const updateComponent = (index, value) => {
    const newComponents = [...systemComponents];
    newComponents[index] = value;
    setSystemComponents(newComponents);
  };

  const removeComponent = (index) => {
    setSystemComponents(systemComponents.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading challenge...</div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Failed to load challenge</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              🏗️ System Builder
            </h1>
            <span className="text-white/70">Difficulty: {session.difficulty}</span>
          </div>

          {/* Phase Progress */}
          <div className="flex gap-2">
            {['Pattern', 'Rule', 'System', 'Critique'].map((phase, idx) => {
              const phases = ['pattern', 'rule', 'system', 'critique'];
              const currentIdx = phases.indexOf(currentPhase);
              const isActive = idx === currentIdx;
              const isComplete = idx < currentIdx;

              return (
                <div
                  key={phase}
                  className={`flex-1 h-2 rounded-full transition-all ${
                    isComplete ? 'bg-green-400' :
                    isActive ? 'bg-yellow-400' :
                    'bg-white/20'
                  }`}
                />
              );
            })}
          </div>
          <div className="flex justify-between mt-2">
            {['Pattern', 'Rule', 'System', 'Critique'].map((phase, idx) => {
              const phases = ['pattern', 'rule', 'system', 'critique'];
              const currentIdx = phases.indexOf(currentPhase);
              const isActive = idx === currentIdx;

              return (
                <span
                  key={phase}
                  className={`text-xs ${isActive ? 'text-yellow-300 font-bold' : 'text-white/50'}`}
                >
                  {phase}
                </span>
              );
            })}
          </div>
        </div>

        {/* Challenge Context */}
        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3">Challenge Scenario</h2>
          <p className="text-gray-700 mb-4">{challenge.context}</p>

          <h3 className="text-lg font-semibold text-gray-800 mb-2">Examples to Analyze:</h3>
          <div className="bg-gray-50 rounded-lg p-4 space-y-3 max-h-96 overflow-y-auto">
            {challenge.examples.map((example, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded p-3">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                  {JSON.stringify(example, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </div>

        {/* Phase 1: Pattern Observation */}
        {currentPhase === 'pattern' && (
          <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              📊 Phase 1: Observe the Pattern
            </h2>
            <p className="text-gray-600 mb-4">
              Look at the examples above. What patterns do you notice? What's consistent? What varies?
            </p>

            <textarea
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Describe what patterns you see... (minimum 10 characters)"
              className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={submitting}
            />

            <div className="text-sm text-gray-500 mb-4">
              {observations.length} / 10 characters minimum
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <button
              onClick={submitPatternObservations}
              disabled={submitting || observations.length < 10}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {submitting ? 'Submitting...' : 'Next: Articulate the Rule →'}
            </button>
          </div>
        )}

        {/* Phase 2: Rule Articulation */}
        {currentPhase === 'rule' && (
          <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              📐 Phase 2: Articulate the Rule
            </h2>
            <p className="text-gray-600 mb-4">
              Based on the pattern you observed, state the underlying RULE or PRINCIPLE.
              Be specific. Use words like "when", "if", "causes", "prevents", "requires".
            </p>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-4">
              <p className="text-sm text-blue-800">
                <strong>Your observations:</strong> {observations}
              </p>
            </div>

            <textarea
              value={rule}
              onChange={(e) => setRule(e.target.value)}
              placeholder="State the rule you've identified... (minimum 10 characters)"
              className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={submitting}
            />

            <div className="text-sm text-gray-500 mb-4">
              {rule.length} / 10 characters minimum
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <button
              onClick={submitRule}
              disabled={submitting || rule.length < 10}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {submitting ? 'Evaluating...' : 'Next: Create the System →'}
            </button>
          </div>
        )}

        {/* Phase 3: System Creation (MANDATORY) */}
        {currentPhase === 'system' && (
          <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              🏗️ Phase 3: CREATE THE SYSTEM
            </h2>

            {ruleQuality && (
              <div className={`p-4 rounded-lg mb-4 ${
                ruleQuality >= 70 ? 'bg-green-50 border border-green-200' :
                ruleQuality >= 50 ? 'bg-yellow-50 border border-yellow-200' :
                'bg-orange-50 border border-orange-200'
              }`}>
                <p className="text-sm font-semibold mb-1">
                  Rule Quality: {ruleQuality}/100
                </p>
                <p className="text-sm">
                  {ruleQuality >= 70 ? '✓ Strong rule articulation!' :
                   ruleQuality >= 50 ? '→ Good, but could be more specific' :
                   '→ Try to be more concrete about cause and effect'}
                </p>
              </div>
            )}

            <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg mb-4">
              <p className="text-sm font-bold text-purple-900 mb-2">YOUR TASK:</p>
              <p className="text-sm text-purple-800 mb-2">{challenge.systemPrompt}</p>
              <p className="text-xs text-purple-600">
                This must be CONCRETE and IMPLEMENTABLE. Not vague advice.
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                System Type:
              </label>
              <select
                value={systemType}
                onChange={(e) => setSystemType(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={submitting}
              >
                <option value="process">Process (step-by-step procedure)</option>
                <option value="algorithm">Algorithm (decision logic)</option>
                <option value="framework">Framework (organizing structure)</option>
                <option value="strategy">Strategy (approach/methodology)</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                System Description: <span className="text-red-500">*</span>
              </label>
              <textarea
                value={systemDescription}
                onChange={(e) => setSystemDescription(e.target.value)}
                placeholder="Describe your system in detail. What are the steps? How does it work? How would someone implement this tomorrow? (minimum 50 characters)"
                className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={submitting}
              />
              <div className="text-sm text-gray-500 mt-1">
                {systemDescription.length} / 50 characters minimum
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                System Components: <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-600 mb-2">
                Break your system into distinct parts or steps:
              </p>
              {systemComponents.map((component, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={component}
                    onChange={(e) => updateComponent(idx, e.target.value)}
                    placeholder={`Component ${idx + 1}`}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    disabled={submitting}
                  />
                  {systemComponents.length > 1 && (
                    <button
                      onClick={() => removeComponent(idx)}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                      disabled={submitting}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addComponent}
                className="text-blue-600 text-sm font-semibold hover:text-blue-700"
                disabled={submitting}
              >
                + Add Component
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <button
              onClick={submitSystem}
              disabled={submitting || systemDescription.length < 50 || systemComponents.filter(c => c.trim()).length === 0}
              className="w-full bg-purple-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {submitting ? 'Creating system and requesting AI critique...' : '🤖 Submit for AI Critique →'}
            </button>
          </div>
        )}

        {/* Phase 4: AI Critique */}
        {currentPhase === 'critique' && critique && (
          <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              🤖 Phase 4: AI Critique
            </h2>

            {/* Overall Score */}
            <div className={`p-6 rounded-lg mb-6 ${
              critique.overallScore >= 70 ? 'bg-green-50 border-2 border-green-400' :
              critique.overallScore >= 50 ? 'bg-yellow-50 border-2 border-yellow-400' :
              'bg-orange-50 border-2 border-orange-400'
            }`}>
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">
                  {critique.overallScore}/100
                </div>
                <div className="text-xl font-semibold mb-3">
                  {critique.overallScore >= 70 ? '🎉 Excellent Systems Thinking!' :
                   critique.overallScore >= 50 ? '💡 Good Foundation' :
                   '🔧 Needs Development'}
                </div>
                <div className="text-lg text-green-600 font-bold">
                  +{xpEarned} XP Earned
                </div>
              </div>
            </div>

            {/* Detailed Scores */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{critique.novelty}/100</div>
                <div className="text-sm text-gray-600">Novelty</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{critique.completeness}/100</div>
                <div className="text-sm text-gray-600">Completeness</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{critique.effectiveness}/100</div>
                <div className="text-sm text-gray-600">Effectiveness</div>
              </div>
            </div>

            {/* Strengths */}
            {critique.strengths && critique.strengths.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  ✓ Strengths
                </h3>
                <ul className="space-y-2">
                  {critique.strengths.map((strength, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-700">
                      <span className="text-green-500 font-bold">→</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Improvements */}
            {critique.improvements && critique.improvements.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  → Areas for Improvement
                </h3>
                <ul className="space-y-2">
                  {critique.improvements.map((improvement, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-700">
                      <span className="text-orange-500 font-bold">→</span>
                      <span>{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Full Critique */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">Full AI Critique:</h3>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                  {critique.aiCritique}
                </pre>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={startChallenge}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
              >
                Try Another Challenge
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-all"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemBuilder;
