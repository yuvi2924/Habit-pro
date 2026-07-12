import api from './axiosInstance'

export const getGlobalLeaderboard = () => api.get('/leaderboard/global')
export const getFriendsLeaderboard = () => api.get('/leaderboard/friends')