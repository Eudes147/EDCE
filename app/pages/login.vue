<template>
  <div class="min-h-screen flex items-center justify-center p-margin-mobile md:p-xl font-body-md text-on-surface">
    <!-- Container for all views - Managed by Vue reactivity -->
    <div class="w-full max-w-[480px]">
      <!-- LOGIN VIEW -->
      <Transition
        name="auth-transition"
        mode="out-in"
      >
        <div
          key="login"
          class="auth-card rounded-xl p-md md:p-lg"
        >
          <header class="mb-lg text-center">
            <h1 class="font-h2 text-h2 text-primary mb-xs">EDCE</h1>
            <p class="font-body-md text-on-surface-variant">Sunday School Management Platform</p>
          </header>
          <form class="space-y-md" @submit.prevent>
            <div class="space-y-xs">
              <label class="font-label-md text-label-md text-on-surface" for="login-email">Email Address</label>
              <input
                id="login-email"
                v-model="loginForm.email"
                class="w-full px-md py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none"
                placeholder="name@gmail.com"
                type="email"
              />
            </div>
            <div class="space-y-xs relative">
              <div class="flex justify-between items-center">
                <label class="font-label-md text-label-md text-on-surface" for="login-password">Password</label>
                <NuxtLink to="/forgot-password"
                  class="text-primary font-label-sm text-label-sm hover:underline"
                  type="button"
                >
                  Forgot password?
                </NuxtLink>
              </div>
              <div class="relative">
                <input
                  id="login-password"
                  v-model="loginForm.password"
                  class="w-full px-md py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none"
                  :type="passwordVisible.login ? 'text' : 'password'"
                  placeholder="••••••••"
                />
                <button
                  class="absolute right-md top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                  @click="togglePasswordVisibility('login')"
                  type="button"
                >
                  <svg
                    v-if="!passwordVisible.login"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1"
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
                    stroke-width="1"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M11.83 9L15 12.16V12a3 3 0 0 0-3-3zm-4.3.8l1.55 1.55c-.05.21-.08.42-.08.65a3 3 0 0 0 3 3c.22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53a5 5 0 0 1-5-5c0-.79.2-1.53.53-2.2M2 4.27l2.28 2.28l.45.45C3.08 8.3 1.78 10 1 12c1.73 4.39 6 7.5 11 7.5c1.55 0 3.03-.3 4.38-.84l.43.42L19.73 22L21 20.73L3.27 3M12 7a5 5 0 0 1 5 5c0 .64-.13 1.26-.36 1.82l2.93 2.93c1.5-1.25 2.7-2.89 3.43-4.75c-1.73-4.39-6-7.5-11-7.5c-1.4 0-2.74.25-4 .7l2.17 2.15C10.74 7.13 11.35 7 12 7" />
                  </svg>
                </button>
              </div>
            </div>
            <div class="flex items-center gap-sm">
              <input
                id="remember"
                v-model="loginForm.remember"
                class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
                type="checkbox"
              />
              <label class="font-body-sm text-body-sm text-on-surface-variant" for="remember">Remember me for 30 days</label>
            </div>
            <button
              class="w-full bg-primary-container text-on-primary font-label-md text-label-md py-md rounded-lg hover:opacity-90 transition-all active:scale-[0.98]"
              type="submit"
            >
              Login
            </button>
            <p class="text-center font-body-sm text-body-sm text-on-surface-variant mt-md">
              Don't have an account?
              <NuxtLink to="/register"
                class="text-primary font-bold hover:underline"
                type="button"
              >
                Signup
              </NuxtLink>
            </p>
          </form>
        </div>
      </Transition>
    </div>

    <!-- Background Decoration (Abstract and Subtle) -->
    <div class="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
      <div class="absolute top-[10%] right-[10%] w-96 h-96 bg-primary/5 rounded-full blur-[80px]"></div>
      <div class="absolute bottom-[10%] left-[5%] w-72 h-72 bg-secondary-container/5 rounded-full blur-[60px]"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

// Form states
const loginForm = reactive({
  email: '',
  password: '',
  remember: false,
})


// Password visibility
const passwordVisible = reactive({
  login: false,
  signup: false,
})

// PIN verification
const pinInputs = ref<string[]>(Array(6).fill(''))
const pinRefs = ref<HTMLInputElement[]>([])


// Toggle password visibility
function togglePasswordVisibility(field: 'login') {
  passwordVisible[field] = !passwordVisible[field]
}

// PIN input handlers
function handlePinInput(index: number) {
  // Auto-focus next input
  if (pinInputs.value[index] && pinInputs.value[index].length === 1 && index < 5) {
    pinRefs.value[index + 1]?.focus()
  }
}

function handlePinKeydown(index: number, event: KeyboardEvent) {
  // Handle backspace to focus previous
  if (event.key === 'Backspace' && !pinInputs.value[index] && index > 0) {
    pinRefs.value[index - 1]?.focus()
  }
}

function handleVerify() {
  const code = pinInputs.value.join('')
  if (code.length === 6) {
    console.log('Verification code:', code)
    // Handle verification logic here
    alert('Account verified! Redirecting to dashboard...')
    switchView('login')
    resetForms()
  }
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

/* Optional: Add card animation styles */
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