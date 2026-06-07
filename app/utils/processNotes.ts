import { mockNotes, mockTests } from '~/data/mockData'
import type { Child, YearGroupedAverages, YearGroupedNotes } from '~/types/child'

export function processNotesAndAverages(typeFilter: 'EVALUATION' | 'SUNDAY_SCHOOL' | 'CONCOURS') {
  const listNotes: YearGroupedNotes = {}
  const moyenne: YearGroupedAverages = {}

  mockNotes.forEach((note) => {
    const associatedTest = mockTests.find(t => t.id === note.testId)
    if (!associatedTest || associatedTest.typeTest !== typeFilter) return

    const year = new Date(note.created_at).getFullYear().toString()

    if (!listNotes[year]) listNotes[year] = []

    const childEntry = listNotes[year].find(item => item.childId === note.childId)

    if (childEntry) {
      childEntry.notes.push(note.note)
    } else {
      listNotes[year].push({
        childId: note.childId,
        notes: [note.note]
      })
    }
  })

  Object.keys(listNotes).forEach((year) => {
    if (listNotes[year]) {
      moyenne[year] = listNotes[year].map((childData) => {
        const total = childData.notes.reduce((sum, n) => sum + n, 0)
        return {
          childId: childData.childId,
          moyenne: Number((total / childData.notes.length).toFixed(2))
        }
      })
    }
  })

  return { listNotes, moyenne }
}