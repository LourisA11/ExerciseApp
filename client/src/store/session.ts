import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { api as myApi } from '../services/myFetch'
import { authState, type User } from './userData'

export type FeedbackMessage = {
  type: 'success' | 'danger' | 'info'
  text: string
}

export const useSessionStore = defineStore('session', () => {
  const SESSION_KEY = 'currentUser'
  const user = ref<User | null>(authState.currentUser)

  const messages = ref<FeedbackMessage[]>([])
  function addMessage(text: string, type: FeedbackMessage['type'] = 'info') {
    messages.value.push({ type, text })
  }
  function handleError(error: Error | string) {
    const message = typeof error === 'string' ? error : error.message
    addMessage(message, 'danger')
    console.error(error)
  }

  const loadingCount = ref(0)
  const isLoading = computed(() => loadingCount.value > 0)

  function setUser(nextUser: User) {
    user.value = nextUser
    authState.currentUser = nextUser
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(nextUser))
  }

  function clearUser() {
    user.value = null
    authState.currentUser = null
    sessionStorage.removeItem(SESSION_KEY)
  }

  function restoreSession() {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) {
      clearUser()
      return
    }

    try {
      const savedUser = JSON.parse(raw) as User
      user.value = savedUser
      authState.currentUser = savedUser
    } catch (error) {
      clearUser()
      handleError(error instanceof Error ? error : 'Invalid session data')
    }
  }

  function api<T>(endpoint: string, data?: unknown, options: RequestInit = {}) {
    loadingCount.value++

    return myApi<T>(endpoint, data, options)
      .catch((error) => {
        handleError(error)
        throw error
      })
      .finally(() => {
        loadingCount.value--
      })
  }

  return {
    user,
    setUser,
    clearUser,
    restoreSession,
    messages,
    addMessage,
    handleError,
    isLoading,
    api,
  }
})

export default useSessionStore