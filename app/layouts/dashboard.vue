<template>
  <div class="font-body-md overflow-x-hidden md:overflow-hidden">
    <div class="flex min-h-[max(884px,100dvh)] w-full bg-background text-on-surface md:h-screen md:min-h-0">
        <aside class="w-[240px] h-screen fixed left-0 top-0 bg-surface-container-low  flex flex-col py-6 z-50">
          <div class="px-6 mb-8">
          <div class="flex items-center gap-3">
  
          <div>
          <h1 class="font-h2 text-h2 font-bold text-primary leading-none tracking-wide mb-1">EDCE</h1>
          <p class="font-caption text-caption text-on-surface-variant opacity-70">Sunday School Plateform</p>
          </div>
          </div>
          </div>
          <nav class="flex-1 overflow-y-auto custom-scrollbar">
          <div class="space-y-1">
            <NuxtLink v-for="icon_link in linksDashboard" :key="icon_link.label" active-class="border-l border-primary bg-surface-container text-primary font-bold px-4 py-3 flex items-center gap-3 transition-colors" class="text-on-surface-variant hover:text-on-surface px-4 py-3 flex items-center gap-3 transition-colors hover:bg-surface-container-high" :to="icon_link.to">
              <Icon :name="icon_link.icon" size="1.5rem" />
              <span class="font-body text-body">{{ icon_link.label }}</span>
            </NuxtLink>
          </div>
          </nav>
          <div class="mt-auto px-4 space-y-1">
          <a class="text-on-surface-variant hover:text-on-surface px-4 py-3 flex items-center gap-3 transition-colors hover:bg-surface-container-high rounded-xl" href="#">
          <Icon name='notifications' size="1.5rem" />
          <span class="font-body text-body">Notifications</span>
          </a>
          <div class="p-4 bg-surface-container-high rounded-xl mt-4 flex items-center gap-3">
          <img alt="User Profile" class="w-8 h-8 rounded-full bg-primary-container" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAx9cmH0QVrDAlGaAE8ky1tvHpelF9_63bajVuHkiQh7Bfn2lXq99Sb3BVLGwgjqv6RTGVnXwA76ZQByUU4Al_g8nUHVXjO5YKQd5dcGFRo4pOVEpy0VCdChxP1GaLBr4uXiq7sJOAYxcb89DUMLpYedqhSu7daQalD14_Ozeus1IWjOCcNF1AZ_-r9ja7fivFnfe7gB886W2cGfX6T_jMmilEDKfqNihuOwJ_s0AanrjBbDC0rCAJ0OzPzCNi5NKtmxgM5DyVQGaQ">
          <div class="overflow-hidden">
          <p class="font-body text-body font-bold truncate">Admin User</p>
          <p class="font-caption text-caption opacity-60">Super Admin</p>
          </div>
          </div>
          </div>
          </aside>
          <header class="fixed top-0 right-0 left-[240px] h-[56px] flex justify-between items-center px-6 z-40 bg-surface-container-lowest border-b border-outline-variant shadow-sm">
            <div class="flex items-center gap-2">
            <span class="font-small text-small text-on-surface-variant">EDCE</span>
            <Icon name='chevron_right' size="1.5rem" />

            <span class="font-body text-body font-bold text-primary">{{actualSection}}</span>
            </div>
            <div class="flex items-center gap-4">
            <button class="p-2 hover:bg-surface-container-high rounded-full transition-colors cursor-pointer">
            <Icon name="search" size="1.5rem" />
            </button>
            <button class="p-2 hover:bg-surface-container-high rounded-full transition-colors cursor-pointer relative">
            <Icon name="notifications" size="1.5rem" />
            <span class="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-surface-container-lowest"></span>
            </button>
            </div>
          </header>
      <main class="ml-[240px] pt-[56px] min-h-screen overflow-y-auto" style="width: stretch">
        <slot />
      </main>

      <!-- <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-outline-variant h-16 flex items-center justify-around px-margin-mobile z-50">
        <NuxtLink active-class="text-primary border-l border-on-primary-fixed-variant" v-for="icon_link in linksDashboard" :key="icon_link.label" class="text-on-surface-variant hover:text-on-surface px-4 py-3 flex items-center gap-3 transition-colors hover:bg-surface-container-high" :to="icon_link.to">
          <Icon :name="icon_link.icon" class="w-6 h-6" />
          <span class="font-body-lg sm:text-body-sm md:text-body-md lg:text-body-lg">{{ icon_link.label }}</span>
        </NuxtLink>
      </nav> -->
    </div>
  </div>
</template>

<script setup lang="ts">
const isMobileMenuOpen = ref(false)
const isMobileMenuVisible = ref(false)
const actualSection=ref("")
const route=useRoute()


const linksDashboard= [
  {to: '/dashboard', icon:'dashboard', label: 'Tableau de bord'},
  {to: '/seances/teacher', icon:'calendar_today', label: 'Séances'},
  {to: '/classes', icon:'groups', label: 'Classes'},
  {to: '/children', icon:'child_care', label: 'Enfants'},
  {to: '/tests', icon:'assignment', label: 'Tests'},
  {to: '/teachers', icon:'school', label: 'Moniteurs'},
  {to: '/events', icon:'event', label: 'Evènement'},
  {to: '/activities', icon:'history', label: 'Activités'},
  {to: '/settings', icon:'settings', label: 'Paramètres'},

]


// Nuxt va surveiller l'URL. Dès qu'elle change, il cherche le label correspondant.
watchEffect(() => {
  const currentLink = linksDashboard.find(link => link.to === route.path)
  if (currentLink) {
    actualSection.value = currentLink.label
  }
})

function showMenu() {
  isMobileMenuOpen.value = true
  window.setTimeout(() => {
    isMobileMenuVisible.value = true
  }, 10)
}

function hideMenu() {
  isMobileMenuVisible.value = false
  window.setTimeout(() => {
    isMobileMenuOpen.value = false
  }, 300)
}

provide('showDashboardMenu', showMenu)
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
        .modal-open {
            overflow: hidden;
        }

        
        body { font-family: 'Sora', sans-serif; }
        h1, h2, h3 { font-family: 'Outfit', sans-serif; }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            vertical-align: middle;
        }
        .active-tab-indicator {
            view-transition-name: active-tab;
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
    
</style>
