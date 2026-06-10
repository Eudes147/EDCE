<template>
  <div class="min-h-screen flex items-center justify-center p-margin-mobile md:p-xl font-body-md text-on-surface">
    <div class="w-full max-w-[30rem]">

      <Transition
        name="pop-bottom"
        mode="out-in"
      >
        <div
          key="signup"
          class="auth-card rounded-xl p-md md:p-lg"
        >
          <header class="mb-lg">
            <h2 class="font-h3 text-h3 text-on-surface">Create your account</h2>
            <p class="font-body-sm text-body-sm text-on-surface-variant">Join the EDCE administrative community</p>
          </header>

          <div 
            v-if="apiErrorMessage" 
            class="mb-md p-sm bg-error/10 border border-error/20 text-error rounded-lg text-body-sm flex items-center gap-xs"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {{ apiErrorMessage }}
          </div>

          <form class="space-y-md" @submit.prevent="handleSignup">
            <div class="grid grid-cols-2 gap-md">
              <div class="space-y-xs">
                <label class="font-label-md text-label-md text-on-surface">First Name</label>
                <input
                  v-model="signupForm.firstName"
                  class="w-full px-md py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                  placeholder="John"
                  type="text"
                  required
                  :disabled="isLoading"
                />
              </div>
              <div class="space-y-xs">
                <label class="font-label-md text-label-md text-on-surface">Last Name</label>
                <input
                  v-model="signupForm.lastName"
                  class="w-full px-md py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                  placeholder="Doe"
                  type="text"
                  required
                  :disabled="isLoading"
                />
              </div>
            </div>

            <div class="space-y-xs">
              <label class="font-label-md text-label-md text-on-surface">Gender</label>
              <select
                v-model="signupForm.sexe"
                class="w-full px-md py-sm rounded-lg border border-outline-variant bg-surface text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all cursor-pointer appearance-none"
                required
                :disabled="isLoading"
              >
                <option value="" disabled selected>Select your gender</option>
                <option value="Masculin">Masculin</option>
                <option value="Feminin">Féminin</option>
              </select>
            </div>

            <div class="space-y-xs">
              <label class="font-label-md text-label-md text-on-surface">Email</label>
              <input
                v-model="signupForm.email"
                class="w-full px-md py-sm rounded-lg border transition-all outline-none"
                :class="[
                  validationErrors.email
                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/10'
                    : 'border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/10'
                ]"
                placeholder="john.doe@email.com"
                type="email"
                required
                :disabled="isLoading"
                @blur="validateEmail"
              />
              <p v-if="validationErrors.email" class="text-xs font-body-xs text-red-500 mt-xs">
                {{ validationErrors.email }}
              </p>
            </div>

            <div class="space-y-xs">
              <label class="font-label-md text-label-md text-on-surface">Password</label>
              <div class="relative">
                <input
                  v-model="signupForm.password"
                  class="w-full px-md py-sm rounded-lg border transition-all outline-none"
                  :class="[
                    validationErrors.password
                      ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/10'
                      : 'border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/10'
                  ]"
                  :type="passwordVisible.signup ? 'text' : 'password'"
                  placeholder="Create a strong password"
                  required
                  :disabled="isLoading"
                  @input="validatePassword"
                />
                <button
                  class="absolute right-md top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                  @click="togglePasswordVisibility('signup')"
                  type="button"
                >
                  <svg
                    v-if="!passwordVisible.signup"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M12 9a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3m0-4.5c5 0 9.27 3.11 11 7.5c-1.73 4.39-6 7.5-11 7.5S2.73 16.39 1 12c1.73-4.39 6-7.5 11-7.5M3.18 12a9.821 9.821 0 0 0 17.64 0a9.821 9.821 0 0 0-17.64 0" />
                  </svg>
                  <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M11.83 9L15 12.16V12a3 3 0 0 0-3-3zm-4.3.8l1.55 1.55c-.05.21-.08.42-.08.65a3 3 0 0 0 3 3c.22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53a5 5 0 0 1-5-5c0-.79.2-1.53.53-2.2M2 4.27l2.28 2.28l.45.45C3.08 8.3 1.78 10 1 12c1.73 4.39 6 7.5 11 7.5c1.55 0 3.03-.3 4.38-.84l.43.42L19.73 22L21 20.73L3.27 3M12 7a5 5 0 0 1 5 5c0 .64-.13 1.26-.36 1.82l2.93 2.93c1.5-1.25 2.7-2.89 3.43-4.75c-1.73-4.39-6-7.5-11-7.5c-1.4 0-2.74.25-4 .7l2.17 2.15C10.74 7.13 11.35 7 12 7" />
                  </svg>
                </button>
              </div>
              <p v-if="validationErrors.password" class="text-xs font-body-xs text-red-500 mt-xs">
                {{ validationErrors.password }}
              </p>
              <div class="flex gap-xs mt-sm">
                <div
                  v-for="i in 3"
                  :key="i"
                  class="h-1 flex-1 rounded-full transition-colors duration-300"
                  :class="passwordStrength >= i ? 'bg-primary' : 'bg-outline-variant'"
                />
              </div>
              <p class="text-xs text-on-surface-variant mt-xs">
                Min 8 chars, uppercase, lowercase, number required
              </p>
            </div>

            <div class="space-y-xs">
              <label class="font-label-md text-label-md text-on-surface">Confirm Password</label>
              <div class="relative">
                <input
                  v-model="signupForm.confirmPassword"
                  class="w-full px-md py-sm rounded-lg border transition-all outline-none"
                  :class="[
                    validationErrors.confirmPassword
                      ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/10'
                      : 'border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/10'
                  ]"
                  :type="passwordVisible.confirmSignup ? 'text' : 'password'"
                  placeholder="Confirm your password"
                  required
                  :disabled="isLoading"
                  @input="validatePassword"
                />
                <button
                  class="absolute right-md top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                  @click="togglePasswordVisibility('confirmSignup')"
                  type="button"
                >
                  <svg
                    v-if="!passwordVisible.confirmSignup"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M12 9a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3m0-4.5c5 0 9.27 3.11 11 7.5c-1.73 4.39-6 7.5-11 7.5S2.73 16.39 1 12c1.73-4.39 6-7.5 11-7.5M3.18 12a9.821 9.821 0 0 0 17.64 0a9.821 9.821 0 0 0-17.64 0" />
                  </svg>
                  <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M11.83 9L15 12.16V12a3 3 0 0 0-3-3zm-4.3.8l1.55 1.55c-.05.21-.08.42-.08.65a3 3 0 0 0 3 3c.22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53a5 5 0 0 1-5-5c0-.79.2-1.53.53-2.2M2 4.27l2.28 2.28l.45.45C3.08 8.3 1.78 10 1 12c1.73 4.39 6 7.5 11 7.5c1.55 0 3.03-.3 4.38-.84l.43.42L19.73 22L21 20.73L3.27 3M12 7a5 5 0 0 1 5 5c0 .64-.13 1.26-.36 1.82l2.93 2.93c1.5-1.25 2.7-2.89 3.43-4.75c-1.73-4.39-6-7.5-11-7.5c-1.4 0-2.74.25-4 .7l2.17 2.15C10.74 7.13 11.35 7 12 7" />
                  </svg>
                </button>
              </div>
              <p v-if="validationErrors.confirmPassword" class="text-xs font-body-xs text-red-500 mt-xs">
                {{ validationErrors.confirmPassword }}
              </p>
            </div>

            <div class="flex items-start gap-sm">
              <input
                id="terms"
                v-model="signupForm.acceptTerms"
                class="mt-1 w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer"
                type="checkbox"
                :disabled="isLoading"
              />
              <label class="font-body-sm text-body-sm text-on-surface-variant cursor-pointer" for="terms">
                I agree to the <a class="text-primary hover:underline" href="#">Terms of Service</a> and
                <a class="text-primary hover:underline" href="#">Privacy Policy</a>
              </label>
            </div>

            <button
              class="w-full bg-primary-container text-on-primary font-label-md text-label-md py-md rounded-lg hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-sm"
              type="submit"
              :disabled="!isFormValid || isLoading"
            >
              <svg v-if="isLoading" class="animate-spin h-5 w-5 text-on-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ isLoading ? 'Creating Account...' : 'Create Account' }}</span>
            </button>

            <p class="text-center font-body-sm text-body-sm text-on-surface-variant mt-md">
              Already have an account?
              <NuxtLink to="/login" class="text-primary font-bold hover:underline">
                Login
              </NuxtLink>
            </p>
          </form>
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
import { ref, reactive, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'
import type { User } from '~/types/auth'
import type { Sexe } from '~/types/index' // MODIFICATION : Import du type Sexe
import { useToast } from '~/composables/useToast'

const toast = useToast()
const authStore = useAuthStore()

// ============================================================================
// REGEX PATTERNS
// ============================================================================

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

const isLoading = ref(false)
const apiErrorMessage = ref('')

const signupForm = reactive({
  firstName: '',
  lastName: '',
  email: '',
  sexe: '' as Sexe | '', // MODIFICATION : Initialisé vide mais typé
  password: '',
  confirmPassword: '',
  role: 'teacher',
  acceptTerms: false,
})

const passwordVisible = reactive({
  signup: false,
  confirmSignup: false,
})

const validationErrors = reactive({
  email: '',
  password: '',
  confirmPassword: '',
})

// ============================================================================
// COMPUTED PROPERTIES
// ============================================================================

const isEmailValid = computed(() => {
  return EMAIL_REGEX.test(signupForm.email)
})

const isPasswordValid = computed(() => {
  return (
    PASSWORD_REGEX.test(signupForm.password) &&
    signupForm.password === signupForm.confirmPassword
  )
})

const passwordStrength = computed(() => {
  const pwd = signupForm.password
  let strength = 0

  if (pwd.length >= 8) strength++
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++
  if (/\d/.test(pwd)) strength++

  return strength
})

const isFormValid = computed(() => {
  return (
    signupForm.firstName.trim().length > 0 &&
    signupForm.lastName.trim().length > 0 &&
    signupForm.sexe !== '' && // MODIFICATION : Validation de la sélection du sexe
    isEmailValid.value &&
    isPasswordValid.value &&
    signupForm.acceptTerms
  )
})

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

function validateEmail(): void {
  validationErrors.email = ''

  if (!signupForm.email.trim()) {
    validationErrors.email = 'Email is required'
    return
  }

  if (!EMAIL_REGEX.test(signupForm.email)) {
    validationErrors.email = 'Please enter a valid email address'
    return
  }
}

function validatePassword(): void {
  validationErrors.password = ''
  validationErrors.confirmPassword = ''

  if (signupForm.password.length > 0) {
    if (signupForm.password.length < 8) {
      validationErrors.password = 'Password must be at least 8 characters'
    } else if (!/[A-Z]/.test(signupForm.password)) {
      validationErrors.password = 'Password must contain at least one uppercase letter'
    } else if (!/[a-z]/.test(signupForm.password)) {
      validationErrors.password = 'Password must contain at least one lowercase letter'
    } else if (!/\d/.test(signupForm.password)) {
      validationErrors.password = 'Password must contain at least one number'
    }
  }

  if (
    signupForm.confirmPassword.length > 0 &&
    signupForm.password !== signupForm.confirmPassword
  ) {
    validationErrors.confirmPassword = 'Passwords do not match'
  }
}

// ============================================================================
// EVENT HANDLERS
// ============================================================================

function togglePasswordVisibility(field: 'signup' | 'confirmSignup') {
  passwordVisible[field] = !passwordVisible[field]
}

async function handleSignup(): Promise<void> {
  validateEmail()
  validatePassword()

  if (!isFormValid.value) {
    return
  }

  isLoading.value = true
  apiErrorMessage.value = ''

  try {
    // Appel à l'API d'inscription en transmettant la propriété "sexe"
    const data = await $fetch<{ token: string; user: User }>('/api/auth/register', {
      method: 'POST',
      body: {
        firstName: signupForm.firstName,
        lastName: signupForm.lastName,
        email: signupForm.email,
        sexe: signupForm.sexe, // MODIFICATION : Ajout du sexe au payload
        password: signupForm.password,
        role: signupForm.role
      }
    })

    // Stockage automatique du cookie d'authentification
    const tokenCookie = useCookie('auth_token', {
      path: '/'
    })
    tokenCookie.value = data.token

    // Initialisation immédiate du store global
    authStore.user = data.user
    authStore.isAuthentificated = true
    authStore.setPermissions(data.user.status)

    // Redirection automatique de l'enseignant vers son espace attitré
    await navigateTo('/seances/teacher')

  } catch (error: any) {
    apiErrorMessage.value = error.data?.message || 'An error occurred during registration.'
    toast.error('Registration error:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Pop-Bottom Transition Animation */
.pop-bottom-enter-active {
  animation: popBottom 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.pop-bottom-leave-active {
  animation: popBottom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) reverse;
}

@keyframes popBottom {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.auth-card {
  background: var(--surface, #fff);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

:deep(input:focus-visible), :deep(select:focus-visible) {
  outline: none;
}
</style>