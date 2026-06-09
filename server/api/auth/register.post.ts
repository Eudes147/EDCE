import { mockUsers } from '~/data/mockData' 
import type { User } from '~/types/auth'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { first_name, last_name, email, password } = body

    // 1. Validation des champs obligatoires pour l'inscription
    if (!first_name || !last_name || !email || !password) {
      throw createError({
        statusCode: 400,
        message: 'Tous les champs requis doivent être remplis (Nom, Prénom, E-mail, Mot de passe).',
      })
    }

    // 2. Vérification si l'adresse e-mail est déjà prise
    const emailExists = mockUsers.some((u) => u.email.toLowerCase() === email.toLowerCase())
    if (emailExists) {
      throw createError({
        statusCode: 409,
        message: 'Cette adresse e-mail est déjà utilisée par un autre compte.',
      })
    }

    // 3. Construction du nouvel utilisateur en respectant l'interface stricte User
    // Note: Vu qu'on s'enregistre, on lui attribue par défaut le rôle minimal "teacher"
    const newUser: User = {
      id: `user-${Math.random().toString(36).substr(2, 9)}`, // Génération d'un ID unique aléatoire
      first_name,
      last_name,
      email: email.toLowerCase(),
      password: password, // En vrai projet, il serait haché
      tel: body.tel || '+225 00 00 00 00', // Valeur par défaut si non fournie dans l'écran
      sexe: body.sexe || 'MASCULIN',       // Valeur par défaut si non fournie
      status: 'teacher',                   // Statut initial obligatoire de type UserStatus
      quarter: body.quarter || undefined, 
      birth_date: body.birth_date ? new Date(body.birth_date) : new Date('2000-01-01'), // Sécurisation obligatoire de l'objet Date !
      created_at: new Date().toISOString()
    }

    // 4. On pousse temporairement l'utilisateur dans notre tableau en mémoire
    mockUsers.push(newUser)

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