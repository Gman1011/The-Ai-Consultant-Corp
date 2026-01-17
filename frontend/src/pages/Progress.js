import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Progress = () => {
  const [stats, setStats] = useState(null);
  const [cognitiveGrowth, setCognitiveGrowth] = useState(null);
  const [aiReadiness, setAIReadiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); // overview, cognitive, games, time

  useEffect(() => {
    fetchProgressData();
  }, []);

  const fetchProgressData = async () => {
    try {
      setLoading(true);
      const [statsRes, cognitiveRes, aiRes] = await Promise.all([
        api.get('/progress/stats'),
        api.get('/progress/cognitive-growth').catch(() => ({ data: null })),
        api.get('/progress/ai-readiness').catch(() => ({ data: null }))
      ]);

      setStats(statsRes.data.statistics);
      setCognitiveGrowth(cognitiveRes.data?.cognitiveGrowth || null);
      setAIReadiness(aiRes.data?.aiReadiness || null);
    } catch (error) {
      console.error('Error fetching progress data:', error);
      setError('Failed to load progress data');
    } finally {
      setLoading(false);
    }
  };

  const renderRadarChart = (data) => {
    if (!data) return null;

    const dimensions = ['workingMemory', 'processingSpeed', 'visualSpatial', 'logicalReasoning', 'attention'];
    const labels = {
      workingMemory: 'Working Memory',
      processingSpeed: 'Processing Speed',
      visualSpatial: 'Visual-Spatial',
      logicalReasoning: 'Logical Reasoning',
      attention: 'Attention'
    };

    const maxValue = 100;
    const centerX = 150;
    const centerY = 150;
    const radius = 100;
    const angleStep = (2 * Math.PI) / dimensions.length;

    // Calculate points for polygon
    const baselinePoints = dimensions.map((dim, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const value = data.baseline?.[dim] || 0;
      const r = (value / maxValue) * radius;
      return {
        x: centerX + r * Math.cos(angle),
        y: centerY + r * Math.sin(angle)
      };
    });

    const currentPoints = dimensions.map((dim, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const value = data.current?.[dim] || 0;
      const r = (value / maxValue) * radius;
      return {
        x: centerX + r * Math.cos(angle),
        y: centerY + r * Math.sin(angle)
      };
    });

    const axisPoints = dimensions.map((dim, i) => {
      const angle = i * angleStep - Math.PI / 2;
      return {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        labelX: centerX + (radius + 30) * Math.cos(angle),
        labelY: centerY + (radius + 30) * Math.sin(angle),
        label: labels[dim]
      };
    });

    return (
      <svg width="350" height="350" className="mx-auto">
        {/* Grid circles */}
        {[25, 50, 75, 100].map(percentage => (
          <circle
            key={percentage}
            cx={centerX}
            cy={centerY}
            r={(percentage / 100) * radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}

        {/* Axes */}
        {axisPoints.map((point, i) => (
          <line
            key={i}
            x1={centerX}
            y1={centerY}
            x2={point.x}
            y2={point.y}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}

        {/* Baseline polygon */}
        {data.baseline && (
          <polygon
            points={baselinePoints.map(p => `${p.x},${p.y}`).join(' ')}
            fill="rgba(156, 163, 175, 0.2)"
            stroke="#9ca3af"
            strokeWidth="2"
          />
        )}

        {/* Current polygon */}
        <polygon
          points={currentPoints.map(p => `${p.x},${p.y}`).join(' ')}
          fill="rgba(59, 130, 246, 0.3)"
          stroke="#3b82f6"
          strokeWidth="3"
        />

        {/* Current points */}
        {currentPoints.map((point, i) => (
          <circle
            key={i}
            cx={point.x}
            cy={point.y}
            r="5"
            fill="#3b82f6"
          />
        ))}

        {/* Labels */}
        {axisPoints.map((point, i) => (
          <text
            key={i}
            x={point.labelX}
            y={point.labelY}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs font-medium"
            fill="#374151"
          >
            {point.label}
          </text>
        ))}
      </svg>
    );
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Total Sessions</div>
          <div className="text-3xl font-bold text-gray-900">
            {stats?.overall?.totalSessionsCompleted || 0}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Average Accuracy</div>
          <div className="text-3xl font-bold text-blue-600">
            {stats?.overall?.averageAccuracy?.toFixed(1) || 0}%
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Time Spent</div>
          <div className="text-3xl font-bold text-green-600">
            {Math.floor(stats?.overall?.totalTimeSpent || 0)}m
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Best Streak</div>
          <div className="text-3xl font-bold text-orange-600">
            {stats?.overall?.bestStreak || 0} 🔥
          </div>
        </div>
      </div>

      {/* Performance Trends */}
      {stats?.trends && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Performance Trends</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className={`text-4xl mb-2 ${
                stats.trends.accuracy === 'improving' ? 'text-green-500' :
                stats.trends.accuracy === 'declining' ? 'text-red-500' :
                'text-gray-500'
              }`}>
                {stats.trends.accuracy === 'improving' ? '📈' :
                 stats.trends.accuracy === 'declining' ? '📉' :
                 '➡️'}
              </div>
              <div className="font-bold text-gray-900">Accuracy Trend</div>
              <div className="text-sm text-gray-600 capitalize">{stats.trends.accuracy}</div>
              {stats.trends.accuracyChange !== 0 && (
                <div className={`text-sm font-medium ${
                  stats.trends.accuracyChange > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stats.trends.accuracyChange > 0 ? '+' : ''}{stats.trends.accuracyChange}%
                </div>
              )}
            </div>

            <div className="text-center">
              <div className="text-4xl mb-2">🎯</div>
              <div className="font-bold text-gray-900">Recent Average</div>
              <div className="text-2xl font-bold text-blue-600">
                {stats.trends.recentAvgAccuracy}%
              </div>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <div className="font-bold text-gray-900">Previous Average</div>
              <div className="text-2xl font-bold text-gray-600">
                {stats.trends.olderAvgAccuracy}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Last 7 Days Activity */}
      {stats?.overall?.lastSevenDays && stats.overall.lastSevenDays.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Last 7 Days Activity</h3>

          <div className="space-y-3">
            {stats.overall.lastSevenDays.map((day, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-600 w-24">
                    {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${day.averageAccuracy}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="text-gray-600">
                    {day.sessionsCompleted} sessions
                  </div>
                  <div className="font-medium text-blue-600 w-12 text-right">
                    {day.averageAccuracy.toFixed(0)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderCognitive = () => (
    <div className="space-y-6">
      {cognitiveGrowth ? (
        <>
          {/* Radar Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
              Cognitive Abilities Profile
            </h3>

            {renderRadarChart(cognitiveGrowth)}

            <div className="flex justify-center space-x-6 mt-6">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-300 mr-2"></div>
                <span className="text-sm text-gray-600">Baseline</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 mr-2"></div>
                <span className="text-sm text-gray-600">Current</span>
              </div>
            </div>
          </div>

          {/* Growth Rates */}
          {cognitiveGrowth.growthRates && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Growth Rates</h3>

              <div className="space-y-3">
                {Object.entries(cognitiveGrowth.growthRates)
                  .filter(([key]) => key !== 'overall')
                  .map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="text-gray-700 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className={`font-bold ${
                        value > 0 ? 'text-green-600' : value < 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {value > 0 ? '+' : ''}{value} points/day
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Projections */}
          {cognitiveGrowth.projections && (
            <div className="bg-gradient-to-br from-purple-500 to-blue-600 text-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold mb-4">Future Projections</h3>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{cognitiveGrowth.projections.oneMonth}</div>
                  <div className="text-sm opacity-90">1 Month</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{cognitiveGrowth.projections.threeMonths}</div>
                  <div className="text-sm opacity-90">3 Months</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{cognitiveGrowth.projections.sixMonths}</div>
                  <div className="text-sm opacity-90">6 Months</div>
                </div>
              </div>

              <div className="text-xs text-center mt-4 opacity-75">
                Confidence: {cognitiveGrowth.projections.confidenceLevel}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No Cognitive Growth Data Yet
          </h3>
          <p className="text-gray-600 mb-6">
            Complete an assessment to track your cognitive development
          </p>
          <Link
            to="/assessment"
            className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
          >
            Take Assessment
          </Link>
        </div>
      )}
    </div>
  );

  const renderGameTypes = () => (
    <div className="space-y-6">
      {stats?.gameTypeBreakdown && Object.keys(stats.gameTypeBreakdown).length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(stats.gameTypeBreakdown).map(([gameType, data]) => (
            <div key={gameType} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 capitalize">
                {gameType.replace('-', ' ')}
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Games Played</span>
                  <span className="font-bold">{data.count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Accuracy</span>
                  <span className="font-bold text-blue-600">{data.avgAccuracy}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Time</span>
                  <span className="font-bold">{(data.avgTime / 60).toFixed(1)}m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total XP</span>
                  <span className="font-bold text-purple-600">{data.totalXP}</span>
                </div>
              </div>

              {/* Accuracy bar */}
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${data.avgAccuracy}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4">🎮</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No Games Played Yet
          </h3>
          <p className="text-gray-600 mb-6">
            Start playing to see detailed statistics
          </p>
          <Link
            to="/games"
            className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
          >
            Browse Games
          </Link>
        </div>
      )}
    </div>
  );

  const renderTimeOfDay = () => (
    <div className="space-y-6">
      {stats?.timeOfDayPerformance && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Performance by Time of Day
          </h3>

          <div className="space-y-4">
            {Object.entries(stats.timeOfDayPerformance).map(([slot, data]) => (
              <div key={slot}>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700">{data.label}</span>
                  <span className="font-medium">
                    {data.count} sessions • {data.avgAccuracy}% avg
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-500 h-3 rounded-full"
                    style={{ width: `${data.avgAccuracy}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700">
              💡 <strong>Tip:</strong> You perform best during{' '}
              {Object.entries(stats.timeOfDayPerformance)
                .sort((a, b) => b[1].avgAccuracy - a[1].avgAccuracy)[0]?.[1]?.label}
            </p>
          </div>
        </div>
      )}

      {/* AI Readiness */}
      {aiReadiness && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            AI Readiness Score
          </h3>

          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-40 h-40 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white mb-4">
              <div className="text-5xl font-bold">{aiReadiness.overallScore}</div>
            </div>
            <div className="text-xl font-bold text-gray-900 mb-2">
              {aiReadiness.report?.level}
            </div>
            <div className="text-gray-600">
              Based on {aiReadiness.aiGamesCompleted} AI collaboration sessions
            </div>
          </div>

          {aiReadiness.breakdown && (
            <div className="space-y-2 mb-6">
              {Object.entries(aiReadiness.breakdown)
                .filter(([key]) => key !== 'overall')
                .map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="font-medium">{value}/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          )}

          {aiReadiness.report?.recommendations && (
            <div className="border-t border-gray-200 pt-4">
              <h4 className="font-bold text-gray-900 mb-2">Recommendations</h4>
              <ul className="space-y-2">
                {aiReadiness.report.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start text-sm text-gray-700">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading progress data...</p>
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
            onClick={fetchProgressData}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Your Progress Analytics
        </h1>
        <p className="text-gray-600">
          Track your cognitive development and performance over time
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8 border-b border-gray-200">
        <div className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'cognitive', label: 'Cognitive Growth', icon: '🧠' },
            { id: 'games', label: 'Game Stats', icon: '🎮' },
            { id: 'time', label: 'Time & AI', icon: '⏰' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-2 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'cognitive' && renderCognitive()}
      {activeTab === 'games' && renderGameTypes()}
      {activeTab === 'time' && renderTimeOfDay()}
    </div>
  );
};

export default Progress;
