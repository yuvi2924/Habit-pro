import { useState, useEffect } from 'react'
import { getGoals, createGoal, updateGoalProgress, deleteGoal } from '../api/goals.api'
import { getHabits } from '../api/habits.api'
import { useNavigate } from 'react-router-dom'

export default function GoalsPage() {
  const [goals, setGoals] = useState([])
  const [habits, setHabits] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', habitId: '', targetValue: 10, unit: 'times', deadline: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      const [g, h] = await Promise.all([getGoals(), getHabits()])
      setGoals(g.data)
      setHabits(h.data)
    } catch { navigate('/login') }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await createGoal({
        ...form,
        habitId: form.habitId || null,
        targetValue: parseInt(form.targetValue)
      })
      setShowForm(false)
      setForm({ title: '', habitId: '', targetValue: 10, unit: 'times', deadline: '' })
      fetchData()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create goal')
    } finally { setLoading(false) }
  }

  const handleProgress = async (id) => {
    await updateGoalProgress(id, 1)
    fetchData()
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this goal?')) return
    await deleteGoal(id)
    fetchData()
  }

  const getProgressPercent = (goal) => {
    return Math.min(Math.round((goal.currentValue / goal.targetValue) * 100), 100)
  }

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
          <button onClick={() => navigate('/friends')} className="text-sm text-gray-500 hover:text-gray-900">Friends</button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">My Goals</h1>
            <p className="text-gray-500 text-sm mt-1">{goals.filter(g => !g.completed).length} active goals</p>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            + New Goal
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Goal</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Goal title</label>
                <input required value={form.title}
                  onChange={e => setForm({...form, title: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. Run 50km this month"/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Linked habit (optional)</label>
                  <select value={form.habitId} onChange={e => setForm({...form, habitId: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="">No habit</option>
                    {habits.map(h => <option key={h.id} value={h.id}>{h.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target</label>
                  <div className="flex gap-2">
                    <input type="number" min="1" value={form.targetValue}
                      onChange={e => setForm({...form, targetValue: e.target.value})}
                      className="w-24 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                    <input value={form.unit} onChange={e => setForm({...form, unit: e.target.value})}
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="times, km, pages..."/>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deadline (optional)</label>
                <input type="date" value={form.deadline}
                  onChange={e => setForm({...form, deadline: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-medium disabled:opacity-50">
                  {loading ? 'Creating...' : 'Create Goal'}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {goals.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-4xl mb-3">🎯</p>
            <p className="text-gray-900 font-medium mb-1">No goals yet</p>
            <p className="text-gray-500 text-sm">Set your first goal to start earning XP!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {goals.map(goal => (
              <div key={goal.id} className={`bg-white rounded-xl border p-5 ${goal.completed ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">{goal.title}</p>
                      {goal.completed && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">✅ Completed</span>}
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {goal.currentValue} / {goal.targetValue} {goal.unit}
                      {goal.deadline && ` · Due ${goal.deadline}`}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {!goal.completed && (
                      <button onClick={() => handleProgress(goal.id)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium">
                        +1 Progress
                      </button>
                    )}
                    <button onClick={() => handleDelete(goal.id)}
                      className="text-red-400 hover:text-red-600 text-xs">
                      Delete
                    </button>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${getProgressPercent(goal)}%`,
                      backgroundColor: goal.completed ? '#10b981' : '#5C4EE5'
                    }}/>
                </div>
                <p className="text-xs text-gray-400 mt-1">{getProgressPercent(goal)}% complete</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}