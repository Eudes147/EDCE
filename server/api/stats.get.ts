// server/api/stats.get.ts
import { defineEventHandler, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import { processNotesAndAverages } from '~/utils/processNotes' 

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)

    // 1. RÉCUPÉRATION PARALLÈLE DE TOUTES LES TABLES DEPUIS SUPABASE
    const [
      childrenRes,
      classesRes,
      teachersRes,
      moderatorsRes,
      testsRes,
      notesRes,
      seancesRes,
      activitiesRes
    ] = await Promise.all([
      client.from('children').select('*'),
      client.from('classes').select('*'),
      client.from('teachers').select('*'),
      client.from('moderators').select('*'),
      client.from('tests').select('*'),
      client.from('notes').select('*'),
      client.from('seances').select('*'),
      client.from('activities').select('*')
    ])

    if (childrenRes.error) throw createError({ statusCode: 400, statusMessage: childrenRes.error.message })
    if (classesRes.error) throw createError({ statusCode: 400, statusMessage: classesRes.error.message })
    if (teachersRes.error) throw createError({ statusCode: 400, statusMessage: teachersRes.error.message })
    if (moderatorsRes.error) throw createError({ statusCode: 400, statusMessage: moderatorsRes.error.message })
    if (testsRes.error) throw createError({ statusCode: 400, statusMessage: testsRes.error.message })
    if (notesRes.error) throw createError({ statusCode: 400, statusMessage: notesRes.error.message })
    if (seancesRes.error) throw createError({ statusCode: 400, statusMessage: seancesRes.error.message })
    if (activitiesRes.error) throw createError({ statusCode: 400, statusMessage: activitiesRes.error.message })

    const listChildren = (childrenRes.data || []).map((c:any)=>({
      id: c.id,
      classe: c.classe,
      name: c.name,
      birth_date: c.birth_date,
      tel: c.tel,
      telParent: c.tel_parent,
      sexe: c.sexe,
      sexeParent: c.sexe_parent,
      nivScolaire: c.niv_scolaire,
      adresse: c.adresse,
      quarter: c.quarter,
      created_at: c.created_at
    }))
    const listClasses = classesRes.data || []
    const listTeachers = (teachersRes.data || []).map((t: any) => ({
      ...t,
      isAvailable: t.is_available ?? t.isAvailable
    }))
    const listModerators = (moderatorsRes.data || []).map((m: any) => ({
      ...m,
      isAvailable: m.is_available ?? m.isAvailable
    }))
    
    const listTests = (testsRes.data || []).map((t: any) => ({
      id: t.id,
      titleTest: t.title_test,
      classe: t.classe,
      typeTest: t.type_test,
      sujetTest: t.sujet_test,
      correctionTest: t.correction_test,
      authorId: t.author_id,
      created_at: t.created_at
    }))

    const listNotes = (notesRes.data || []).map((n: any) => ({
      id: n.id,
      childId: n.child_id,
      testId: n.test_id,
      note: Number(n.note),
      created_at: n.created_at
    }))

    const listSeances = (seancesRes.data || []).map((s: any) => ({
      id: s.id,
      title: s.title,
      type: s.type,
      classe: s.classe,
      authorId: s.author_id,
      supervisorId: s.supervisor_id,
      created_at: s.created_at
    }))

    // Utilisation directe des activités sans modification inutile
    const listActivities = activitiesRes.data || []

    // 2. STATS GLOBALES
    const totalStats = {
      totalLengthChildren: listChildren.length,
      totalLengthClasses: listClasses.length,
      totalLengthModerators: listModerators.length,
      totalLengthTeachers: listTeachers.length,
      totalLengthTests: listTests.length,
      totalLengthSeances: listSeances.length,
      totalLengthActivities: listActivities.length
    }

    const listStats = {
      listChildren,
      listClasses,
      listModerators,
      listTeachers,
      listTests,
      listNotes,
      listSeances
    }

    // 3. STATS ENFANTS
    let totalBoy = 0
    let totalGirl = 0

    const listParentInfos = listChildren.map((child: any) => {
      if (child.sexe === 'Masculin') totalBoy++
      else if (child.sexe === 'Feminin') totalGirl++

      const denomination = child.sexeParent === 'Masculin' ? 'Mr' : 'Mme'
      const parentName = child.name ? child.name.trim().split(' ')[0] : ''
      return { name: `${denomination} ${parentName}`, tel: child.telParent }
    })

    const childrenPerClass = listClasses.map((classe: any) => {
      const count = listChildren.filter((child: any) => child.classe === classe.classe).length
      const rate = listChildren.length > 0 ? Number((count / listChildren.length).toFixed(2)) : 0
      return { classe: classe.classe, count, rate }
    })

    const childrenStats = { childrenPerClass, totalBoy, totalGirl, listParentInfos }

    // 4. STATS ENSEIGNANTS
    const teachersStats = listTeachers.reduce((acc: any, t: any) => {
      if (t.isAvailable) acc.teachersAvailable++
      else acc.teachersUnavailable++
      if (t.sexe === 'Masculin') acc.teacherMasculin++
      else if (t.sexe === 'Feminin') acc.teacherFeminin++
      return acc
    }, { teachersAvailable: 0, teachersUnavailable: 0, teacherMasculin: 0, teacherFeminin: 0 })

    // 5. STATS MODÉRATEURS
    const moderatorsStats = listModerators.reduce((acc: any, m: any) => {
      if (m.isAvailable) acc.moderatorsAvailable++
      else acc.moderatorsUnavailable++
      if (m.sexe === 'Masculin') acc.moderatorMasculin++
      else if (m.sexe === 'Feminin') acc.moderatorFeminin++
      return acc
    }, { moderatorsAvailable: 0, moderatorsUnavailable: 0, moderatorMasculin: 0, moderatorFeminin: 0 })

    // 6. STATS TESTS
    const testsPerClass = listClasses.map((classe: any) => {
      const count = listTests.filter((test: any) => test.classe === classe.classe).length
      return { classe: classe.classe, count }
    })

    const testsPerMonth: Record<string, number> = {}
    const testEvaluation: any[] = []
    const testConcours: any[] = []
    const testSundaySchool: any[] = []

    listTests.forEach((test: any) => {
      const month = new Date(test.created_at).toLocaleString('fr-FR', { month: 'long' }).toLowerCase()
      testsPerMonth[month] = (testsPerMonth[month] || 0) + 1
      if (test.typeTest === 'EVALUATION') testEvaluation.push(test)
      else if (test.typeTest === 'CONCOURS') testConcours.push(test)
      else if (test.typeTest === 'SUNDAY_SCHOOL') testSundaySchool.push(test)
    })

    const testsStats = {
      testsPerClass,
      testsPerMonth,
      testEvaluation: { liste: testEvaluation, count: testEvaluation.length },
      testConcours: { liste: testConcours, count: testConcours.length },
      testSundaySchool: { liste: testSundaySchool, count: testSundaySchool.length }
    }

    // 7. STATS NOTES
    const notesStats = {
      evaluations: processNotesAndAverages('EVALUATION', listNotes, listTests),
      sundaySchool: processNotesAndAverages('SUNDAY_SCHOOL', listNotes, listTests),
      concours: processNotesAndAverages('CONCOURS', listNotes, listTests)
    }

    return {
      totalStats,
      listStats,
      childrenStats,
      teachersStats,
      moderatorsStats,
      testsStats,
      notesStats
    }

  } catch (error: any) {
    console.error("Erreur critique dans le générateur de statistiques :", error)
    throw createError({ 
      statusCode: error.statusCode || 500, 
      statusMessage: error.statusMessage || 'Erreur serveur lors du calcul des tableaux de statistiques.' 
    })
  }
})