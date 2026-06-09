import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  const tokenCookie = useCookie('auth_token')

  // 1. Routes publiques (Accessibles par tout le monde)
  const publicRoutes = ['/', '/login', '/register']

  // 2. TES ROUTES ADMIN (Strictement réservées à l'administrateur)
  const adminOnlyRoutes = [
    '/dashboard',
    '/settings',
    '/classes',
    '/teachers',
    '/seances/admin'
  ]

  // 3. CAS : L'utilisateur n'est pas connecté
  if (!tokenCookie.value) {
    if (!publicRoutes.includes(to.path)) {
      return navigateTo('/login')
    }
    return
  }

  // 4. CAS RECONSTITUTION : Si F5/Refresh, on réhydrate le store depuis le token mocké
  if (tokenCookie.value && !authStore.isAuthentificated) {
    const tokenStr = String(tokenCookie.value)
    if (tokenStr.includes('admin')) {
      authStore.user = { status: 'admin' } as any
    } else if (tokenStr.includes('moderator')) {
      authStore.user = { status: 'moderator' } as any
    } else {
      authStore.user = { status: 'teacher' } as any
    }
    authStore.isAuthentificated = true
    authStore.setPermissions(authStore.userStatus||'teacher')
  }

  // 5. CAS REDIRECTION : Si déjà connecté et qu'on va sur le Login/Register/Index
  if (tokenCookie.value && publicRoutes.includes(to.path)) {
    if (authStore.userStatus === 'admin') {
      return navigateTo('/dashboard')
    } else {
      return navigateTo('/seances/teacher')
    }
  }

  // 6. LE VERROU CENTRALISÉ : Normalisation de la route actuelle
  // (On s'assure qu'elle commence par un slash pour correspondre au tableau)
  const currentPath = to.path.startsWith('/') ? to.path : `/${to.path}`

  // Vérification : est-ce que la route est dans ta liste admin ?
  const isAdminRoute = adminOnlyRoutes.includes(currentPath)
  
  if (isAdminRoute && authStore.userStatus !== 'admin') {
    // Si un prof ou modérateur tente d'aller sur /dashboard, /settings, /classes ou /teachers
    // Il est bloqué et renvoyé sur ses séances !
    return navigateTo('/seances/teacher')
  }
})