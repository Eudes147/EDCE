<template>
<div class="p-8 max-w-[1400px] mx-auto space-y-8">
<!-- Header Section -->
<div class="flex justify-between items-end">
<div>
<h2 class="font-h1 text-h1 text-on-surface">Gestion des Enseignants</h2>
<p class="font-body text-body text-on-surface-variant mt-2">Gérez vos équipes pédagogiques et leur planning mensuel.</p>
</div>
</div>
<!-- Teachers List Table -->
<section class="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm">
<div class="p-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low/30">
<div class="relative w-72">
<Icon color="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]" name="search" />
<input class="w-full bg-surface-bright border border-outline-variant rounded-lg pl-10 pr-4 py-2 text-body font-body focus:ring-2 focus:ring-primary focus:border-transparent outline-none" placeholder="Rechercher un enseignant..." type="text">
</div>
<div class="flex items-center gap-2">
<button class="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors">
<Icon name="filter_list" />

</button>
<button class="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors">
<Icon name="download" />

</button>
</div>
</div>
<div class="overflow-x-auto">
<table class="w-full text-left border-collapse">
<thead>
<tr class="bg-surface-container-low/50">
<th class="px-6 py-4 font-body text-body font-bold text-on-surface">Nom</th>
<th class="px-6 py-4 font-body text-body font-bold text-on-surface">Prénom</th>
<th class="px-6 py-4 font-body text-body font-bold text-on-surface">Tel.</th>
<th class="px-6 py-4 font-body text-body font-bold text-on-surface">Disponibilité</th>
<th class="px-6 py-4 font-body text-body font-bold text-on-surface text-right">Actions</th>
</tr>
</thead>
<tbody class="divide-y divide-outline-variant">

<!-- Teacher Row 3 -->
<tr v-for="teacher in listTeachers.slice(0,3)" :key="teacher.id" class="hover:bg-surface-container-low transition-colors group">
<td class="px-6 py-4 font-body text-body text-on-surface font-semibold">{{teacher.first_name.toUpperCase()}}</td>
<td class="px-6 py-4 font-body text-body text-on-surface-variant">{{teacher.last_name}}</td>
<td class="px-6 py-4 font-body text-body text-on-surface-variant">{{ teacher.tel }}</td>
<td class="px-6 py-4 font-body text-body text-on-surface-variant">{{teacher.isAvailable? 'Oui': 'Non'}}</td>
<td class="px-6 py-4 text-right">
<button class="p-1.5 rounded-md hover:bg-surface-container-high text-on-surface-variant transition-colors">
<Icon name="more_vert" color="text-[20px]" />

</button>
</td>
</tr>
</tbody>
</table>
</div>
<div class="px-6 py-3 border-t border-outline-variant flex justify-between items-center bg-surface-container-low/10">
<span class="font-small text-small text-on-surface-variant">Affichage 1-3 de {{ listTeachers.length }} teachers</span>
<div class="flex gap-2">
<button class="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container-high transition-colors">
<Icon name="chevron_left" color="text-[18px]" />

</button>
<button class="w-8 h-8 flex items-center justify-center rounded bg-primary text-on-primary font-small text-small">1</button>
<button class="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container-high transition-colors">
<Icon name="chevron_right" color="text-[18px]" />

</button>
</div>
</div>
</section>
<!-- Emploi du Temps Mensuel Section -->
<section class="space-y-4">
<div class="flex justify-between items-center">
<div>
<h3 class="font-h2 text-h2 text-on-surface">Emploi du Temps Mensuel</h3>
<p class="font-body text-body text-on-surface-variant">Affectations pour le mois de Novembre 2024</p>
</div>
<div class="flex items-center gap-3">
<div class="flex items-center bg-surface-container-low p-1 rounded-lg border border-outline-variant">
<button class="px-4 py-1.5 rounded-md bg-surface-container-lowest shadow-sm text-primary font-body text-body font-semibold">Ce mois</button>
<button class="px-4 py-1.5 rounded-md text-on-surface-variant font-body text-body hover:bg-surface-container-high transition-all">Mois prochain</button>
</div>
<button class="flex items-center gap-2 bg-secondary text-on-secondary px-5 py-2.5 rounded-lg font-body text-body font-semibold shadow-sm hover:opacity-90 active:scale-95 transition-all">
<Icon name="publish" color="text-[20px]" />

<span>Publier emploi du temps</span>
</button>
</div>
</div>
<div class="grid grid-cols-4 gap-1 bg-neutral-200 border border-outline-variant rounded-xl overflow-hidden custom-shadow-subtle">
<!-- Grid Header -->
<div class="bg-surface-container-high p-4 font-body text-body font-bold text-on-surface text-center">Dates (Dimanches)</div>
<div class="bg-surface-container-high p-4 font-body text-body font-bold text-primary text-center" style="z-index: 1;">NORMAL</div>
<div class="bg-surface-container-high p-4 font-body text-body font-bold text-secondary text-center" style="z-index: 1;">SUNDAY_SCHOOL</div>
<div class="bg-surface-container-high p-4 font-body text-body font-bold text-tertiary text-center" style="z-index: 1;">DLT</div>
<!-- Row 1 -->
<div class="bg-surface-container-low p-4 flex items-center justify-center font-body text-body font-semibold border-r border-outline-variant/30" style="z-index: 1;">
                        Dim 3 Nov
                    </div>
<div class="bg-surface-container-lowest p-4 group hover:bg-primary-container/5 transition-colors cursor-pointer relative" style="z-index: 1;">
<div class="flex flex-col gap-2">
<span class="font-small text-small bg-primary-container/10 text-primary px-2 py-1 rounded-md text-center">Tshibamba Caleb</span>
<span class="font-small text-small bg-primary-container/10 text-primary px-2 py-1 rounded-md text-center">Kabamba Jon</span>
</div>
</div>
<div class="bg-surface-container-lowest p-4 hover:bg-secondary-container/5 transition-colors cursor-pointer" style="z-index: 1;">
<span class="font-small text-small bg-secondary-container/10 text-secondary px-2 py-1 rounded-md block text-center">Mutombo Déborah</span>
</div>
<div class="bg-surface-container-lowest p-4 hover:bg-tertiary-container/5 transition-colors cursor-pointer" style="z-index: 1;">
<span class="font-small text-small bg-tertiary-container/10 text-tertiary px-2 py-1 rounded-md block text-center">Luzolo Marc</span>
</div>
<!-- Row 2 -->
<div class="bg-surface-container-low p-4 flex items-center justify-center font-body text-body font-semibold border-r border-outline-variant/30">
                        Dim 10 Nov
                    </div>
<div class="bg-surface-container-lowest p-4 hover:bg-primary-container/5 transition-colors cursor-pointer">
<span class="font-small text-small bg-primary-container/10 text-primary px-2 py-1 rounded-md block text-center">Mwamba Jean</span>
</div>
<div class="bg-surface-container-lowest p-4 hover:bg-secondary-container/5 transition-colors cursor-pointer" style="z-index: 1;">
<div class="flex flex-col gap-2">
<span class="font-small text-small bg-secondary-container/10 text-secondary px-2 py-1 rounded-md text-center">Nkulu Sarah</span>
<span class="font-small text-small bg-secondary-container/10 text-secondary px-2 py-1 rounded-md text-center">Mpiana Paul</span>
</div>
</div>
<div class="bg-neutral-100 p-4 flex items-center justify-center group" style="z-index: 1;">
<button class="opacity-0 group-hover:opacity-100 transition-opacity bg-surface-container-lowest p-1.5 rounded-full border border-outline-variant text-on-surface-variant hover:text-primary">
<Icon name="add" color="text-[18px]" />

</button>
</div>
<!-- Row 3 -->
<div class="bg-surface-container-low p-4 flex items-center justify-center font-body text-body font-semibold border-r border-outline-variant/30">
                        Dim 17 Nov
                    </div>
<div class="bg-surface-container-lowest p-4 hover:bg-primary-container/5 transition-colors cursor-pointer" style="z-index: 1;">
<span class="font-small text-small bg-primary-container/10 text-primary px-2 py-1 rounded-md block text-center">Luntadila Ruth</span>
</div>
<div class="bg-neutral-100 p-4 flex items-center justify-center group">
<button class="opacity-0 group-hover:opacity-100 transition-opacity bg-surface-container-lowest p-1.5 rounded-full border border-outline-variant text-on-surface-variant hover:text-primary">
<Icon name="add" color="text-[18px]" />
</button>
</div>
<div class="bg-surface-container-lowest p-4 hover:bg-tertiary-container/5 transition-colors cursor-pointer" style="z-index: 1;">
<span class="font-small text-small bg-tertiary-container/10 text-tertiary px-2 py-1 rounded-md block text-center">Tshibamba Caleb</span>
</div>
<!-- Row 4 -->
<div class="bg-surface-container-low p-4 flex items-center justify-center font-body text-body font-semibold border-r border-outline-variant/30">
                        Dim 24 Nov
                    </div>
<div class="bg-surface-container-lowest p-4 hover:bg-primary-container/5 transition-colors cursor-pointer">
<span class="font-small text-small bg-primary-container/10 text-primary px-2 py-1 rounded-md block text-center">Kabamba Jon</span>
</div>
<div class="bg-surface-container-lowest p-4 hover:bg-secondary-container/5 transition-colors cursor-pointer">
<span class="font-small text-small bg-secondary-container/10 text-secondary px-2 py-1 rounded-md block text-center">Mutombo Déborah</span>
</div>
<div class="bg-surface-container-lowest p-4 hover:bg-tertiary-container/5 transition-colors cursor-pointer">
<span class="font-small text-small bg-tertiary-container/10 text-tertiary px-2 py-1 rounded-md block text-center">Mwamba Jean</span>
</div>
</div>
</section>
</div>
<div :class="[activeTeacherModal ? '' : 'hidden','fixed inset-0 z-[100] flex items-center justify-center']" id="teacherModal">
<div class="modal-overlay absolute inset-0" @click="activeTeacherModal=false"></div>
<div class="bg-surface-container-lowest w-full max-w-lg rounded-xl shadow-2xl z-10 overflow-hidden relative transform scale-100 transition-transform border border-outline-variant">
<!-- Modal Header -->
<div class="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low/30">
<h3 class="font-h2 text-h2 text-on-surface">Ajouter un Enseignant</h3>
<button class="p-2 rounded-full hover:bg-surface-container-high text-on-surface-variant transition-colors" @click="activeTeacherModal=false">
<Icon name="close" />

</button>
</div>
<!-- Modal Form -->
<div class="p-6 space-y-4">
<div class="grid grid-cols-2 gap-4">
<div class="space-y-1.5" style="z-index: 1;">
<label class="font-small text-small font-bold text-on-surface-variant">Nom</label>
<input class="w-full bg-surface-bright border border-outline-variant rounded-lg px-4 py-2 font-body text-body focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="Ex: Tshibamba" type="text">
</div>
<div class="space-y-1.5" style="z-index: 1;">
<label class="font-small text-small font-bold text-on-surface-variant">Prénom</label>
<input class="w-full bg-surface-bright border border-outline-variant rounded-lg px-4 py-2 font-body text-body focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="Ex: Caleb" type="text">
</div>
</div>
<div class="space-y-1.5">
<label class="font-small text-small font-bold text-on-surface-variant">Profession</label>
<input class="w-full bg-surface-bright border border-outline-variant rounded-lg px-4 py-2 font-body text-body focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="Ex: Architecte" type="text">
</div>
<div class="grid grid-cols-2 gap-4">
<div class="space-y-1.5" style="z-index: 1;">
<label class="font-small text-small font-bold text-on-surface-variant">Situation Matrimoniale</label>
<select class="w-full bg-surface-bright border border-outline-variant rounded-lg px-4 py-2 font-body text-body focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all">
<option>Célibataire</option>
<option>Marié(e)</option>
<option>Veuf/Veuve</option>
</select>
</div>
<div class="space-y-1.5" style="z-index: 1;">
<label class="font-small text-small font-bold text-on-surface-variant">Genre</label>
<select class="w-full bg-surface-bright border border-outline-variant rounded-lg px-4 py-2 font-body text-body focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all">
<option>Masculin</option>
<option>Féminin</option>
</select>
</div>
</div>
<div class="space-y-1.5">
<label class="font-small text-small font-bold text-on-surface-variant">Téléphone</label>
<input class="w-full bg-surface-bright border border-outline-variant rounded-lg px-4 py-2 font-body text-body focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="+243 ..." type="tel">
</div>
</div>
<!-- Modal Footer -->
<div class="p-6 bg-surface-container-low/30 border-t border-outline-variant flex justify-end gap-3">
<button class="px-6 py-2 rounded-lg border border-outline-variant text-on-surface-variant font-body text-body font-semibold hover:bg-surface-container-high transition-colors" @click="activeTeacherModal=false">Annuler</button>
<button class="px-6 py-2 rounded-lg bg-primary text-on-primary font-body text-body font-semibold hover:opacity-90 active:scale-95 transition-all">Sauvegarder</button>
</div>
</div>
</div>
</template>
<script setup lang="ts">
    import {ref,computed} from 'vue'
    import {useTeacher} from '~/composables/useTeacher'

    const {listTeachers}=useTeacher()
    definePageMeta({
        layout:'dashboard'
    })
    const activeTeacherModal=ref(false)
</script>