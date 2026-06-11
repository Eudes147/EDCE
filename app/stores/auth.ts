import { defineStore } from 'pinia'
// Import types
import { 
  type User, 
  type UserStatus, 
  type LoginCredentials, 
  type RegisterData, 
  type AuthResponse, 
  type AuthState, 
  defaultPermissions,
  type UserPermissions,
} from '~/types/auth'

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => {
    // 🍪 Initialisation des cookies Nuxt pour la persistance (SSR-friendly)
    const userCookie = useCookie<User | null>('auth_user')
    const permissionsCookie = useCookie<any>('auth_permissions')
    const isAuthCookie = useCookie<boolean>('auth_is_authenticated')

    return {
      // On récupère la valeur du cookie, sinon on remet à l'état par défaut
      user: userCookie.value || null,
      isAuthentificated: isAuthCookie.value || false,
      isInitialized: !!userCookie.value,
      isLoading: false,
      permissions: permissionsCookie.value || JSON.parse(JSON.stringify(defaultPermissions))
    }
  },

  getters: {
    isAdmin: (state) => state.user?.status === "admin",
    userEmail: (state) => state.user?.email ?? "",
    userInitials: (state) => {
      if (!state.user) return '??'
      const last = state.user.last_name?.[0] ?? ''
      const first = state.user.first_name?.[0] ?? ''
      return `${last}${first}`.toUpperCase()
    },
    fullName: (state) => {
      if (!state.user) return ''
      return `${state.user.last_name} ${state.user.first_name}`
    },
    userStatus: (state) => state.user?.status || null,

    // Permissions dynamiques basées sur l'état des permissions
    canCreateChild: (state) => state.permissions?.teacher?.canCreateChild ?? false,
    canCreateNote: (state) => state.permissions?.teacher?.canCreateNote ?? false,
    canCreateTest: (state) => state.permissions?.moderator?.canCreateTest ?? false,
    canEditNote: (state) => state.permissions?.moderator?.canEditNote ?? false,
    canAccessDashboard: (state) => state.permissions?.admin?.canAccessDashboard ?? false,
    canAttributePermission: (state) => state.permissions?.admin?.canAttributePermission ?? false,
  },

  actions: {
    // Synchronise l'état local Pinia avec les Cookies Nuxt
    saveStateToCookies() {
      const maxAge = 60 * 60 * 24 // Durée de 1 jour

      const userCookie = useCookie<User | null>('auth_user', { maxAge })
      const permissionsCookie = useCookie<any>('auth_permissions', { maxAge })
      const isAuthCookie = useCookie<boolean>('auth_is_authenticated', { maxAge })

      userCookie.value = this.user
      permissionsCookie.value = this.permissions
      isAuthCookie.value = this.isAuthentificated
    },

    setAuthData(data: AuthResponse | null) {
      if (data) {
        this.user = data.user
        this.permissions = data.permissions
        this.isAuthentificated = true
        this.isInitialized = true
        this.saveStateToCookies()
      } else {
        this.clearAuthData()
      }
    },

    setPermissions(status: UserStatus) {
      this.permissions = {
        admin: { canAccessDashboard: false, canAttributePermission: false },
        moderator: { canCreateTest: false, canEditNote: false },
        teacher: { canCreateChild: false, canCreateNote: false }
      }

      if (status === "admin") {
        this.permissions.admin.canAccessDashboard = true
        this.permissions.admin.canAttributePermission = true
      } 
      else if (status === "moderator") {
        this.permissions.moderator.canCreateTest = true
        this.permissions.moderator.canEditNote = true
      } 
      else if (status === "teacher") {
        this.permissions.teacher.canCreateChild = true
        this.permissions.teacher.canCreateNote = true
      }

      // On sauvegarde l'état mis à jour des permissions dans les cookies
      const permissionsCookie = useCookie<UserPermissions>('auth_permissions')
      permissionsCookie.value = this.permissions
    },

    clearAuthData() {
      // Suppression de tous les cookies d'authentification
      const authCookie = useCookie('auth_token')
      const userCookie = useCookie('auth_user')
      const permissionsCookie = useCookie('auth_permissions')
      const isAuthCookie = useCookie('auth_is_authenticated')

      authCookie.value = null
      userCookie.value = null
      permissionsCookie.value = null
      isAuthCookie.value = null

      // Réinitialisation de l'état
      this.user = null
      this.isAuthentificated = false
      this.isInitialized = false
      this.permissions = JSON.parse(JSON.stringify(defaultPermissions))
    },

    updateUserStatus(user: User, status: UserStatus) {
      this.setLoading(true)
      if (this.user?.status === "admin") {
        user.status = status
        
        // Si l'admin modifie son propre statut, on synchronise les cookies
        if (this.user.id === user.id) {
          this.user.status = status
          this.setPermissions(status)
          this.saveStateToCookies()
        }

        this.setLoading(false)
        return true
      }
      this.setLoading(false)
      return false
    },

    setLoading(loading: boolean) {
      this.isLoading = loading
    },

    // ==========================================
    // ACTION : LOGIN (Connexion)
    // ==========================================
    async login(credentials: LoginCredentials): Promise<boolean> {
      this.setLoading(true)
      try {
        const response = await $fetch<{ token: string; user: User }>('/api/auth/login', {
          method: 'POST',
          body: credentials
        })

        // 1. Stockage du token
        const authCookie = useCookie('auth_token', { maxAge: 60 * 60 * 24 })
        authCookie.value = response.token

        // 2. Initialisation de l'état local
        this.user = response.user
        this.isAuthentificated = true
        this.isInitialized = true
        
        // 3. Calcul des permissions
        this.setPermissions(response.user.status)

        // 4. Persistence des données utilisateur
        this.saveStateToCookies()

        return true
      } catch (error: any) {
        throw new Error(error.data?.message || error.statusMessage || "Impossible de se connecter.")
      } finally {
        this.setLoading(false)
      }
    },

    // ==========================================
    // ACTION : REGISTER (Inscription)
    // ==========================================
    async register(registerData: RegisterData): Promise<boolean> {
      this.setLoading(true)
      try {
        const response = await $fetch<{ token: string; user: User }>('/api/auth/register', {
          method: 'POST',
          body: registerData
        })

        const authCookie = useCookie('auth_token', { maxAge: 60 * 60 * 24 })
        authCookie.value = response.token

        this.user = response.user
        this.isAuthentificated = true
        this.isInitialized = true
        this.setPermissions(response.user.status)
        
        // Persistence des données utilisateur après inscription
        this.saveStateToCookies()

        return true
      } catch (error: any) {
        throw new Error(error.data?.message || error.statusMessage || "Échec de l'inscription.")
      } finally {
        this.setLoading(false)
      }
    },

    // ==========================================
    // ACTION : LOGOUT (Déconnexion)
    // ==========================================
    async logout() {
      this.setLoading(true)
      try {
        // Envoi optionnel au serveur
        // await $fetch('/api/auth/logout', { method: 'POST' })
      } catch (error) {
        console.error("Erreur lors de la déconnexion serveur", error)
      } finally {
        this.clearAuthData()
        this.setLoading(false)
        await navigateTo('/login')
      }
    },
     initializeFromCookies() {
    const userCookie = useCookie<User | null>('auth_user')
    const permissionsCookie = useCookie<any>('auth_permissions')
    const isAuthCookie = useCookie<boolean>('auth_is_authenticated')

    if (userCookie.value) {
      this.user = userCookie.value
      this.isAuthentificated = isAuthCookie.value || false
      this.isInitialized = true
      this.permissions = permissionsCookie.value || JSON.parse(JSON.stringify(defaultPermissions))
    }
  },
  }
})