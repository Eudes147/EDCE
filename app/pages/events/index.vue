<template>
  <section class="p-8 max-w-7xl w-full mx-auto">
<!-- Header Section -->
<div class="flex justify-between items-end mb-8">
<div>
<h2 class="font-h1 text-h1 text-on-background mb-1">Gestion des Événements</h2>
<p class="font-body text-body text-on-surface-variant">Créez les évènements de cette année et associez y des activités annuelles de l'école du dimanche.</p>
</div>
</div>

<!-- Events Table Card -->
<div class="bg-surface-container-lowest rounded-xl soft-shadow overflow-hidden">
<div class="px-6 py-4 border-b border-outline-variant/30 flex justify-between items-center bg-surface-bright">
<h3 class="font-h3 text-h3">Calendrier Annuel</h3>
<div class="flex gap-2">
<select v-model="year" class="px-3 py-1.5 text-small font-small border border-outline-variant rounded-lg flex items-center gap-1 hover:bg-surface-container-low transition-colors">
<Icon color="text-[16px]" name="filter_list" />
    <option value="2026">2026</option>
    <option value="2027">2027</option>

</select>
<button class="px-3 py-1.5 text-small font-small border border-outline-variant rounded-lg flex items-center gap-1 hover:bg-surface-container-low transition-colors">
<Icon color="text-[16px]" name="download" />
pan>
                            Exporter
                        </button>
</div>
</div>
<div class="overflow-x-auto">
<table class="w-full text-left border-collapse">
<thead>
<tr class="bg-surface-container-low/50">
<th class="px-6 py-4 font-caption text-caption text-outline uppercase tracking-wider">Type d'Événement</th>
<th class="px-6 py-4 font-caption text-caption text-outline uppercase tracking-wider text-center">Année</th>
<th class="px-6 py-4 font-caption text-caption text-outline uppercase tracking-wider">Activités</th>
<th class="px-6 py-4 font-caption text-caption text-outline uppercase tracking-wider text-right">Actions</th>
</tr>
</thead>
<tbody class="divide-y divide-outline-variant/20">
<!-- Event Row 1 -->
<tr class="hover:bg-surface-container-low transition-colors group">
<td class="px-6 py-4">
<div class="flex items-center gap-3">
<div class="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary">
<Icon name="festival" />

</div>
<div>
<p class="font-body text-body font-medium">Arbre de Noël</p>
</div>
</div>
</td>
<td class="px-6 py-4 text-center font-body text-body">{{ year }}</td>

<td class="px-6 py-4">

    <button class="bg-primary/5 text-primary px-3 py-1.5 rounded-lg text-small font-medium hover:bg-primary/10 transition-colors flex items-center gap-1">
    <Icon name="settings_suggest" color="text-[18px]" />
                                                Manage Activities
                                            </button>
</td>
<td>
<div class="flex items-center justify-end gap-2">
<button class="p-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors">
<Icon name="visibilty" color="text-[20px]" />
</button>
<button class="p-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors">
<Icon name="edit" color="text-[20px]" />
</button>
<button class="p-2 text-error/80 hover:text-error hover:bg-error-container/20 rounded-lg transition-colors">
<Icon name="delete" color="text-[20px]" />
</button>
</div>
</td>
</tr>
<!-- Event Row 2 -->
<tr class="hover:bg-surface-container-low transition-colors group">
<td class="px-6 py-4">
<div class="flex items-center gap-3">
<div class="w-10 h-10 rounded-lg bg-tertiary-container/10 flex items-center justify-center text-tertiary">
<<Icon name="theater_comedy" />

</div>
<div>
<p class="font-body text-body font-medium">Soirée Récréative des Enfants</p>
</div>
</div>
</td>
<td class="px-6 py-4 text-center font-body text-body">{{ year }}</td>

<td class="px-6 py-4">

<button class="bg-primary/5 text-primary px-3 py-1.5 rounded-lg text-small font-medium hover:bg-primary/10 transition-colors flex items-center gap-1">
<Icon name="settings_suggest" color="text-[18px]" />
                                            Manage Activities
                                        </button>
</td>
<td>
<div class="flex items-center justify-end gap-2">
<button class="p-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors">
<Icon name="visibilty" color="text-[20px]" />
</button>
<button class="p-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors">
<Icon name="edit" color="text-[20px]" />
</button>
<button class="p-2 text-error/80 hover:text-error hover:bg-error-container/20 rounded-lg transition-colors">
<Icon name="delete" color="text-[20px]" />
</button>
</div>
</td>
</tr>
</tbody>
</table>
</div>
</div>

</section>
<footer class="mt-auto p-6 text-center">
<p class="font-caption text-caption text-outline-variant">© 2026 EDCE Management System • Sunday School Interface</p>
</footer>
<div class="fixed bottom-8 right-8 z-50">
<button class="w-14 h-14 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all">
<Icon color="text-[32px]" name="event_available" />
</button>
</div>
</template>
<script setup lang="ts">
import {ref,computed} from 'vue'
import { useActivities } from '~/composables/useActivity';
import type { EventType } from '~/types/activity';

const actualYear = computed(() => new Date().getFullYear().toString())
const year=ref(actualYear.value)
const { groupActivityperEvent, groupActivityperYear, listActivityAtEvent, listActivities }=useActivities()

const getEventActivitiesAssociatedbyEventType=(eventType:EventType)=>{
    return groupActivityperYear.value[year.value]?.map(activity=>{
        const listActivityAtEventbyEventType= listActivityAtEvent.value.filter(event=> event.eventType===eventType)
        const activities= listActivityAtEventbyEventType.map(activity=>{
            return listActivities.value.filter(listActivity=>listActivity.id === activity.activityId)
        })
        return activities
    })
}
definePageMeta({
  layout: 'dashboard',
})
</script>