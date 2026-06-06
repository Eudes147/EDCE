<template>
  <div class="min-h-screen flex items-center justify-center p-margin-mobile md:p-xl font-body-md text-on-surface">
    <div class="w-full max-w-[30rem]">

      <!-- SIGNUP VIEW -->
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
          <form class="space-y-md" @submit.prevent="handleSignup">
            <div class="grid grid-cols-2 gap-md">
              <div class="space-y-xs">
                <label class="font-label-md text-label-md text-on-surface">First Name</label>
                <input
                  v-model="signupForm.firstName"
                  class="w-full px-md py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                  placeholder="John"
                  type="text"
                />
              </div>
              <div class="space-y-xs">
                <label class="font-label-md text-label-md text-on-surface">Last Name</label>
                <input
                  v-model="signupForm.lastName"
                  class="w-full px-md py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                  placeholder="Doe"
                  type="text"
                />
              </div>
            </div>

            <!-- Email Input with Validation -->
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
                @blur="validateEmail"
              />
              <p v-if="validationErrors.email" class="text-xs font-body-xs text-red-500 mt-xs">
                {{ validationErrors.email }}
              </p>
            </div>

            <!-- Password Input with Validation -->
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
              <!-- Password strength indicator -->
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

            <!-- Confirm Password Input -->
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

            <!-- Role Selection -->
            <div class="space-y-xs">
              <label class="font-label-md text-label-md text-on-surface">Select Role</label>
              <select
                v-model="signupForm.role"
                class="w-full px-md py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none bg-white transition-all"
              >
                <option value="Teacher">Teacher</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <!-- Terms Acceptance -->
            <div class="flex items-start gap-sm">
              <input
                id="terms"
                v-model="signupForm.acceptTerms"
                class="mt-1 w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer"
                type="checkbox"
              />
              <label class="font-body-sm text-body-sm text-on-surface-variant cursor-pointer" for="terms">
                I agree to the <a class="text-primary hover:underline" href="#">Terms of Service</a> and
                <a class="text-primary hover:underline" href="#">Privacy Policy</a>
              </label>
            </div>

            <!-- Submit Button -->
            <button
              class="w-full bg-primary-container text-on-primary font-label-md text-label-md py-md rounded-lg hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              :disabled="!isFormValid"
            >
              Create Account
            </button>

            <!-- Login Link -->
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

    <!-- Background Decoration -->
    <div class="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
      <div class="absolute top-[10%] right-[10%] w-96 h-96 bg-primary/5 rounded-full blur-[80px]"></div>
      <div class="absolute bottom-[10%] left-[5%] w-72 h-72 bg-secondary-container/5 rounded-full blur-[60px]"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

// ============================================================================
// REGEX PATTERNS
// ============================================================================

// RFC 5322 Email validation (strict)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Password validation: Min 8 chars, at least 1 uppercase, 1 lowercase, 1 number
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

const signupForm = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'Teacher',
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

  // Password validation
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

  // Confirm password validation
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

  // Log form data for debugging
  console.log('Form submitted:', {
    firstName: signupForm.firstName,
    lastName: signupForm.lastName,
    email: signupForm.email,
    role: signupForm.role,
    acceptTerms: signupForm.acceptTerms,
  })

  // TODO: Replace with actual API call
  // await registerUser(signupForm)
  
  // For now, just show success message
  alert('Account created successfully! Please check your email for verification.')
  
  // Reset form
  resetForm()
}

function resetForm(): void {
  signupForm.firstName = ''
  signupForm.lastName = ''
  signupForm.email = ''
  signupForm.password = ''
  signupForm.confirmPassword = ''
  signupForm.role = 'Teacher'
  signupForm.acceptTerms = false

  validationErrors.email = ''
  validationErrors.password = ''
  validationErrors.confirmPassword = ''
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

/* Card styling */
.auth-card {
  background: var(--surface, #fff);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Focus visible states for better accessibility */
:deep(input:focus-visible),
:deep(select:focus-visible) {
  outline: none;
}
</style>
