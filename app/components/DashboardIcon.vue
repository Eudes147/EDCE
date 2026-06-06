<template>
  <svg
    aria-hidden="true"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    viewBox="0 0 24 24"
  >
    <template v-if="name === 'dashboard'">
      <rect height="7" width="7" x="3" y="3" />
      <rect height="7" width="7" x="14" y="3" />
      <rect height="7" width="7" x="14" y="14" />
      <rect height="7" width="7" x="3" y="14" />
    </template>
    <template v-else-if="name === 'school'">
      <path d="m22 10-10-5-10 5 10 5 10-5Z" />
      <path d="M6 12v5c3 2 9 2 12 0v-5" />
      <path d="M22 10v6" />
    </template>
    <template v-else-if="name === 'child_care'">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.8 10.2h.01" />
      <path d="M15.2 10.2h.01" />
      <path d="M8.8 15.1c1.8 1.7 4.6 1.7 6.4 0" />
      <path d="M9.2 4.4c.7 1 1.8 1.6 3.1 1.6 1 0 1.9-.4 2.6-1" />
      <path d="M4.3 12H3" />
      <path d="M21 12h-1.3" />
    </template>
    <template v-else-if="name === 'quiz'">
      <path d="M5 4h11v16H5z" />
      <path d="M16 8h3v13H8v-1" />
      <path d="M9 8.4c.5-.9 1.3-1.4 2.3-1.4 1.5 0 2.7.9 2.7 2.3 0 2-3 1.8-3 3.7" />
      <path d="M11 16h.01" />
    </template>
    <template v-else-if="name === 'group'">
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19v-1.5A4.5 4.5 0 0 1 8 13h2a4.5 4.5 0 0 1 4.5 4.5V19" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M15.5 14h1.8a3.7 3.7 0 0 1 3.7 3.7V19" />
    </template>
    <template v-else-if="name === 'settings'">
      <path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z" />
      <path d="M19.4 15a1.8 1.8 0 0 0 .36 2l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.8 1.8 0 0 0-2-.36 1.8 1.8 0 0 0-1 1.64V21a2 2 0 1 1-4 0v-.09a1.8 1.8 0 0 0-1-1.64 1.8 1.8 0 0 0-2 .36l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.8 1.8 0 0 0 .36-2 1.8 1.8 0 0 0-1.64-1H3a2 2 0 1 1 0-4h.09a1.8 1.8 0 0 0 1.64-1 1.8 1.8 0 0 0-.36-2l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.8 1.8 0 0 0 2 .36h.01A1.8 1.8 0 0 0 10 3.09V3a2 2 0 1 1 4 0v.09a1.8 1.8 0 0 0 1 1.64 1.8 1.8 0 0 0 2-.36l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.8 1.8 0 0 0-.36 2v.01A1.8 1.8 0 0 0 20.91 10H21a2 2 0 1 1 0 4h-.09A1.8 1.8 0 0 0 19.4 15Z" />
    </template>
    <template v-else-if="name === 'search'">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </template>
    <template v-else-if="name === 'notifications'">
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </template>
    <template v-else-if="name === 'help'">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.1 9a3 3 0 1 1 5.8 1c-.5 1.4-2.1 1.8-2.6 3" />
      <path d="M12 17h.01" />
    </template>
    <template v-else-if="name === 'add_circle'">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v8" />
      <path d="M8 12h8" />
    </template>
    <template v-else-if="name === 'person_add'">
      <path d="M16 21v-2a4 4 0 0 0-8 0v2" />
      <circle cx="12" cy="7" r="4" />
      <path d="M19 8v6" />
      <path d="M22 11h-6" />
    </template>
    <template v-else-if="name === 'visibility'">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </template>
    <template v-else-if="name === 'edit'">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
    </template>
    <template v-else-if="name === 'delete'">
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6 18 20H6L5 6" />
      <path d="M10 11v5" />
      <path d="M14 11v5" />
    </template>
    <template v-else-if="name === 'more_vert'">
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="19" r="1" />
    </template>
    <template v-else-if="name === 'call'">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.7.6 2.5a2 2 0 0 1-.5 2.1L8 9.5a16 16 0 0 0 6.5 6.5l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.6.5 2.5.6a2 2 0 0 1 1.7 2Z" />
    </template>
    <template v-else-if="name === 'chat'">
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" />
    </template>
    <template v-else-if="name === 'menu'">
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
    </template>
    <template v-else-if="name === 'close'">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </template>
    <template v-else-if="name === 'trending_up'">
      <path d="m3 17 6-6 4 4 7-7" />
      <path d="M14 8h6v6" />
    </template>
    <template v-else-if="name === 'event'">
      <rect height="18" rx="2" width="18" x="3" y="4" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h18" />
    </template>
    <template v-else-if="name === 'workspace_premium'">
      <circle cx="12" cy="8" r="5" />
      <path d="m8.5 13.5-1.5 8 5-3 5 3-1.5-8" />
    </template>
    <template v-else-if="name === 'calendar_add_on'">
      <rect height="18" rx="2" width="18" x="3" y="4" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h18" />
      <path d="M12 14v4" />
      <path d="M10 16h4" />
    </template>
    <template v-else-if="name === 'description'">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h8" />
    </template>
    <template v-else-if="name === 'mail'">
      <rect height="16" rx="2" width="20" x="2" y="4" />
      <path d="m22 7-10 6L2 7" />
    </template>
  </svg>
</template>

<script setup lang="ts">
defineProps<{
  name: string
}>()
</script>
