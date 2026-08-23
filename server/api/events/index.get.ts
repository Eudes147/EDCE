// server/api/events/index.get.ts
import { defineEventHandler, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import type { Activity, EventActivity } from '~/types/activity'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)

    // 1. Récupération des relations event_activities et des activités depuis Supabase
    const { data: listActivityAtEvent, error: eventsError } = await client
      .from('event_activities')
      .select('*')

    if (eventsError) {
      throw createError({ statusCode: 400, statusMessage: eventsError.message })
    }

    const { data: listActivities, error: activitiesError } = await client
      .from('activities')
      .select('*')

    if (activitiesError) {
      throw createError({ statusCode: 400, statusMessage: activitiesError.message })
    }

    // Mapping BDD -> Front pour event_activities
    const events: EventActivity[] = (listActivityAtEvent || []).map((e: any) => ({
      id: e.id,
      activityId: e.activity_id,
      eventType: e.event_type,
      year: e.year
    }))

    const activities = (listActivities || []) as Activity[]

    // 2. Liste unique des types d'événements
    const listEvent = [...new Set(events.map(ev => ev.eventType))]

    // 3. Regroupement des activités par Année
    const groupActivityperYear = events.reduce((acc: Record<string, Activity[]>, ev) => {
      const activityFound = activities.find(a => a.id === ev.activityId)
      if (activityFound) {
        if (!acc[ev.year]) acc[ev.year] = []
        if (!acc[ev.year]?.some(a => a.id === activityFound.id)) {
          acc[ev.year]?.push(activityFound)
        }
      }
      return acc
    }, {})

    // 4. Regroupement des activités par Type d'Événement
    const groupActivityperEvent = listEvent.reduce((acc: Record<string, Activity[]>, eventType) => {
      const eventsFound = events.filter(ea => ea.eventType === eventType)
      const matchedActivities = eventsFound
        .map(ea => activities.find(a => a.id === ea.activityId))
        .filter((a): a is Activity => !!a)

      acc[eventType] = matchedActivities
      return acc
    }, {})

    return {
      listActivityAtEvent: events,
      listEvent,
      groupActivityperYear,
      groupActivityperEvent
    }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || "Erreur lors de la récupération des événements.",
    })
  }
})