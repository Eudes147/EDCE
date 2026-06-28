<template>
  <!-- En-tête de la page -->
<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-outline-variant/20 pb-3">
  <div>
    <h2 class="font-h1 text-lg sm:text-xl md:text-2xl text-on-background font-bold">Gestion des Enfants</h2>
    <p class="font-body text-[11px] sm:text-xs md:text-sm text-on-surface-variant mt-0.5">
      Supervisez les inscriptions, les notes et les participations aux événements de vos enfants.
    </p>
  </div>
</div>
<div v-if="isLoading || isTestLoading ">
  <Loader name="des enfants..." />
</div>

<div v-else-if="childrenPerClass">
<!-- Section principale : Liste des enfants -->
<section class="section-card overflow-hidden bg-white rounded-xl shadow-sm border border-outline-variant/20 space-y-2 md:space-y-4">
  <div class="p-4 md:p-6 border-b border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-3">
    <h3 class="font-h3 text-sm sm:text-base flex items-center gap-2 font-semibold">
      <Icon name="format_list_bulleted" class="text-primary" />
      Liste des Enfants
    </h3>
    
    <!-- Barre de recherche intégrée + Sélecteur alignés (100% de large sur mobile) -->
    <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
      <div class="relative flex-1 sm:w-60">
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xs"><Icon name="search" size="1.1rem"/></span>
        <input 
          v-model="searchChildQuery" 
          type="text" 
          placeholder="Rechercher par nom..." 
          class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg text-xs pl-9 pr-4 py-2 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none placeholder:text-on-surface-variant/40 text-on-surface"
        />
      </div>
      <select 
        v-model="classeSelected" 
        class="bg-surface-container-low border border-outline-variant/30 rounded-lg text-xs px-3 py-2 focus:ring-1 focus:ring-primary focus:outline-none cursor-pointer"
      >
        <option v-for="child_classe in child_classes" :key="child_classe" :value="child_classe">
          {{ child_classe }}
        </option>
      </select>
    </div>
  </div>
  
  <!-- Vue Table (Desktop) -->
  <div class="hidden md:block overflow-x-auto">
    <table class="w-full text-left table-auto">
      <thead class="bg-surface-container-low border-b border-outline-variant/30">
        <tr>
          <th class="px-6 py-3.5 font-caption text-xs uppercase tracking-wider text-outline">Nom Complet</th>
          <th class="px-6 py-3.5 font-caption text-xs uppercase tracking-wider text-outline">Classe</th>
          <th class="px-6 py-3.5 font-caption text-xs uppercase tracking-wider text-outline">Niveau Scolaire</th>
          <th class="px-6 py-3.5 font-caption text-xs uppercase tracking-wider text-outline text-right w-40">Actions</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-outline-variant/20">
        <tr 
          v-for="child in filteredChildren" 
          :key="child.id"
          @click="attribute(child)" 
          class="hover:bg-surface-container-low/60 transition-colors cursor-pointer group"
          :class="{'bg-primary/5': attributeChild?.id === child.id}"
        >
          <td class="px-6 py-4 flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
              {{ getFullName(child.name).initials }}
            </div>
            <span class="font-body text-sm font-medium text-doomu-text">{{ child.name }}</span>
            <span v-if="attributeChild?.id === child.id" class="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full font-medium ml-2 animate-pulse">Sélectionné</span>
          </td>
          <td class="px-6 py-4 text-sm text-doomu-text">{{ child.classe }}</td>
          <td class="px-6 py-4 text-sm text-doomu-text">{{ child?.nivScolaire || 'Non défini' }}</td>

          <td class="px-6 py-4 text-right">
            <div class="flex items-center justify-end gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity">
              <button @click.stop="view(child)" class="p-1.5 text-outline hover:text-primary transition-colors" title="Voir"><Icon name="visibility" size="1.2rem"/></button>
              <button v-if="authStore.isAdmin || permissionsLocal.canEditNote" @click.stop="edit(child)" class="p-1.5 text-outline hover:text-primary transition-colors" title="Editer"><Icon name="edit" size="1.2rem" /></button>
              <button v-if="authStore.isAdmin" @click.stop="supprimer(child)" class="p-1.5 text-outline hover:text-error transition-colors" title="Supprimer"><Icon name="delete" size="1.2rem"/></button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Vue Cartes (Mobile) -->
  <div class="block md:hidden divide-y divide-outline-variant/20">
    <div 
      v-for="child in filteredChildren" 
      :key="`mobile-${child.id}`"
      @click="attribute(child)"
      class="p-4 flex flex-col gap-3 transition-colors active:bg-surface-container-low"
      :class="attributeChild?.id === child.id ? 'bg-primary/5' : 'bg-white'"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
            {{ getFullName(child.name).initials }}
          </div>
          <div>
            <p class="font-body text-xs sm:text-sm font-bold text-doomu-text">{{ child.name }}</p>
            <p class="text-[10px] text-outline-variant">{{ child.classe }} • {{ child?.nivScolaire || 'Non défini' }}</p>
          </div>
        </div>
        <span v-if="attributeChild?.id === child.id" class="text-[9px] bg-primary text-white px-1.5 py-0.5 rounded-full font-semibold">Sélectionné</span>
      </div>

      <div class="flex justify-end gap-2 pt-2 border-t border-dashed border-outline-variant/20">
        <button @click.stop="view(child)" class="flex items-center gap-1 text-[11px] text-outline hover:text-primary px-2 py-1.5 bg-surface-container-low rounded-lg"><Icon name="visibility" size="0.95rem"/> Voir</button>
        <button v-if="authStore.isAdmin || permissionsLocal.canEditNote" @click.stop="edit(child)" class="flex items-center gap-1 text-[11px] text-outline hover:text-primary px-2 py-1.5 bg-surface-container-low rounded-lg"><Icon name="edit" size="0.95rem" /> Éditer</button>
        <button v-if="authStore.isAdmin" @click.stop="supprimer(child)" class="flex items-center gap-1 text-[11px] text-error hover:bg-error/10 px-2 py-1.5 bg-error/5 rounded-lg"><Icon name="delete" size="0.95rem"/> Supprimer</button>
      </div>
    </div>
  </div>

  <!-- État vide -->
  <div v-if="filteredChildren?.length === 0" class="px-6 py-8 text-center text-doomu-text-muted font-body text-xs md:text-sm italic">
    Aucun enfant trouvé pour cette recherche ou cette classe.
  </div>
</section>

<!-- Zone Grille Basse : Attribution & Inscription -->
<div class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8 space-y-2 md:space-y-4">
  
  <!-- Bloc Attribution de Notes -->
  <div class="lg:col-span-2 section-card overflow-hidden bg-white rounded-xl shadow-sm border border-outline-variant/20 flex flex-col justify-between space-y-2 md:space-y-4 my-2 md:my-4">
    <div>
      <div class="p-4 border-b border-outline-variant/30 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
        <h3 class="font-h3 text-sm sm:text-base flex items-center gap-2 font-semibold">
          <Icon name="assignment" class="text-secondary-container"/>
          Attribution de Notes
        </h3>
        <div class="flex items-center gap-2 bg-surface-container-low px-3 py-1 rounded-lg w-full sm:w-auto border border-outline-variant/20">
          <span class="text-xs text-outline whitespace-nowrap">Test :</span>
          <select v-model="testSelectedId" class="text-xs bg-transparent border-none font-semibold text-primary cursor-pointer focus:ring-0 focus:outline-none w-full">
            <option v-for="test in getTestbyClasse(classeSelected)" :value="test.id" :key="test.id">
              {{ test.titleTest }}
            </option>
          </select>
        </div>
      </div>
      
      <div class="p-4 md:p-6">
        <div class="space-y-4">
          <div v-if="!attributeChild" class="flex items-center gap-2.5 bg-surface-container-low/60 p-4 rounded-xl border border-dashed border-outline-variant/40">
            <Icon name="info" class="text-outline/60 shrink-0" size="1.1rem" />
            <p class="text-doomu-text-muted text-[11px] sm:text-xs">Sélectionnez un enfant dans la liste ci-dessus en cliquant sur sa ligne ou sa carte pour lui attribuer une note.</p>
          </div>
          
          <div v-else class="flex flex-col sm:flex-row sm:items-center gap-3 bg-primary/5 p-4 rounded-xl border border-primary/20 transition-all">
            <div class="flex-1 font-body text-xs sm:text-sm font-medium text-doomu-text">
              Note pour : <span class="text-primary font-bold block sm:inline text-xs sm:text-sm">{{ attributeChild?.name }}</span>
            </div>
            <div class="flex items-center gap-2 w-full sm:w-auto">
              <div class="flex-1 sm:w-24">
                <input 
                  v-model="note" 
                  class="w-full bg-white border border-outline-variant/50 rounded-lg text-xs px-2.5 py-1.5 focus:ring-1 focus:ring-primary focus:outline-none text-doomu-text font-bold" 
                  placeholder="Ex: 15" 
                  type="number" min="0" max="20" step="0.25"
                />
              </div>
              <div class="flex-1 sm:w-32">
                <button 
                  class="w-full bg-primary text-white hover:opacity-90 transition-all text-xs font-semibold py-1.5 rounded-lg shadow-sm disabled:bg-primary/10" 
                  @click="saveNote(attributeChild.id, testSelectedId)" :disabled="isNoteLoading"
                >
                {{isNoteLoading?'Enregistrement':'Enregistrer'}}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Bloc Formulaire Nouvelle Inscription -->
  <div class="section-card p-4 md:p-6 h-fit bg-white rounded-xl shadow-sm border border-outline-variant/20">
    <h3 class="font-h3 text-sm sm:text-base mb-3.5 flex items-center gap-2 font-semibold">
      <Icon name="add_circle" class="text-primary"/>
      Nouvelle Inscription
    </h3>
    <form @submit.prevent="handleSubmit" class="space-y-3">
      <div>
        <label class="block font-caption text-[11px] text-outline mb-1">Nom Complet <span class="text-error">*</span></label>
        <input v-model="formChild.name" class="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg text-xs px-3 py-2 focus:ring-1 focus:ring-primary text-doomu-text focus:outline-none" placeholder="Ex: AHOUNANSOU Viviane" type="text" required />
      </div>
      
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="block font-caption text-[11px] text-outline mb-1">Genre</label>
          <select v-model="formChild.sexe" class="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg text-xs px-3 py-2 text-doomu-text focus:outline-none">
            <option value="Masculin">Masculin</option>
            <option value="Feminin">Féminin</option>
          </select>
        </div>
        <div>
          <label class="block font-caption text-[11px] text-outline mb-1">Date Naiss. <span class="text-error">*</span></label>
          <input v-model="dateSelected" class="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg text-xs px-3 py-2 text-doomu-text focus:outline-none" type="date" required />
        </div>
      </div>
      
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="block font-caption text-[11px] text-outline mb-1">Classe EDCE</label>
          <select v-model="formChild.classe" class="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg text-xs px-3 py-2 text-doomu-text focus:outline-none">
            <option v-for="child_classe in child_classes" :key="child_classe" :value="child_classe">{{ child_classe }}</option>
          </select>
        </div>
        <div>
          <label class="block font-caption text-[11px] text-outline mb-1">Niveau Scolaire <span class="text-error">*</span></label>
          <select v-model="formChild.nivScolaire" class="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg text-xs px-3 py-2 text-doomu-text focus:outline-none" required>
            <option v-for="child_niv in nivScolaireByClasse" :key="child_niv" :value="child_niv">{{ child_niv }}</option>
          </select>
        </div>
      </div>
      
      <div v-if="formChild.classe?.includes('Junior')">
        <label class="block font-caption text-[11px] text-outline mb-1">Téléphone Personnel</label>
        <input v-model="formChild.tel" class="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg text-xs px-3 py-2 text-doomu-text focus:outline-none" placeholder="Ex: 0198564789" type="text" />
      </div>
      <div>
        <label class="block font-caption text-[11px] text-outline mb-1">Quartier <span class="text-error"></span></label>
        <input v-model="formChild.quarter" class="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg text-xs px-3 py-2 focus:ring-1 focus:ring-primary text-doomu-text focus:outline-none" placeholder="Ex: Yénawa 2e Von..." type="text" />
      </div>

      <div class="py-1">
        <button v-if="authStore.isAdmin || permissionsLocal.canCreateChild"
          class="w-full border border-dashed border-outline-variant hover:border-primary hover:text-primary text-outline rounded-lg py-2 flex flex-col items-center gap-0.5 transition-all bg-doomu-bg/20" 
          @click="activeParentModal = true" type="button"
        >
          <Icon name="family_history" size="1.15rem"/>
          <span class="text-xs font-medium">
            {{ formChild.telParent && formChild.telParent !== '01xxxxxxxx' ? '👨‍👩‍👦 Parent configuré' : 'Associer un Parent' }}
          </span>
        </button>
      </div>

      <button 
        class="w-full bg-primary text-white font-semibold py-2 rounded-lg shadow-md shadow-primary/10 hover:opacity-95 transition-all text-xs disabled:bg-primary/10" 
        type="submit" :disabled="isCreateLoading"
      >
      {{ isCreateLoading ? 'Inscription en cours...':"Finaliser l'Inscription" }}
        
      </button>
    </form>
  </div>
</div>

<!-- Section Événements Dynamisée -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 space-y-2 md:space-y-4">
  <div 
    v-for="activityName in ['Arbre de noël', 'Soirée récréative des enfants']" 
    :key="activityName"
    class="bg-white border border-outline-variant/40 rounded-xl p-4 md:p-5 shadow-sm flex flex-col justify-between hover:border-primary/50 transition-all group my-2 md:my-4"
  >
    <div v-for="(children, activityTitle) in getLimitedActivitiesWithChildren(activityName)" :key="activityTitle" class="space-y-4">
      
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-outline-variant/20 pb-2">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-primary animate-ping"></span>
          <h4 class="font-bold font-h3 text-on-surface text-sm sm:text-base group-hover:text-primary transition-colors">
            {{ activityTitle }}
          </h4>
        </div>
        
        <!-- Badges spécifiques pour identifier clairement l'EventType d'appartenance -->
        <span :class="[
          'text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border w-fit',
          activityName.includes('noël') ? 'bg-primary/5 text-primary border-primary/15' : 'bg-secondary/5 text-secondary border-secondary/15'
        ]">
          Catégorie : {{ activityName }}
        </span>
      </div>

      <div>
        <p class="text-[11px] text-on-surface-variant mb-2">Participants récents :</p>
        <ul class="space-y-1.5">
          <li v-if="children?.length === 0" class="text-xs text-on-surface-variant/70 italic pl-1">Aucun participant enregistré</li>
          <li 
            v-for="child in children.slice(0, 3)" :key="child.id"
            class="flex items-center gap-2 text-xs text-on-surface bg-surface-container-low px-3 py-1.5 rounded-lg"
          >
            <Icon name="person" class="text-outline text-[13px]" />
            {{ child.name }}
          </li>
          <li v-if="children.length > 3" class="text-[10px] text-primary font-semibold pl-1 italic">
            + {{ children.length - 3 }} autre(s) enfant(s) inscrit(s)
          </li>
        </ul>
      </div>

      <button 
        @click="openAssociationModal(activityTitle)"
        class="w-full bg-primary/5 hover:bg-primary text-primary hover:text-white font-bold py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-1.5 border border-primary/10 text-xs"
      >
        <Icon name="person_add" size="1.05rem"/> Inscrire un enfant
      </button>
    </div>
  </div>
</div>
</div>


<!-- Modals (Tous tes modals sont conservés et harmonisés) -->

<!-- Modal : Inscrire à une activité -->
<Modal v-model="isModalOpen" :title="`Inscrire à : ${selectedActivityTitle}`" size="md">
  <div class="space-y-4 py-2">
    <p class="text-xs text-on-surface-variant">Sélectionnez l'enfant à inscrire à cette session d'activité.</p>
    <div class="flex flex-col gap-1.5">
      <label class="text-xs font-bold text-on-surface-variant">Enfants disponibles</label>
      <select v-model="selectedChildId" class="w-full p-2.5 border border-outline-variant rounded-xl bg-white focus:ring-1 focus:ring-primary focus:border-primary text-xs font-body text-on-surface">
        <option value="" disabled>-- Choisir un enfant --</option>
        <option v-for="child in childrenPerClass[classeSelected]" :key="child.id" :value="child.id">
          {{ child.name ? child.name.toUpperCase() : '' }}
        </option>
      </select>
    </div>
  </div>
  <template #footer>
    <div class="flex flex-col sm:flex-row gap-2 w-full">
      <button class="px-4 py-2 border border-outline rounded-xl text-on-surface w-full hover:bg-surface-container transition-all text-xs font-bold order-2 sm:order-1" @click="isModalOpen = false">Annuler</button>
      <button class="px-4 py-2 bg-primary text-on-primary font-bold rounded-xl w-full hover:opacity-90 transition-all text-xs flex items-center justify-center gap-1 order-1 sm:order-2" :disabled="!selectedChildId" @click="submitAssociation">
        <Icon name="done" /> Confirmer
      </button>
    </div>
  </template>
</Modal>

<!-- Modal : Parents -->
<Modal v-model="activeParentModal" title="Informations Parents" size="md">
  <div class="space-y-4 py-2">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label class="block font-caption text-[11px] text-outline mb-1">Civilité</label>
        <select v-model="formChild.sexeParent" class="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg text-xs px-3 py-2 text-doomu-text focus:outline-none">
          <option value="Masculin">Mr (Père)</option>
          <option value="Feminin">Mme (Mère)</option>
        </select>
      </div>
      <div>
        <label class="block font-caption text-[11px] text-outline mb-1">Nom de famille</label>
        <input class="w-full bg-surface-container-low/60 border border-outline-variant/20 rounded-lg text-xs px-3 py-2 text-doomu-text-muted font-medium" :value="formChild.name ? formChild.name.trim().split(' ')[0] : '-'" disabled type="text" />
      </div>
    </div>
    <div>
      <label class="block font-caption text-[11px] text-outline mb-1">Téléphone du Responsable <span class="text-error">*</span></label>
      <input v-model="formChild.telParent" class="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg text-xs px-3 py-2 focus:ring-1 focus:ring-primary text-doomu-text focus:outline-none" placeholder="Ex: 0195487596" type="tel" />
    </div>
  </div>
  <template #footer>
    <div class="flex flex-col sm:flex-row gap-2 w-full justify-end">
      <button class="px-4 py-2 border border-doomu-border rounded-lg text-doomu-text hover:bg-doomu-bg transition-colors w-full sm:w-auto text-xs" @click="activeParentModal = false">Annuler</button>
      <button class="px-6 py-2 bg-primary text-white font-semibold rounded-lg shadow-sm w-full sm:w-auto text-xs" @click="validateParent">Valider</button>
    </div>
  </template>
</Modal>

<!-- Modal : Voir Détails -->
<Modal v-model="showViewModal" title="Détails de l'enfant" size="md">
  <div v-if="childSelected" class="space-y-4 text-xs sm:text-sm">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div class="border-b sm:border-none pb-2 sm:pb-0">
        <p class="text-xs text-doomu-text-muted">Nom Complet</p>
        <p class="font-medium text-doomu-text text-sm sm:text-base">{{ childSelected?.name }}</p>
      </div>
      <div class="border-b sm:border-none pb-2 sm:pb-0">
        <p class="text-xs text-doomu-text-muted">Genre</p>
        <p class="font-medium text-doomu-text">{{ childSelected?.sexe }}</p>
      </div>
      <div class="border-b sm:border-none pb-2 sm:pb-0">
        <p class="text-xs text-doomu-text-muted">Classe EDCE</p>
        <p class="font-medium text-doomu-text">{{ childSelected?.classe }}</p>
      </div>
      <div class="border-b sm:border-none pb-2 sm:pb-0">
        <p class="text-xs text-doomu-text-muted">Niv. Scolaire</p>
        <p class="font-medium text-doomu-text">{{ childSelected?.nivScolaire || 'Non défini' }}</p>
      </div>
      <div class="border-b sm:border-none pb-2 sm:pb-0">
        <p class="text-xs text-doomu-text-muted">Téléphone Enfant</p>
        <p class="font-medium text-doomu-text">{{ childSelected?.tel || 'Aucun' }}</p>
      </div>
      <div>
        <p class="text-xs text-doomu-text-muted">Téléphone Parent</p>
        <p class="font-medium text-doomu-text">{{ childSelected.telParent || 'Non défini' }}</p>
      </div>
      <div>
        <p class="text-xs text-doomu-text-muted">Quartier</p>
        <p class="font-medium text-doomu-text">{{ childSelected.quarter || 'Non défini' }}</p>
      </div>
    </div>
  </div>
  <template #footer>
    <button class="px-4 py-2 bg-doomu-bg hover:bg-doomu-border rounded-lg text-doomu-text transition-colors w-full sm:w-auto text-xs" @click="showViewModal = false">Fermer</button>
  </template>
</Modal>

<!-- Modal : Modifier Fiche -->
<Modal v-model="showEditModal" title="Modifier la fiche enfant" size="md">
  <div v-if="childSelected" class="py-2">
    <form @submit.prevent="handleUpdate" id="editChildForm" class="space-y-4">
      <div>
        <label class="block font-caption text-xs text-outline mb-1.5">Nom Complet</label>
        <input v-model="childSelected.name" class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg text-xs px-3 py-2 text-doomu-text focus:outline-none focus:border-primary" type="text" required />
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="block font-caption text-xs text-outline mb-1.5">Genre</label>
          <select v-model="childSelected.sexe" class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg text-xs px-3 py-2 text-doomu-text focus:outline-none">
            <option value="Masculin">Masculin</option>
            <option value="Feminin">Féminin</option>
          </select>
        </div>
        <div>
          <label class="block font-caption text-xs text-outline mb-1.5">Date Naissance</label>
          <input v-model="editDateSelected" class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg text-xs px-3 py-2 text-doomu-text focus:outline-none" type="date" required />
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="block font-caption text-xs text-outline mb-1.5">Classe EDCE</label>
          <select v-model="childSelected.classe" class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg text-xs px-3 py-2 text-doomu-text focus:outline-none">
            <option v-for="child_classe in child_classes" :key="child_classe" :value="child_classe">{{ child_classe }}</option>
          </select>
        </div>
        <div>
          <label class="block font-caption text-xs text-outline mb-1.5">Niveau Scolaire</label>
          <select v-model="childSelected.nivScolaire" class="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg text-xs px-3 py-2 text-doomu-text focus:outline-none" required>
            <option v-for="child_niv in nivScolaireByChild" :key="child_niv" :value="child_niv">{{ child_niv }}</option>
          </select>
        </div>
      </div>
      <div>
        <label class="block font-caption text-xs text-outline mb-1.5">Téléphone Parent</label>
        <input v-model="childSelected.telParent" class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg text-xs px-3 py-2 text-doomu-text focus:outline-none" type="tel" required />
      </div>
      <div>
        <label class="block font-caption text-xs text-outline mb-1.5">Quartier</label>
        <input v-model="childSelected.quarter" class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg text-xs px-3 py-2 text-doomu-text focus:outline-none" type="tel" required />
      </div>
    </form>
  </div>
  <template #footer>
    <div class="flex flex-col sm:flex-row gap-2 w-full justify-end">
      <button type="button" class="px-4 py-2 border border-doomu-border rounded-lg text-doomu-text hover:bg-doomu-bg w-full sm:w-auto order-2 sm:order-1 text-xs" @click="showEditModal = false">Annuler</button>
      <button type="submit" form="editChildForm" class="px-6 py-2 bg-primary text-white rounded-lg shadow-sm w-full sm:w-auto order-1 sm:order-2 text-xs" :disabled="isLoading">Enregistrer</button>
    </div>
  </template>
</Modal>

<!-- Modal : Supprimer d'Inscription -->
<Modal v-model="showDeleteModal" title="Supprimer la fiche d'inscription" size="sm">
  <div v-if="childSelected" class="space-y-3 text-center py-2 text-xs">
    <div class="w-10 h-10 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto">
      <Icon name="delete" class="text-[20px]" />
    </div>
    <p class="text-body font-medium text-doomu-text">Confirmez-vous la désinscription définitive de l'enfant ?</p>
    <p class="text-xs font-bold text-error bg-error/5 p-2.5 rounded border border-error/20 break-words">
      {{ childSelected.name }} <br class="sm:hidden" />({{ childSelected.classe }})
    </p>
  </div>
  <template #footer>
    <div class="flex flex-col sm:flex-row gap-2 w-full">
      <button class="px-4 py-2 border border-doomu-border rounded-lg text-doomu-text w-full hover:bg-doomu-bg order-2 sm:order-1 text-xs" @click="showDeleteModal = false">Annuler</button>
      <button class="px-4 py-2 bg-error text-white rounded-lg w-full hover:bg-error-dark order-1 sm:order-2 text-xs" @click="confirmDelete" :disabled="isLoading">Supprimer</button>
    </div>
  </template>
</Modal>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useChildren } from '~/composables/useChild'
import { useNote } from '~/composables/useNote'
import { useTest } from '~/composables/useTest'
import { useToast } from '~/composables/useToast'
import { useAuthStore } from '~/stores/auth'
import { classes, nivScolaireClasse } from "~/stores/child"
import type { EventType } from '~/types/activity'
import type { Child, childSubmit } from '~/types/child'
import type { ClasseType } from '~/types/classe'
import type { Note } from '~/types/test'
//Utils
import { validateFormTel } from '~/utils/validateFormatTel'

definePageMeta({
  layout: 'dashboard',
})

// --- COMPOSABLES GENERAUX ---

const authStore=useAuthStore()
const permissionsLocal=ref()
const permissions=authStore.permissions
if(authStore.userStatus && permissions){
  permissionsLocal.value=permissions[authStore.userStatus]
} 
const actualYear = computed(() => new Date().getFullYear().toString())
const toast = useToast()
const { childrenPerClass, getFullName, fetchAllChildren, createChild, updateChild, deleteChild, isLoading } = useChildren()
const { getTestbyClasse, fetchAllTests, isTestLoading } = useTest()
const { createNote, updateNote, fetchAllNotesData, isExistNotebyTestAndChildIds, getNote } = useNote() 

// --- INSTANCIATION DU STORE DES PARTICIPANTS (Résout l'erreur 7022 & 2769) ---
const participantEventStore = useParticipantEventActivity()

// Extraction des refs réactives et méthodes nécessaires
const listEventActivity = participantEventStore.listEventActivity
const listActivities = participantEventStore.listActivities
const createParticipantEventActivity = participantEventStore.createParticipantEventActivity
const fetchAllEventData = participantEventStore.fetchAllEventData
const isEventLoading = participantEventStore.isLoading
const isCreateLoading=ref(false)

// --- ETATS DE NAVIGATION / SELECTION ---
const activeParentModal = ref(false)
const searchChildQuery=ref('')
const child_classes = ref(classes)
const classeSelected = ref<ClasseType>('Petit')
const attributeChild = ref<Child | null>(null)
const childSelected = ref<Child | null>(null)

// --- VISIBILITE DES MODALES ---
const showViewModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)

// --- GESTION LOCALE DES DATES POUR LES INPUTS HTML ---
const dateSelected = ref<string|undefined>("")
const editDateSelected = ref<string|undefined>("")

// --- GESTION DES ATTRIBUTIONS DE NOTES ---
const note = ref<number | null>(null)
const testSelectedId = ref("")
const isNoteLoading = ref(false)

// Variables
const noteFound=ref<Note>()
// AuthStore


// --- FORMULAIRE REACTIF D'INSCRIPTION ---
const formChild = ref<childSubmit>({
  classe: 'Petit',
  name: '',
  sexe: 'Masculin',
  birth_date: new Date(),
  nivScolaire: '',
  sexeParent: 'Masculin',
  tel: '',
  telParent: '',
  quarter: '',
})

const nivScolaireByClasse=computed(()=>{
  return nivScolaireClasse[formChild.value?.classe]
})

const nivScolaireByChild=computed(()=>{
  if(childSelected) return nivScolaireClasse[childSelected?.value.classe]
})
// --- ETATS LOCAUX COMPOSANTE PARTICIPANTS / EVENT ---
const isModalOpen = ref(false)
const selectedActivityTitle = ref('')
const selectedChildId = ref('')

// --- CHARGEMENT INITIAL GLOBAL ---
onMounted(async () => {
  await fetchAllTests()
  await fetchAllChildren()
  await fetchAllEventData()
  await fetchAllNotesData()
  resetTestSelection()
})

// --- WATCHERS ET SYNCHRONISATIONS ---
watch(dateSelected, (newDate) => {
  if (newDate) formChild.value.birth_date = new Date(newDate)
})

const resetTestSelection = () => {
  const availableTests = getTestbyClasse.value(classeSelected.value)
  
  if (availableTests && availableTests?.length > 0) {
    // Si on a des tests, on prend l'ID du premier (on sait qu'il existe, pas besoin de ?.id)
    testSelectedId.value = availableTests[0]?.id || ""
  } else {
    // Sinon, on remet à vide
    testSelectedId.value = ""
  }
}

watch(classeSelected, () => {
  resetTestSelection()
  attributeChild.value = null
})



const getLimitedActivitiesWithChildren = (eventType: EventType) => {
  // 1. Appel du store
  const fullCrossedData = participantEventStore.getChildrenByActivityTitle(actualYear.value, eventType)
  
  // 2. Vérification de sécurité (si fullCrossedData est null/undefined)
  if (!fullCrossedData) return {}

  // 3. Transformation
  return Object.fromEntries(
    Object.entries(fullCrossedData).slice(0, 2)
  )
}


// --- ACTIONS METIERS : ENFANTS ---
const attribute = (child: Child) => {
  attributeChild.value = child

  if(isExistNotebyTestAndChildIds(testSelectedId.value, child.id)){
    noteFound.value=getNote(testSelectedId.value, child.id)
    note.value=Number(noteFound.value?.note||0)
  }
  else{
    note.value=Number(0)
  }

}

watch(testSelectedId,(newTestId)=>{
  if(attributeChild.value && newTestId && isExistNotebyTestAndChildIds(newTestId, attributeChild.value.id)){
    noteFound.value=getNote(newTestId,attributeChild.value.id)
    note.value=Number(noteFound.value?.note||0)
  }
  else{
    note.value=Number(0)
  }

 }
)

const validateParent = () => {
  if (!formChild.value.telParent || formChild.value.telParent.includes('x') || !validateFormTel(formChild.value.telParent)) {
    toast.warning('Numéro invalide', 'Saisissez le numéro de téléphone réel du parent avec 01.')
    return
  }
  toast.success('Parent mémorisé', 'Les informations du tuteur légal ont été rattachées.')
  activeParentModal.value = false
}

const handleSubmit = async () => {
  if (!formChild.value.name.trim()) {
    toast.warning("Champs requis", "Le nom complet de l'enfant est obligatoire.")
    return
  }
  if (!dateSelected.value) {
    toast.warning("Champs requis", "La date de naissance est obligatoire.")
    return
  }
  if (!formChild.value.telParent || formChild.value.telParent === '01xxxxxxxx') {
    toast.warning("Parent manquant", "Veuillez associer un numéro de parent avant de valider.")
    return
  }
  if(formChild.value.tel && !validateFormTel(formChild.value.tel)){
    toast.warning(`Le numéro de téléphone de  ${formChild.value.name} ne respecte pas les normes.`)
    return
  }

  try {
    isCreateLoading.value=true
    await createChild({
      name: formChild.value.name,
      sexe: formChild.value.sexe,
      birth_date: formChild.value.birth_date,
      classe: formChild.value.classe,
      nivScolaire: formChild.value.nivScolaire,
      sexeParent: formChild.value.sexeParent,
      quarter: formChild.value.quarter||'Non défini',
      tel: formChild.value.tel || 'Aucun',
      telParent: formChild.value.telParent
    })
    
    toast.success('Inscription validée', `${formChild.value.name} a été inscrit en classe ${formChild.value.classe}.`)
    isCreateLoading.value=false
    
    formChild.value = {
      classe: classeSelected.value,
      name: '',
      sexe: 'Masculin',
      birth_date: new Date(),
      nivScolaire: '',
      sexeParent: 'Masculin',
      tel: '',
      telParent: '',
      quarter: ''
    }
    dateSelected.value = ""
  } catch (err) {
    toast.error("Échec de l'inscription", "Le serveur a renvoyé une erreur lors du traitement.")
  }
}

const handleUpdate = async () => {
  if (!childSelected.value) return
  
  try {
    const payload: Partial<Child> = {
      name: childSelected.value.name,
      sexe: childSelected.value.sexe,
      classe: childSelected.value.classe,
      nivScolaire: childSelected.value.nivScolaire,
      telParent: childSelected.value.telParent,
      quarter: childSelected.value.quarter
    }
    
    if (editDateSelected.value) {
      payload.birth_date = new Date(editDateSelected.value)
    }

    await updateChild(childSelected.value.id, payload)
    toast.success('Fiche modifiée', `Les modifications pour ${childSelected.value.name} ont été enregistrées.`)
    showEditModal.value = false
  } catch (err) {
    toast.error('Erreur', 'Impossible de mettre à jour le profil de l\'enfant.')
  }
}

const confirmDelete = async () => {
  if (!childSelected.value) return
  const name = childSelected.value.name
  try {
    await deleteChild(childSelected.value.id)
    toast.success('Enfant supprimé', `La fiche de ${name} a été définitivement retirée.`);
    showDeleteModal.value = false
    if (attributeChild.value?.id === childSelected.value.id) attributeChild.value = null
    childSelected.value = null
  } catch (err) {
    toast.error('Erreur', 'Suppression impossible depuis le serveur.')
  }
}

// --- ACTIONS METIERS : NOTES ---
const saveNote = async (childId: string, testId: string | undefined) => {
  if (!testId) {
    toast.error('Opération impossible', "Aucun test ou épreuve n'a été sélectionné pour cette classe.")
    return
  }
  
  if (note.value === null || note.value === undefined || note.value < 0 || note.value > 20) {
    toast.warning('Note incorrecte', 'La note doit être comprise entre 0 et 20.')
    return
  }

  isNoteLoading.value = true
  try {
    if(isExistNotebyTestAndChildIds(testId, childId)){
      if(noteFound.value)
      await updateNote({
        id: noteFound.value?.id,
        testId: testId,
        childId: childId,
        note: Number(note.value)
      })
    }
    else{
      if (createNote) {
      await createNote({
        childId,
        testId: testId as string, // Cast explicite pour résoudre l'erreur 2322 🎯
        note: note.value
      })
      note.value = null 
    }
    }
    
  } catch (err) {
    toast.error('Erreur', "La note n'a pas pu être sauvegardée.")
  } finally {
    isNoteLoading.value = false
  }
}

// --- ACTIONS METIERS : PARTICIPANTS / EVENT ---
const openAssociationModal = (activityTitle: string) => {
  selectedActivityTitle.value = activityTitle
  selectedChildId.value = ''
  isModalOpen.value = true
}

const submitAssociation = async () => {
  if (!selectedChildId.value) return

  const associatedActivity = listActivities.value.find((a: any) => a.title === selectedActivityTitle.value)
  const associatedEvent = listEventActivity.value.find(
    (e: any) => e.activityId === associatedActivity?.id && e.year === actualYear.value
  )

  if (!associatedEvent || !associatedEvent.id) {
    alert(`Impossible de procéder à l'inscription : aucun événement correspondant trouvé pour ${actualYear.value}.`)
    return
  }

  const newParticipant = {
    id: `part-${Date.now()}`, 
    childId: selectedChildId.value,
    eventActivityId: associatedEvent.id
  }

  await createParticipantEventActivity(newParticipant)
  
  isModalOpen.value = false
  selectedChildId.value = ''
}

// --- CONTRÔLEURS DE VISIBILITÉ ---
const view = (child: Child) => {
  childSelected.value = { ...child }
  showViewModal.value = true
}

const edit = (child: Child) => {
  childSelected.value = { ...child }
  if (child.birth_date && editDateSelected.value) {
    editDateSelected.value = new Date(child.birth_date).toISOString().split('T')[0]
  } else {
    editDateSelected.value = ""
  }
  showEditModal.value = true
}

const supprimer = (child: Child) => {
  childSelected.value = child
  showDeleteModal.value = true
}

// --- COMPUTED: FILTRAGE DES ENFANTS ---
const filteredChildren = computed(() => {
  // 1. Récupère la liste complète pour la classe sélectionnée
  const childrenList = childrenPerClass.value[classeSelected.value] || [];
  
  // 2. Si la barre de recherche est vide, on retourne toute la liste
  if (!searchChildQuery.value || searchChildQuery.value.trim() === '') {
    return childrenList;
  }
  
  // 3. Sinon, on filtre en comparant le nom (insensible à la casse)
  const query = searchChildQuery.value.toLowerCase();
  return childrenList.filter(child => 
    child.name.toLowerCase().includes(query)
  );
});
</script>


