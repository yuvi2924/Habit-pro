import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useThemeStore } from '../store/themeStore'
import api from '../api/axiosInstance'

const THEMES = {
  indigo: '#5C4EE5', blue: '#185FA5', green: '#0F6E56',
  coral: '#E85D24', pink: '#993556', amber: '#854F0B'
}

export default function FeedbackPage() {
  const navigate = useNavigate()
  const { theme } = useThemeStore()
  const themeColor = THEMES[theme] || THEMES.indigo
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api.post('/feedback', form)
      setSubmitted(true)
    } catch {
      setError('Failed to submit feedback. Please try again.')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: themeColor }}>
            <span className="text-white text-sm font-bold">H</span>
          </div>
          <span className="text-xl font-semibold text-gray-900">HabitPRO</span>
        </div>
        <div className="flex gap-4">
          <button onClick={() => navigate('/dashboard')} className="text-sm text-gray-500 hover:text-gray-900">Dashboard</button>
          <button onClick={() => navigate('/profile')} className="text-sm text-gray-500 hover:text-gray-900">Profile</button>
        </div>
      </nav>

      <div className="max-w-lg mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Feedback</h1>
        <p className="text-gray-500 text-sm mb-8">We'd love to hear from you!</p>

        {submitted ? (
          <div className="bg-white rounded-xl border border-green-200 p-8 text-center">
            <p className="text-5xl mb-4">🎉</p>
            <p className="text-xl font-semibold text-gray-900 mb-2">Thank you!</p>
            <p className="text-gray-500 text-sm mb-6">Your feedback has been submitted successfully.</p>
            <button onClick={() => navigate('/dashboard')}
              className="text-white px-6 py-2.5 rounded-lg text-sm font-medium"
              style={{ backgroundColor: themeColor }}>
              Back to Dashboard
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
                <input required value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2"
                  placeholder="Your full name"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                <input required type="email" value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2"
                  placeholder="you@example.com"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone number</label>
                <input required type="tel" value={form.phone}
                  onChange={e => setForm({...form, phone: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2"
                  placeholder="+91 98765 43210"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea required rows={4} value={form.message}
                  onChange={e => setForm({...form, message: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 resize-none"
                  placeholder="Tell us what you think about HabitPRO..."/>
              </div>
              <button type="submit" disabled={loading}
                className="w-full text-white py-3 rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
                style={{ backgroundColor: themeColor }}>
                {loading ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}