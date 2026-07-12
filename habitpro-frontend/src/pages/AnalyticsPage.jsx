import { useState, useEffect } from 'react'
import { getHabits } from '../api/habits.api'
import { getGoals } from '../api/goals.api'
import { getMyFriends } from '../api/friends.api'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function AnalyticsPage() {
  const [habits, setHabits] = useState([])
  const [goals, setGoals] = useState([])
  const [friends, setFriends] = useState([])
  const navigate = useNavigate()
  const { logout } = useAuthStore()

  useEffect(() => {
    getHabits().then(r => setHabits(r.data)).catch(() => {})
    getGoals().then(r => setGoals(r.data)).catch(() => {})
    getMyFriends().then(r => setFriends(r.data)).catch(() => {})
  }, [])

  const completedGoals = goals.filter(g => g.completed).length
  const activeGoals = goals.filter(g => !g.completed).length
  const goalCompletionRate = goals.length > 0
    ? Math.round((completedGoals / goals.length) * 100) : 0

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
          <button onClick={() => navigate('/leaderboard')} className="text-sm text-gray-500 hover:text-gray-900">Leaderboard</button>
          <button onClick={() => { logout(); navigate('/login') }} className="text-sm text-red-400 hover:text-red-600">Sign out</button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Analytics</h1>
        <p className="text-gray-500 text-sm mb-8">Your performance overview</p>

        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
            <p className="text-3xl mb-1">🏃</p>
            <p className="text-2xl font-semibold text-indigo-600">{habits.length}</p>
            <p className="text-sm text-gray-500">Active habits</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
            <p className="text-3xl mb-1">🎯</p>
            <p className="text-2xl font-semibold text-indigo-600">{activeGoals}</p>
            <p className="text-sm text-gray-500">Active goals</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
            <p className="text-3xl mb-1">✅</p>
            <p className="text-2xl font-semibold text-green-600">{completedGoals}</p>
            <p className="text-sm text-gray-500">Goals completed</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
            <p className="text-3xl mb-1">👥</p>
            <p className="text-2xl font-semibold text-indigo-600">{friends.length}</p>
            <p className="text-sm text-gray-500">Friends</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Goal completion rate</h2>
            <div className="flex items-center justify-center">
              <div className="relative w-32 h-32">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#E5E7EB" strokeWidth="10"/>
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#5C4EE5" strokeWidth="10"
                    strokeDasharray={`${goalCompletionRate * 2.51} 251`}
                    strokeLinecap="round"/>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-2xl font-semibold text-indigo-600">{goalCompletionRate}%</p>
                </div>
              </div>
            </div>
            <p className="text-center text-sm text-gray-500 mt-3">
              {completedGoals} of {goals.length} goals completed
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Habits by category</h2>
            {habits.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">No habits yet</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(
                  habits.reduce((acc, h) => {
                    acc[h.category] = (acc[h.category] || 0) + 1
                    return acc
                  }, {})
                ).map(([cat, count]) => (
                  <div key={cat}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700 capitalize">{cat}</span>
                      <span className="text-gray-400">{count} habit{count > 1 ? 's' : ''}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="h-2 rounded-full bg-indigo-500"
                        style={{ width: `${(count / habits.length) * 100}%` }}/>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Goals progress</h2>
          {goals.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">No goals yet</p>
          ) : (
            <div className="space-y-4">
              {goals.map(goal => (
                <div key={goal.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-900">{goal.title}</span>
                    <span className="text-gray-400">
                      {goal.currentValue}/{goal.targetValue} {goal.unit}
                      {goal.completed && ' ✅'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div className="h-2.5 rounded-full transition-all"
                      style={{
                        width: `${Math.min((goal.currentValue / goal.targetValue) * 100, 100)}%`,
                        backgroundColor: goal.completed ? '#10b981' : '#5C4EE5'
                      }}/>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}