import nodemailer from 'nodemailer'

import { useToast } from '~/composables/useToast' // Assurez-vous que le chemin est correct

export default defineEventHandler(async (event) => {
  const toast = useToast()

  const body = await readBody(event)
  const { email } = body

  if (!email) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email is required',
    })
  }

  // Petit délai pour simuler le réseau
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Génération d'un Token temporaire unique
  const fakeToken = `tok_${Math.random().toString(36).substring(2, 15)}`
  const resetLink = `http://localhost:3000/reset-password?token=${fakeToken}`


  try {
    // Création du compte éphémère gratuit sur Ethereal
    const testAccount = await nodemailer.createTestAccount()

    // CORRECTION : On extrait les infos depuis l'objet "smtp" interne de testAccount
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
      subject: '🔄 Reset your password',
      text: `Hello, please reset your password by clicking on this link: ${resetLink}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 500px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #002f6c; margin-bottom: 16px;">Reset your password</h2>
          <p>You requested to reset your password. Click the button below to proceed and choose a new one:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="display: inline-block; background-color: #002f6c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Reset Password
            </a>
          </div>
          <p style="font-size: 12px; color: #666; border-top: 1px solid #eee; padding-top: 12px; margin-top: 20px;">
            If you didn't request this change, you can safely ignore this email. This link will expire shortly.
          </p>
        </div>
      `,
    }

    // Envoi effectif du mail
    const info = await transporter.sendMail(mailOptions)

    // CORRECTION : Sécurisation du retour de getTestMessageUrl (string | undefined au lieu de string | false)
    const previewUrl = nodemailer.getTestMessageUrl(info) || undefined

    toast.success('E-mail envoyé avec succès !')
    toast.info('👉 Cliquez sur le lien ci-dessous pour ouvrir votre boîte mail virtuelle :')
    toast.info(`\x1b[36m%s\x1b[0m`, previewUrl)

    return {
      success: true,
      message: 'Reset email sent successfully',
    }
  } catch (error: any) {
    toast.error('SMTP Error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to send reset email.',
    })
  }
})