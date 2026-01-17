import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
  const [progress, setProgress] = useState(null);
  const [recommendedGames, setRecommendedGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [progressRes, recommendationsRes] = await Promise.all([
        api.get('/progress/overview'),
        api.get('/games/recommended')
      ]);

      setProgress(progressRes.data.progress);
      setRecommendedGames(recommendationsRes.data.recommended || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getGameIcon = (gameType) => {
    const icons = {
      'visual-pattern': '👁️',
      'sequence': '🔢',
      'spatial': '🎲',
      'logical': '🧩',
      'memory': '🧠',
      'speed': '⚡',
      'ai-collaboration': '🤖'
    };
    return icons[gameType] || '🎮';
  };

  const getGameName = (gameType) => {
    const names = {
      'visual-pattern': 'Visual Patterns',
      'sequence': 'Sequence Recognition',
      'spatial': 'Spatial Reasoning',
      'logical': 'Logical Patterns',
      'memory': 'Working Memory',
      'speed': 'Speed Challenge',
      'ai-collaboration': 'AI Collaboration'
    };
    return names[gameType] || gameType;
  };

  const getRankColor = (rank) => {
    const colors = {
      'novice': '#94a3b8',
      'apprentice': '#3b82f6',
      'adept': '#8b5cf6',
      'expert': '#f59e0b',
      'master': '#ef4444',
      'grandmaster': '#fbbf24'
    };
    return colors[rank] || '#94a3b8';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your progress...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
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
          Welcome back! 🎯
        </h1>
        <p className="text-gray-600">
          Continue your cognitive training journey
        </p>
      </div>

      {/* Progress Overview Card */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg p-8 mb-8 text-white">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Level & XP */}
          <div>
            <div className="text-sm opacity-90 mb-1">Level</div>
            <div className="text-4xl font-bold">{progress?.level || 1}</div>
            <div className="text-sm opacity-75 mt-1">
              {progress?.rank || 'Novice'}
            </div>
          </div>

          {/* XP Progress */}
          <div className="md:col-span-2">
            <div className="text-sm opacity-90 mb-2">
              XP Progress to Level {(progress?.level || 1) + 1}
            </div>
            <div className="bg-white bg-opacity-20 rounded-full h-4 mb-2 overflow-hidden">
              <div
                className="bg-white h-full rounded-full transition-all duration-500"
                style={{ width: `${progress?.nextLevel?.progressPercent || 0}%` }}
              ></div>
            </div>
            <div className="text-sm opacity-90">
              {progress?.totalXP || 0} / {progress?.nextLevel?.xpRequired || 100} XP
            </div>
          </div>

          {/* Streak */}
          <div className="text-center">
            <div className="text-6xl mb-2">🔥</div>
            <div className="text-2xl font-bold">{progress?.currentStreak || 0}</div>
            <div className="text-sm opacity-75">Day Streak</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Sessions Completed</span>
            <span className="text-2xl">🎮</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {progress?.totalSessions || 0}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Average Accuracy</span>
            <span className="text-2xl">🎯</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {progress?.averageAccuracy?.toFixed(1) || 0}%
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Achievements</span>
            <span className="text-2xl">🏆</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {progress?.achievements || 0}
          </div>
        </div>
      </div>

      {/* Recommended Games */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Recommended for You</h2>
          <Link
            to="/games"
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            View All Games →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendedGames.map((gameType) => (
            <div
              key={gameType}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-500"
              onClick={() => navigate(`/play/${gameType}`)}
            >
              <div className="p-6">
                <div className="text-6xl mb-4 text-center">
                  {getGameIcon(gameType)}
                </div>
                <h3 className="text-xl font-bold text-center mb-2">
                  {getGameName(gameType)}
                </h3>
                <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors">
                  Play Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skill Trees */}
      {progress?.skillTrees && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Skill Development</h2>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {Object.entries(progress.skillTrees).map(([skillName, skillData]) => (
                <div key={skillName} className="text-center">
                  <div className="text-sm text-gray-600 mb-2 capitalize">
                    {skillName.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <div className="relative w-24 h-24 mx-auto mb-2">
                    <svg className="transform -rotate-90 w-24 h-24">
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-gray-200"
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - (skillData.level / 20))}`}
                        className="text-blue-500 transition-all duration-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold">{skillData.level}</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">{skillData.masteryLevel}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {progress?.recentActivity && progress.recentActivity.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Activity</h2>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="divide-y divide-gray-200">
              {progress.recentActivity.slice(0, 5).map((activity, index) => (
                <div key={index} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">{getGameIcon(activity.gameType)}</div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {getGameName(activity.gameType)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(activity.date).toLocaleDateString()} at{' '}
                          {new Date(activity.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">
                        {activity.accuracy.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-500">
                        +{activity.xpEarned} XP
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/assessment"
          className="bg-purple-500 text-white rounded-lg shadow p-6 hover:bg-purple-600 transition-colors"
        >
          <div className="text-4xl mb-2">📊</div>
          <div className="font-bold text-lg mb-1">Take Assessment</div>
          <div className="text-sm opacity-90">Track your cognitive growth</div>
        </Link>

        <Link
          to="/progress"
          className="bg-green-500 text-white rounded-lg shadow p-6 hover:bg-green-600 transition-colors"
        >
          <div className="text-4xl mb-2">📈</div>
          <div className="font-bold text-lg mb-1">View Analytics</div>
          <div className="text-sm opacity-90">Detailed performance insights</div>
        </Link>

        <Link
          to="/achievements"
          className="bg-yellow-500 text-white rounded-lg shadow p-6 hover:bg-yellow-600 transition-colors"
        >
          <div className="text-4xl mb-2">🏅</div>
          <div className="font-bold text-lg mb-1">Achievements</div>
          <div className="text-sm opacity-90">View your accomplishments</div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
