<template>
  <div class="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 font-body text-on-surface">
    <div class="w-full max-w-[30rem]">
      <div class="auth-card rounded-xl p-6 sm:p-8 border border-outline-variant/30">
        <header class="mb-6">
          <h2 class="font-h1 text-xl sm:text-2xl font-bold text-on-surface">Nouveau mot de passe</h2>
          <p class="font-body text-xs sm:text-sm text-on-surface-variant mt-1">
            Définissez votre nouveau mot de passe d'accès pour valider la réinitialisation.
          </p>
        </header>

        <div 
          v-if="!token" 
          class="p-4 bg-error/10 border border-error/20 text-error rounded-lg text-xs sm:text-sm flex flex-col gap-3 animate-fade-in"
        >
          <div class="flex items-center gap-2">
            <Icon name="block" class="shrink-0" size="1.15rem" />
            <span class="font-bold">Lien non valide</span>
          </div>
          <p class="text-xs">Le jeton d'authentification est absent ou a expiré. Veuillez refaire une demande.</p>
          <NuxtLink to="/auth/forgot-password" class="text-center bg-error text-white font-bold py-2 rounded-lg text-xs mt-1">
            Demander un nouveau lien
          </NuxtLink>
        </div>

        <div v-else class="space-y-4">
          <div 
            v-if="apiErrorMessage" 
            class="p-4 bg-error/10 border border-error/20 text-error rounded-lg text-xs sm:text-sm flex items-center gap-2 animate-fade-in"
          >
            <Icon name="error" class="shrink-0" size="1.15rem" />
            <span>{{ apiErrorMessage }}</span>
          </div>

          <form @submit.prevent="handleResetSubmit" class="space-y-4">
            <div class="space-y-1">
              <label class="text-xs font-bold uppercase tracking-wider text-on-surface-variant" for="new-password">
                Nouveau mot de passe
              </label>
              <div class="relative">
                <input
  id="new-password"
  v-model="passwordInput"
  :type="showPassword ? 'text' : 'password'"
  class="w-full pl-3 pr-10 py-2 rounded-lg border transition-all bg-white outline-none text-sm font-semibold"
  :class="passwordError ? 'border-error focus:ring-error/10 focus:border-error' : 'border-outline-variant focus:ring-primary/10 focus:border-primary'"
  placeholder="••••••••"
  required
  :disabled="isLoading"
/>
                <button 
                  type="button" 
                  @click="showPassword = !showPassword" 
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/70 hover:text-on-surface"
                >
                  <Icon :name="showPassword ? 'visibility_off' : 'visibility'" size="1.2rem" />
                </button>
              </div>
              <p v-if="passwordError" class="text-xs font-medium text-error mt-0.5">{{ passwordError }}</p>
            </div>

            <div class="space-y-1">
              <label class="text-xs font-bold uppercase tracking-wider text-on-surface-variant" for="confirm-password">
                Confirmer le mot de passe
              </label>
              <input
                id="confirm-password"
                v-model="confirmPasswordInput"
                :type="showPassword ? 'text' : 'password'"
                class="w-full px-3 py-2 rounded-lg border transition-all bg-white outline-none text-sm font-semibold"
                :class="confirmError ? 'border-error focus:ring-error/10 focus:border-error' : 'border-outline-variant focus:ring-primary/10 focus:border-primary'"
                placeholder="••••••••"
                required
                :disabled="isLoading"
                @input="validateConfirmPassword"
              />
              <p v-if="confirmError" class="text-xs font-medium text-error mt-0.5">{{ confirmError }}</p>
            </div>

            <button
              class="w-full bg-primary text-white font-bold py-3 rounded-lg hover:opacity-95 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md text-sm pt-2"
              type="submit"
              :disabled="isLoading || !!passwordError || !!confirmError || !passwordInput || !confirmPasswordInput"
            >
              <Icon v-if="isLoading" name="sync" class="animate-spin" size="1.15rem" />
              <span>{{ isLoading ? 'Mise à jour en cours...' : 'Réinitialiser mon mot de passe' }}</span>
            </button>
          </form>
        </div>
      </div>
    </div>

    <div class="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
      <div class="absolute top-[10%] right-[10%] w-96 h-96 bg-primary/5 rounded-full blur-[80px]"></div>
      <div class="absolute bottom-[10%] left-[5%] w-72 h-72 bg-secondary/5 rounded-full blur-[60px]"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from '#app'
import { useToast } from '~/composables/useToast'

const route = useRoute()
const router = useRouter()
const toast = useToast()

// Extraction sécurisée du token d'URL
const token = computed<string>(() => String(route.query.token || ''))

// États réactifs du formulaire
const passwordInput = ref<string>('')
const confirmPasswordInput = ref<string>('')
const passwordError = ref<string>('')
const confirmError = ref<string>('')
const showPassword = ref<boolean>(false)
const isLoading = ref<boolean>(false)
const apiErrorMessage = ref<string>('')

// Observateurs de validation de force du MDP
watch(passwordInput, (val) => {
  passwordError.value = ''
  if (val.length > 0 && val.length < 8) {
    passwordError.value = 'Le mot de passe doit contenir au moins 8 caractères.'
  }
  validateConfirmPassword()
})

function validateConfirmPassword(): void {
  confirmError.value = ''
  if (confirmPasswordInput.value && passwordInput.value !== confirmPasswordInput.value) {
    confirmError.value = 'Les mots de passe ne correspondent pas.'
  }
}

/**
 * 💾 SOUMISSION FINALE DU NOUVEAU MOT DE PASSE
 */
async function handleResetSubmit(): Promise<void> {
  validateConfirmPassword()
  if (passwordError.value || confirmError.value || !token.value) return

  isLoading.value = true
  apiErrorMessage.value = ''

  try {
    await $fetch('/api/auth/reset-password', {
      method: 'POST',
      body: { 
        token: token.value,
        password: passwordInput.value 
      }
    })

    toast.success('Mot de passe mis à jour', 'Votre compte a été sécurisé avec succès. Vous pouvez vous connecter.')
    await router.push('/login')
  } catch (error: any) {
    apiErrorMessage.value = error.data?.statusMessage || 'Une erreur est survenue lors de la réinitialisation.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.auth-card { background: var(--md-sys-color-surface, #fff); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); }
</style>