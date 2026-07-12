import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getMyFriends } from '../api/friends.api'
import { sendMessage, getConversation } from '../api/chat.api'
import { useThemeStore } from '../store/themeStore'
import api from '../api/axiosInstance'

const THEMES = {
  indigo: '#5C4EE5', blue: '#185FA5', green: '#0F6E56',
  coral: '#E85D24', pink: '#993556', amber: '#854F0B'
}

export default function ChatPage() {
  const navigate = useNavigate()
  const { friendId } = useParams()
  const { theme } = useThemeStore()
  const themeColor = THEMES[theme] || THEMES.indigo
  const [friends, setFriends] = useState([])
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [me, setMe] = useState(null)
  const [selectedFriend, setSelectedFriend] = useState(null)
  const [sending, setSending] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    getMyFriends().then(r => setFriends(r.data)).catch(() => {})
    api.get('/users/me').then(r => setMe(r.data)).catch(() => {})
  }, [])

  useEffect(() => {
    if (friendId) {
      const friend = friends.find(f => f.id === parseInt(friendId))
      if (friend) setSelectedFriend(friend)
      fetchMessages(friendId)
      const interval = setInterval(() => fetchMessages(friendId), 3000)
      return () => clearInterval(interval)
    }
  }, [friendId, friends])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchMessages = async (fId) => {
    try {
      const res = await getConversation(fId)
      setMessages(res.data)
    } catch {}
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!text.trim() || !friendId) return
    setSending(true)
    try {
      await sendMessage({ receiverId: parseInt(friendId), message: text })
      setText('')
      fetchMessages(friendId)
    } catch { alert('Failed to send message') }
    finally { setSending(false) }
  }

  const formatTime = (sentAt) => {
    if (!sentAt) return ''
    return new Date(sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
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
          <button onClick={() => navigate('/friends')} className="text-sm text-gray-500 hover:text-gray-900">Friends</button>
        </div>
      </nav>

      <div className="flex flex-1 max-w-5xl mx-auto w-full px-6 py-6 gap-6">
        <div className="w-64 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <p className="font-semibold text-gray-900">Messages</p>
          </div>
          {friends.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-gray-400 text-sm">No friends yet</p>
              <button onClick={() => navigate('/friends')}
                className="text-xs mt-2 underline" style={{ color: themeColor }}>
                Add friends
              </button>
            </div>
          ) : friends.map(friend => (
            <button key={friend.id}
              onClick={() => navigate(`/chat/${friend.id}`)}
              className={`w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 ${parseInt(friendId) === friend.id ? 'bg-gray-50' : ''}`}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                style={{ backgroundColor: themeColor }}>
                {friend.username[0].toUpperCase()}
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">{friend.username}</p>
                <p className="text-xs text-gray-400">Level {friend.level}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="flex-1 bg-white rounded-xl border border-gray-200 flex flex-col">
          {!friendId ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-4xl mb-3">💬</p>
                <p className="text-gray-500">Select a friend to start chatting</p>
              </div>
            </div>
          ) : (
            <>
              <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                  style={{ backgroundColor: themeColor }}>
                  {selectedFriend?.username?.[0]?.toUpperCase() || '?'}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{selectedFriend?.username}</p>
                  <p className="text-xs text-gray-400">Level {selectedFriend?.level} · {selectedFriend?.totalXp} XP</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: '500px' }}>
                {messages.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400 text-sm">No messages yet — say hi! 👋</p>
                  </div>
                ) : messages.map(msg => {
                  const isMe = me && msg.sender?.id === me.id
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${isMe ? 'text-white rounded-br-none' : 'bg-gray-100 text-gray-900 rounded-bl-none'}`}
                        style={isMe ? { backgroundColor: themeColor } : {}}>
                        <p>{msg.message}</p>
                        <p className={`text-xs mt-1 ${isMe ? 'text-white opacity-70' : 'text-gray-400'}`}>
                          {formatTime(msg.sentAt)}
                        </p>
                      </div>
                    </div>
                  )
                })}
                <div ref={bottomRef}/>
              </div>

              <form onSubmit={handleSend} className="p-4 border-t border-gray-100 flex gap-3">
                <input value={text} onChange={e => setText(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2"
                  style={{ '--tw-ring-color': themeColor }}/>
                <button type="submit" disabled={sending || !text.trim()}
                  className="text-white px-6 py-2.5 rounded-xl text-sm font-medium disabled:opacity-50 transition-colors"
                  style={{ backgroundColor: themeColor }}>
                  {sending ? '...' : 'Send'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}