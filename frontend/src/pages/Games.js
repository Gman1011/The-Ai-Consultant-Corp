import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Games = () => {
  const [gameTypes, setGameTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, unlocked, locked
  const navigate = useNavigate();

  useEffect(() => {
    fetchGameTypes();
  }, []);

  const fetchGameTypes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/games/types');
      setGameTypes(response.data.gameTypes);
    } catch (error) {
      console.error('Error fetching game types:', error);
      setError('Failed to load games');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayGame = (gameType) => {
    if (!gameType.unlocked) {
      alert(`This game unlocks at level ${getUnlockLevel(gameType.id)}`);
      return;
    }
    navigate(`/play/${gameType.id}`);
  };

  const getUnlockLevel = (gameId) => {
    const unlockLevels = {
      'spatial': 5,
      'speed': 3,
      'ai-collaboration': 10
    };
    return unlockLevels[gameId] || 1;
  };

  const getDifficultyColor = (difficulty) => {
    if (difficulty.includes('Easy')) return 'text-green-600';
    if (difficulty.includes('Medium')) return 'text-yellow-600';
    if (difficulty.includes('Hard')) return 'text-red-600';
    return 'text-blue-600';
  };

  const filteredGames = gameTypes.filter(game => {
    if (filter === 'unlocked') return game.unlocked;
    if (filter === 'locked') return !game.unlocked;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading games...</p>
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
            onClick={fetchGameTypes}
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
          Choose Your Training
        </h1>
        <p className="text-gray-600">
          Select a game type to enhance your cognitive abilities
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-8 flex space-x-4 border-b border-gray-200">
        <button
          onClick={() => setFilter('all')}
          className={`pb-4 px-4 font-medium transition-colors ${
            filter === 'all'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          All Games ({gameTypes.length})
        </button>
        <button
          onClick={() => setFilter('unlocked')}
          className={`pb-4 px-4 font-medium transition-colors ${
            filter === 'unlocked'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Unlocked ({gameTypes.filter(g => g.unlocked).length})
        </button>
        <button
          onClick={() => setFilter('locked')}
          className={`pb-4 px-4 font-medium transition-colors ${
            filter === 'locked'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Locked ({gameTypes.filter(g => !g.unlocked).length})
        </button>
      </div>

      {/* Game Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGames.map((game) => (
          <div
            key={game.id}
            className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all ${
              game.unlocked
                ? 'hover:shadow-xl hover:scale-105 cursor-pointer'
                : 'opacity-75'
            }`}
            onClick={() => game.unlocked && handlePlayGame(game)}
          >
            {/* Game Header */}
            <div className={`p-6 ${
              game.unlocked
                ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                : 'bg-gray-400'
            } text-white relative`}>
              {!game.unlocked && (
                <div className="absolute top-4 right-4">
                  <span className="bg-white text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                    🔒 Level {getUnlockLevel(game.id)}
                  </span>
                </div>
              )}
              <div className="text-6xl mb-4 text-center">{game.icon}</div>
              <h3 className="text-2xl font-bold text-center">{game.name}</h3>
            </div>

            {/* Game Info */}
            <div className="p-6">
              <p className="text-gray-600 mb-4 min-h-[60px]">
                {game.description}
              </p>

              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Difficulty:</span>
                  <span className={`font-medium ${getDifficultyColor(game.difficulty)}`}>
                    {game.difficulty}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Duration:</span>
                  <span className="font-medium text-gray-900">{game.estimatedTime}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Skill Tree:</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {game.skillTree.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </div>
              </div>

              {game.unlocked ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayGame(game);
                  }}
                  className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  Play Now
                </button>
              ) : (
                <button
                  disabled
                  className="w-full bg-gray-300 text-gray-500 py-3 rounded-lg cursor-not-allowed font-medium"
                >
                  Locked - Reach Level {getUnlockLevel(game.id)}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredGames.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎮</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No games found
          </h3>
          <p className="text-gray-600">
            {filter === 'locked'
              ? 'All games are unlocked! Great job!'
              : 'Try changing the filter to see more games.'}
          </p>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start space-x-4">
          <div className="text-3xl">💡</div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Tips for Effective Training
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Play regularly (daily is best) to see consistent improvement</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Try different game types to develop well-rounded cognitive abilities</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Don't worry about mistakes - the system adapts to your level</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Take breaks if you feel fatigued for optimal performance</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Games;
