import { useState, useEffect } from 'react'
import { getMyFriends, getPendingRequests, sendFriendRequest, respondToRequest, getFriendProgress } from '../api/friends.api'
import { useNavigate } from 'react-router-dom'

export default function FriendsPage() {
  const [friends, setFriends] = useState([])
  const [pending, setPending] = useState([])
  const [username, setUsername] = useState('')
  const [message, setMessage] = useState('')
  const [selectedFriend, setSelectedFriend] = useState(null)
  const [tab, setTab] = useState('friends')
  const navigate = useNavigate()

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      const [f, p] = await Promise.all([getMyFriends(), getPendingRequests()])
      setFriends(f.data)
      setPending(p.data)
    } catch { navigate('/login') }
  }

  const handleSendRequest = async (e) => {
    e.preventDefault()
    try {
      await sendFriendRequest(username)
      setMessage('Friend request sent to ' + username)
      setUsername('')
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to send request')
    }
  }

  const handleRespond = async (id, accept) => {
    await respondToRequest(id, accept)
    fetchData()
  }

  const handleViewProgress = async (friend) => {
    const res = await getFriendProgress(friend.id)
    setSelectedFriend(res.data)
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
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Friends</h1>

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-base font-semibold text-gray-900 mb-3">Add a friend</h2>
          <form onSubmit={handleSendRequest} className="flex gap-3">
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter username..."
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium">
              Send Request
            </button>
          </form>
          {message && <p className="text-sm text-indigo-600 mt-2">{message}</p>}
        </div>

        <div className="flex gap-2 mb-6">
          <button onClick={() => setTab('friends')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'friends' ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>
            Friends ({friends.length})
          </button>
          <button onClick={() => setTab('pending')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'pending' ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>
            Pending ({pending.length})
          </button>
        </div>

        {tab === 'friends' && (
          <div className="grid gap-4">
            {friends.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <p className="text-4xl mb-3">👥</p>
                <p className="text-gray-900 font-medium mb-1">No friends yet</p>
                <p className="text-gray-500 text-sm">Send a friend request to get started!</p>
              </div>
            ) : friends.map(friend => (
              <div key={friend.id} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-lg">
                      {friend.username[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{friend.username}</p>
                      <p className="text-sm text-gray-500">{friend.email}</p>
                    </div>
                  </div>
                  <button onClick={() => handleViewProgress(friend)}
                    className="border border-indigo-200 text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    View Progress
                  </button>
                </div>

                {selectedFriend?.id === friend.id && (
                  <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
                    <div className="bg-indigo-50 rounded-lg p-4 text-center">
                      <p className="text-sm text-indigo-600 mb-1">Level</p>
                      <p className="text-2xl font-semibold text-indigo-700">{selectedFriend.level}</p>
                    </div>
                    <div className="bg-indigo-50 rounded-lg p-4 text-center">
                      <p className="text-sm text-indigo-600 mb-1">Total XP</p>
                      <p className="text-2xl font-semibold text-indigo-700">{selectedFriend.totalXp}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === 'pending' && (
          <div className="grid gap-4">
            {pending.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <p className="text-4xl mb-3">📭</p>
                <p className="text-gray-500 text-sm">No pending requests</p>
              </div>
            ) : pending.map(req => (
              <div key={req.id} className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-semibold text-lg">
                    {req.username[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{req.username}</p>
                    <p className="text-sm text-gray-500">wants to be your friend</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleRespond(req.id, true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                    Accept
                  </button>
                  <button onClick={() => handleRespond(req.id, false)}
                    className="border border-gray-300 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}