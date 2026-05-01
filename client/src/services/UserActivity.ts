import { api } from './myFetch'

export interface UserActivity {
  id: number;              
  created_at: string;    
  user_id: string;       
  exercise_id: string;    
  weight_lb: number | null; 
  reps: number | null;  
  durations_min: number | null;
  distance: number | null;   
}

export function getUserActivities(params?: { page?: number }) {
  const qs = params?.page ? `?page=${params.page}` : '';
  return api<{ list: UserActivity[]; count: number }>(`/user-activities${qs}`);
}

export function createUserActivity(payload: Omit<UserActivity, 'id'>) {
  return api('/user-activities', payload);
}

export function getActivitiesByUser(userId: number) {
  return api<{ list: UserActivity[]; count: number }>(`/users/${userId}/activities`)
}

export function deleteUserActivity(id: number) {
  return api<UserActivity>(`/user-activities/${id}`, undefined, { method: 'DELETE' })
}