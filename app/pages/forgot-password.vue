<template>
  <div class="min-h-screen flex items-center justify-center p-margin-mobile md:p-xl font-body-md text-on-surface">
    <div class="w-full max-w-[30rem]">
      <Transition name="auth-transition" mode="out-in">
        <div class="auth-card rounded-xl p-md md:p-lg">
          <header class="mb-lg">
            <h2 class="font-h3 text-h3 text-on-surface">Mot de passe oublié?</h2>
            <p class="font-body-sm text-body-sm text-on-surface-variant mt-xs">
              Entre ton adresse email et nous vous enverrons le lien de réinitialisation.
            </p>
          </header>

          <div 
            v-if="isSubmittedSuccessfully" 
            class="mb-md p-sm bg-green-500/10 border border-green-500/20 text-green-600 rounded-lg text-body-sm flex items-start gap-xs"
          >
            <svg class="mt-[2px] shrink-0" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <span>An email has been sent. Please check your terminal/console to open your test inbox and view the email.</span>
          </div>

          <div 
            v-if="apiErrorMessage" 
            class="mb-md p-sm bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-body-sm flex items-center gap-xs"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {{ apiErrorMessage }}
          </div>

          <form v-if="!isSubmittedSuccessfully" class="space-y-md" @submit.prevent="handleEmailSubmit">
            <div class="space-y-xs">
              <label class="font-label-md text-label-md text-on-surface" for="forgot-email">
                Email Address
              </label>
              <input
                id="forgot-email"
                v-model="emailInput"
                class="w-full px-md py-sm rounded-lg border transition-all outline-none"
                :class="[
                  emailError
                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/10'
                    : 'border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/10'
                ]"
                placeholder="name@church.org"
                type="email"
                required
                :disabled="isLoading"
                @blur="validateEmail"
              />
              <p v-if="emailError" class="text-xs font-body-xs text-red-500 mt-xs">
                {{ emailError }}
              </p>
            </div>

            <button
              class="w-full bg-primary-container text-on-primary font-label-md text-label-md py-md rounded-lg hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-sm"
              type="submit"
              :disabled="!isEmailValid || isLoading"
            >
              <svg v-if="isLoading" class="animate-spin h-5 w-5 text-on-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ isLoading ? 'Sending Link...' : 'Send Reset Link' }}</span>
            </button>

            <p class="text-center font-body-sm text-body-sm text-on-surface-variant mt-md">
              Remember your password?
              <NuxtLink to="/login" class="text-primary font-bold hover:underline">Login</NuxtLink>
            </p>
          </form>

          <div v-else class="mt-md">
            <NuxtLink 
              to="/login" 
              class="w-full block text-center bg-outline-variant text-on-surface font-label-md text-label-md py-md rounded-lg hover:opacity-90 transition-all"
            >
              Return to Login
            </NuxtLink>
          </div>
        </div>
      </Transition>
    </div>

    <div class="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
      <div class="absolute top-[10%] right-[10%] w-96 h-96 bg-primary/5 rounded-full blur-[80px]"></div>
      <div class="absolute bottom-[10%] left-[5%] w-72 h-72 bg-secondary-container/5 rounded-full blur-[60px]"></div>
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
    emailError.value = 'Email is required'
    return
  }
  if (!EMAIL_REGEX.test(emailInput.value)) {
    emailError.value = 'Please enter a valid email address'
    return
  }
}

async function handleEmailSubmit(): Promise<void> {
  validateEmail()
  if (emailError.value) return

  isLoading.value = true
  apiErrorMessage.value = ''

  try {
    // Connexion directe avec forgot-password.post.ts
    await $fetch('/api/auth/forgot-password', {
      method: 'POST',
      body: { email: emailInput.value }
    })
    isSubmittedSuccessfully.value = true
  } catch (error: any) {
    apiErrorMessage.value = error.data?.statusMessage || 'An unexpected error occurred.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.auth-transition-enter-active, .auth-transition-leave-active { transition: all 0.4s ease-out; }
.auth-transition-enter-from { opacity: 0; transform: translateY(10px); }
.auth-transition-leave-to { opacity: 0; transform: translateY(-10px); }
.auth-card { background: var(--surface, #fff); box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); }
</style>