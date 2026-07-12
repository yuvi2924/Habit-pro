import { useState, useEffect } from 'react'
import { getHabits, createHabit, deleteHabit } from '../api/habits.api'
import { logActivity, getActivities } from '../api/activities.api'
import { useNavigate } from 'react-router-dom'

const CATEGORIES = ['general', 'health', 'fitness', 'study', 'mindfulness', 'work']
const COLORS = ['#5C4EE5', '#0F6E56', '#E85D24', '#185FA5', '#854F0B', '#993556']

export default function HabitsPage() {
  const [habits, setHabits] = useState([])
  const [completedToday, setCompletedToday] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', category: 'general', frequency: 'daily', color: '#5C4EE5', icon: '⭐' })
  const [loading, setLoading] = useState(false)
  const [checkingIn, setCheckingIn] = useState(null)
  const navigate = useNavigate()

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      const res = await getHabits()
      setHabits(res.data)
      const today = new Date().toISOString().split('T')[0]
      const acts = await getActivities(today, today)
      setCompletedToday(acts.data.filter(a => a.completed).map(a => a.habit.id))
    } catch { navigate('/login') }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await createHabit(form)
      setShowForm(false)
      setForm({ title: '', category: 'general', frequency: 'daily', color: '#5C4EE5', icon: '⭐' })
      fetchData()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create habit')
    } finally { setLoading(false) }
  }

  const handleCheckIn = async (habitId) => {
    setCheckingIn(habitId)
    try {
      await logActivity({ habitId, value: 1 })
      fetchData()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to log activity')
    } finally { setCheckingIn(null) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this habit?')) return
    await deleteHabit(id)
    fetchData()
  }

  const todayCompleted = completedToday.length
  const completionRate = habits.length > 0
    ? Math.round((todayCompleted / habits.length) * 100) : 0

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
          <button onClick={() => navigate('/goals')} className="text-sm text-gray-500 hover:text-gray-900">Goals</button>
          <button onClick={() => navigate('/friends')} className="text-sm text-gray-500 hover:text-gray-900">Friends</button>
          <button onClick={() => navigate('/leaderboard')} className="text-sm text-gray-500 hover:text-gray-900">Leaderboard</button>
          <button onClick={() => navigate('/analytics')} className="text-sm text-gray-500 hover:text-gray-900">Analytics</button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">My Habits</h1>
            <p className="text-gray-500 text-sm mt-1">{habits.length} habits tracked</p>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            + New Habit
          </button>
        </div>

        {habits.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-700">Today's progress</p>
              <p className="text-sm font-semibold text-indigo-600">{todayCompleted}/{habits.length} completed</p>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3">
              <div className="h-3 rounded-full bg-indigo-600 transition-all duration-500"
                style={{ width: `${completionRate}%` }}/>
            </div>
            <p className="text-xs text-gray-400 mt-1">{completionRate}% done today
              {completionRate === 100 && ' 🎉 Amazing! All habits completed!'}
            </p>
          </div>
        )}

        {showForm && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Habit</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Habit name</label>
                <input required value={form.title}
                  onChange={e => setForm({...form, title: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. Morning run, Read 30 mins..."/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select value={form.category}
                    onChange={e => setForm({...form, category: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                  <select value={form.frequency}
                    onChange={e => setForm({...form, frequency: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <div className="flex gap-2">
                  {COLORS.map(c => (
                    <button key={c} type="button"
                      onClick={() => setForm({...form, color: c})}
                      className="w-8 h-8 rounded-full border-2 transition-all"
                      style={{ backgroundColor: c, borderColor: form.color === c ? '#1f2937' : 'transparent' }}/>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-medium disabled:opacity-50">
                  {loading ? 'Creating...' : 'Create Habit'}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {habits.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-4xl mb-3">🌱</p>
            <p className="text-gray-900 font-medium mb-1">No habits yet</p>
            <p className="text-gray-500 text-sm">Create your first habit to get started!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {habits.map(habit => {
              const done = completedToday.includes(habit.id)
              return (
                <div key={habit.id}
                  className={`bg-white rounded-xl border p-5 flex items-center justify-between transition-all ${done ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                      style={{ backgroundColor: habit.color + '20' }}>
                      {done ? '✅' : '⭐'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{habit.title}</p>
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{habit.category}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{habit.frequency}</span>
                        {done && <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">+10 XP earned</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {!done ? (
                      <button
                        onClick={() => handleCheckIn(habit.id)}
                        disabled={checkingIn === habit.id}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 transition-colors">
                        {checkingIn === habit.id ? 'Logging...' : '✓ Check in'}
                      </button>
                    ) : (
                      <span className="text-green-600 text-sm font-medium">Done today!</span>
                    )}
                    <button onClick={() => handleDelete(habit.id)}
                      className="text-red-400 hover:text-red-600 text-sm transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}