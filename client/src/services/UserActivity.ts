import { api } from './myFetch'

export interface UserActivity {
  id: number
  created_at: string
  user_id: string
  exercise_id: string
  weight_lb: number | null
  reps: number | null
  durations_min: number | null
  distance: number | null
}

interface ActivityResponse {
  data: UserActivity[]
  total: number
  hasMore: boolean
}

export async function getUserActivities(
  params?: {
    page?: number
    pageSize?: number
    search?: string
  }
) {

  const query = new URLSearchParams()

  if (params?.page) {
    query.set('page', String(params.page))
  }

  if (params?.pageSize) {
    query.set('limit', String(params.pageSize))
  }

  const qs = query.toString()

  const response = await api<ActivityResponse>(
    `/user-exercises${qs ? `?${qs}` : ''}`
  )

  return {
    list: response.data ?? [],
    count: response.total ?? 0,
    hasMore: response.hasMore ?? false,
  }
}

export function getActivitiesByUser(userId: number) {
  return api<{ list: UserActivity[]; count: number }>(
    `/users/${userId}/activities`
  )
}

export function createUserActivity(
  payload: Omit<UserActivity, 'id' | 'created_at'>
) {
  return api<UserActivity>(
    '/user-exercises',
    payload,
    {
      method: 'POST'
    }
  )
}

export function deleteUserActivity(id: number) {
  return api<UserActivity>(
    `/user-exercises/${id}`,
    undefined,
    {
      method: 'DELETE'
    }
  )
}