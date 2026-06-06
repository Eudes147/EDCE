import { mockChildren, mockClasses, mockModerators, mockTests, mockTeachers, mockNotes } from '~/data/mockData'
import {processNotesAndAverages} from '~/composables/useNote'



export default defineEventHandler(() => {

  const totalStats = {
    totalLengthChildren: mockChildren.length,
    totalLengthClasses: mockClasses.length,
    totalLengthModerators: mockModerators.length,
    totalLengthTeachers: mockTeachers.length,
    totalLengthTests: mockTests.length
  }

  const listStats = {
    listChildren: mockChildren,
    listClasses: mockClasses,
    listModerators: mockModerators,
    listTeachers: mockTeachers,
    listTests: mockTests
  }

  // CHILDREN STATS
  const childrenPerClass = mockClasses.map(classe => {
    const count = mockChildren.filter(child => child.classe === classe.classe).length
    const rate=Number(count/totalStats.totalLengthChildren).toFixed(2)
    return { classe: classe.classe, count: count, rate:rate }
  })
  
  const totalBoy = mockChildren.filter(child => child.sexe === 'Masculin').length
  const totalGirl = mockChildren.filter(child => child.sexe === 'Feminin').length

  const listParentInfos = mockChildren.map(child => {
    const denomination = child.sexeParent === 'Masculin' ? 'Mr' : 'Mme'
    const parentName = child.name.trim().split(' ')[0]
    return { name: `${denomination} ${parentName}`, tel: child.telParent }
  })

  const childrenStats = { childrenPerClass, totalBoy, totalGirl, listParentInfos }

  // TEACHERS STATS
  const teachersStats = {
    teachersAvailable: mockTeachers.filter(t => t.isAvailable).length,
    teachersUnavailable: mockTeachers.filter(t => !t.isAvailable).length,
    teacherMasculin: mockTeachers.filter(t => t.sexe === 'Masculin').length,
    teacherFeminin: mockTeachers.filter(t => t.sexe === 'Feminin').length
  }

  // MODERATORS STATS
  const moderatorsStats = {
    moderatorsAvailable: mockModerators.filter(m => m.isAvailable).length,
    moderatorsUnavailable: mockModerators.filter(m => !m.isAvailable).length,
    moderatorMasculin: mockModerators.filter(m => m.sexe === 'Masculin').length,
    moderatorFeminin: mockModerators.filter(m => m.sexe === 'Feminin').length
  }

  // TESTS STATS
  const testsPerClass = mockClasses.map(classe => {
    const count = mockTests.filter(test => test.classe === classe.classe).length
    return { classe: classe.classe, count: count }
  })

  const testsPerMonth = mockTests.reduce((acc, test) => {
    const month = new Date(test.created_at).toLocaleString('default', { month: 'long' })
    acc[month] = (acc[month] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const testEvaluation = mockTests.filter(test => test.typeTest === 'EVALUATION')
  const testConcours = mockTests.filter(test => test.typeTest === 'CONCOURS')
  const testSundaySchool = mockTests.filter(test => test.typeTest === 'SUNDAY_SCHOOL')

  const testsStats = {
    testsPerClass,
    testsPerMonth,
    testEvaluation: { liste: testEvaluation, count: testEvaluation.length },
    testConcours: { liste: testConcours, count: testConcours.length },
    testSundaySchool: { liste: testSundaySchool, count: testSundaySchool.length }
  }

  // NOTES STATS 
  const notesStats = {
    evaluations: processNotesAndAverages('EVALUATION'),
    sundaySchool: processNotesAndAverages('SUNDAY_SCHOOL'),
    concours: processNotesAndAverages('CONCOURS')
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
})