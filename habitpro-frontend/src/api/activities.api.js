import api from './axiosInstance'

export const logActivity = (data) => api.post('/activities', data)
export const getActivities = (from, to) => api.get(`/activities?from=${from}&to=${to}`)