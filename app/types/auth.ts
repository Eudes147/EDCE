// Interface User
export interface User {
  id: string
  first_name: string
  last_name: string
  email: string
  password: string
  tel: string
  sexe: Sexe
  status: UserStatus
  quarter?: string
  birth_date: Date
  created_at: string
}
// Sexe
export type Sexe = "MASCULIN" | "FEMININ"

export type UserStatus="teacher" | "moderator" | "admin"

export interface UserPermissions {
  teacher: {
    canCreateChild: boolean
    canCreateNote: boolean
  },
  moderator: {
    canCreateTest: boolean
    canEditNote: boolean
  },
  admin: {
    canAttributePermission: boolean
    canAccessDashboard: boolean
  }
}
// Permissions par défaut des users non connectés
export const defaultPermissions: UserPermissions = {
  teacher: {
    canCreateChild: false,
    canCreateNote: false
  },
  moderator: {
    canCreateTest: false,
    canEditNote: false
  },
  admin: {
    canAttributePermission: false,
    canAccessDashboard: false
  }
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  first_name: string
  last_name: string
  email: string
  password: string
}

// Etat de de l'authentification
export interface AuthState {
  user: User | null
  isAuthentificated: boolean
  isLoading: boolean
  isInitialized: boolean
  permissions: UserPermissions | null
}

export interface AuthResponse {
  user: User
  isAuthentificated: boolean
  isInitialized: boolean
  permissions: UserPermissions
}