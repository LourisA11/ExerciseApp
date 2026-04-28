import { reactive } from 'vue'
import { api } from '../services/myFetch'

export interface IUser {
  id?: number
  dbId?: string
  email?: string
  name?: string
  role?: 'admin' | 'user'
}

export const usersState = reactive({
  list: [] as IUser[],
  loading: false,
})

export async function loadUsers() {
  usersState.loading = true
  try {
    const res = await api<{ data: IUser[] }>(`/users`)
    usersState.list = res.data ?? []
  } finally {
    usersState.loading = false
  }
}

export async function getUserByEmail(email: string) {
  const res = await api<{ data: IUser[] }>(`/users?email=${encodeURIComponent(email)}`)
  return (res.data && res.data[0]) ?? null
}

export async function createUser(payload: Partial<IUser>) {
  return api<{ data: IUser }>(`/users`, payload, { method: 'POST' })
}

export async function updateUser(id: string, payload: Partial<IUser>) {
  return api<{ data: IUser }>(`/users/${id}`, payload, { method: 'PATCH' })
}

export default {
  usersState,
  loadUsers,
  getUserByEmail,
  createUser,
  updateUser,
}
