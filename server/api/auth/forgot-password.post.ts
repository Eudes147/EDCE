import nodemailer from 'nodemailer'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email } = body

  if (!email) {
    throw createError({
      statusCode: 400,
      statusMessage: 'L\'adresse email est requise.',
    })
  }

  // Petit délai pour simuler le réseau
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Génération d'un Token temporaire unique
  const fakeToken = `tok_${Math.random().toString(36).substring(2, 15)}`
  
  // CORRECTION : Le chemin pointe vers /auth/reset-password
  const resetLink = `http://localhost:3000/auth/reset-password?token=${fakeToken}`

  try {
    // Création du compte éphémère gratuit sur Ethereal
    const testAccount = await nodemailer.createTestAccount()

    const transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    })

    const mailOptions = {
      from: '"Application Auth" <noreply@example.com>',
      to: email,
      subject: '🔄 Réinitialisation de votre mot de passe',
      text: `Bonjour, veuillez réinitialiser votre mot de passe en cliquant sur ce lien : ${resetLink}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 500px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #002f6c; margin-bottom: 16px;">Réinitialisation de mot de passe</h2>
          <p>Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour continuer et en choisir un nouveau :</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="display: inline-block; background-color: #002f6c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Réinitialiser le mot de passe
            </a>
          </div>
          <p style="font-size: 12px; color: #666; border-top: 1px solid #eee; padding-top: 12px; margin-top: 20px;">
            Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email en toute sécurité. Ce lien expirera bientôt.
          </p>
        </div>
      `,
    }

    // Envoi effectif du mail
    const info = await transporter.sendMail(mailOptions)
    const previewUrl = nodemailer.getTestMessageUrl(info) || undefined

    // CORRECTION : On loggue proprement dans le terminal du serveur de dev
    console.log('\n======================================================')
    console.log('📧 EMAIL DE RÉINITIALISATION ENVOYÉ (Ethereal)')
    console.log(`URL de prévisualisation de la boîte mail : \x1b[36m%s\x1b[0m`, previewUrl)
    console.log('======================================================\n')

    return {
      success: true,
      message: 'Email de réinitialisation envoyé avec succès.',
      // On peut retourner l'URL au front-end si on est en mode développement pour faciliter les tests
      previewUrl 
    }
  } catch (error: any) {
    console.error('Erreur SMTP rencontrée :', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Impossible d\'envoyer l\'email de récupération.',
    })
  }
})