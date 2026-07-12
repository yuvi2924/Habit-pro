import api from './axiosInstance'

export const sendMessage = (data) => api.post('/chat/send', data)
export const getConversation = (friendId) => api.get(`/chat/conversation/${friendId}`)
export const getUnread = () => api.get('/chat/unread')