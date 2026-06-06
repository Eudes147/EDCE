<template>
  <div class="min-h-screen flex items-center justify-center p-margin-mobile md:p-xl font-body-md text-on-surface">
    <div class="w-full max-w-[30rem]">
      <!-- EMAIL INPUT VIEW -->
      <Transition name="auth-transition" mode="out-in">
        <div
          v-show="currentView === 'email-input'"
          key="email-input"
          class="auth-card rounded-xl p-md md:p-lg"
        >
          <header class="mb-lg">
            <h2 class="font-h3 text-h3 text-on-surface">Forgot your password?</h2>
            <p class="font-body-sm text-body-sm text-on-surface-variant">
              Enter your email address and we'll send you a verification code
            </p>
          </header>

          <form class="space-y-md" @submit.prevent="handleEmailSubmit">
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
                @blur="validateEmail"
              />
              <p v-if="emailError" class="text-xs font-body-xs text-red-500 mt-xs">
                {{ emailError }}
              </p>
            </div>

            <button
              class="w-full bg-primary-container text-on-primary font-label-md text-label-md py-md rounded-lg hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              :disabled="!isEmailValid || isLoading"
            >
              {{ isLoading ? 'Sending...' : 'Send Verification Code' }}
            </button>

            <p class="text-center font-body-sm text-body-sm text-on-surface-variant mt-md">
              Remember your password?
              <NuxtLink to="/login" class="text-primary font-bold hover:underline">
                Login
              </NuxtLink>
            </p>
          </form>

          <!-- Debug mode: Test email suggestion -->
          <div class="mt-lg pt-lg border-t border-outline-variant">
            <p class="text-xs text-on-surface-variant mb-sm font-bold">🧪 Demo Mode:</p>
            <button
              type="button"
              class="text-xs text-primary hover:underline"
              @click="emailInput = DEMO_EMAIL"
            >
              Use demo email: {{ DEMO_EMAIL }}
            </button>
          </div>
        </div>
      </Transition>

      <!-- VERIFICATION VIEW -->
      <Transition name="auth-transition" mode="out-in">
        <div
          v-show="currentView === 'verification'"
          key="verification"
          class="auth-card rounded-xl p-md md:p-lg text-center"
        >
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-container-low text-primary mb-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </div>

          <header class="mb-lg">
            <h2 class="font-h3 text-h3 text-on-surface">Verify your email</h2>
            <p class="font-body-sm text-body-sm text-on-surface-variant">
              We've sent a 6-digit code to<br /><span class="font-bold text-on-surface">{{ verificationEmail }}</span>
            </p>
          </header>

          <form class="space-y-md" @submit.prevent="handleVerificationSubmit">
            <div class="space-y-md">
              <p class="font-label-md text-label-md text-on-surface text-left">Verification Code</p>
              <div class="flex justify-center gap-sm">
                <input
                  v-for="(digit, index) in pinInputs"
                  :key="index"
                  ref="pinRefs"
                  v-model="pinInputs[index]"
                  class="pin-input w-12 h-14 text-center text-h3 font-h3 border border-outline-variant rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                  maxlength="1"
                  type="text"
                  inputmode="numeric"
                  placeholder="0"
                  @input="handlePinInput(index, $event)"
                  @keydown="handlePinKeydown(index, $event)"
                  @paste="handlePinPaste"
                />
              </div>
              <p v-if="pinError" class="text-xs font-body-xs text-red-500">
                {{ pinError }}
              </p>
            </div>

            <button
              class="w-full bg-primary-container text-on-primary font-label-md text-label-md py-md rounded-lg hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              :disabled="completedPins < 6 || isLoading"
            >
              {{ isLoading ? 'Verifying...' : 'Verify Code' }}
            </button>

            <button
              type="button"
              class="w-full text-primary font-label-md text-label-md py-md hover:underline transition-colors"
              @click="switchView('email-input')"
            >
              Change Email
            </button>
          </form>

          <!-- Debug mode: Test code suggestion -->
          <div class="mt-lg pt-lg border-t border-outline-variant">
            <p class="text-xs text-on-surface-variant mb-sm font-bold">🧪 Demo Mode:</p>
            <button
              type="button"
              class="text-xs text-primary hover:underline"
              @click="fillDemoCode"
            >
              Fill demo code: {{ DEMO_CODE }}
            </button>
          </div>
        </div>
      </Transition>

      <!-- RESET PASSWORD VIEW -->
      <Transition name="auth-transition" mode="out-in">
        <div
          v-show="currentView === 'reset-password'"
          key="reset-password"
          class="auth-card rounded-xl p-md md:p-lg"
        >
          <header class="mb-lg">
            <h2 class="font-h3 text-h3 text-on-surface">Create new password</h2>
            <p class="font-body-sm text-body-sm text-on-surface-variant">
              Enter a new password for your account
            </p>
          </header>

          <form class="space-y-md" @submit.prevent="handlePasswordSubmit">
            <!-- New Password -->
            <div class="space-y-xs">
              <label class="font-label-md text-label-md text-on-surface" for="new-password">
                New Password
              </label>
              <div class="relative">
                <input
                  id="new-password"
                  v-model="passwordForm.password"
                  class="w-full px-md py-sm rounded-lg border transition-all outline-none"
                  :class="[
                    passwordError.password
                      ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/10'
                      : 'border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/10'
                  ]"
                  :type="passwordVisible.new ? 'text' : 'password'"
                  placeholder="Create a strong password"
                  @blur="validatePassword"
                />
                <button
                  type="button"
                  class="absolute right-md top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                  @click="togglePasswordVisibility('new')"
                >
                  <svg
                    v-if="!passwordVisible.new"
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
              <p v-if="passwordError.password" class="text-xs font-body-xs text-red-500 mt-xs">
                {{ passwordError.password }}
              </p>
              <!-- Password strength indicator -->
              <div class="flex gap-xs mt-sm">
                <div
                  v-for="i in 3"
                  :key="i"
                  class="h-1 flex-1 rounded-full transition-colors"
                  :class="passwordStrength >= i ? 'bg-primary' : 'bg-outline-variant'"
                />
              </div>
              <p class="text-xs text-on-surface-variant mt-xs">
                Minimum 8 characters required
              </p>
            </div>

            <!-- Confirm Password -->
            <div class="space-y-xs">
              <label class="font-label-md text-label-md text-on-surface" for="confirm-password">
                Confirm Password
              </label>
              <div class="relative">
                <input
                  id="confirm-password"
                  v-model="passwordForm.confirmPassword"
                  class="w-full px-md py-sm rounded-lg border transition-all outline-none"
                  :class="[
                    passwordError.confirmPassword
                      ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/10'
                      : 'border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/10'
                  ]"
                  :type="passwordVisible.confirm ? 'text' : 'password'"
                  placeholder="Confirm your password"
                  @blur="validatePassword"
                />
                <button
                  type="button"
                  class="absolute right-md top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                  @click="togglePasswordVisibility('confirm')"
                >
                  <svg
                    v-if="!passwordVisible.confirm"
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
              <p v-if="passwordError.confirmPassword" class="text-xs font-body-xs text-red-500 mt-xs">
                {{ passwordError.confirmPassword }}
              </p>
            </div>

            <button
              class="w-full bg-primary-container text-on-primary font-label-md text-label-md py-md rounded-lg hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              :disabled="!isPasswordValid || isLoading"
            >
              {{ isLoading ? 'Resetting...' : 'Reset Password' }}
            </button>

            <p class="text-center font-body-sm text-body-sm text-on-surface-variant mt-md">
              Remember your password?
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
// CONSTANTS - Demo mode credentials
// ============================================================================
const DEMO_EMAIL = 'test@edce.com'
const DEMO_CODE = '123456'

// RFC 5322 Email validation regex (strict)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// PIN validation (digits only)
const PIN_REGEX = /^\d$/

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

// View management
const currentView = ref<'email-input' | 'verification' | 'reset-password'>('email-input')

// Email input state
const emailInput = ref<string>('')
const emailError = ref<string>('')
const verificationEmail = ref<string>('')

// PIN verification state
const pinInputs = ref<string[]>(Array(6).fill(''))
const pinRefs = ref<HTMLInputElement[]>([])
const pinError = ref<string>('')

// Password reset state
const passwordForm = reactive({
  password: '',
  confirmPassword: '',
})

const passwordError = reactive({
  password: '',
  confirmPassword: '',
})

const passwordVisible = reactive({
  new: false,
  confirm: false,
})

// Loading state
const isLoading = ref<boolean>(false)

// ============================================================================
// COMPUTED PROPERTIES
// ============================================================================

const isEmailValid = computed(() => {
  return EMAIL_REGEX.test(emailInput.value)
})

const completedPins = computed(() => {
  return pinInputs.value.filter(p => p.length > 0).length
})

const isPasswordValid = computed(() => {
  return (
    passwordForm.password.length >= 8 &&
    passwordForm.password === passwordForm.confirmPassword &&
    passwordForm.password.length > 0 &&
    passwordForm.confirmPassword.length > 0
  )
})

const passwordStrength = computed(() => {
  const pwd = passwordForm.password
  let strength = 0

  if (pwd.length >= 8) strength++
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++
  if (/\d/.test(pwd)) strength++

  return strength
})

// ============================================================================
// VIEW SWITCHING
// ============================================================================

function switchView(view: 'email-input' | 'verification' | 'reset-password') {
  currentView.value = view
}

// ============================================================================
// EMAIL VALIDATION & SUBMISSION
// ============================================================================

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

  if (emailError.value) {
    return
  }

  isLoading.value = true

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500))

  // Demo verification: check if email matches DEMO_EMAIL
  if (emailInput.value === DEMO_EMAIL) {
    verificationEmail.value = emailInput.value
    resetPinInputs()
    switchView('verification')
    console.log('✅ Demo email verified. Use code:', DEMO_CODE)
  } else {
    emailError.value = `Demo mode: Please use ${DEMO_EMAIL}`
  }

  isLoading.value = false
}

// ============================================================================
// PIN VERIFICATION
// ============================================================================

function handlePinInput(index: number, event: Event): void {
  const target = event.target as HTMLInputElement
  const value = target.value

  // Only allow digits
  if (!PIN_REGEX.test(value) && value !== '') {
    target.value = ''
    pinInputs.value[index] = ''
    pinError.value = 'Only numbers are allowed'
    return
  }

  pinError.value = ''

  // Auto-focus next input
  if (value && index < 5) {
    pinRefs.value[index + 1]?.focus()
  }
}

function handlePinKeydown(index: number, event: KeyboardEvent): void {
  // Handle backspace to focus previous
  if (event.key === 'Backspace' && !pinInputs.value[index] && index > 0) {
    pinRefs.value[index - 1]?.focus()
  }

  // Allow only numbers
  if (!/^\d$/.test(event.key) && !['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(event.key)) {
    event.preventDefault()
  }
}

function handlePinPaste(event: ClipboardEvent): void {
  event.preventDefault()

  const pastedData = event.clipboardData?.getData('text') || ''
  // Take only first 6 digits
  const digits = pastedData.replace(/\D/g, '').substring(0, 6)

  // Distribute to PIN inputs
  for (let i = 0; i < 6; i++) {
    pinInputs.value[i] = digits[i] || ''
  }

  // Focus last filled or next empty input
  const lastFilledIndex = pinInputs.value.findIndex(p => !p)
  if (lastFilledIndex !== -1) {
    pinRefs.value[lastFilledIndex]?.focus()
  } else {
    pinRefs.value[5]?.focus()
  }

  pinError.value = ''
}

function fillDemoCode(): void {
  for (let i = 0; i < 6; i++) {
    pinInputs.value[i] = DEMO_CODE[i]
  }
}

async function handleVerificationSubmit(): Promise<void> {
  const code = pinInputs.value.join('')

  if (code.length !== 6) {
    pinError.value = 'Please enter all 6 digits'
    return
  }

  isLoading.value = true

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500))

  // Demo verification: check if code matches DEMO_CODE
  if (code === DEMO_CODE) {
    switchView('reset-password')
    console.log('✅ Code verified successfully')
  } else {
    pinError.value = `Demo mode: Correct code is ${DEMO_CODE}`
  }

  isLoading.value = false
}

// ============================================================================
// PASSWORD RESET
// ============================================================================

function togglePasswordVisibility(field: 'new' | 'confirm'): void {
  passwordVisible[field] = !passwordVisible[field]
}

function validatePassword(): void {
  passwordError.password = ''
  passwordError.confirmPassword = ''

  if (passwordForm.password.length > 0 && passwordForm.password.length < 8) {
    passwordError.password = 'Password must be at least 8 characters'
  }

  if (passwordForm.confirmPassword && passwordForm.password !== passwordForm.confirmPassword) {
    passwordError.confirmPassword = 'Passwords do not match'
  }
}

async function handlePasswordSubmit(): Promise<void> {
  validatePassword()

  if (!isPasswordValid.value) {
    return
  }

  isLoading.value = true

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500))

  console.log('✅ Password reset successfully')
  console.log('New password:', passwordForm.password)

  // Redirect to login
  await navigateTo('/login')

  isLoading.value = false
}

// ============================================================================
// UTILITIES
// ============================================================================

function resetPinInputs(): void {
  pinInputs.value = Array(6).fill('')
  pinError.value = ''
}

function resetForms(): void {
  emailInput.value = ''
  emailError.value = ''
  passwordForm.password = ''
  passwordForm.confirmPassword = ''
  passwordError.password = ''
  passwordError.confirmPassword = ''
  resetPinInputs()
}
</script>

<style scoped>
/* Transition animations */
.auth-transition-enter-active,
.auth-transition-leave-active {
  transition: all 0.4s ease-out;
}

.auth-transition-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.auth-transition-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Card styling */
.auth-card {
  background: var(--surface, #fff);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* PIN inputs styling */
.pin-input {
  font-size: 1.5rem;
  letter-spacing: 0.1em;
}

.pin-input::-webkit-outer-spin-button,
.pin-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.pin-input[type='number'] {
  -moz-appearance: textfield;
}
</style>