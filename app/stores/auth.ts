import { defineStore } from 'pinia'
// Import types
import { 
  type User, 
  type UserStatus, 
  type LoginCredentials, 
  type RegisterData, 
  type AuthResponse, 
  type AuthState, 
  defaultPermissions 
} from '~/types/auth'

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isAuthentificated: false,
    isInitialized: false,
    isLoading: false,
    permissions: JSON.parse(JSON.stringify(defaultPermissions)) // Deep copy pour éviter les mutations partagées
  }),

  getters: {
    isAdmin: (state) => state.user?.status === "admin",
    userEmail: (state) => state.user?.email ?? "",
    userInitials: (state) => {
      if (!state.user) return '??'
      // Sécurité si les champs sont vides
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
    canCreateChild: (state) => state.permissions?.teacher.canCreateChild ?? false,
    canCreateNote: (state) => state.permissions?.teacher.canCreateNote ?? false,
    canCreateTest: (state) => state.permissions?.moderator.canCreateTest ?? false,
    canEditNote: (state) => state.permissions?.moderator.canEditNote ?? false,
    canAccessDashboard: (state) => state.permissions?.admin.canAccessDashboard ?? false,
    canAttributePermission: (state) => state.permissions?.admin.canAttributePermission ?? false,
  },

  actions: {
    setAuthData(data: AuthResponse | null) {
      if (data) {
        this.user = data.user
        this.permissions = data.permissions
        this.isAuthentificated = true
        this.isInitialized = true
      } else {
        this.clearAuthData()
      }
    },

    setPermissions(status: UserStatus) {
      // On repart d'une structure propre et vidée
      this.permissions = {
        admin: { canAccessDashboard: false, canAttributePermission: false },
        moderator: { canCreateTest: false, canEditNote: false },
        teacher: { canCreateChild: false, canCreateNote: false }
      }

      // Attribution stricte selon le rôle
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
    },

    clearAuthData() {
      const authCookie = useCookie('auth_token')
      authCookie.value = null // Supprime le cookie d'authentification

      this.user = null
      this.isAuthentificated = false
      this.isInitialized = false
      this.permissions = JSON.parse(JSON.stringify(defaultPermissions))
    },

    updateUserStatus(user: User, status: UserStatus) {
      this.setLoading(true)
      if (this.user?.status === "admin") {
        user.status = status
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
        // Envoi des identifiants au serveur Nitro
        const response = await $fetch<{ token: string; user: User }>('/api/auth/login', {
          method: 'POST',
          body: credentials
        })

        // Stockage du token temporaire dans les cookies Nuxt
        const authCookie = useCookie('auth_token', { maxAge: 60 * 60 * 24 }) // Expire en 1 jour
        authCookie.value = response.token

        // Initialisation des données de l'utilisateur
        this.user = response.user
        this.isAuthentificated = true
        this.isInitialized = true
        
        // Calcul et mise en place des permissions associées à son rôle
        this.setPermissions(response.user.status)

        return true
      } catch (error: any) {
        // Renvoie l'erreur brute pour qu'elle soit attrapée par le composant Vue
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
        // Envoi des données d'inscription au serveur Nitro
        const response = await $fetch<{ token: string; user: User }>('/api/auth/register', {
          method: 'POST',
          body: registerData
        })

        // Optionnel : Connecter automatiquement l'utilisateur après inscription
        const authCookie = useCookie('auth_token', { maxAge: 60 * 60 * 24 })
        authCookie.value = response.token

        this.user = response.user
        this.isAuthentificated = true
        this.isInitialized = true
        this.setPermissions(response.user.status)

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
        // Si tu veux notifier ton serveur de la déconnexion
        // await $fetch('/api/auth/logout', { method: 'POST' })
      } catch (error) {
        console.error("Erreur lors de la déconnexion serveur", error)
      } finally {
        // Quoi qu'il arrive, on nettoie le local et on redirige
        this.clearAuthData()
        this.setLoading(false)
        await navigateTo('/login')
      }
    }
  }
})