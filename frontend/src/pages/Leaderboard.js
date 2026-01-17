import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [type, setType] = useState('global'); // global, age-group
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLeaderboard();
  }, [type]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/progress/leaderboard?type=${type}&limit=100`);
      setLeaderboard(response.data.leaderboard);
      setUserRank(response.data.userRank);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setError('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const getRankMedal = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
  };

  const getRankColor = (rankTitle) => {
    const colors = {
      novice: 'text-gray-500',
      apprentice: 'text-blue-500',
      adept: 'text-purple-500',
      expert: 'text-orange-500',
      master: 'text-red-500',
      grandmaster: 'text-yellow-500'
    };
    return colors[rankTitle] || 'text-gray-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading leaderboard...</p>
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
            onClick={fetchLeaderboard}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Leaderboard 🏆
        </h1>
        <p className="text-gray-600">
          See how you rank against other players
        </p>
      </div>

      {/* Type Filter */}
      <div className="mb-8 flex space-x-4">
        <button
          onClick={() => setType('global')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            type === 'global'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          🌍 Global
        </button>
        <button
          onClick={() => setType('age-group')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            type === 'age-group'
              ? 'bg-purple-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          👥 Your Age Group
        </button>
      </div>

      {/* Your Rank Card */}
      {userRank && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-lg p-6 mb-8">
          <div className="text-center">
            <div className="text-6xl mb-2">
              {getRankMedal(userRank) || '🎮'}
            </div>
            <h2 className="text-3xl font-bold mb-2">Your Rank</h2>
            <div className="text-5xl font-bold mb-2">#{userRank}</div>
            <p className="opacity-90">
              {type === 'global' ? 'Global Ranking' : 'Age Group Ranking'}
            </p>
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Table Header */}
        <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
          <div className="grid grid-cols-12 gap-4 font-bold text-gray-700">
            <div className="col-span-1 text-center">Rank</div>
            <div className="col-span-5">Player</div>
            <div className="col-span-2 text-center">Level</div>
            <div className="col-span-2 text-center">Rank</div>
            <div className="col-span-2 text-right">Total XP</div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-200">
          {leaderboard.map((player) => (
            <div
              key={player.userId}
              className={`px-6 py-4 transition-colors ${
                player.isCurrentUser
                  ? 'bg-blue-50 border-l-4 border-blue-500'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="grid grid-cols-12 gap-4 items-center">
                {/* Rank */}
                <div className="col-span-1 text-center">
                  <div className="flex items-center justify-center">
                    {getRankMedal(player.rank) ? (
                      <span className="text-3xl">{getRankMedal(player.rank)}</span>
                    ) : (
                      <span className="text-lg font-bold text-gray-600">
                        #{player.rank}
                      </span>
                    )}
                  </div>
                </div>

                {/* Player Name */}
                <div className="col-span-5">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                      {player.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {player.name}
                        {player.isCurrentUser && (
                          <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            You
                          </span>
                        )}
                      </div>
                      {player.ageGroup && (
                        <div className="text-xs text-gray-500">
                          Age: {player.ageGroup}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Level */}
                <div className="col-span-2 text-center">
                  <div className="inline-flex items-center space-x-1">
                    <span className="text-lg">⭐</span>
                    <span className="font-bold text-gray-900">{player.level}</span>
                  </div>
                </div>

                {/* Rank Title */}
                <div className="col-span-2 text-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                    getRankColor(player.rank)
                  } bg-gray-100`}>
                    {player.rank}
                  </span>
                </div>

                {/* Total XP */}
                <div className="col-span-2 text-right">
                  <div className="font-bold text-purple-600">
                    {player.totalXP.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">XP</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {leaderboard.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No players found
            </h3>
            <p className="text-gray-600">
              Be the first to appear on the leaderboard!
            </p>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start space-x-4">
          <div className="text-3xl">💡</div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              How Rankings Work
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Rankings are based on your total XP earned</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Complete games with high accuracy to earn more XP</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Level up and maintain streaks for bonus XP</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Leaderboard updates in real-time as you play</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
