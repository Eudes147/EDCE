import { useToast } from '~/composables/useToast' // Assurez-vous que le chemin est correct
const toast = useToast()
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { token, password } = body

  if (!token || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing token or password',
    })
  }

  if (password.length < 8) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Password must be at least 8 characters long',
    })
  }

  await new Promise((resolve) => setTimeout(resolve, 1000))

  console.log('\n======================================================')
  toast.success('Le mot de passe a été mis à jour via le lien e-mail !')
  toast.info('Token validé :', token)
  console.log('======================================================\n')

  return {
    success: true,
    message: 'Password reset successfully',
  }
})