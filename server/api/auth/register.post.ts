import { usersState } from '../teachers/index.get' // Importation du state persistant en mémoire
import type { User } from '~/types/auth'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // Harmonisation : Accepte le camelCase du front ou le snake_case
    const first_name = body.firstName || body.first_name
    const last_name = body.lastName || body.last_name
    const email = body.email
    const sexe = body.sexe
    const password = body.password

    // 1. Validation des champs obligatoires (incluant désormais le sexe)
    if (!first_name || !last_name || !email || !sexe || !password) {
      throw createError({
        statusCode: 400,
        message: 'Tous les champs requis doivent être remplis (Nom, Prénom, Genre, E-mail, Mot de passe).',
      })
    }

    // 2. Vérification si l'adresse e-mail est déjà prise dans notre state global
    const emailExists = usersState.users.some((u) => u.email.toLowerCase() === email.toLowerCase())
    if (emailExists) {
      throw createError({
        statusCode: 409,
        message: 'Cette adresse e-mail est déjà utilisée par un autre compte.',
      })
    }

    // 3. Construction du nouvel utilisateur
    const newUser: User = {
      id: `user-${Math.random().toString(36).substring(2, 11)}`,
      first_name,
      last_name,
      email: email.toLowerCase(),
      password: password, 
      tel: body.tel || '+225 00 00 00 00',
      sexe: sexe, // Reçoit directement 'Masculin' ou 'Feminin' envoyé par le select
      status: 'teacher', // Rôle de départ par défaut
      quarter: body.quarter || undefined, 
      birth_date: body.birth_date ? new Date(body.birth_date) : new Date('2000-01-01'), 
      created_at: new Date().toISOString()
    }

    // 4. On pousse dans le tableau centralisé (pour que useTeacher() le détecte au prochain fetch)
    usersState.users.push(newUser)

    // 5. On extrait le mot de passe avant de renvoyer le résultat
    const { password: _, ...userWithoutPassword } = newUser

    return {
      token: `mock-jwt-token-${newUser.id}-${newUser.status}-${Date.now()}`,
      user: userWithoutPassword
    }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Une erreur est survenue lors de l'inscription.",
    })
  }
})