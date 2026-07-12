import api from './axiosInstance'

export const sendFriendRequest = (username) => api.post(`/friends/request/${username}`)
export const respondToRequest = (id, accept) => api.put(`/friends/respond/${id}?accept=${accept}`)
export const getMyFriends = () => api.get('/friends')
export const getPendingRequests = () => api.get('/friends/pending')
export const getFriendProgress = (id) => api.get(`/friends/progress/${id}`)