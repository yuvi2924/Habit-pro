import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getHabits } from '../api/habits.api'
import { getMyFriends } from '../api/friends.api'
import { getGoals } from '../api/goals.api'
import api from '../api/axiosInstance'

export default function DashboardPage() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [habits, setHabits] = useState([])
  const [friends, setFriends] = useState([])
  const [goals, setGoals] = useState([])
  const [profile, setProfile] = useState(null)
  const [streaks, setStreaks] = useState([])

  useEffect(() => {
    getHabits().then(r => setHabits(r.data)).catch(() => {})
    getMyFriends().then(r => setFriends(r.data)).catch(() => {})
    getGoals().then(r => setGoals(r.data)).catch(() => {})
    api.get('/users/me').then(r => setProfile(r.data)).catch(() => {})
    api.get('/users/streaks').then(r => setStreaks(r.data)).catch(() => {})
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const bestStreak = streaks.length > 0
    ? Math.max(...streaks.map(s => s.currentStreak)) : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
            <span className="text-white text-sm font-bold">H</span>
          </div>
          <span className="text-xl font-semibold text-gray-900">HabitPRO</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/habits')} className="text-sm text-gray-500 hover:text-gray-900">Habits</button>
          <button onClick={() => navigate('/goals')} className="text-sm text-gray-500 hover:text-gray-900">Goals</button>
          <button onClick={() => navigate('/friends')} className="text-sm text-gray-500 hover:text-gray-900">Friends</button>
          <button onClick={() => navigate('/chat')} className="text-sm text-gray-500 hover:text-gray-900">💬 Chat</button>
          <button onClick={() => navigate('/leaderboard')} className="text-sm text-gray-500 hover:text-gray-900">Leaderboard</button>
          <button onClick={() => navigate('/analytics')} className="text-sm text-gray-500 hover:text-gray-900">Analytics</button>
          <button onClick={() => navigate('/profile')} className="text-sm text-gray-500 hover:text-gray-900">👤 Profile</button>
          <button onClick={() => navigate('/feedback')} className="text-sm text-gray-500 hover:text-gray-900">📝 Feedback</button>
          <button onClick={() => navigate('/about')} className="text-sm text-gray-500 hover:text-gray-900">ℹ️ About</button>
          <button onClick={handleLogout} className="text-sm text-red-400 hover:text-red-600">Sign out</button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Welcome back, {profile?.username || 'there'}! 👋
        </h1>
        <p className="text-gray-500 mb-8">Track your habits, earn points and beat your streaks.</p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500 mb-1">Total XP</p>
            <p className="text-2xl font-semibold text-indigo-600">{profile?.totalXp || 0}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500 mb-1">Level</p>
            <p className="text-2xl font-semibold text-indigo-600">{profile?.level || 1}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500 mb-1">Best streak</p>
            <p className="text-2xl font-semibold text-indigo-600">🔥 {bestStreak}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">My Habits</h2>
              <button onClick={() => navigate('/habits')}
                className="text-sm text-indigo-600 hover:underline">View all</button>
            </div>
            {habits.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">No habits yet — create one!</p>
            ) : habits.slice(0, 3).map(habit => (
              <div key={habit.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                  style={{ backgroundColor: habit.color + '20' }}>⭐</div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{habit.title}</p>
                  <p className="text-xs text-gray-400">{habit.category} · {habit.frequency}</p>
                </div>
              </div>
            ))}
            <button onClick={() => navigate('/habits')}
              className="w-full mt-4 border border-dashed border-gray-300 text-gray-400 hover:text-indigo-600 hover:border-indigo-300 py-2 rounded-lg text-sm transition-colors">
              + Add habit
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Friends</h2>
              <button onClick={() => navigate('/friends')}
                className="text-sm text-indigo-600 hover:underline">View all</button>
            </div>
            {friends.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">No friends yet — add some!</p>
            ) : friends.slice(0, 3).map(friend => (
              <div key={friend.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-sm">
                  {friend.username[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{friend.username}</p>
                  <p className="text-xs text-gray-400">Level {friend.level} · {friend.totalXp} XP</p>
                </div>
              </div>
            ))}
            <button onClick={() => navigate('/friends')}
              className="w-full mt-4 border border-dashed border-gray-300 text-gray-400 hover:text-indigo-600 hover:border-indigo-300 py-2 rounded-lg text-sm transition-colors">
              + Add friend
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">My Goals</h2>
              <button onClick={() => navigate('/goals')}
                className="text-sm text-indigo-600 hover:underline">View all</button>
            </div>
            {goals.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">No goals yet — create one!</p>
            ) : goals.slice(0, 3).map(goal => (
              <div key={goal.id} className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-gray-900">{goal.title}</p>
                  <p className="text-xs text-gray-400">
                    {goal.currentValue}/{goal.targetValue} {goal.unit}
                    {goal.completed && <span className="ml-2 text-green-600">✅</span>}
                  </p>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(Math.round((goal.currentValue / goal.targetValue) * 100), 100)}%`,
                      backgroundColor: goal.completed ? '#10b981' : '#5C4EE5'
                    }}/>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  {Math.min(Math.round((goal.currentValue / goal.targetValue) * 100), 100)}% complete
                </p>
              </div>
            ))}
            <button onClick={() => navigate('/goals')}
              className="w-full mt-2 border border-dashed border-gray-300 text-gray-400 hover:text-indigo-600 hover:border-indigo-300 py-2 rounded-lg text-sm transition-colors">
              + Add goal
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Quick links</h2>
            </div>
            <div className="grid grid-cols-4 gap-3">
              <button onClick={() => navigate('/leaderboard')}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
                <span className="text-2xl">🏆</span>
                <span className="text-sm text-gray-600">Leaderboard</span>
              </button>
              <button onClick={() => navigate('/analytics')}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
                <span className="text-2xl">📊</span>
                <span className="text-sm text-gray-600">Analytics</span>
              </button>
              <button onClick={() => navigate('/chat')}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
                <span className="text-2xl">💬</span>
                <span className="text-sm text-gray-600">Chat</span>
              </button>
              <button onClick={() => navigate('/profile')}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
                <span className="text-2xl">👤</span>
                <span className="text-sm text-gray-600">Profile</span>
              </button>
              <button onClick={() => navigate('/habits')}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
                <span className="text-2xl">✅</span>
                <span className="text-sm text-gray-600">Check in</span>
              </button>
              <button onClick={() => navigate('/friends')}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
                <span className="text-2xl">👥</span>
                <span className="text-sm text-gray-600">Friends</span>
              </button>
              <button onClick={() => navigate('/goals')}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
                <span className="text-2xl">🎯</span>
                <span className="text-sm text-gray-600">Goals</span>
              </button>
              <button onClick={() => navigate('/feedback')}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
                <span className="text-2xl">📝</span>
                <span className="text-sm text-gray-600">Feedback</span>
              </button>
              <button onClick={() => navigate('/about')}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
                <span className="text-2xl">ℹ️</span>
                <span className="text-sm text-gray-600">About</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}