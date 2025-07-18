// stores/auth.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useCookie } from '#app'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const currentUser = ref(null)
  const token = useCookie('auth_token')

  // Manual JWT decoding function
  function decodeToken(token) {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
      return JSON.parse(jsonPayload)
    } catch (error) {
      console.error('Error decoding token:', error)
      return null
    }
  }

  // Initialize authentication state from the cookie or localStorage
  function initializeAuth() {
    // Check the cookie for token first
    if (token.value) {
      const decodedUser = decodeToken(token.value)
      if (decodedUser) {
        currentUser.value = decodedUser
        isAuthenticated.value = true

        // Sync to localStorage
        localStorage.setItem('auth_token', token.value)
        localStorage.setItem('userDetails', JSON.stringify(decodedUser))
      } else {
        token.value = null
      }
    }
    // Fall back to localStorage if the cookie is empty
    else {
      const localToken = localStorage.getItem('auth_token')
      const localUserDetails = localStorage.getItem('userDetails')

      if (localToken && localUserDetails) {
        const decodedUser = decodeToken(localToken)
        if (decodedUser) {
          currentUser.value = JSON.parse(localUserDetails)
          isAuthenticated.value = true
          token.value = localToken // Sync back to cookie
        }
      }
    }
  }

  async function login(credentials) {
    try {
      const data = await $fetch('/api/users/login', {
        method: 'POST',
        body: credentials,
      })

      if (data && data.token) {
        token.value = data.token // Save JWT in cookie
        const decodedUser = decodeToken(data.token)
        currentUser.value = decodedUser
        isAuthenticated.value = true

        // Save to localStorage
        localStorage.setItem('auth_token', data.token)
        localStorage.setItem('userDetails', JSON.stringify(decodedUser))
        return true
      } else {
        console.error('Login failed: No data received')
        return false
      }
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  function logout() {
    // Clear both cookie and localStorage
    token.value = null
    currentUser.value = null
    isAuthenticated.value = false
    localStorage.removeItem('auth_token')
    localStorage.removeItem('userDetails')
  }

  return { isAuthenticated, currentUser, login, logout, initializeAuth }
})
