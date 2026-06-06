import {defineStore} from 'pinia'
// Import types
import {type User, type Sexe,type UserStatus, type UserPermissions,type LoginCredentials,type RegisterData, type AuthResponse, type AuthState, defaultPermissions } from '~/types/auth'

export const useAuthStore = defineStore('auth',{
  state: (): AuthState=>({
    user: null,
    isAuthentificated: false,
    isInitialized: false,
    isLoading: false,
    permissions: defaultPermissions
  }),
  getters: {
    // User Info
    isAdmin: (state)=>{
      return state.user?.status === "admin"
    },
    userEmail: (state)=>{
      if(!state.user) return ''
      return state.user?.email ?? ""
    },
    userInitials: (state)=>{
      if(!state.user) return '??'
      return `${state.user.last_name[0]}${state.user.first_name[0]}`
    },
    fullName: (state)=>{
      if(!state.user) return ''
      return `${state.user?.last_name} ${state.user?.first_name}`
    },
    userStatus: (state)=>{
      if(!state.user) return null
      return state.user?.status || null
    },
    // Permissions
    canCreateChild: (state)=>{
      return state.permissions?.teacher.canCreateChild ?? false
    },
    canCreateNote: (state)=>{
      return state.permissions?.teacher.canCreateNote ?? false
    },
    canCreateTest: (state)=>{
      return state.permissions?.moderator.canCreateTest ?? false
    },
    canEditNote: (state)=>{
      return state.permissions?.moderator.canEditNote ?? false
    },
    canAccessDashboard: (state)=>{
      return state.permissions?.admin.canAccessDashboard ?? false
    },
    canAttributePermission: (state)=>{
      return state.permissions?.admin.canAttributePermission ?? false
    },
  },
  actions: {
    setAuthData(data: AuthResponse|null){
      if(data) {
        this.user= data.user
        this.permissions=data.permissions
        this.isAuthentificated=true
      }
      else{
        this.clearAuthData()
      }
    },
    setPermissions(status: UserStatus) {
    if (!this.permissions) {
      this.permissions = {
        admin: { canAccessDashboard: false, canAttributePermission: false },
        moderator: { canCreateTest: false, canEditNote: false },
        teacher: { canCreateChild: false, canCreateNote: false }
      }
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
  },
    clearAuthData(){
      this.user= null,
      this.isAuthentificated= false,
      this.isInitialized= false,
      this.permissions= defaultPermissions
    },
    updateUserStatus(user: User, status: UserStatus | "teacher") {
      this.setLoading(true)
      if(this.user?.status=="admin") {
        user.status = status
        return true
      }
      this.setLoading(false)
      return false
    },
    setLoading(loading: boolean | false){
      this.isLoading=loading
    },
    async login(credentials: LoginCredentials):Promise<boolean> {
      return false
    },
    async register(registerData: RegisterData):Promise<boolean> {
      return true
    },
    async logout(){
      return
    }
  }
}) 
