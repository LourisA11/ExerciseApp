import { myFetch } from './myFetch'

type UserIdentity = {
  id: string
  email: string
}

type UsersResponse = {
  isSuccess: boolean
  message?: string
  data: UserIdentity[]
  total: number
}

export function getUsersByEmail(email: string) {
  return myFetch(`/users?email=${encodeURIComponent(email)}`) as Promise<UsersResponse>
}
