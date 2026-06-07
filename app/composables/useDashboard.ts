import type { DashboardStats } from '~/types/stats'

export const useDashboard = () => {
  // CORRECTION : On indique à Nuxt que les données reçues respectent l'interface DashboardStats
  const { data: stats, pending, error, refresh } = useFetch<DashboardStats>('/api/stats', {
    baseURL: '/',
    lazy: true
  })

  return {
    stats,
    pending,
    error,
    refresh
  }
}