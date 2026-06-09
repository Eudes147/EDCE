/**
 * Composable pour la gestion des notifications toast
 */
export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  duration?: number
}
import { ref, readonly } from "vue"

const toasts = ref<Toast[]>([])

export const useToast = () => {
  const add = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast: Toast = { ...toast, id }
    toasts.value.push(newToast)

    // Auto-remove after duration
    const duration = toast.duration ?? 5000
    if (duration > 0) {
      setTimeout(() => {
        remove(id)
      }, duration)
    }

    return id
  }

  const remove = (id: string) => {
    const index = toasts.value.findIndex((t) => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const success = (titleOrMessage: string, message?: string, duration?: number) => {
    if (message) {
      return add({ type: 'success', title: titleOrMessage, message, duration })
    }
    return add({ type: 'success', message: titleOrMessage, duration })
  }

  const error = (titleOrMessage: string, message?: string, duration?: number) => {
    if (message) {
      return add({ type: 'error', title: titleOrMessage, message, duration })
    }
    return add({ type: 'error', message: titleOrMessage, duration })
  }

  const warning = (titleOrMessage: string, message?: string, duration?: number) => {
    if (message) {
      return add({ type: 'warning', title: titleOrMessage, message, duration })
    }
    return add({ type: 'warning', message: titleOrMessage, duration })
  }

  const info = (titleOrMessage: string, message?: string, duration?: number) => {
    if (message) {
      return add({ type: 'info', title: titleOrMessage, message, duration })
    }
    return add({ type: 'info', message: titleOrMessage, duration })
  }

  return {
    toasts: readonly(toasts),
    add,
    remove,
    success,
    error,
    warning,
    info,
  }
}
