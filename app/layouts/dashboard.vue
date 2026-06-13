<template>
  <div class="font-body-md overflow-x-hidden md:overflow-hidden bg-background min-h-screen">
    <div class="flex flex-col md:flex-row w-full md:h-screen">
      
      <!-- 🖥️ SIDEBAR (DESKTOP) -->
      <aside class="hidden md:flex w-[240px] h-screen fixed left-0 top-0 bg-surface-container-low flex-col py-6 z-50 border-r border-outline-variant/20">
        <div class="px-6 mb-8">
          <div class="flex items-center gap-3">
            <div>
              <h1 class="font-h2 text-h2 font-bold text-primary leading-none tracking-wide mb-1">EDCE</h1>
              <p class="font-caption text-caption text-on-surface-variant opacity-70">Sunday School Platform</p>
            </div>
          </div>
        </div>
        
        <nav class="flex-1 overflow-y-auto custom-scrollbar">
          <div class="space-y-1">
            <NuxtLink 
              v-for="icon_link in filteredLinks" 
              :key="icon_link.label" 
              active-class="border-l-4 border-primary bg-surface-container text-primary font-bold" 
              class="text-on-surface-variant hover:text-on-surface px-4 py-3 flex items-center gap-3 transition-colors hover:bg-surface-container-high" 
              :to="icon_link.to"
            >
              <Icon :name="icon_link.icon" size="1.5rem" />
              <span class="font-body text-body">{{ icon_link.label }}</span>
            </NuxtLink>
          </div>
        </nav>
        
        <div class="mt-auto px-4 space-y-1">
          <a class="text-on-surface-variant hover:text-on-surface px-4 py-3 flex items-center gap-3 transition-colors hover:bg-surface-container-high rounded-xl" href="#" @click="toast.info('Fonctionnalité à venir')">
            <Icon name='notifications' size="1.5rem" />
            <span class="font-body text-body">Notifications</span>
          </a>
          <div class="p-4 bg-surface-container-high rounded-xl mt-4 flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-white font-bold text-xs uppercase flex-shrink-0">
              {{ authStore.fullName ? authStore.fullName.charAt(0) : 'U' }}
            </div>
            <div class="overflow-hidden">
              <p class="font-body text-sm font-bold truncate">{{ authStore.fullName }}</p>
              <p class="font-caption text-[10px] uppercase tracking-wider opacity-60">{{ (authStore?.userStatus || 'teacher').toUpperCase() }}</p>
            </div>
          </div>
        </div>
      </aside>

      <!-- 📱 HEADER (MOBILE & TABLET) -->
      <header class="md:hidden h-[56px] bg-surface-container-lowest border-b border-outline-variant/30 flex items-center justify-between px-4 fixed top-0 left-0 right-0 z-40 shadow-sm">
        <div class="flex items-center gap-2">
          <h1 class="font-h2 text-base font-bold text-primary mr-1">EDCE</h1>
          <Icon name='chevron_right' size="1.1rem" class="text-outline-variant" />
          <span class="text-sm font-bold text-on-surface">{{ actualSection }}</span>
        </div>
        <div class="flex items-center justify-center gap-2">
          <div class="flex justify-center items-center gap-2">
            <button @click="handleLogout" title="Déconnexion" class="p-2 hover:bg-surface-container-high rounded-full transition-colors relative">
              <Icon name="logout" size="1.3rem" />
            </button>
          </div>
          <div :title="authStore.fullName" class="w-8 h-8 md:w-12 md:h-12  rounded-full bg-secondary-container flex justify-center items-center text-white hover:cursor-pointer">
          <span>{{ authStore.userInitials }}</span>
          </div>
        </div>
        
      </header>

      <!-- 📱 NAVIGATION BASSE RESPONSIVE (MOBILE) -->
      <!-- Changement : overflow-x-auto, scrollbar-none et ajustement de l'alignement selon le nombre d'éléments -->
      <nav 
        class="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-outline-variant/30 flex items-center px-2 z-50 shadow-[0_-4px_16px_rgba(15,23,42,0.05)] overflow-x-auto scrollbar-none"
        :class="filteredLinks.length <= 5 ? 'justify-around' : 'justify-start gap-1'"
      >
        <NuxtLink 
          v-for="icon_link in mobileLinks" 
          :key="`mobile-${icon_link.label}`" 
          :to="icon_link.to"
          class="flex flex-col items-center justify-center gap-0.5 h-full text-on-surface-variant transition-colors min-w-[68px] shrink-0"
          :class="filteredLinks.length <= 5 ? 'flex-1' : 'w-[72px]'"
          active-class="text-primary font-bold"
        >
          <Icon :name="icon_link.icon" size="1.3rem" />
          <span class="text-[10px] font-medium tracking-wide truncate max-w-[64px]">{{ icon_link.label }}</span>
        </NuxtLink>
      </nav>

      <!-- 🖥️ CONTENU PRINCIPAL & HEADER DESKTOP -->
      <div class="flex-1 flex flex-col min-w-0 md:pl-[240px]">
        
        <header class="hidden md:flex h-[56px] fixed top-0 right-0 left-[240px] justify-between items-center px-6 z-40 bg-surface-container-lowest border-b border-outline-variant/40 shadow-sm">
          <div class="flex items-center gap-2">
            <span class="font-small text-small text-on-surface-variant">EDCE</span>
            <Icon name='chevron_right' size="1.5rem" />
            <span class="font-body text-body font-bold text-primary">{{ actualSection }}</span>
          </div>
          <div class="flex items-center gap-4">
            <button class="p-2 hover:bg-surface-container-high rounded-full transition-colors cursor-pointer">
              <Icon name="search" size="1.5rem" />
            </button>
            <div class="flex items-center justify-center gap-2">
          <div class="flex items-center gap-2">
            <button @click="handleLogout" title="Déconnexion" class="p-2 hover:bg-surface-container-high rounded-full transition-colors relative">
              <Icon name="logout" size="1.3rem" />
            </button>
          </div>
          <div :title="authStore.fullName" class="w-8 h-8 md:w-12 md:h-12 rounded-full bg-secondary-container flex justify-center items-center text-white hover:cursor-pointer">
          <span>{{ authStore.userInitials }}</span>
          </div>
        </div>
          </div>
        </header>

        <main class="flex-1 p-4 md:p-6 pt-[72px] md:pt-[76px] pb-24 md:pb-6 overflow-y-auto">
          <slot />
        </main>

      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import {useToast} from '~/composables/useToast'

const toast=useToast()
const route = useRoute()
const authStore = useAuthStore()

const linksDashboard = computed(() => [
  { to: '/dashboard', icon: 'dashboard', label: 'Dashboard', display: authStore.isAdmin },
  { to: '/seances/admin', icon: 'calendar_today', label: 'Séances', display: authStore.isAdmin },
  { to: '/seances/teacher', icon: 'calendar_today', label: 'Séances', display: !authStore.isAdmin },
  { to: '/classes', icon: 'groups', label: 'Classes', display: authStore.isAdmin },
  { to: '/children', icon: 'child_care', label: 'Enfants', display: true },
  { to: '/tests', icon: 'assignment', label: 'Tests', display: true },
  { to: '/teachers', icon: 'school', label: 'Moniteurs', display: authStore.isAdmin },
  { to: '/events', icon: 'event', label: 'Evènements', display: authStore.isAdmin },
  { to: '/activities', icon: 'history', label: 'Activités', display: true },
  { to: '/settings', icon: 'settings', label: 'Paramètres', display: authStore.isAdmin },
  { to: '/schedule', icon: 'event_busy', label: 'Planning', display: !authStore.isAdmin },
])

// Liens filtrés pour la version Desktop
const filteredLinks = computed(() => linksDashboard.value.filter(link => link.display))

// Changement : On expose TOUS les liens pour que l'overflow gère le défilement horizontal de manière naturelle
const mobileLinks = computed(() => filteredLinks.value)

// Détermination dynamique de la section courante
const actualSection = computed(() => {
  const currentLink = filteredLinks.value.find(link => route.path.startsWith(link.to))
  return currentLink ? currentLink.label : "EDCE"
})

//Logique de logout
const handleLogout= async()=>{
  await authStore.logout()
}
</script>

<style>
.glass-card {
  background: #FFFFFF;
  border: 1px solid #E8E4DE;
  border-radius: 12px;
}
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e1ed;
  border-radius: 10px;
}

/* Utilitaires pour masquer la scrollbar visuelle sur la Bottom Nav mobile */
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

body { font-family: 'Sora', sans-serif; }
h1, h2, h3 { font-family: 'Outfit', sans-serif; }
</style>