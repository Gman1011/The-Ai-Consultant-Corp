import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [filter, setFilter] = useState('all'); // all, unlocked, locked
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newlyUnlocked, setNewlyUnlocked] = useState([]);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const response = await api.get('/progress/achievements');
      setAchievements(response.data.achievements);
      setNewlyUnlocked(response.data.newlyUnlocked || []);
    } catch (error) {
      console.error('Error fetching achievements:', error);
      setError('Failed to load achievements');
    } finally {
      setLoading(false);
    }
  };

  const getRarityColor = (rarity) => {
    const colors = {
      common: 'from-gray-400 to-gray-500',
      rare: 'from-blue-400 to-blue-600',
      epic: 'from-purple-400 to-purple-600',
      legendary: 'from-yellow-400 to-orange-500'
    };
    return colors[rarity] || colors.common;
  };

  const getRarityBadge = (rarity) => {
    const badges = {
      common: { emoji: '⚪', label: 'Common' },
      rare: { emoji: '🔵', label: 'Rare' },
      epic: { emoji: '🟣', label: 'Epic' },
      legendary: { emoji: '🟡', label: 'Legendary' }
    };
    return badges[rarity] || badges.common;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      milestone: '🎯',
      mastery: '👑',
      consistency: '🔥',
      speed: '⚡',
      special: '⭐'
    };
    return icons[category] || '🏆';
  };

  const filteredAchievements = achievements.filter(achievement => {
    if (filter === 'unlocked' && !achievement.unlocked) return false;
    if (filter === 'locked' && achievement.unlocked) return false;
    if (categoryFilter !== 'all' && achievement.category !== categoryFilter) return false;
    return true;
  });

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const completionPercent = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;

  const categories = ['all', ...new Set(achievements.map(a => a.category))];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading achievements...</p>
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
            onClick={fetchAchievements}
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
          Achievements 🏆
        </h1>
        <p className="text-gray-600">
          Unlock achievements by completing challenges and reaching milestones
        </p>
      </div>

      {/* Newly Unlocked Banner */}
      {newlyUnlocked.length > 0 && (
        <div className="mb-8 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">🎉 New Achievements Unlocked!</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {newlyUnlocked.map((achievement, index) => (
              <div key={index} className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="text-3xl mb-2">{getRarityBadge(achievement.rarity).emoji}</div>
                <div className="font-bold">{achievement.name}</div>
                <div className="text-sm opacity-90">{achievement.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress Overview */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Collection Progress</h2>
            <p className="text-gray-600">
              {unlockedCount} of {totalCount} achievements unlocked
            </p>
          </div>
          <div className="text-4xl font-bold text-blue-600">
            {completionPercent.toFixed(0)}%
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all duration-500"
            style={{ width: `${completionPercent}%` }}
          />
        </div>

        {/* Rarity Breakdown */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['common', 'rare', 'epic', 'legendary'].map(rarity => {
            const total = achievements.filter(a => a.rarity === rarity).length;
            const unlocked = achievements.filter(a => a.rarity === rarity && a.unlocked).length;
            const badge = getRarityBadge(rarity);

            return (
              <div key={rarity} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl mb-2">{badge.emoji}</div>
                <div className="font-bold text-gray-900 capitalize">{badge.label}</div>
                <div className="text-sm text-gray-600">{unlocked}/{total}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        {/* Status Filter */}
        <div className="flex space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All ({achievements.length})
          </button>
          <button
            onClick={() => setFilter('unlocked')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              filter === 'unlocked'
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Unlocked ({unlockedCount})
          </button>
          <button
            onClick={() => setFilter('locked')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              filter === 'locked'
                ? 'bg-gray-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Locked ({totalCount - unlockedCount})
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setCategoryFilter(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                categoryFilter === category
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category !== 'all' && getCategoryIcon(category)}{' '}
              <span className="capitalize">{category}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAchievements.map((achievement, index) => (
          <div
            key={achievement.achievementId || index}
            className={`rounded-xl shadow-lg overflow-hidden transition-all ${
              achievement.unlocked ? 'hover:scale-105' : 'opacity-75'
            }`}
          >
            {/* Achievement Header */}
            <div className={`bg-gradient-to-br ${getRarityColor(achievement.rarity)} p-6 text-white relative`}>
              {achievement.unlocked ? (
                <div className="absolute top-4 right-4 text-3xl">
                  ✓
                </div>
              ) : (
                <div className="absolute top-4 right-4 text-2xl opacity-75">
                  🔒
                </div>
              )}

              <div className="text-5xl mb-3 text-center">
                {getCategoryIcon(achievement.category)}
              </div>

              <h3 className="text-xl font-bold text-center mb-2">
                {achievement.name}
              </h3>

              <div className="flex justify-center">
                <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-xs font-medium">
                  {getRarityBadge(achievement.rarity).emoji} {getRarityBadge(achievement.rarity).label}
                </span>
              </div>
            </div>

            {/* Achievement Body */}
            <div className="bg-white p-6">
              <p className="text-gray-700 text-sm mb-4 min-h-[60px]">
                {achievement.description}
              </p>

              {/* Progress Bar */}
              {!achievement.unlocked && achievement.progress !== undefined && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{achievement.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${achievement.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Reward */}
              {achievement.reward && (
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Reward:</span>
                    <span className="font-bold text-purple-600">
                      +{achievement.reward.xp} XP
                    </span>
                  </div>
                </div>
              )}

              {/* Unlock Date */}
              {achievement.unlocked && achievement.unlockedAt && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="text-xs text-gray-500 text-center">
                    Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredAchievements.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No achievements found
          </h3>
          <p className="text-gray-600">
            Try changing the filters to see more achievements
          </p>
        </div>
      )}

      {/* Tips */}
      <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start space-x-4">
          <div className="text-3xl">💡</div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              How to Unlock Achievements
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span><strong>Milestone:</strong> Reach specific levels or complete set numbers of games</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span><strong>Mastery:</strong> Achieve high accuracy or perfect scores in games</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span><strong>Consistency:</strong> Maintain daily streaks and regular practice</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span><strong>Speed:</strong> Complete games quickly with high accuracy</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span><strong>Special:</strong> Complete unique challenges and hidden objectives</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievements;
