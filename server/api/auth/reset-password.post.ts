export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { token, password } = body

  if (!token || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Le jeton (token) ou le mot de passe est manquant.',
    })
  }

  if (password.length < 8) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Le mot de passe doit contenir au moins 8 caractères.',
    })
  }

  // Simulation du délai réseau
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // CORRECTION : Remplacement du useToast par des console.log serveur standard
  console.log('\n======================================================')
  console.log('✅ MOT DE PASSE MIS À JOUR AVEC SUCCÈS')
  console.log('Token validé et consommé :', token)
  console.log('======================================================\n')

  return {
    success: true,
    message: 'Le mot de passe a été réinitialisé avec succès.',
  }
})