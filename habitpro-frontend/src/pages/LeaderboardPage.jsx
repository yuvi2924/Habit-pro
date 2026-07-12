import { useState, useEffect } from 'react'
import { getGlobalLeaderboard, getFriendsLeaderboard } from '../api/leaderboard.api'
import { useNavigate } from 'react-router-dom'

const MEDALS = ['🥇', '🥈', '🥉']

export default function LeaderboardPage() {
  const [global, setGlobal] = useState([])
  const [friends, setFriends] = useState([])
  const [tab, setTab] = useState('global')
  const navigate = useNavigate()

  useEffect(() => {
    getGlobalLeaderboard().then(r => setGlobal(r.data)).catch(() => {})
    getFriendsLeaderboard().then(r => setFriends(r.data)).catch(() => {})
  }, [])

  const data = tab === 'global' ? global : friends

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
            <span className="text-white text-sm font-bold">H</span>
          </div>
          <span className="text-xl font-semibold text-gray-900">HabitPRO</span>
        </div>
        <div className="flex gap-4">
          <button onClick={() => navigate('/dashboard')} className="text-sm text-gray-500 hover:text-gray-900">Dashboard</button>
          <button onClick={() => navigate('/habits')} className="text-sm text-gray-500 hover:text-gray-900">Habits</button>
          <button onClick={() => navigate('/goals')} className="text-sm text-gray-500 hover:text-gray-900">Goals</button>
          <button onClick={() => navigate('/friends')} className="text-sm text-gray-500 hover:text-gray-900">Friends</button>
          <button onClick={() => navigate('/analytics')} className="text-sm text-gray-500 hover:text-gray-900">Analytics</button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Leaderboard</h1>
        <p className="text-gray-500 text-sm mb-6">See how you rank against others</p>

        <div className="flex gap-2 mb-6">
          <button onClick={() => setTab('global')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'global' ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>
            🌍 Global
          </button>
          <button onClick={() => setTab('friends')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'friends' ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>
            👥 Friends
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {data.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-4xl mb-3">🏆</p>
              <p className="text-gray-500 text-sm">No data yet — start completing habits to earn XP!</p>
            </div>
          ) : data.map((entry, index) => (
            <div key={entry.id}
              className={`flex items-center gap-4 px-6 py-4 border-b border-gray-50 last:border-0 ${entry.type === 'me' ? 'bg-indigo-50' : ''}`}>
              <div className="w-8 text-center">
                {index < 3 ? (
                  <span className="text-xl">{MEDALS[index]}</span>
                ) : (
                  <span className="text-sm font-medium text-gray-400">#{index + 1}</span>
                )}
              </div>
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
                {entry.username[0].toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900">{entry.username}</p>
                  {entry.type === 'me' && <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">You</span>}
                </div>
                <p className="text-xs text-gray-400">Level {entry.level}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-indigo-600">{entry.totalXp} XP</p>
                <div className="w-24 bg-gray-100 rounded-full h-1.5 mt-1">
                  <div className="h-1.5 rounded-full bg-indigo-500"
                    style={{ width: `${Math.min((entry.totalXp / (data[0]?.totalXp || 1)) * 100, 100)}%` }}/>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}