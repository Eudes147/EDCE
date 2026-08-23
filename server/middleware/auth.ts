// server/middleware/auth.ts
import { defineEventHandler, createError, getHeader } from 'h3'

export default defineEventHandler((event) => {
  const authHeader = getHeader(event, 'authorization')

  const config = useRuntimeConfig(event)
  const USERNAME = config.basicAuthUser
  const PASSWORD = config.basicAuthPass

  if (!USERNAME || !PASSWORD) {
    event.node.res.setHeader('WWW-Authenticate', 'Basic realm="Configuration Manquante"')
    throw createError({ statusCode: 401, message: 'Serveur non configuré' })
  }

  if (authHeader && authHeader.startsWith('Basic ')) {
    const base64Credentials = authHeader.split(' ')[1]
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii')
    const [username, password] = credentials.split(':')

    if (username === USERNAME && password === PASSWORD) {
      return 
    }
  }

  event.node.res.setHeader('WWW-Authenticate', 'Basic realm="Zone Protegee Nuxt"')
  throw createError({
    statusCode: 401,
    message: 'Accès non autorisé'
  })
})