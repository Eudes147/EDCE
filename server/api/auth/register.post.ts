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
    
    // Récupération des nouveaux champs (flexibilité camelCase / snake_case)
    const tel = body.tel
    const birth_date = body.birthDate || body.birth_date

    // 1. Validation des champs obligatoires
    if (!first_name || !last_name || !email || !sexe || !password) {
      throw createError({
        statusCode: 400,
        message: 'Tous les champs requis doivent être remplis (Nom, Prénom, Genre, E-mail, Mot de passe).',
      })
    }

    // 2. Vérification si l'adresse e-mail est déjà prise
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
      tel: tel || '+225 00 00 00 00', // Valeur par défaut si non renseigné
      sexe: sexe,
      status: 'teacher', 
      quarter: body.quarter || undefined, 
      birth_date: birth_date ? new Date(birth_date) : new Date('2000-01-01'), // Conversion si renseigné
      created_at: new Date().toISOString()
    }

    // 4. On pousse dans le tableau centralisé
    usersState.users.push(newUser)

    // 5. On extrait le mot de passe avant de renvoyer le résultat
    const { password: _, ...userWithoutPassword } = newUser

    return {
      token: `mock-jwt-token-${newUser.id}-${newUser.status}-${Date.now()}`,
      user: newUser
    }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Une erreur est survenue lors de l'inscription.",
    })
  }
})