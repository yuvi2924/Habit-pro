import { useNavigate } from 'react-router-dom'
import { useThemeStore } from '../store/themeStore'

const THEMES = {
  indigo: '#5C4EE5', blue: '#185FA5', green: '#0F6E56',
  coral: '#E85D24', pink: '#993556', amber: '#854F0B'
}

export default function AboutPage() {
  const navigate = useNavigate()
  const { theme } = useThemeStore()
  const themeColor = THEMES[theme] || THEMES.indigo

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
          <button onClick={() => navigate('/feedback')} className="text-sm text-gray-500 hover:text-gray-900">Feedback</button>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">About HabitPRO</h1>
        <p className="text-gray-500 text-sm mb-8">Learn more about this project and its creator</p>

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-5 mb-6">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold"
              style={{ backgroundColor: themeColor }}>
              Y
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Yuvi Sharma</h2>
              <p className="text-gray-500 text-sm">Creator & Developer of HabitPRO</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: themeColor }}>
                <span className="text-lg">👤</span>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Full Name</p>
                <p className="font-medium text-gray-900">Yuvi Sharma</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: themeColor }}>
                <span className="text-lg">📧</span>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Email Address</p>
                <a href="mailto:yuvisharma17654@gmail.com"
                  className="font-medium hover:underline"
                  style={{ color: themeColor }}>
                  yuvisharma17654@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: themeColor }}>
                <span className="text-lg">📱</span>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Phone Number</p>
                <a href="tel:+919350233236"
                  className="font-medium hover:underline"
                  style={{ color: themeColor }}>
                  +91 9350233236
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-3">About the App</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-3">
            HabitPRO is a full-stack habit tracking application built with React, Java Spring Boot and MySQL.
            It helps you build better habits, track your daily activities, set goals and compete with friends.
          </p>
          <p className="text-gray-500 text-sm leading-relaxed">
            The app features JWT authentication, a points and XP system, streak tracking, friend requests,
            real-time chat, leaderboards, analytics and much more — all built from scratch.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Tech Stack</h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-2xl mb-2">⚛️</p>
              <p className="text-sm font-medium text-gray-900">React</p>
              <p className="text-xs text-gray-400">Frontend</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-2xl mb-2">☕</p>
              <p className="text-sm font-medium text-gray-900">Spring Boot</p>
              <p className="text-xs text-gray-400">Backend</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-2xl mb-2">🐬</p>
              <p className="text-sm font-medium text-gray-900">MySQL</p>
              <p className="text-xs text-gray-400">Database</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-2xl mb-2">🔐</p>
              <p className="text-sm font-medium text-gray-900">JWT</p>
              <p className="text-xs text-gray-400">Auth</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-2xl mb-2">🎨</p>
              <p className="text-sm font-medium text-gray-900">Tailwind</p>
              <p className="text-xs text-gray-400">Styling</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-2xl mb-2">🗄️</p>
              <p className="text-sm font-medium text-gray-900">Flyway</p>
              <p className="text-xs text-gray-400">Migrations</p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button onClick={() => navigate('/feedback')}
            className="text-white px-8 py-3 rounded-xl text-sm font-medium mr-3"
            style={{ backgroundColor: themeColor }}>
            📝 Send Feedback
          </button>
          <button onClick={() => navigate('/dashboard')}
            className="border border-gray-300 text-gray-700 px-8 py-3 rounded-xl text-sm font-medium hover:bg-gray-50">
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}