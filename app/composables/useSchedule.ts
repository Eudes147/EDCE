// server/utils/scheduleStore.ts

import { mockMonthlySchedule } from '~/data/mockData'
import { useToast } from '~/composables/useToast'

/**
 * Store en mémoire pour les schedules (pour tests/développement)
 * Remplace temporairement la BD Prisma
 */
const toast=useToast()
interface ScheduleData {
  monthKey: string
  status: string
  matrixData: string // JSON stringifié
  createdAt: Date
  updatedAt: Date
}

// Map pour stocker les schedules en mémoire
const scheduleStore = new Map<string, ScheduleData>()

/**
 * Initialiser le store avec les données mockées
 */
export const initializeScheduleStore = () => {
  // Vider le store existant
  scheduleStore.clear()

  // Remplir avec les données mockées
  if (mockMonthlySchedule && mockMonthlySchedule.monthKey) {
    scheduleStore.set(mockMonthlySchedule.monthKey, {
      monthKey: mockMonthlySchedule.monthKey,
      status: mockMonthlySchedule.status =='published' ? 'published' : 'draft',
      matrixData: JSON.stringify(mockMonthlySchedule.rows),
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    console.log(`[ScheduleStore] Initialisé avec ${scheduleStore.size} schedule(s) mockée(s)`)
  }
}

/**
 * Créer ou mettre à jour un schedule (upsert)
 */
export const upsertSchedule = (
  monthKey: string,
  status: string,
  rows: any[]
): ScheduleData => {
  const now = new Date()
  const existing = scheduleStore.get(monthKey)

  const schedule: ScheduleData = {
    monthKey,
    status: status as 'draft' | 'published',
    matrixData: JSON.stringify(rows),
    createdAt: existing ? existing.createdAt : now,
    updatedAt: now,
  }

  scheduleStore.set(monthKey, schedule)
  toast.success(`[ScheduleStore] Upsert: ${monthKey}`)

  return schedule
}

/**
 * Récupérer un schedule par monthKey
 */
export const getSchedule = (monthKey: string): ScheduleData | null => {
  const schedule = scheduleStore.get(monthKey)
  if (schedule) {
    toast.success(`[ScheduleStore] Get: ${monthKey} (trouvé)`)
  } else {
    toast.success(`[ScheduleStore] Get: ${monthKey} (non trouvé)`)
  }
  return schedule || null
}

/**
 * Mettre à jour un schedule (update)
 */
export const updateSchedule = (
  monthKey: string,
  updates: { status?: string; rows?: any[] }
): ScheduleData | null => {
  const existing = scheduleStore.get(monthKey)

  if (!existing) {
    toast.success(`[ScheduleStore] Update: ${monthKey} (non trouvé)`)
    return null
  }

  const updated: ScheduleData = {
    ...existing,
    status: (updates.status as 'draft' | 'published') || existing.status,
    matrixData: updates.rows ? JSON.stringify(updates.rows) : existing.matrixData,
    updatedAt: new Date(),
  }

  scheduleStore.set(monthKey, updated)
  toast.success(`[ScheduleStore] Update: ${monthKey}`)

  return updated
}

/**
 * Supprimer un schedule (optionnel)
 */
export const deleteSchedule = (monthKey: string): boolean => {
  const deleted = scheduleStore.delete(monthKey)
  if (deleted) {
    toast.success(`[ScheduleStore] Delete: ${monthKey}`)
  }
  return deleted
}

/**
 * Obtenir tous les schedules (optionnel)
 */
export const getAllSchedules = (): ScheduleData[] => {
  return Array.from(scheduleStore.values())
}

/**
 * Réinitialiser le store (optionnel)
 */
export const resetScheduleStore = () => {
  scheduleStore.clear()
  toast.success(`[ScheduleStore] Reset complet`)
}

// Initialiser au démarrage
initializeScheduleStore()