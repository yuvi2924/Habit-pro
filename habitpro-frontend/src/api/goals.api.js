import api from './axiosInstance'

export const getGoals = () => api.get('/goals')
export const createGoal = (data) => api.post('/goals', data)
export const updateGoalProgress = (id, value) => api.put(`/goals/${id}/progress?value=${value}`)
export const deleteGoal = (id) => api.delete(`/goals/${id}`)