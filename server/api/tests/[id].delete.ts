import { defineEventHandler, createError } from 'h3'

export default defineEventHandler(async (event) => {
  // 1. Récupérer l'ID passé dans l'URL
  const testId = event.context.params?.id

  if (!testId) {
    throw createError({
      statusCode: 400,
      statusMessage: "L'identifiant du test est manquant.",
    })
  }

  try {
    // TODO: Insère ici ta logique de suppression en base de données
    // Exemple avec un ORM fictif :
    // await db.test.delete({
    //   where: { id: testId }
    // })

    return {
      success: true,
      message: `Le test avec l'ID ${testId} a été supprimé avec succès.`
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Erreur lors de la suppression du test sur le serveur.",
    })
  }
})