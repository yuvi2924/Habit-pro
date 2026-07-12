import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useThemeStore } from '../store/themeStore'
import api from '../api/axiosInstance'

const THEMES = [
  { name: 'indigo', label: 'Indigo', color: '#5C4EE5' },
  { name: 'blue', label: 'Blue', color: '#185FA5' },
  { name: 'green', label: 'Green', color: '#0F6E56' },
  { name: 'coral', label: 'Coral', color: '#E85D24' },
  { name: 'pink', label: 'Pink', color: '#993556' },
  { name: 'amber', label: 'Amber', color: '#854F0B' },
]

export default function ProfilePage() {
  const navigate = useNavigate()
  const { logout } = useAuthStore()
  const { theme, setTheme } = useThemeStore()
  const [profile, setProfile] = useState(null)
  const [avatar, setAvatar] = useState(null)
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    api.get('/users/me').then(r => setProfile(r.data)).catch(() => {})
  }, [])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setAvatar(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleUpload = async () => {
    if (!avatar) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', avatar)
      await api.post('/users/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
      alert('Upload failed — backend avatar endpoint coming soon!')
    } finally { setUploading(false) }
  }

  const currentTheme = THEMES.find(t => t.name === theme) || THEMES[0]

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: currentTheme.color }}>
            <span className="text-white text-sm font-bold">H</span>
          </div>
          <span className="text-xl font-semibold text-gray-900">HabitPRO</span>
        </div>
        <div className="flex gap-4">
          <button onClick={() => navigate('/dashboard')} className="text-sm text-gray-500 hover:text-gray-900">Dashboard</button>
          <button onClick={() => navigate('/feedback')} className="text-sm text-gray-500 hover:text-gray-900">Feedback</button>
          <button onClick={() => { logout(); navigate('/login') }} className="text-sm text-red-400 hover:text-red-600">Sign out</button>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">My Profile</h1>

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Profile Photo</h2>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 flex items-center justify-center"
              style={{ backgroundColor: currentTheme.color + '20' }}>
              {preview ? (
                <img src={preview} alt="avatar" className="w-full h-full object-cover"/>
              ) : (
                <span className="text-3xl font-semibold" style={{ color: currentTheme.color }}>
                  {profile?.username?.[0]?.toUpperCase() || 'U'}
                </span>
              )}
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">{profile?.username}</p>
              <p className="text-sm text-gray-500 mb-3">{profile?.email}</p>
              <div className="flex gap-3">
                <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Choose photo
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden"/>
                </label>
                {preview && (
                  <button onClick={handleUpload} disabled={uploading}
                    className="text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                    style={{ backgroundColor: currentTheme.color }}>
                    {uploading ? 'Uploading...' : saved ? '✓ Saved!' : 'Upload'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-2">Stats</h2>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center p-4 rounded-xl bg-gray-50">
              <p className="text-2xl font-semibold" style={{ color: currentTheme.color }}>{profile?.totalXp || 0}</p>
              <p className="text-sm text-gray-500">Total XP</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-gray-50">
              <p className="text-2xl font-semibold" style={{ color: currentTheme.color }}>{profile?.level || 1}</p>
              <p className="text-sm text-gray-500">Level</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-gray-50">
              <p className="text-2xl font-semibold" style={{ color: currentTheme.color }}>🔥</p>
              <p className="text-sm text-gray-500">Streak</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Theme Color</h2>
          <div className="grid grid-cols-6 gap-3">
            {THEMES.map(t => (
              <button key={t.name} onClick={() => setTheme(t.name)}
                className="flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all"
                style={{ borderColor: theme === t.name ? t.color : 'transparent', backgroundColor: theme === t.name ? t.color + '10' : '' }}>
                <div className="w-8 h-8 rounded-full" style={{ backgroundColor: t.color }}/>
                <span className="text-xs text-gray-600">{t.label}</span>
              </button>
            ))}
          </div>
          {saved && <p className="text-sm text-green-600 mt-3">✓ Theme saved!</p>}
        </div>
      </div>
    </div>
  )
}