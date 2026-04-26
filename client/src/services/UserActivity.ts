import { api } from './myFetch'

export type UserActivity = {
  id: number
  userId: number
  action: string
  details?: string
  createdAt: string
}

export function getUserActivities(params?: { page?: number; pageSize?: number; search?: string }) {
  const query = new URLSearchParams()

  if (params?.page) query.set('page', String(params.page))
  if (params?.pageSize) query.set('pageSize', String(params.pageSize))
  if (params?.search) query.set('search', params.search)

  const qs = query.toString()
  return api<{ list: UserActivity[]; count: number }>(`/user-activities${qs ? `?${qs}` : ''}`)
}

export function getActivitiesByUser(userId: number) {
  return api<{ list: UserActivity[]; count: number }>(`/users/${userId}/activities`)
}

export function createUserActivity(payload: Omit<UserActivity, 'id' | 'createdAt'>) {
  return api<UserActivity>('/user-activities', payload)
}

export function deleteUserActivity(id: number) {
  return api<UserActivity>(`/user-activities/${id}`, undefined, { method: 'DELETE' })
}