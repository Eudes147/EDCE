// server/api/participants/events.get.ts
import { defineEventHandler, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import type { ParticipantEventActivity } from '~/types/participant'
import type { Activity, EventActivity } from '~/types/activity'
import type { Child } from '~/types/child'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)

    // Exécution des requêtes en parallèle
    const [activitiesRes, participantEventsRes, eventActivitiesRes, childrenRes] = await Promise.all([
      client.from('activities').select('*'),
      client.from('participant_event_activities').select('*'),
      client.from('event_activities').select('*'),
      client.from('children').select('*')
    ])

    if (activitiesRes.error) throw createError({ statusCode: 400, statusMessage: activitiesRes.error.message })
    if (participantEventsRes.error) throw createError({ statusCode: 400, statusMessage: participantEventsRes.error.message })
    if (eventActivitiesRes.error) throw createError({ statusCode: 400, statusMessage: eventActivitiesRes.error.message })
    if (childrenRes.error) throw createError({ statusCode: 400, statusMessage: childrenRes.error.message })

    // Normalisation des champs snake_case vers camelCase
    const listParticipantEventActivity: ParticipantEventActivity[] = (participantEventsRes.data || []).map((p: any) => ({
      id: p.id,
      childId: p.child_id,
      eventActivityId: p.event_activity_id
    }))

    return {
      listActivities: (activitiesRes.data || []) as Activity[],
      listParticipantEventActivity,
      listEventActivity: (eventActivitiesRes.data || []) as EventActivity[],
      listChildren: (childrenRes.data || []) as Child[]
    }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || "Erreur lors de la récupération des données de participation aux événements.",
    })
  }
})