<template>
  <div class="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 font-body text-on-surface">
    <div class="w-full max-w-[30rem]">
      <Transition name="auth-transition" mode="out-in">
        <div class="auth-card rounded-xl p-6 sm:p-8 border border-outline-variant/30">
          <header class="mb-6">
            <h2 class="font-h1 text-xl sm:text-2xl font-bold text-on-surface">Mot de passe oublié ?</h2>
            <p class="font-body text-xs sm:text-sm text-on-surface-variant mt-1">
              Entrez votre adresse email et nous vous enverrons un lien de réinitialisation sécurisé.
            </p>
          </header>

          <div 
            v-if="isSubmittedSuccessfully" 
            class="mb-6 p-4 bg-success/10 border border-success/20 text-success rounded-lg text-xs sm:text-sm flex items-start gap-2 animate-fade-in"
          >
            <Icon name="check_circle" class="shrink-0 mt-[2px]" size="1.15rem" />
            <span>Un email de récupération a été envoyé. Veuillez vérifier votre boîte de réception ainsi que vos spams.</span>
          </div>

          <div 
            v-if="apiErrorMessage" 
            class="mb-6 p-4 bg-error/10 border border-error/20 text-error rounded-lg text-xs sm:text-sm flex items-center gap-2 animate-fade-in"
          >
            <Icon name="error" class="shrink-0" size="1.15rem" />
            <span>{{ apiErrorMessage }}</span>
          </div>

          <form v-if="!isSubmittedSuccessfully" class="space-y-4" @submit.prevent="handleEmailSubmit">
            <div class="space-y-1">
              <label class="text-xs font-bold uppercase tracking-wider text-on-surface-variant" for="forgot-email">
                Adresse Email
              </label>
              <input
                id="forgot-email"
                v-model="emailInput"
                class="w-full px-3 py-2 rounded-lg border transition-all outline-none text-sm font-semibold bg-white"
                :class="[
                  emailError
                    ? 'border-error focus:ring-2 focus:ring-error/10 focus:border-error'
                    : 'border-outline-variant focus:ring-2 focus:ring-primary/10 focus:border-primary'
                ]"
                placeholder="nom@eglise.org"
                type="email"
                required
                :disabled="isLoading"
                @blur="validateEmail"
              />
              <p v-if="emailError" class="text-xs font-medium text-error mt-0.5">
                {{ emailError }}
              </p>
            </div>

            <button
              class="w-full bg-primary text-white font-bold py-3 rounded-lg hover:opacity-95 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md text-sm"
              type="submit"
              :disabled="!isEmailValid || isLoading"
            >
              <Icon v-if="isLoading" name="sync" class="animate-spin" size="1.15rem" />
              <span>{{ isLoading ? 'Envoi du lien en cours...' : 'Envoyer le lien de récupération' }}</span>
            </button>

            <p class="text-center text-xs sm:text-sm text-on-surface-variant mt-4">
              Se souvenir du mot de passe ?
              <NuxtLink to="/login" class="text-primary font-bold hover:underline ml-1">Se connecter</NuxtLink>
            </p>
          </form>

          <div v-else class="mt-4">
            <NuxtLink 
              to="/login" 
              class="w-full block text-center bg-surface-container border border-outline-variant rounded-lg text-on-surface font-bold py-3 hover:bg-surface-container-high transition-all text-sm"
            >
              Retour à la page de Connexion
            </NuxtLink>
          </div>
        </div>
      </Transition>
    </div>

    <div class="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
      <div class="absolute top-[10%] right-[10%] w-96 h-96 bg-primary/5 rounded-full blur-[80px]"></div>
      <div class="absolute bottom-[10%] left-[5%] w-72 h-72 bg-secondary/5 rounded-full blur-[60px]"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const emailInput = ref<string>('')
const emailError = ref<string>('')
const isLoading = ref<boolean>(false)
const apiErrorMessage = ref<string>('')
const isSubmittedSuccessfully = ref<boolean>(false)

const isEmailValid = computed(() => EMAIL_REGEX.test(emailInput.value))

function validateEmail(): void {
  emailError.value = ''
  if (!emailInput.value.trim()) {
    emailError.value = 'L\'adresse email est requise.'
    return
  }
  if (!EMAIL_REGEX.test(emailInput.value)) {
    emailError.value = 'Veuillez entrer une adresse email valide.'
    return
  }
}

async function handleEmailSubmit(): Promise<void> {
  validateEmail()
  if (emailError.value) return

  isLoading.value = true
  apiErrorMessage.value = ''

  try {
    await $fetch('/api/auth/forgot-password', {
      method: 'POST',
      body: { email: emailInput.value.trim() }
    })
    isSubmittedSuccessfully.value = true
  } catch (error: any) {
    apiErrorMessage.value = error.data?.statusMessage || 'Une erreur inattendue est survenue.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.auth-transition-enter-active, .auth-transition-leave-active { transition: all 0.4s ease-out; }
.auth-transition-enter-from { opacity: 0; transform: translateY(10px); }
.auth-transition-leave-to { opacity: 0; transform: translateY(-10px); }
.auth-card { background: var(--md-sys-color-surface, #fff); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); }
</style>