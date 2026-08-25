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

    // 1. Mappage complet des activités
    const listActivities: Activity[] = (activitiesRes.data || []).map((a: any) => ({
      id: a.id,
      title: a.title,
    }))

    // 2. Mappage complet des relations de participation
    const listParticipantEventActivity: ParticipantEventActivity[] = (participantEventsRes.data || []).map((p: any) => ({
      id: p.id,
      childId: p.child_id,
      eventActivityId: p.event_activity_id,
    }))

    // 3. Mappage complet des événements d'activités
    const listEventActivity: EventActivity[] = (eventActivitiesRes.data || []).map((e: any) => ({
      id: e.id,
      activityId: e.activity_id,
      eventType: e.event_type,
      year: e.year,
    }))

    // 4. Mappage complet des enfants (tous les champs de la table children)
    const listChildren: Child[] = (childrenRes.data || []).map((c: any) => ({
      id: c.id,
      name: c.name,
      classe: c.classe,
      birth_date: c.birth_date,
      tel: c.tel,
      telParent: c.tel_parent,
      sexe: c.sexe,
      nivScolaire: c.niv_scolaire,
      sexeParent: c.sexe_parent,
      quarter: c.quarter,
      adresse: c.adresse,
    }))

    return {
      success: true,
      listActivities,
      listParticipantEventActivity,
      listEventActivity,
      listChildren
    }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || "Erreur lors de la récupération des données de participation aux événements.",
    })
  }
})