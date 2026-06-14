import { notesState } from '../notes/index.get'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  const index = notesState.notes.findIndex(note => note.id === id)
  if (index === -1) {
    throw createError({ statusCode: 404, message: 'Note introuvable.' })
  }

  try{
    if(id != undefined)
    notesState.notes[index] = {
    id: id,
    childId: body.childId,
    testId: body.testid,
    note: Number(body.note),
    created_at: new Date().toISOString()
  }
  return { success: true }
  }
  catch(err){
    throw createError({message: "Id de la note introuvable"})
  }
  
})