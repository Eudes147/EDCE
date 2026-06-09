<template>
  <div class="p-6">
    <section class="section-card overflow-hidden" style="transform: translateY(0px);">
<div class="p-6 border-b border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
<h3 class="font-h3 text-h3 flex items-center gap-2">
<Icon name="school" color="text-primary" />
                        Liste des Seances crées cette année
                    </h3>
<div class="flex items-center gap-3">
<select v-model="classeSelected" class="bg-surface-container-low border-none rounded-lg text-small px-4 py-2 focus:ring-primary">
<option v-for="child_classe in classes" :key="child_classe" :value="child_classe">{{ child_classe }}</option>
</select>
</div>
</div>
<div class="overflow-x-auto">
<table class="w-full text-left">
<thead class="bg-surface-container-low border-b border-outline-variant/30">
<tr>
<th class="px-6 py-4 font-caption text-caption uppercase tracking-wider text-outline">Titre</th>
<th class="px-6 py-4 font-caption text-caption uppercase tracking-wider text-outline">Type</th>
<th class="px-6 py-4 font-caption text-caption uppercase tracking-wider text-outline">Classe</th>
<th class="px-6 py-4 font-caption text-caption uppercase tracking-wider text-outline text-right">Actions</th>
</tr>
</thead>
<tbody class="divide-y divide-outline-variant/20">
<tr v-for="seance in getSeancebyMonthAndClasse" class="hover:bg-surface-container-low transition-colors">
<td class="px-6 py-4 flex items-center gap-3">
<div class="bg-primary/10 text-primary flex items-center justify-center font-bold text-small">{{seance.title}}</div>

</td>
<td class="px-6 py-4 text-body">{{ seance.type }}</td>
<td class="px-6 py-4 text-body">{{ seance.classe }}</td>

<td class="px-6 py-4 text-right space-x-2">
<button @click="view(seance)" class="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Voir"><Icon color="text-on-surface-variant" name="visibility" /></button>
<button @click="edit(seance)" class="text-outline hover:text-primary transition-colors"><Icon name="edit" color="text-[20px]"/>
</button>
<button @click="supprimer(seance)" class="text-outline hover:text-error transition-colors"><Icon name="delete" color="text-[20px]"/></button>
</td>
</tr>
</tbody>
</table>
</div>
<!-- View Transaction Modal -->
    <Modal v-model="showViewModal" title="Détails de la séance" :show-footer="false">
      <div v-if="seanceModal" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-doomu-text-muted">ID</p>
            <p class="font-medium text-doomu-text">{{ seanceModal.id }}</p>
          </div>
          <div>
            <p class="text-sm text-doomu-text-muted">Type</p>
            <p class="font-medium text-doomu-text">{{ seanceModal.type }}</p>
          </div>
          <div>
            <p class="text-sm text-doomu-text-muted">Titre</p>
            <p class="font-medium text-doomu-text">{{ seanceModal.title }}</p>
          </div>
          <div>
            <p class="text-sm text-doomu-text-muted">Classe</p>
            <p class="font-medium text-doomu-text">{{ seanceModal.classe }}</p>
          </div>
          <div>
            <p class="text-sm text-doomu-text-muted">Date de création</p>
            <p class="font-medium text-doomu-text">{{ formatDate(seanceModal.created_at) }}</p>
          </div>
          <div>
            <p class="text-sm text-doomu-text-muted">Créé(e) par</p>
            <p class="font-medium text-doomu-text">{{ getAuthorSupervisorbySeance(seanceModal).authorName }}</p>
          </div>
          <div>
            <p class="text-sm text-doomu-text-muted">Supervisé par</p>
            <p class="font-medium text-doomu-text">{{ getAuthorSupervisorbySeance(seanceModal).supervisorName }}</p>
          </div>
  
        </div>
        <div class="flex justify-end pt-4 border-t border-doomu-border">
          <button class="btn-outline" @click="showViewModal = false">Fermer</button>
        </div>
      </div>
    </Modal>
</section>
  </div>
</template>
<script setup lang="ts">
import { definePageMeta } from '#imports';
import { computed, ref } from 'vue';
import { useParticipantSeance } from '~/composables/useParticipant';
import { useSeance } from '~/composables/useSeance';
import { classes } from '~/stores/child';
import type { ClasseType } from '~/types/classe';
import type { Month } from '~/types/index';
import type { Seance } from '~/types/seance';

const showViewModal=ref(false)
const seanceModal=ref<Seance>()


  definePageMeta({
    layout: 'dashboard'
  })
  
  const months = ref<Month[]>([
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre'
  ])

  const {getChildbySeanceId, getAuthorSupervisorbySeance}=useParticipantSeance()
const monthSelected = ref<Month>('janvier')
  const formatDate = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateStr).toLocaleDateString('fr-FR', options)
  }

  const actualYear = computed(() => new Date().getFullYear().toString())
  const classeSelected=ref<ClasseType>("Petit")
  const {groupSeanceperYear}= useSeance()
  const getSeanceActualYear=computed(()=>{
    return groupSeanceperYear.value[actualYear.value]
  })
  const getSeancebyMonthAndClasse=computed(()=>{
    return getSeanceActualYear.value?.filter(seance=>{
      const seanceMonth=new Date(seance.created_at).toLocaleString('fr-FR', {month: 'long'})
      return seanceMonth.toLowerCase() ===monthSelected.value && seance.classe === classeSelected.value

    })
  })

  const view=(seance: Seance)=>{
    seanceModal.value=seance
    showViewModal.value=!showViewModal.value
  }
  const edit=(seance: Seance)=>{
    return 
  }
  const supprimer=(seance: Seance)=>{
    return 
  }

</script>
