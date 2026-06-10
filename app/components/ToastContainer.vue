<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-50 space-y-2">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]',
            typeClasses[toast.type],
          ]"
        >
          <span class="text-xl">{{ typeIcons[toast.type] }}</span>
          <div class="flex-1">
            <p v-if="toast.title" class="font-semibold">{{ toast.title }}</p>
            <p :class="{ 'text-sm opacity-90': toast.title }">{{ toast.message }}</p>
          </div>
          <button
            class="text-current opacity-70 hover:opacity-100"
            @click="removeToast(toast.id)"
          >
            ✕
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const { toasts, remove: removeToast } = useToast()

const typeClasses: Record<string, string> = {
  success: 'bg-green-600 text-white',
  error: 'bg-red-600 text-white',
  warning: 'bg-secondary text-white',
  info: 'bg-primary text-white',
}

const typeIcons: Record<string, string> = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
