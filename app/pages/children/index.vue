<template>
  <div class="p-8 max-w-7xl mx-auto w-full space-y-8">
<!-- Header Section -->
<div class="flex justify-between items-end">
<div>
<h2 class="font-h1 text-h1 text-on-background">Gestion des Enfants</h2>
<p class="font-body text-body text-on-surface-variant mt-1">Supervisez les inscriptions, les notes et les participations aux événements de vos enfants.</p>
</div>
</div>

<!-- 1. Children List Table -->
<section class="section-card overflow-hidden" style="transform: translateY(0px);">
<div class="p-6 border-b border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
<h3 class="font-h3 text-h3 flex items-center gap-2">
<Icon name="format_list_bulleted" color="text-primary" />
                        Liste des Enfants
                    </h3>
<div class="flex items-center gap-3">
<select v-model="classeSelected" class="bg-surface-container-low border-none rounded-lg text-small px-4 py-2 focus:ring-primary">
<option v-for="child_classe in child_classes" :key="child_classe" :value="child_classe">{{ child_classe }}</option>
</select>
</div>
</div>
<div class="overflow-x-auto">
<table class="w-full text-left">
<thead class="bg-surface-container-low border-b border-outline-variant/30">
<tr>
<th class="px-6 py-4 font-caption text-caption uppercase tracking-wider text-outline">Nom Complet</th>
<th class="px-6 py-4 font-caption text-caption uppercase tracking-wider text-outline">Classe</th>
<th class="px-6 py-4 font-caption text-caption uppercase tracking-wider text-outline">Niveau Scolaire</th>
<th class="px-6 py-4 font-caption text-caption uppercase tracking-wider text-outline text-right">Actions</th>
</tr>
</thead>
<tbody class="divide-y divide-outline-variant/20">
<tr v-for="child in childrenPerClass[classeSelected]" 
@click="attribute(child)" class="hover:bg-surface-container-low transition-colors">
<td class="px-6 py-4 flex items-center gap-3">
<div class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-small">{{getFullName(child.name).initials}}</div>
<span class="font-body text-body font-medium">{{ child.name }}</span>
</td>
<td class="px-6 py-4 text-body">{{ child.classe }}</td>
<td class="px-6 py-4 text-body">{{ child?.nivScolaire||'Non défini' }}</td>

<td class="px-6 py-4 text-right space-x-2">
<button class="text-outline hover:text-primary transition-colors"><Icon name="edit" color="text-[20px]"/>
</button>
<button class="text-outline hover:text-error transition-colors"><Icon name="delete" color="text-[20px]"/></button>
</td>
</tr>
</tbody>
</table>
</div>
<div class="p-4 border-t border-outline-variant/30 flex items-center justify-center">
<button v-if="(childrenPerClass[classeSelected]?.length||0) > 3" class="text-primary font-medium text-body hover:underline">Voir tous les enfants ({{ childrenPerClass[classeSelected]?.length.toString().padStart(2,'0') }})</button>
</div>
</section>
<!-- 2. Attribution de Notes & 5. Add New Child (Asymmetric Grid) -->
<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
<!-- Attribution de Notes -->
<div class="lg:col-span-2 section-card overflow-hidden" style="transform: translateY(0px);">
<div class="p-6 border-b border-outline-variant/30 flex justify-between items-center">
<h3 class="font-h3 text-h3 flex items-center gap-2">
<Icon name="assignment" color="text-secondary-container"/>
                            Attribution de Notes
                        </h3>
<div class="flex items-center gap-2">
<span class="text-small text-outline">Test:</span>
<select v-model="testSelected" class="text-small bg-transparent border-none font-medium text-primary p-0 cursor-pointer focus:ring-0">
<option v-for="test in getTestbyClasse(classeSelected)" :value="test.titleTest" :key="test.id">{{ test.titleTest }}</option>
</select>
</div>
</div>
<div class="p-6">
<div class="space-y-4">
<div class="flex items-center gap-4 bg-surface-container-low p-3 rounded-xl">
<div class="flex-1 font-body text-body font-medium">Jean Dupont</div>
<div class="w-24">
<input class="w-full bg-white border border-outline-variant/50 rounded-lg text-small px-3 py-1.5 focus:ring-primary" placeholder="Note" type="number">
</div>
<div class="w-32">
<button class="w-full bg-white border border-primary text-primary hover:bg-primary hover:text-white transition-all text-small font-semibold py-1.5 rounded-lg">Enregistrer</button>
</div>
</div>
<div class="flex items-center gap-4 bg-surface-container-low p-3 rounded-xl">
<div class="flex-1 font-body text-body font-medium">Marie-Laure Koffi</div>
<div class="w-24">
<input class="w-full bg-white border border-outline-variant/50 rounded-lg text-small px-3 py-1.5 focus:ring-primary" placeholder="Note" type="number">
</div>
<div class="w-32">
<button class="w-full bg-white border border-primary text-primary hover:bg-primary hover:text-white transition-all text-small font-semibold py-1.5 rounded-lg">Enregistrer</button>
</div>
</div>
</div>
</div>
</div>
<!-- Add New Child Quick Form -->
<div class="section-card p-6 h-fit sticky top-[80px]" style="transform: translateY(0px);">
<h3 class="font-h3 text-h3 mb-6 flex items-center gap-2">
<Icon name="add_circle" color="text-primary"/>
                        Nouvelle Inscription
                    </h3>
<form class="space-y-4">
<div>
<label class="block font-caption text-caption text-outline mb-1.5">Nom Complet</label>
<input v-model="formChild.name" class="w-full bg-surface-container-low border-none rounded-lg text-small px-4 py-2.5 focus:ring-primary" placeholder="Ex: AHOUNANSOU Viviane" type="text">
</div>
<div class="grid grid-cols-2 gap-3">
<div>
<label class="block font-caption text-caption text-outline mb-1.5">Genre</label>
<select v-model="formChild.sexe" class="w-full bg-surface-container-low border-none rounded-lg text-small px-4 py-2.5 focus:ring-primary">
<option value="Masculin">Masculin</option>
<option value="Feminin">Féminin</option>
</select>
</div>
<div>
<label class="block font-caption text-caption text-outline mb-1.5">Date Naiss.</label>
<input v-model="formChild.birth_date" class="w-full bg-surface-container-low border-none rounded-lg text-small px-4 py-2.5 focus:ring-primary" type="date">
</div>
</div>
<div class="grid grid-cols-2 gap-3">
<div>
<label class="block font-caption text-caption text-outline mb-1.5">Classe EDCE</label>
<select v-model="formChild.classe" class="w-full bg-surface-container-low border-none rounded-lg text-small px-4 py-2.5 focus:ring-primary">
<option v-for="child_classe in child_classes" :key="child_classe" :value="child_classe">{{child_classe}}</option>
</select>
</div>
<div>
<label class="block font-caption text-caption text-outline mb-1.5">Niveau Scolaire</label>
<input v-model="formChild.nivScolaire" class="w-full bg-surface-container-low border-none rounded-lg text-small px-4 py-2.5 focus:ring-primary" placeholder="Ex: CP2" type="text">
</div>
</div>
<div v-if="formChild.classe?.includes('junior') ">
<label class="block font-caption text-caption text-outline mb-1.5">Telephone</label>
<input class="w-full bg-surface-container-low border-none rounded-lg text-small px-4 py-2.5 focus:ring-primary" placeholder="Ex: 0198564789" type="number">
</div>
<div class="py-2">
<button class="w-full border-2 border-dashed border-outline-variant hover:border-primary hover:text-primary text-outline rounded-lg py-3 flex flex-col items-center gap-1 transition-all" @click="activeParentModal=true" type="button">
  <p class="text-center"><Icon name="family_history" /></p>

<span class="text-small font-medium">Associer des Parents</span>
</button>
</div>
<button class="w-full bg-primary text-white font-semibold py-3 rounded-lg shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform" type="submit">
                            Finaliser l'Inscription
                        </button>
</form>
</div>
</div>
<!-- Events Participation Section -->
<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
<!-- 3. Participation Génie Biblique -->
<section class="section-card overflow-hidden">
<div class="p-6 bg-gradient-to-r from-primary-container/10 to-transparent">
<div class="flex justify-between items-center mb-4">
<h3 class="font-h3 text-h3 flex items-center gap-2">
<Icon name="quiz" color="text-primary-container"/>
                                Génie Biblique 2024
                            </h3>
<button class="text-small font-semibold text-primary">Assigner Équipe</button>
</div>
<div class="space-y-3">
<div class="bg-white p-4 rounded-xl border border-outline-variant/20 flex items-center gap-4">
<div class="w-10 h-10 rounded-lg bg-secondary-container text-white flex items-center justify-center font-bold">A</div>
<div class="flex-1">
<p class="font-body text-body font-semibold">Les David</p>
<p class="font-caption text-caption text-outline">Jean D., Samuel K., Lea M.</p>
</div>
<span class="px-2 py-1 bg-primary-container/20 text-primary-container rounded-md text-[10px] font-bold">120 PTS</span>
</div>
<div class="bg-white p-4 rounded-xl border border-outline-variant/20 flex items-center gap-4">
<div class="w-10 h-10 rounded-lg bg-tertiary-container text-white flex items-center justify-center font-bold">B</div>
<div class="flex-1">
<p class="font-body text-body font-semibold">Les Gédéons</p>
<p class="font-caption text-caption text-outline">Marie-Laure, Isaac P., Naomi F.</p>
</div>
<span class="px-2 py-1 bg-primary-container/20 text-primary-container rounded-md text-[10px] font-bold">105 PTS</span>
</div>
</div>
</div>
</section>
<!-- 4. Participation Fête de Noël -->
<section class="section-card overflow-hidden">
<div class="p-6 bg-gradient-to-r from-error/5 to-transparent">
<div class="flex justify-between items-center mb-4">
<h3 class="font-h3 text-h3 flex items-center gap-2">
<Icon name="celebration" color="text-error"/>
                                Fête de Noël 2024
                            </h3>
<button class="text-small font-semibold text-error">Attribuer Rôle</button>
</div>
<div class="overflow-hidden rounded-xl border border-outline-variant/20">
<table class="w-full text-left bg-white">
<thead class="bg-error/5 border-b border-outline-variant/30">
<tr>
<th class="px-4 py-2 font-caption text-caption text-outline">Enfant</th>
<th class="px-4 py-2 font-caption text-caption text-outline">Activité</th>
<th class="px-4 py-2 font-caption text-caption text-outline">Répétition</th>
</tr>
</thead>
<tbody class="divide-y divide-outline-variant/10">
<tr>
<td class="px-4 py-3 font-body text-small">Jean Dupont</td>
<td class="px-4 py-3"><span class="px-2 py-0.5 bg-secondary-fixed/30 text-secondary-fixed-variant rounded text-[10px] font-bold">Théâtre (Noé)</span></td>
<td class="px-4 py-3 text-small text-outline">80%</td>
</tr>
<tr>
<td class="px-4 py-3 font-body text-small">Marie-Laure Koffi</td>
<td class="px-4 py-3"><span class="px-2 py-0.5 bg-primary-fixed/30 text-primary-fixed-variant rounded text-[10px] font-bold">Chorale</span></td>
<td class="px-4 py-3 text-small text-outline">100%</td>
</tr>
<tr>
<td class="px-4 py-3 font-body text-small">Koffi Samuel</td>
<td class="px-4 py-3"><span class="px-2 py-0.5 bg-tertiary-fixed/30 text-tertiary-fixed-variant rounded text-[10px] font-bold">Poésie</span></td>
<td class="px-4 py-3 text-small text-outline">45%</td>
</tr>
</tbody>
</table>
</div>
</div>
</section>
</div>
</div>

<!-- Modal Parent -->
 <div :class="[ activeParentModal ?'': 'hidden' , 'fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4']" id="parent_modal">
<div class="bg-white rounded-xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
<div class="px-6 py-4 border-b border-outline-variant/30 flex justify-between items-center">
<h3 class="font-h3 text-h3">Informations Parents</h3>
<button class="text-outline hover:text-on-surface" @click="activeParentModal=false">
<Icon name="close" />
</button>
</div>
<div class="p-6 space-y-6">
<!-- Stepper -->
<div class="flex items-center gap-2 mb-4">
<div class="flex-1 h-1.5 bg-surface-container-highest rounded-full"></div>
</div>
<div class="space-y-4">
<h4 class="font-body font-semibold text-primary">Parent</h4>
<div class="grid grid-cols-2 gap-4">
<div>
<label class="block font-caption text-caption text-outline mb-1.5">Sexe</label>
<select v-model="formChild.sexeParent" class="w-full bg-surface-container-low border-none rounded-lg text-small px-4 py-2.5 focus:ring-primary">
<option value="MASCULIN">Mr</option>
<option value="FEMININ">Mme</option>
</select>
</div>
<div>
<label class="block font-caption text-caption text-outline mb-1.5">Nom</label>
<input class="w-full bg-surface-container-low border-none rounded-lg text-small px-4 py-2 focus:ring-primary" placeholder="Nom de famille" :value="formChild.name?.split(' ')[0]" :disabled="true" type="text">
</div>
</div>
<div>
<label class="block font-caption text-caption text-outline mb-1.5">Téléphone</label>
<input v-model="formChild.telParent" class="w-full bg-surface-container-low border-none rounded-lg text-small px-4 py-2 focus:ring-primary" placeholder="+2290195487596" type="tel">
</div>
</div>
</div>
<div class="px-6 py-4 bg-surface-container-low flex justify-end gap-3">
<button class="px-4 py-2 text-on-surface-variant font-medium text-small hover:bg-surface-variant rounded-lg transition-colors" @click="activeParentModal=false">Annuler</button>
<button class="px-6 py-2 bg-primary text-white font-semibold text-small rounded-lg shadow-md shadow-primary/10 transition-transform active:scale-95" @click="activeParentModal=false">Valider le parent</button>
</div>
</div>
</div>
</template>
<script setup lang="ts">
import { definePageMeta } from '#imports';
definePageMeta({
  layout: 'dashboard',
})
import {ref} from 'vue'
import { classes } from "~/stores/child";
import {useChildren} from '~/composables/useChild'
import { useTest } from '~/composables/useTest';
import type { Classe, ClasseType } from '~/types/classe';
import type { Child } from '~/types/child';
import type { Test } from '~/types/test';

const {childrenPerClass, getFullName}=useChildren()
const { getTestbyClasse }=useTest()
const activeParentModal=ref(false)
const child_classes=ref(classes)
const classeSelected=ref<ClasseType>('Petit')
const formChild = ref({
  classe: 'Petit',
  name: '',
  sexe: 'Masculin',
  birth_date: '',
  nivScolaire: '',
  sexeParent: 'Masculin',
  tel: '',
  telParent: '01xxxxxxxx',
})

const testSelected=ref(getTestbyClasse.value(classeSelected.value)[0])


const attribute = (child: Child)=>{
  return 
}

</script>