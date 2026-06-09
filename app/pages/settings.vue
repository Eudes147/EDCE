<template>

<div class="max-w-6xl mx-auto">
<!-- Header Section -->
<div class="mb-8">
<h2 class="font-h1 text-h1 text-on-surface mb-2">Paramètres du système</h2>
<p class="text-on-surface-variant font-body text-body">Gérez les accès, les permissions et les alertes de votre plateforme.</p>
</div>
<!-- Tabbed Interface Container -->
<div class="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[600px]">
<!-- Tabs Nav -->
<div class="flex border-b border-outline-variant px-6">
<button class="px-6 py-4 font-body text-body font-bold text-primary border-b-2 border-primary transition-all flex items-center gap-2" id="tab-btn-teachers" @click="switchTab('teachers')">
<Icon name="school" color="text-[20px]"/>
                        Gestion Teachers
                    </button>
<button class="px-6 py-4 font-body text-body text-on-surface-variant hover:text-primary transition-all flex items-center gap-2" id="tab-btn-permissions" @click="switchTab('permissions')">
<Icon name="security" color="text-[20px]"/>
                        Permissions Globales
                    </button>
<button class="px-6 py-4 font-body text-body text-on-surface-variant hover:text-primary transition-all flex items-center gap-2" id="tab-btn-notifications" @click="switchTab('notifications')">
<Icon name="mail" color="text-[20px]"/>
                        Centre de Notifications
                    </button>
</div>
<!-- Tab Content: Teachers -->
<div class="p-6" id="tab-content-teachers">
<div class="flex justify-between items-center mb-6">
<h3 class="font-h3 text-h3">Liste des Utilisateurs</h3>
<button class="bg-primary text-on-primary px-4 py-2 rounded-lg font-body text-body flex items-center gap-2 hover:opacity-90 transition-all">
<Icon name="add" />
                            Nouvel Utilisateur
                        </button>
</div>
<div class="overflow-hidden border border-outline-variant rounded-xl">
<table class="w-full text-left border-collapse">
<thead class="bg-surface-container-low font-body text-body font-bold text-on-surface-variant">
<tr>
<th class="px-6 py-4">Utilisateur</th>
<th class="px-6 py-4">Rôle</th>
<th class="px-6 py-4">Statut</th>
<th class="px-6 py-4">Dernière Connexion</th>
<th class="px-6 py-4 text-right">Actions</th>
</tr>
</thead>
<tbody class="divide-y divide-outline-variant font-body text-body">
<tr class="hover:bg-surface-container transition-colors">
<td class="px-6 py-4 flex items-center gap-3">
<div class="w-10 h-10 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary font-bold">JD</div>
<div>
<p class="font-bold">Jean Dupont</p>
<p class="text-caption text-on-surface-variant">jean.d@edce.com</p>
</div>
</td>
<td class="px-6 py-4"><span class="px-2 py-1 rounded bg-primary-container/10 text-primary text-small">Teacher</span></td>
<td class="px-6 py-4">
<span class="flex items-center gap-1.5 text-secondary">
<span class="w-2 h-2 rounded-full bg-secondary"></span>
                                            Actif
                                        </span>
</td>
<td class="px-6 py-4 text-on-surface-variant">Il y a 2h</td>
<td class="px-6 py-4 text-right space-x-2">
<button class="text-primary hover:underline font-bold">Changer Statut</button>
<button class="text-error hover:underline font-bold">Disable</button>
</td>
</tr>
<tr class="hover:bg-surface-container transition-colors">
<td class="px-6 py-4 flex items-center gap-3">
<div class="w-10 h-10 rounded-full bg-tertiary-container/20 flex items-center justify-center text-tertiary font-bold">SM</div>
<div>
<p class="font-bold">Sarah Mansour</p>
<p class="text-caption text-on-surface-variant">sarah.m@edce.com</p>
</div>
</td>
<td class="px-6 py-4"><span class="px-2 py-1 rounded bg-secondary-fixed-dim/20 text-on-secondary-container text-small">Modérateur</span></td>
<td class="px-6 py-4">
<span class="flex items-center gap-1.5 text-secondary">
<span class="w-2 h-2 rounded-full bg-secondary"></span>
                                            Actif
                                        </span>
</td>
<td class="px-6 py-4 text-on-surface-variant">Hier, 18:45</td>
<td class="px-6 py-4 text-right space-x-2">
<button class="text-primary hover:underline font-bold">Changer Statut</button>
<button class="text-error hover:underline font-bold">Disable</button>
</td>
</tr>
<tr class="hover:bg-surface-container transition-colors opacity-60">
<td class="px-6 py-4 flex items-center gap-3">
<div class="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant font-bold">KB</div>
<div>
<p class="font-bold">Karim Ben</p>
<p class="text-caption text-on-surface-variant">karim.b@edce.com</p>
</div>
</td>
<td class="px-6 py-4"><span class="px-2 py-1 rounded bg-surface-container-high text-on-surface-variant text-small">Teacher</span></td>
<td class="px-6 py-4">
<span class="flex items-center gap-1.5 text-on-surface-variant">
<span class="w-2 h-2 rounded-full bg-outline"></span>
                                            Désactivé
                                        </span>
</td>
<td class="px-6 py-4 text-on-surface-variant">Le 12 Mai</td>
<td class="px-6 py-4 text-right space-x-2">
<button class="text-primary hover:underline font-bold">Activer</button>
<button class="text-outline cursor-not-allowed font-bold" :disabled="true">Delete</button>
</td>
</tr>
</tbody>
</table>
</div>
</div>
<!-- Tab Content: Permissions -->
<div class="p-8 hidden" id="tab-content-permissions">
<div class="max-w-3xl mx-auto space-y-8">
<div>
<h3 class="font-h3 text-h3 mb-1">Contrôle des Accès</h3>
<p class="text-body text-on-surface-variant opacity-70">Définissez les actions autorisées pour les différents niveaux de rôles.</p>
</div>
<div class="space-y-4">
<!-- Permission Item -->
<label class="flex items-center justify-between p-5 rounded-xl border border-outline-variant hover:border-primary cursor-pointer transition-all group">
<div class="flex items-center gap-4">
<div class="w-12 h-12 rounded-full bg-primary-container/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
<Icon name="notifications_active"/>
</div>
<div>
<p class="font-bold font-body">Activer notifications auto</p>
<p class="text-small text-on-surface-variant">Envoie des rappels aux parents 24h avant chaque séance.</p>
</div>
</div>
<input  class="w-6 h-6 rounded-md text-primary focus:ring-primary border-outline-variant" type="checkbox"/>
</label>
<label class="flex items-center justify-between p-5 rounded-xl border border-outline-variant hover:border-primary cursor-pointer transition-all group">
<div class="flex items-center gap-4">
<div class="w-12 h-12 rounded-full bg-secondary-container/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
<Icon name="edit_square"/>
</div>
<div>
<p class="font-bold font-body">Permettre teachers de créer tests</p>
<p class="text-small text-on-surface-variant">Autorise les enseignants à générer de nouveaux examens sans validation.</p>
</div>
</div>
<input class="w-6 h-6 rounded-md text-primary focus:ring-primary border-outline-variant" type="checkbox"/>
</label>
<label class="flex items-center justify-between p-5 rounded-xl border border-outline-variant hover:border-primary cursor-pointer transition-all group">
<div class="flex items-center gap-4">
<div class="w-12 h-12 rounded-full bg-tertiary-container/10 flex items-center justify-center text-tertiary group-hover:scale-110 transition-transform">
<Icon name="visibility_off" />
</div>
<div>
<p class="font-bold font-body">Masquer les notes globales</p>
<p class="text-small text-on-surface-variant">Seuls les administrateurs peuvent voir la moyenne de l'école.</p>
</div>
</div>
<input class="w-6 h-6 rounded-md text-primary focus:ring-primary border-outline-variant" type="checkbox"/>
</label>
<label class="flex items-center justify-between p-5 rounded-xl border border-outline-variant hover:border-primary cursor-pointer transition-all group">
<div class="flex items-center gap-4">
<div class="w-12 h-12 rounded-full bg-primary-container/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
<Icon name="share" />
</div>
<div>
<p class="font-bold font-body">Partage de documents externe</p>
<p class="text-small text-on-surface-variant">Permet le partage de liens vers des ressources hors plateforme.</p>
</div>
</div>
<input class="w-6 h-6 rounded-md text-primary focus:ring-primary border-outline-variant" type="checkbox"/>
</label>
</div>
<div class="flex justify-end gap-3 pt-6 border-t border-outline-variant">
<button class="px-6 py-2.5 rounded-lg border border-outline text-on-surface font-body hover:bg-surface-container-high transition-all">Réinitialiser</button>
<button class="px-8 py-2.5 rounded-lg bg-primary text-on-primary font-bold font-body shadow-sm hover:opacity-90 transition-all">Enregistrer</button>
</div>
</div>
</div>
<!-- Tab Content: Notifications -->
<div class="p-6 hidden" id="tab-content-notifications">
<div class="max-w-4xl mx-auto">
<div class="flex items-center justify-between mb-8">
<div>
<h3 class="font-h3 text-h3">Journal des Notifications</h3>
<p class="text-body text-on-surface-variant opacity-70">Historique des messages envoyés par le système.</p>
</div>
<div class="flex gap-2">
<span class="bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-small font-bold">12 Non-lues</span>
<button class="text-primary text-small hover:underline">Marquer tout comme lu</button>
</div>
</div>
<div class="space-y-3">
<!-- Unread Notification Item -->
<div class="flex items-start gap-4 p-4 rounded-xl bg-surface-container-high border-l-4 border-primary transition-all hover:bg-surface-container-highest group">
<div class="w-10 h-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary">
<Icon name="error" />
</div>
<div class="flex-1">
<div class="flex justify-between">
<p class="font-bold font-body text-on-surface">Alerte Absence Critique</p>
<span class="text-caption text-on-surface-variant">À l'instant</span>
</div>
<p class="text-body text-on-surface-variant mt-1">L'élève Lucas Bernard a manqué 3 séances consécutives dans la classe de CM1-B.</p>
<div class="mt-3 flex gap-4">
<button class="text-primary text-small font-bold flex items-center gap-1 hover:underline">
                                            Voir dossier
                                        </button>
<button class="text-on-surface-variant text-small font-bold flex items-center gap-1 hover:text-on-surface">
                                            Archiver
                                        </button>
</div>
</div>
<div class="w-2 h-2 rounded-full bg-primary mt-2"></div>
</div>
<!-- Read Notification Item -->
<div class="flex items-start gap-4 p-4 rounded-xl border border-outline-variant hover:border-outline transition-all group">
<div class="w-10 h-10 shrink-0 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant">
<Icon name="assignment_turned_in" color="text-[20px]"/>
</div>
<div class="flex-1">
<div class="flex justify-between">
<p class="font-bold font-body text-on-surface opacity-70">Nouveau Test Validé</p>
<span class="text-caption text-on-surface-variant">Il y a 3h</span>
</div>
<p class="text-body text-on-surface-variant opacity-70">Le test "Histoire du Dimanche - Niveau 2" a été approuvé par la modération.</p>
<div class="mt-3 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
<button class="text-on-surface-variant text-small font-bold hover:text-on-surface">Détails</button>
<button class="text-on-surface-variant text-small font-bold hover:text-on-surface">Supprimer</button>
</div>
</div>
</div>
<!-- Read Notification Item -->
<div class="flex items-start gap-4 p-4 rounded-xl border border-outline-variant hover:border-outline transition-all group">
<div class="w-10 h-10 shrink-0 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant">
<Icon name="person_add" />
</div>
<div class="flex-1">
<div class="flex justify-between">
<p class="font-bold font-body text-on-surface opacity-70">Inscription Finalisée</p>
<span class="text-caption text-on-surface-variant">Hier, 14:22</span>
</div>
<p class="text-body text-on-surface-variant opacity-70">Famille Leroy : 2 enfants ajoutés avec succès à la base de données.</p>
<div class="mt-3 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
<button class="text-on-surface-variant text-small font-bold hover:text-on-surface">Profil Parent</button>
<button class="text-on-surface-variant text-small font-bold hover:text-on-surface">Supprimer</button>
</div>
</div>
</div>
<!-- Read Notification Item -->
<div class="flex items-start gap-4 p-4 rounded-xl border border-outline-variant hover:border-outline transition-all group">
<div class="w-10 h-10 shrink-0 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant">
<Icon name="update" color="text-[20px]"/>
</div>
<div class="flex-1">
<div class="flex justify-between">
<p class="font-bold font-body text-on-surface opacity-70">Mise à jour Système</p>
<span class="text-caption text-on-surface-variant">Le 15 Octobre</span>
</div>
<p class="text-body text-on-surface-variant opacity-70">Version 2.4.1 déployée : Amélioration des exports PDF et corrections de bugs mineurs.</p>
</div>
</div>
</div>
<div class="mt-8 text-center">
<button class="text-primary font-bold font-body hover:bg-primary-container/10 px-6 py-2 rounded-lg transition-colors">Charger les notifications anciennes</button>
</div>
</div>
</div>
</div>
<!-- Footer Meta -->
<div class="mt-8 flex justify-between items-center text-on-surface-variant opacity-60 font-caption text-caption">
<p>© 2026 EDCE - Sunday School Management</p>
<div class="flex gap-6">
<a class="hover:underline" href="#">Documentation API</a>
<a class="hover:underline" href="#">Support Technique</a>
<a class="hover:underline" href="#">Confidentialité</a>
</div>
</div>
</div>
</template>

<script setup>

definePageMeta({
  layout: 'dashboard'
})

function switchTab(tabName) {
            // Hide all contents
            document.getElementById('tab-content-teachers').classList.add('hidden');
            document.getElementById('tab-content-permissions').classList.add('hidden');
            document.getElementById('tab-content-notifications').classList.add('hidden');

            // Reset all buttons
            const buttons = [
                document.getElementById('tab-btn-teachers'),
                document.getElementById('tab-btn-permissions'),
                document.getElementById('tab-btn-notifications')
            ];

            buttons.forEach(btn => {
                btn.classList.remove('text-primary', 'border-primary', 'border-b-2', 'font-bold');
                btn.classList.add('text-on-surface-variant');
            });

            // Show selected content
            document.getElementById('tab-content-' + tabName).classList.remove('hidden');

            // Highlight selected button
            const activeBtn = document.getElementById('tab-btn-' + tabName);
            activeBtn.classList.remove('text-on-surface-variant');
            activeBtn.classList.add('text-primary', 'border-primary', 'border-b-2', 'font-bold');
            
            // Interaction Feedback
            activeBtn.classList.add('scale-105');
            setTimeout(() => activeBtn.classList.remove('scale-105'), 200);
        }
onMounted(()=>{
    // Mini interaction for action buttons
        document.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('mousedown', () => btn.classList.add('opacity-70'));
            btn.addEventListener('mouseup', () => btn.classList.remove('opacity-70'));
        });
})
        
</script>