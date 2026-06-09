<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="handleBackdropClick"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" />

        <!-- Modal content -->
        <div
          :class="[
            'relative bg-white rounded-xl shadow-xl w-full animate-slide-up flex flex-col max-h-[90vh]',
            sizeClasses
          ]"
          role="dialog"
          aria-modal="true"
        >
          <!-- Header -->
          <div v-if="title || $slots.header" class="px-6 py-4 border-b border-doomu-border flex-shrink-0">
            <slot name="header">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-doomu-text">{{ title }}</h3>
                <button
                  v-if="closable"
                  type="button"
                  class="p-1 rounded-lg text-doomu-text-muted hover:text-doomu-text hover:bg-doomu-bg transition-colors"
                  @click="close"
                >
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </slot>
          </div>

          <!-- Body (scrollable) -->
          <div :class="['p-6 overflow-y-auto flex-1', bodyClass]">
            <slot />
          </div>

          <!-- Footer (toujours visible en bas) -->
          <div v-if="$slots.footer" class="px-6 py-4 border-t border-doomu-border bg-doomu-bg/30 rounded-b-xl flex-shrink-0 flex items-center justify-end gap-3">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import {ref, computed} from 'vue'
type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

const props = withDefaults(defineProps<{
  modelValue: boolean
  title?: string
  size?: ModalSize
  closable?: boolean
  closeOnBackdrop?: boolean
  bodyClass?: string
}>(), {
  size: 'md',
  closable: true,
  closeOnBackdrop: true,
  bodyClass: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

const sizeClasses = computed(() => {
  const sizes: Record<ModalSize, string> = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-4xl',
  }
  return sizes[props.size]
})

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

const handleBackdropClick = () => {
  if (props.closeOnBackdrop) {
    close()
  }
}

// Close on escape
onMounted(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && props.modelValue && props.closable) {
      close()
    }
  }
  document.addEventListener('keydown', handleEscape)
  onUnmounted(() => document.removeEventListener('keydown', handleEscape))
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
