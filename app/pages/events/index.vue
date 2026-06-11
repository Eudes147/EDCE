<template>
  <div class="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6 md:space-y-8">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-2">
      <div>
        <h2 class="font-h1 text-xl md:text-h1 text-on-background font-bold">Gestion des Enfants</h2>
        <p class="font-body text-sm md:text-body text-on-surface-variant mt-1">
          Supervisez les inscriptions, les notes et les participations aux événements de vos enfants.
        </p>
      </div>
    </div>

    <section class="section-card overflow-hidden bg-white rounded-xl shadow-sm border border-outline-variant/20">
      <div class="p-4 md:p-6 border-b border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 class="font-h3 text-base md:text-h3 flex items-center gap-2 font-semibold">
          <Icon name="format_list_bulleted" class="text-primary" />
          Liste des Enfants
        </h3>
        <div class="w-full sm:w-auto">
          <select 
            v-model="classeSelected" 
            class="w-full sm:w-auto bg-surface-container-low border border-outline-variant/30 rounded-lg text-small px-4 py-2 focus:ring-primary focus:outline-none"
          >
            <option v-for="child_classe in child_classes" :key="child_classe" :value="child_classe">
              {{ child_classe }}
            </option>
          </select>
        </div>
      </div>
      
      <div class="hidden md:block overflow-x-auto">
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
            <tr 
              v-for="child in childrenPerClass[classeSelected]" 
              :key="child.id"
              @click="attribute(child)" 
              class="hover:bg-surface-container-low transition-colors cursor-pointer"
              :class="{'bg-primary/5': attributeChild?.id === child.id}"
            >
              <td class="px-6 py-4 flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                  {{ getFullName(child.name).initials }}
                </div>
                <span class="font-body text-body font-medium text-doomu-text">{{ child.name }}</span>
              </td>
              <td class="px-6 py-4 text-body text-doomu-text">{{ child.classe }}</td>
              <td class="px-6 py-4 text-body text-doomu-text">{{ child?.nivScolaire || 'Non défini' }}</td>

              <td class="px-6 py-4 text-right space-x-2">
                <button @click.stop="view(child)" class="text-outline hover:text-primary transition-colors" title="Voir">
                  <Icon name="visibility" class="text-[20px]"/>
                </button>
                <button @click.stop="edit(child)" class="text-outline hover:text-primary transition-colors" title="Editer">
                  <Icon name="edit" class="text-[20px]" />
                </button>
                <button @click.stop="supprimer(child)" class="text-outline hover:text-error transition-colors" title="Supprimer">
                  <Icon name="delete" class="text-[20px]"/>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="block md:hidden divide-y divide-outline-variant/20">
        <div 
          v-for="child in childrenPerClass[classeSelected]" 
          :key="`mobile-${child.id}`"
          @click="attribute(child)"
          class="p-4 flex flex-col gap-3 transition-colors"
          :class="attributeChild?.id === child.id ? 'bg-primary/5' : 'bg-white'"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                {{ getFullName(child.name).initials }}
              </div>
              <div>
                <p class="font-body text-sm font-bold text-doomu-text">{{ child.name }}</p>
                <p class="text-xs text-outline-variant">{{ child.classe }} • {{ child?.nivScolaire || 'Non défini' }}</p>
              </div>
            </div>
            
            <span v-if="attributeChild?.id === child.id" class="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full font-semibold">Sélectionné</span>
          </div>

          <div class="flex justify-end gap-4 pt-1 border-t border-dashed border-outline-variant/20">
            <button @click.stop="view(child)" class="flex items-center gap-1 text-xs text-outline hover:text-primary px-2 py-1 bg-surface-container-low rounded">
              <Icon name="visibility" size="1.1rem"/> Voir
            </button>
            <button @click.stop="edit(child)" class="flex items-center gap-1 text-xs text-outline hover:text-primary px-2 py-1 bg-surface-container-low rounded">
              <Icon name="edit" size="1.1rem" /> Éditer
            </button>
            <button @click.stop="supprimer(child)" class="flex items-center gap-1 text-xs text-error hover:bg-error/10 px-2 py-1 bg-error/5 rounded">
              <Icon name="delete" size="1.1rem"/> Supprimer
            </button>
          </div>
        </div>
      </div>

      <div v-if="!childrenPerClass[classeSelected] || childrenPerClass[classeSelected]?.length === 0" class="px-6 py-8 text-center text-doomu-text-muted font-body text-sm">
        Aucun enfant inscrit dans cette classe.
      </div>
    </section>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
      <div class="lg:col-span-2 section-card overflow-hidden bg-white rounded-xl shadow-sm border border-outline-variant/20 flex flex-col justify-between">
        <div>
          <div class="p-4 md:p-6 border-b border-outline-variant/30 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <h3 class="font-h3 text-base md:text-h3 flex items-center gap-2 font-semibold">
              <Icon name="assignment" class="text-secondary-container"/>
              Attribution de Notes
            </h3>
            <div class="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-lg w-full sm:w-auto">
              <span class="text-small text-outline whitespace-nowrap">Test:</span>
              <select v-model="testSelectedId" class="text-small bg-transparent border-none font-medium text-primary cursor-pointer focus:ring-0 focus:outline-none w-full">
                <option v-for="test in getTestbyClasse(classeSelected)" :value="test.id" :key="test.id">
                  {{ test.titleTest }}
                </option>
              </select>
            </div>
          </div>
          
          <div class="p-4 md:p-6">
            <div class="space-y-4">
              <div v-if="!attributeChild" class="flex items-center gap-4 bg-surface-container-low p-4 rounded-xl border border-dashed border-outline-variant/40">
                <p class="text-doomu-text-muted text-xs md:text-sm">Sélectionnez un enfant dans la liste ci-dessus (en cliquant sur sa ligne ou sa carte) pour lui attribuer une note.</p>
              </div>
              <div v-else class="flex flex-col sm:flex-row sm:items-center gap-4 bg-surface-container-low p-4 rounded-xl border border-primary/20">
                <div class="flex-1 font-body text-sm md:text-body font-medium text-doomu-text">
                  Note pour : <span class="text-primary font-bold block sm:inline">{{ attributeChild?.name }}</span>
                </div>
                <div class="flex items-center gap-3 w-full sm:w-auto">
                  <div class="flex-1 sm:w-24">
                    <input 
                      v-model="note" 
                      class="w-full bg-white border border-outline-variant/50 rounded-lg text-small px-3 py-2 focus:ring-primary focus:outline-none text-doomu-text" 
                      placeholder="Note" 
                      type="number"
                      min="0"
                      max="20"
                      step="0.25"
                    />
                  </div>
                  <div class="flex-1 sm:w-32">
                    <button 
                      class="w-full bg-primary text-white hover:bg-primary-dark transition-all text-small font-semibold py-2 rounded-lg shadow-sm" 
                      @click="saveNote(attributeChild.id, testSelectedId)"
                      :disabled="isNoteLoading"
                    >
                      Enregistrer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="section-card p-4 md:p-6 h-fit bg-white rounded-xl shadow-sm border border-outline-variant/20">
        <h3 class="font-h3 text-base md:text-h3 mb-4 md:mb-6 flex items-center gap-2 font-semibold">
          <Icon name="add_circle" class="text-primary"/>
          Nouvelle Inscription
        </h3>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block font-caption text-caption text-outline mb-1.5">Nom Complet <span class="text-error">*</span></label>
            <input v-model="formChild.name" class="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg text-small px-4 py-2.5 focus:ring-primary text-doomu-text focus:outline-none" placeholder="Ex: AHOUNANSOU Viviane" type="text" required />
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-caption text-caption text-outline mb-1.5">Genre</label>
              <select v-model="formChild.sexe" class="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg text-small px-4 py-2.5 focus:ring-primary text-doomu-text focus:outline-none">
                <option value="Masculin">Masculin</option>
                <option value="Feminin">Féminin</option>
              </select>
            </div>
            <div>
              <label class="block font-caption text-caption text-outline mb-1.5">Date Naiss. <span class="text-error">*</span></label>
              <input v-model="dateSelected" class="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg text-small px-4 py-2.5 focus:ring-primary text-doomu-text focus:outline-none" type="date" required />
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-caption text-caption text-outline mb-1.5">Classe EDCE</label>
              <select v-model="formChild.classe" class="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg text-small px-4 py-2.5 focus:ring-primary text-doomu-text focus:outline-none">
                <option v-for="child_classe in child_classes" :key="child_classe" :value="child_classe">{{ child_classe }}</option>
              </select>
            </div>
            <div>
              <label class="block font-caption text-caption text-outline mb-1.5">Niveau Scolaire <span class="text-error">*</span></label>
              <input v-model="formChild.nivScolaire" class="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg text-small px-4 py-2.5 focus:ring-primary text-doomu-text focus:outline-none" placeholder="Ex: CP2" type="text" required />
            </div>
          </div>
          
          <div v-if="formChild.classe?.includes('Junior')">
            <label class="block font-caption text-caption text-outline mb-1.5">Téléphone Personnel</label>
            <input v-model="formChild.tel" class="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg text-small px-4 py-2.5 focus:ring-primary text-doomu-text focus:outline-none" placeholder="Ex: 0198564789" type="text" />
          </div>

          <div class="py-2">
            <button 
              class="w-full border-2 border-dashed border-outline-variant hover:border-primary hover:text-primary text-outline rounded-lg py-3 flex flex-col items-center gap-1 transition-all bg-doomu-bg/20" 
              @click="activeParentModal = true" 
              type="button"
            >
              <p class="text-center flex items-center justify-center"><Icon name="family_history" /></p>
              <span class="text-small font-medium">
                {{ formChild.telParent && formChild.telParent !== '01xxxxxxxx' ? '👨‍👩‍👦 Parent configuré' : 'Associer des Parents' }}
              </span>
            </button>
          </div>

          <button 
            class="w-full bg-primary text-white font-semibold py-3 rounded-lg shadow-lg shadow-primary/20 hover:scale-[1.01] transition-transform" 
            type="submit"
            :disabled="isLoading"
          >
            Finaliser l'Inscription
          </button>
        </form>
      </div>
    </div>

    <div class="space-y-4 md:space-y-6">
      <div v-if="isLoading" class="text-sm text-on-surface-variant italic py-4">
        Chargement des activités...
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div 
          v-for="(children, activityTitle) in getLimitedActivitiesWithChildren('Arbre de noël')" 
          :key="activityTitle"
          class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 md:p-5 shadow-sm flex flex-col justify-between hover:border-primary transition-all group"
        >
          <div>
            <div class="flex items-center gap-2 mb-3">
              <span class="w-2 h-2 rounded-full bg-primary"></span>
              <h4 class="font-bold font-h3 text-on-surface text-base group-hover:text-primary transition-colors">
                {{ activityTitle }}
              </h4>
            </div>
            <p class="text-caption text-on-surface-variant mb-4">Participants récents :</p>
            <ul class="space-y-2 mb-6">
              <li v-if="children.length === 0" class="text-xs text-on-surface-variant italic pl-2">Aucun participant enregistré</li>
              <li 
                v-for="child in children.slice(0, 3)" 
                :key="child.id"
                class="flex items-center gap-2 text-sm text-on-surface font-body bg-surface-container-low/50 px-3 py-1.5 rounded-lg"
              >
                <Icon name="person" class="text-on-surface-variant text-[16px]" />
                {{ child.name }}
              </li>
              <li v-if="children.length > 3" class="text-caption text-primary font-medium pl-2 italic">
                + {{ children.length - 3 }} autre(s) enfant(s) inscrit(s)
              </li>
            </ul>
          </div>
          <button 
            @click="openAssociationModal(activityTitle)"
            class="w-full bg-primary/5 hover:bg-primary text-primary hover:text-on-primary font-bold py-2.5 px-4 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 border border-primary/10"
          >
            <Icon name="person_add" /> Inscrire un enfant
          </button>
        </div>

        <div 
          v-for="(children, activityTitle) in getLimitedActivitiesWithChildren('Soirée récréative des enfants')" 
          :key="activityTitle"
          class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 md:p-5 shadow-sm flex flex-col justify-between hover:border-primary transition-all group"
        >
          <div>
            <div class="flex items-center gap-2 mb-3">
              <span class="w-2 h-2 rounded-full bg-primary"></span>
              <h4 class="font-bold font-h3 text-on-surface text-base group-hover:text-primary transition-colors">
                {{ activityTitle }}
              </h4>
            </div>
            <p class="text-caption text-on-surface-variant mb-4">Participants récents :</p>
            <ul class="space-y-2 mb-6">
              <li v-if="children.length === 0" class="text-xs text-on-surface-variant italic pl-2">Aucun participant enregistré</li>
              <li 
                v-for="child in children.slice(0, 3)" 
                :key="child.id"
                class="flex items-center gap-2 text-sm text-on-surface font-body bg-surface-container-low/50 px-3 py-1.5 rounded-lg"
              >
                <Icon name="person" class="text-on-surface-variant text-[16px]" />
                {{ child.name }}
              </li>
              <li v-if="children.length > 3" class="text-caption text-primary font-medium pl-2 italic">
                + {{ children.length - 3 }} autre(s) enfant(s) inscrit(s)
              </li>
            </ul>
          </div>
          <button 
            @click="openAssociationModal(activityTitle)"
            class="w-full bg-primary/5 hover:bg-primary text-primary hover:text-on-primary font-bold py-2.5 px-4 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 border border-primary/10"
          >
            <Icon name="person_add" /> Inscrire un enfant
          </button>
        </div>
      </div>
    </div>

    <Modal v-model="isModalOpen" :title="`Inscrire à : ${selectedActivityTitle}`" size="md">
      <div class="space-y-4 py-2">
        <p class="text-body-sm text-on-surface-variant">Sélectionnez l'enfant à inscrire à cette session d'activité.</p>
        <div class="flex flex-col gap-1.5">
          <label class="text-caption font-bold text-on-surface-variant">Enfants disponibles</label>
          <select v-model="selectedChildId" class="w-full p-3 border border-outline-variant rounded-xl bg-white focus:ring-2 focus:ring-primary focus:border-primary text-sm font-body text-on-surface">
            <option value="" disabled>-- Choisir un enfant --</option>
            <option v-for="child in childrenPerClass[classeSelected]" :key="child.id" :value="child.id">
              {{ child.name ? child.name.toUpperCase() : '' }}
            </option>
          </select>
        </div>
      </div>
      <template #footer>
        <div class="flex flex-col sm:flex-row gap-2 w-full">
          <button class="px-4 py-2.5 border border-outline rounded-xl text-on-surface w-full hover:bg-surface-container transition-all text-sm font-bold order-2 sm:order-1" @click="isModalOpen = false">Annuler</button>
          <button class="px-4 py-2.5 bg-primary text-on-primary font-bold rounded-xl w-full hover:opacity-90 transition-all text-sm flex items-center justify-center gap-1 order-1 sm:order-2" :disabled="!selectedChildId" @click="submitAssociation">
            <Icon name="done" /> Confirmer
          </button>
        </div>
      </template>
    </Modal>
    
    <Modal v-model="activeParentModal" title="Informations Parents" size="md">
      <div class="space-y-4 py-2">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block font-caption text-caption text-outline mb-1.5">Civilité</label>
            <select v-model="formChild.sexeParent" class="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg text-small px-4 py-2.5 text-doomu-text focus:outline-none">
              <option value="Masculin">Mr (Père)</option>
              <option value="Feminin">Mme (Mère)</option>
            </select>
          </div>
          <div>
            <label class="block font-caption text-caption text-outline mb-1.5">Nom de famille</label>
            <input class="w-full bg-surface-container-low/60 border border-outline-variant/20 rounded-lg text-small px-4 py-2.5 text-doomu-text-muted font-medium" :value="formChild.name ? formChild.name.trim().split(' ')[0] : '-'" disabled type="text" />
          </div>
        </div>
        <div>
          <label class="block font-caption text-caption text-outline mb-1.5">Téléphone du Responsable <span class="text-error">*</span></label>
          <input v-model="formChild.telParent" class="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg text-small px-4 py-2.5 focus:ring-primary text-doomu-text focus:outline-none" placeholder="Ex: +2290195487596" type="tel" />
        </div>
      </div>
      <template #footer>
        <div class="flex flex-col sm:flex-row gap-2 w-full justify-end">
          <button class="px-4 py-2 border border-doomu-border rounded-lg text-doomu-text hover:bg-doomu-bg transition-colors w-full sm:w-auto" @click="activeParentModal = false">Annuler</button>
          <button class="px-6 py-2 bg-primary text-white font-semibold rounded-lg shadow-sm w-full sm:w-auto" @click="validateParent">Valider</button>
        </div>
      </template>
    </Modal>

    <Modal v-model="showViewModal" title="Détails de l'enfant" size="md">
      <div v-if="childSelected" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="border-b sm:border-none pb-2 sm:pb-0">
            <p class="text-xs text-doomu-text-muted">Nom Complet</p>
            <p class="font-medium text-doomu-text text-base">{{ childSelected?.name }}</p>
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
            <p class="font-medium text-doomu-text">{{ childSelected.telParent }}</p>
          </div>
        </div>
      </div>
      <template #footer>
        <button class="px-4 py-2 bg-doomu-bg hover:bg-doomu-border rounded-lg text-doomu-text transition-colors w-full sm:w-auto" @click="showViewModal = false">Fermer</button>
      </template>
    </Modal>

    <Modal v-model="showEditModal" title="Modifier la fiche enfant" size="md">
      <div v-if="childSelected" class="py-2">
        <form @submit.prevent="handleUpdate" id="editChildForm" class="space-y-4">
          <div>
            <label class="block font-caption text-caption text-outline mb-1.5">Nom Complet</label>
            <input v-model="childSelected.name" class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg text-small px-4 py-2.5 text-doomu-text focus:outline-none focus:border-primary" type="text" required />
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-caption text-caption text-outline mb-1.5">Genre</label>
              <select v-model="childSelected.sexe" class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg text-small px-4 py-2.5 text-doomu-text focus:outline-none">
                <option value="Masculin">Masculin</option>
                <option value="Feminin">Féminin</option>
              </select>
            </div>
            <div>
              <label class="block font-caption text-caption text-outline mb-1.5">Date Naissance</label>
              <input v-model="editDateSelected" class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg text-small px-4 py-2.5 text-doomu-text focus:outline-none" type="date" required />
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-caption text-caption text-outline mb-1.5">Classe EDCE</label>
              <select v-model="childSelected.classe" class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg text-small px-4 py-2.5 text-doomu-text focus:outline-none">
                <option v-for="child_classe in child_classes" :key="child_classe" :value="child_classe">{{ child_classe }}</option>
              </select>
            </div>
            <div>
              <label class="block font-caption text-caption text-outline mb-1.5">Niveau Scolaire</label>
              <input v-model="childSelected.nivScolaire" class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg text-small px-4 py-2.5 text-doomu-text focus:outline-none" type="text" required />
            </div>
          </div>
          <div>
            <label class="block font-caption text-caption text-outline mb-1.5">Téléphone Parent</label>
            <input v-model="childSelected.telParent" class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg text-small px-4 py-2.5 text-doomu-text focus:outline-none" type="tel" required />
          </div>
        </form>
      </div>
      <template #footer>
        <div class="flex flex-col sm:flex-row gap-2 w-full justify-end">
          <button type="button" class="px-4 py-2 border border-doomu-border rounded-lg text-doomu-text hover:bg-doomu-bg w-full sm:w-auto order-2 sm:order-1" @click="showEditModal = false">Annuler</button>
          <button type="submit" form="editChildForm" class="px-6 py-2 bg-primary text-white rounded-lg shadow-sm w-full sm:w-auto order-1 sm:order-2" :disabled="isLoading">Enregistrer</button>
        </div>
      </template>
    </Modal>

    <Modal v-model="showDeleteModal" title="Supprimer la fiche d'inscription" size="sm">
      <div v-if="childSelected" class="space-y-3 text-center py-2">
        <div class="w-12 h-12 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto">
          <Icon name="delete" class="text-[24px]" />
        </div>
        <p class="text-body font-medium text-doomu-text text-sm">Confirmez-vous la désinscription définitive de l'enfant ?</p>
        <p class="text-xs font-bold text-error bg-error/5 p-3 rounded border border-error/20 break-words">
          {{ childSelected.name }} <br class="sm:hidden" />({{ childSelected.classe }})
        </p>
      </div>
      <template #footer>
        <div class="flex flex-col sm:flex-row gap-2 w-full">
          <button class="px-4 py-2 border border-doomu-border rounded-lg text-doomu-text w-full hover:bg-doomu-bg order-2 sm:order-1" @click="showDeleteModal = false">Annuler</button>
          <button class="px-4 py-2 bg-error text-white rounded-lg w-full hover:bg-error-dark order-1 sm:order-2" @click="confirmDelete" :disabled="isLoading">Supprimer</button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { definePageMeta } from '#imports'
import { useActivities } from '~/composables/useActivity'
import { useToast } from '~/composables/useToast'
import type { EventType } from '~/types/activity'

definePageMeta({
  layout: 'dashboard',
})

const toast = useToast()
const { 
  listActivities, 
  listActivityAtEvent, 
  isLoading, 
  fetchAllData, 
  syncEventActivity,
  createActivity,
  deleteActivityAtEvent 
} = useActivities()

// --- GESTION DYNAMIQUE ET CALCULÉE DES ANNÉES ---
const currentSystemYear = computed(() => new Date().getFullYear())
const year = ref<string>(currentSystemYear.value.toString())

const dynamicYears = computed<string[]>(() => {
  const current = currentSystemYear.value
  return [
    (current - 1).toString(), // Année précédente
    current.toString(),       // Année en cours
    (current + 1).toString()  // Année suivante
  ]
})

// --- CONFIGURATION EXCLUSIVE DES DEUX TYPES D'ÉVÉNEMENTS ---
interface EventStructure {
  type: EventType
  label: string
  icon: string
  iconColor: string
  iconBg: string
}

const structuredEvents: EventStructure[] = [
  {
    type: 'Arbre de noël',
    label: 'Arbre de Noël',
    icon: 'festival',
    iconColor: 'text-primary',
    iconBg: 'bg-primary/10 border-primary/20'
  },
  {
    type: 'Soirée récréative des enfants',
    label: 'Soirée Récréative des Enfants',
    icon: 'theater_comedy',
    iconColor: 'text-tertiary',
    iconBg: 'bg-tertiary/10 border-tertiary/20'
  }
]

// --- ÉTATS DES MODALES CONTEXTUELLES ---
const activeManageModal = ref(false)
const activeViewModal = ref(false)
const activeCleanModal = ref(false)
// On initialise avec une valeur valide du type au lieu d'une chaîne vide
const modalContext = ref<{ type: EventType; label: string }>({ 
  type: 'Arbre de noël', 
  label: '' 
})

onMounted(async () => {
  await fetchAllData()
})

// --- RÉSOLUTION DES ASSOCIATIONS (FILTRAGE CALCULÉ) ---
const getAttachedActivities = computed(() => {
  return (eventType: EventType) => {
    const currentRelations = listActivityAtEvent.value.filter(
      eventRel => eventRel.eventType === eventType && eventRel.year === year.value
    )
    
    return currentRelations.map(rel => {
      return listActivities.value.find(act => act.id === rel.activityId)
    }).filter((act): act is any => !!act)
  }
})

const isActivityChecked = computed(() => {
  return (activityId: string) => {
    return listActivityAtEvent.value.some(
      rel => rel.activityId === activityId && 
             rel.eventType === modalContext.value.type && 
             rel.year === year.value
    )
  }
})

// --- ACTIONS INTERFACES ---
const openManageModal = (type: EventType, label: string) => {
  modalContext.value = { type, label }
  activeManageModal.value = true
}

const openViewDetails = (type: EventType, label: string) => {
  modalContext.value = { type, label }
  activeViewModal.value = true
}

const openCleanConfirm = (type: EventType, label: string) => {
  modalContext.value = { type, label }
  activeCleanModal.value = true
}

const handleCheckboxToggle = async (activityId: string, isChecked: boolean) => {
  // 1. Le garde-fou : on extrait le type et on vérifie qu'il est bien défini
  const currentType = modalContext.value.type
  
  if (!currentType) {
    console.warn("Impossible de synchroniser : aucun type d'événement sélectionné.")
    return
  }

  // 2. Ici, TypeScript sait à 100% que currentType est de type 'EventType' (et non "")
  await syncEventActivity(activityId, currentType, year.value, isChecked)
}

const executePurgeEvent = async () => {
  if (!modalContext.value.type) return
  
  const relationsToPurge = listActivityAtEvent.value.filter(
    rel => rel.eventType === modalContext.value.type && rel.year === year.value
  )

  if (relationsToPurge.length === 0) {
    toast.warning('Opération annulée', 'Aucune activité n\'est associée à cet événement.')
    activeCleanModal.value = false
    return
  }

  try {
    isLoading.value = true
    await Promise.all(relationsToPurge.map(rel => deleteActivityAtEvent(rel.id)))
    await fetchAllData()
    toast.success('Événement vidé', 'Toutes les activités ont été dissociées avec succès.')
    activeCleanModal.value = false
  } catch (err) {
    toast.error('Erreur', 'Une erreur est survenue lors de la désaffectation globale.')
  } finally {
    isLoading.value = false
  }
}

const promptGlobalActivityCreation = async () => {
  const title = prompt("Saisissez l'intitulé de la nouvelle activité globale (ex: Pièce de théâtre) :")
  if (!title || !title.trim()) return

  await createActivity(title.trim())
}

const triggerCreateNewActivity = () => {
  activeManageModal.value = false
  setTimeout(() => {
    promptGlobalActivityCreation()
  }, 300)
}
</script>