import { seancesState } from './seances/index.get'
import { notesState } from './notes/index.get'
import { childrenState } from './children/index.get'
import { teachersState } from './teachers/index.get'
import { moderatorsState } from './moderators/index.get'
import { testsState } from './tests/index.get'
import {state} from './activities/index.get'

import { processNotesAndAverages } from '~/utils/processNotes' 

export default defineEventHandler(() => {
  try {
    // 1. RÉCUPÉRATION DES ÉTATS EN MÉMOIRE VIVE DU SERVEUR
    // Sécurisation avec un repli sur tableau vide pour éviter tout crash au démarrage
    const listChildren = childrenState?.children || []
    const listClasses = childrenState?.classes || []
    const listTeachers = teachersState?.teachers || []
    const listModerators = moderatorsState?.moderators || []
    const listTests = testsState?.tests || []
    const listNotes = notesState?.notes || []
    const listSeances = seancesState?.seances || []
    const listActivities = state?.activities || []


    // 2. STATS GLOBALES TOTALEMENT DYNAMIQUES
    const totalStats = {
      totalLengthChildren: listChildren.length,
      totalLengthClasses: listClasses.length,
      totalLengthModerators: listModerators.length,
      totalLengthTeachers: listTeachers.length,
      totalLengthTests: listTests.length,
      totalLengthSeances: listSeances.length,
      totalLengthActivities: listActivities.length
    }

    // Renvoi des listes à jour au besoin (optionnel pour débogage frontend)
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

    const listParentInfos = listChildren.map(child => {
      if (child.sexe === 'Masculin') totalBoy++
      else if (child.sexe === 'Feminin') totalGirl++

      const denomination = child.sexeParent === 'Masculin' ? 'Mr' : 'Mme'
      const parentName = child.name.trim().split(' ')[0]
      return { name: `${denomination} ${parentName}`, tel: child.telParent }
    })

    const childrenPerClass = listClasses.map(classe => {
      const count = listChildren.filter(child => child.classe === classe.classe).length
      const rate = listChildren.length > 0 ? Number((count / listChildren.length).toFixed(2)) : 0
      return { classe: classe.classe, count, rate }
    })

    const childrenStats = { childrenPerClass, totalBoy, totalGirl, listParentInfos }

    // 4. STATS ENSEIGNANTS
    const teachersStats = listTeachers.reduce((acc, t) => {
      if (t.isAvailable) acc.teachersAvailable++
      else acc.teachersUnavailable++
      if (t.sexe === 'Masculin') acc.teacherMasculin++
      else if (t.sexe === 'Feminin') acc.teacherFeminin++
      return acc
    }, { teachersAvailable: 0, teachersUnavailable: 0, teacherMasculin: 0, teacherFeminin: 0 })

    // 5. STATS MODÉRATEURS
    const moderatorsStats = listModerators.reduce((acc, m) => {
      if (m.isAvailable) acc.moderatorsAvailable++
      else acc.moderatorsUnavailable++
      if (m.sexe === 'Masculin') acc.moderatorMasculin++
      else if (m.sexe === 'Feminin') acc.moderatorFeminin++
      return acc
    }, { moderatorsAvailable: 0, moderatorsUnavailable: 0, moderatorMasculin: 0, moderatorFeminin: 0 })

    // 6. STATS TESTS
    const testsPerClass = listClasses.map(classe => {
      const count = listTests.filter(test => test.classe === classe.classe).length
      return { classe: classe.classe, count }
    })

    const testsPerMonth: Record<string, number> = {}
    const testEvaluation: any[] = []
    const testConcours: any[] = []
    const testSundaySchool: any[] = []

    listTests.forEach(test => {
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

    // 7. STATS NOTES PROPULSÉES PAR LES GRILLES DE NOTES EN MÉMOIRE
    const notesStats = {
      evaluations: processNotesAndAverages('EVALUATION', listNotes, listTests),
      sundaySchool: processNotesAndAverages('SUNDAY_SCHOOL', listNotes, listTests),
      concours: processNotesAndAverages('CONCOURS', listNotes, listTests)
    }

    // Envoi de la grosse charge utile calculée à la volée
    return {
      totalStats,
      listStats,
      childrenStats,
      teachersStats,
      moderatorsStats,
      testsStats,
      notesStats
    }

  } catch (error) {
    console.error("Erreur critique dans le générateur de statistiques :", error)
    throw createError({ statusCode: 500, statusMessage: 'Erreur serveur lors du calcul des tableaux de statistiques.' })
  }
})