<template>
  <div v-if="pending">
    Chargement des données du dashboard....
  </div>
  <div v-else-if="error">{{error.message}}</div>
  <main v-else-if="stats" ref="desktopMain" class="hidden md:flex flex-1 flex-col min-w-0 h-full bg-background overflow-hidden">
    <!-- <template #header-title>
      <span class="font-body text-body font-bold text-primary">Dashboard</span>
    </template> -->
    <header class="flex justify-between items-center w-full px-margin-desktop py-sm h-16 bg-background border-b border-outline-variant">
      <div class="flex items-center gap-4">
        <h2 class="font-h2 text-h2 font-bold text-primary">Dashboard</h2>
      </div>
      <div class="flex items-center gap-lg">
        <div class="relative w-64">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-outline">
            <Icon name="search" size="1.25rem" />
          </span>
          
          <input class="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="Rechercher..." type="text" />
        </div>
        <div class="flex items-center gap-4">
          <button class="text-on-surface-variant hover:text-primary transition-colors">
            <Icon size="1.5rem" name="notifications" />
          </button>
          <button class="text-on-surface-variant hover:text-primary transition-colors">
            <Icon size="1.5rem" name="help" />
          </button>
          <div class="h-8 w-8 rounded-full bg-surface-container-highest border border-outline-variant overflow-hidden">
            <img class="w-full h-full object-cover" data-alt="A clean, professional headshot of a young adult male administrator with a friendly expression. He is wearing a minimalist navy blue sweater against a soft, neutral grey background. The lighting is bright and even, reflecting a high-end corporate directory style with a warm white aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAa-sp3VAUi9Z7l2sCVsRw0qNVq2clOdfAz-7V9pys0PfGvQWgaWI02XoT5g-Ekky4cJwzKb6Dpffixhy8yGh9O9V7BVEbdqnSYBK9ejPSEfl1tsYvrLHfdojpwSpBM3W2Vy49FKiwGYzjIs1yUYLQOpeApuctMR2JR0Pb6VYNR1nY63Gax5nmYIWDFe2ffH57a2k6YhupAKmHH9vc-xSzEu9coAM7IeU2Nb8yB7EAF6vwvoH9hCsqxGe5oGY3ss_x6e-B6btCrCSQ" />
          </div>
        </div>
      </div>
    </header>

    <div class="flex-1 overflow-y-auto p-margin-desktop space-y-lg">
      <div class="flex flex-wrap gap-md">
        <button class="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-lg font-label-md hover:scale-95 transition-transform ultra-shadow">
          <Icon size="1.5rem" name="add_circle" />
          Voir la liste des moniteurs
        </button>
        <button class="flex items-center gap-2 px-6 py-3 bg-primary-container text-white rounded-lg font-label-md hover:scale-95 transition-transform ultra-shadow">
          <Icon size="1.5rem" name="quiz" />
          Voir les tests
        </button>
        <div class="relative w-full md:w-64">
        <select v-model="filtreClasse" class="w-full pl-4 pr-10 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-xl appearance-none focus:ring-2 focus:ring-primary focus:border-transparent outline-none font-body text-on-surface ultra-minimal-shadow cursor-pointer" style="transform: translateY(0px); transition: transform 0.2s ease-out;">
        <option v-for="classe in classeEDCE" :value="classe">{{classe}}</option>
        </select>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
        <div class="glass-card p-md ultra-shadow transition-transform hover:-translate-y-1">
          <p class="font-label-sm text-on-surface-variant mb-1">Enfants totals</p>
          <div class="flex items-baseline justify-between">
            <h3 class="font-h1 text-h1 text-primary">{{childStatistics?.count || 0}}</h3>
            <span class="text-xs font-bold text-secondary bg-secondary/10 px-2 py-1 rounded-full">{{(childStatistics?.rate || 0) * 100}}%</span>
          </div>
          <div class="mt-4 h-1 bg-surface-container-high rounded-full overflow-hidden">
            <div class="h-full bg-primary w-[75%]"></div>
          </div>
        </div>
        <div class="glass-card p-md ultra-shadow transition-transform hover:-translate-y-1">
          <p class="font-label-sm text-on-surface-variant mb-1">Séances crées ce mois</p>
          <div class="flex items-baseline justify-between">
            <h3 class="font-h1 text-h1 text-primary">48</h3>
            <span class="text-xs font-bold text-secondary bg-secondary/10 px-2 py-1 rounded-full">Constant</span>
          </div>
          <div class="mt-4 h-1 bg-surface-container-high rounded-full overflow-hidden">
            <div class="h-full bg-primary w-[48%]"></div>
          </div>
        </div>
        <div class="glass-card p-md ultra-shadow transition-transform hover:-translate-y-1">
          <p class="font-label-sm text-on-surface-variant mb-1">Enseignants actifs</p>
          <div class="flex items-baseline justify-between">
            <h3 class="font-h1 text-h1 text-primary">32</h3>
            <span class="text-xs font-bold text-secondary bg-secondary/10 px-2 py-1 rounded-full">+4</span>
          </div>
          <div class="mt-4 h-1 bg-surface-container-high rounded-full overflow-hidden">
            <div class="h-full bg-primary w-[90%]"></div>
          </div>
        </div>
        <div class="glass-card p-md ultra-shadow transition-transform hover:-translate-y-1">
          <p class="font-label-sm text-on-surface-variant mb-1">Nombre d'activités</p>
          <div class="flex items-baseline justify-between">
            <h3 class="font-h1 text-h1 text-primary">06</h3>
            <span class="text-xs font-bold text-on-surface-variant bg-surface-container-high px-2 py-1 rounded-full">Proch: Samedi</span>
          </div>
          <div class="mt-4 h-1 bg-surface-container-high rounded-full overflow-hidden">
            <div class="h-full bg-primary w-[25%]"></div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
        <div class="glass-card p-lg flex justify-center items-center">
          <h4 class="font-h3 text-h3 mb-lg">Répartition par classe</h4>
          <div class="flex items-end gap-4 h-48 px-2" style="height: stretch;">
            <div v-for='classe in classeEDCE' :key='classe' class="flex-1 flex flex-col items-center gap-2">
              <div class="w-full bg-primary/20 rounded-t-md hover:bg-primary transition-colors" style="height: 6rem"></div>
              <span class="font-label-sm text-on-surface-variant">{{classe}}</span>
            </div>      
          </div>
        </div>
        <div class="glass-card p-lg">
          <h4 class="font-h3 text-h3 mb-lg">Succès aux examens de Sunday school</h4>
          <div class="space-y-md">
            <div v-for="classe in classeEDCE" :key="classe">
              <div class="flex justify-between mb-2">
                <span class="font-label-md">{{classe}}</span>
                <span class="font-label-md text-primary">92%</span>
              </div>
              <div class="h-2 bg-surface-container-high rounded-full">
                <div class="h-full bg-secondary rounded-full" style="width: 92%"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section class="glass-card overflow-hidden">
        <div class="px-lg py-md border-b border-outline-variant flex justify-between items-center">
          <h4 class="font-h3 text-h3">Liste des enfants</h4>
          <button class="text-primary font-label-md hover:underline">Voir tout</button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead class="bg-surface-container-low">
              <tr>
                <th class="px-lg py-4 font-label-md text-on-surface-variant">Nom</th>
                <th class="px-lg py-4 font-label-md text-on-surface-variant">Classe</th>
                <th class="px-lg py-4 font-label-md text-on-surface-variant">Age</th>
                <th class="px-lg py-4 font-label-md text-on-surface-variant">Téléphone</th>
                <th class="px-lg py-4 font-label-md text-on-surface-variant text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-outline-variant">
              <tr class="hover:bg-surface-container-lowest transition-colors group">
                <td class="px-lg py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">MK</div>
                    <div>
                      <p class="font-label-md text-on-surface">Marc Kouassi</p>
                      <p class="text-[11px] text-on-surface-variant">marc.k@email.com</p>
                    </div>
                  </div>
                </td>
                <td class="px-lg py-4 font-body-sm">CM1 - Section A</td>
                <td class="px-lg py-4 font-body-sm">12 Sept 2023</td>
                <td class="px-lg py-4">
                  <span class="px-2 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider">Actif</span>
                </td>
                <td class="px-lg py-4 text-right">
                  <div class="flex justify-end gap-2 transition-opacity">
                    <button class="text-on-surface-variant hover:text-primary"><Icon size="1.5rem" name="visibility" /></button>
                    <button class="text-on-surface-variant hover:text-primary"><Icon size="1.5rem" name="edit" /></button>
                    <button class="text-error hover:text-error-container"><Icon size="1.5rem" name="delete" /></button>
                  </div>
                </td>
              </tr>
              
            </tbody>
          </table>
        </div>
      </section>

      <div class="grid grid-cols-1 xl:grid-cols-3 gap-gutter pb-xl">
        <div class="xl:col-span-1 glass-card flex flex-col">
          <div class="p-md border-b border-outline-variant flex justify-between items-center">
            <h4 class="font-label-md text-on-surface font-bold uppercase tracking-wider">Contacts Parents</h4>
            <Icon size='1rem' color="h-4 w-4 text-on-surface-variant text-sm" name="more_vert" />
          </div>
          <div class="p-4 space-y-4">
            <div class="flex items-center justify-between group">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center">
                  <Icon color="h-5 w-5 text-primary text-lg" name="call" />
                </div>
                <div>
                  <p class="font-label-sm">M. Kouassi</p>
                  <p class="text-[10px] text-on-surface-variant">+225 07 00 00 00</p>
                </div>
              </div>
              <button class="p-4 flex justify-center items-center rounded-full hover:bg-primary-container hover:text-white transition-colors">
                <Icon color="h-4 w-4 text-sm" name="chat" />
              </button>
            </div>
            <div class="flex items-center justify-between group border-t border-outline-variant/30 pt-4">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center">
                  <Icon color="h-5 w-5 text-primary text-lg" name="call" />
                </div>
                <div>
                  <p class="font-label-sm">Mme Diallo</p>
                  <p class="text-[10px] text-on-surface-variant">+225 05 00 00 00</p>
                </div>
              </div>
              <button class="p-4 flex justify-center items-center rounded-full hover:bg-primary-container hover:text-white transition-colors">
                <Icon color="h-4 w-4 text-sm" name="chat" />
              </button>
            </div>
            <div class="flex items-center justify-between group border-t border-outline-variant/30 pt-4">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center">
                  <Icon color="h-5 w-5 text-primary text-lg" name="call" />
                </div>
                <div>
                  <p class="font-label-sm">M. Traoré</p>
                  <p class="text-[10px] text-on-surface-variant">+225 01 00 00 00</p>
                </div>
              </div>
              <button class="p-4 flex justify-center items-center rounded-full hover:bg-primary-container hover:text-white transition-colors">
                <Icon color="h-4 w-4 text-sm" name="chat" />
              </button>
            </div>
          </div>
        </div>

        <div class="xl:col-span-2 glass-card">
          <div class="p-md border-b border-outline-variant">
            <h4 class="font-label-md text-on-surface font-bold uppercase tracking-wider">Délibération de fin d'année</h4>
          </div>
          <div class="p-lg">
            <div class="space-y-md">
              <div class="flex items-center gap-4">
                <span class="w-6 font-h3 text-secondary">01</span>
                <div class="flex-1 flex items-center justify-between bg-surface-container-low p-3 rounded-lg border border-outline-variant">
                  <span class="font-label-md">Sarah Diallo</span>
                  <span class="font-bold text-primary">2,450 pts</span>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <span class="w-6 font-h3 text-on-surface-variant">02</span>
                <div class="flex-1 flex items-center justify-between bg-surface-container-low p-3 rounded-lg border border-outline-variant">
                  <span class="font-label-md">Marc Kouassi</span>
                  <span class="font-bold text-primary">2,380 pts</span>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <span class="w-6 font-h3 text-on-surface-variant">03</span>
                <div class="flex-1 flex items-center justify-between bg-surface-container-low p-3 rounded-lg border border-outline-variant">
                  <span class="font-label-md">Esther Yao</span>
                  <span class="font-bold text-primary">2,100 pts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>

  <div class="md:hidden min-h-[max(884px,100dvh)] w-full font-body-md text-body-md overflow-x-hidden">
    <header class="sticky top-0 z-50 bg-background flex justify-between items-center w-full px-margin-mobile py-sm h-16 border-b border-outline-variant">
      <div class="flex items-center gap-2">
        <h1 class="font-h3 text-h3 font-bold text-primary">EDCE</h1>
      </div>
      <div class="flex items-center gap-4">
        <button class="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors">
          <Icon size="1.5rem" name="notifications" />
        </button>
        <button class="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors" @click="showDashboardMenu?.()">
          <Icon size="1.5rem" name="menu" />
        </button>
      </div>
    </header>

    <main class="px-margin-mobile py-md space-y-md">
      <section>
        <h2 class="font-h2 text-h2-mobile text-on-surface">Tableau de bord</h2>
        <p class="font-body-sm text-on-surface-variant">Bienvenue, Admin. Voici l'aperçu de la semaine.</p>
      </section>

      <section class="grid grid-cols-1 gap-sm">
        <div class="bg-white border border-[#E8E4DE] p-sm rounded-xl custom-shadow flex items-center gap-sm">
          <div class="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
            <Icon size="1.5rem" name="child_care" />
          </div>
          <div>
            <p class="font-label-sm text-on-surface-variant">Total enfants</p>
            <p class="font-h3 text-h3">342</p>
          </div>
          <div class="ml-auto text-primary font-label-sm flex items-center">
            +4% <Icon color="h-[14px] w-[14px] text-[14px]" name="trending_up" />
          </div>
        </div>
        <div class="bg-white border border-[#E8E4DE] p-sm rounded-xl custom-shadow flex items-center gap-sm">
          <div class="w-10 h-10 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary">
            <Icon size="1.5rem" name="school" />
          </div>
          <div>
            <p class="font-label-sm text-on-surface-variant">Séances</p>
            <p class="font-h3 text-h3">24</p>
          </div>
          <div class="ml-auto text-on-surface-variant font-label-sm">
            Cette semaine
          </div>
        </div>
        <div class="bg-white border border-[#E8E4DE] p-sm rounded-xl custom-shadow flex items-center gap-sm">
          <div class="w-10 h-10 rounded-lg bg-tertiary-fixed flex items-center justify-center text-tertiary">
            <Icon size="1.5rem" name="group" />
          </div>
          <div>
            <p class="font-label-sm text-on-surface-variant">Teachers</p>
            <p class="font-h3 text-h3">18</p>
          </div>
          <div class="ml-auto text-on-surface-variant font-label-sm">
            Actifs
          </div>
        </div>
        <div class="bg-white border border-[#E8E4DE] p-sm rounded-xl custom-shadow flex items-center gap-sm">
          <div class="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant">
            <Icon size="1.5rem" name="event" />
          </div>
          <div>
            <p class="font-label-sm text-on-surface-variant">Événements</p>
            <p class="font-h3 text-h3">3</p>
          </div>
          <div class="ml-auto text-on-surface-variant font-label-sm">
            A venir
          </div>
        </div>
      </section>

      <section class="grid grid-cols-1 gap-md">
        <div class="bg-white border border-[#E8E4DE] p-md rounded-xl custom-shadow">
          <h3 class="font-label-md text-on-surface mb-md">Répartition par niveau</h3>
          <div class="flex items-end justify-between h-32 gap-2">
            <div class="flex flex-col items-center gap-2 flex-1">
              <div class="bg-primary w-full rounded-t-lg chart-bar" style="height: 60%"></div>
              <span class="font-label-sm text-[10px]">Niv 1</span>
            </div>
            <div class="flex flex-col items-center gap-2 flex-1">
              <div class="bg-primary-container w-full rounded-t-lg chart-bar" style="height: 85%"></div>
              <span class="font-label-sm text-[10px]">Niv 2</span>
            </div>
            <div class="flex flex-col items-center gap-2 flex-1">
              <div class="bg-secondary-container w-full rounded-t-lg chart-bar" style="height: 45%"></div>
              <span class="font-label-sm text-[10px]">Niv 3</span>
            </div>
            <div class="flex flex-col items-center gap-2 flex-1">
              <div class="bg-outline-variant w-full rounded-t-lg chart-bar" style="height: 30%"></div>
              <span class="font-label-sm text-[10px]">Niv 4</span>
            </div>
          </div>
        </div>
        <div class="bg-primary-container text-white p-md rounded-xl custom-shadow relative overflow-hidden">
          <div class="relative z-10">
            <h3 class="font-label-md text-white mb-xs">Succès aux examens</h3>
            <p class="font-h2 text-h2-mobile mb-sm">92%</p>
            <p class="font-body-sm opacity-90">Taux de réussite global pour la session de Printemps.</p>
          </div>
          <div class="absolute -right-4 -bottom-4 opacity-20 transform rotate-12">
            <Icon color="h-[120px] w-[120px] text-[120px]" name="workspace_premium" />
          </div>
        </div>
      </section>

      <section>
        <div class="flex justify-between items-center mb-sm">
          <h3 class="font-label-md text-on-surface">Dernières inscriptions</h3>
          <button class="text-primary font-label-sm">Voir tout</button>
        </div>
        <div class="bg-white border border-[#E8E4DE] rounded-xl custom-shadow overflow-hidden">
          <div class="divide-y divide-[#E8E4DE]">
            <div class="flex items-center gap-sm p-sm">
              <img alt="Avatar" class="w-10 h-10 rounded-full bg-surface-container" data-alt="A high-quality 3D minimalist avatar of a young smiling boy with short hair, wearing a simple blue t-shirt, rendered in a clean flat design style on a soft gray background. The lighting is bright and cheerful, echoing a modern school administrative app aesthetic with functional warmth." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeOm8TLihHv0wbUVHV9SUBASpFwDThRZdnAq26cQ7m8Otc9H63Xkhwstdxw_gsSvJGF0bGwixAStoERl8r_T7W3jSzaTpgU-iJthMLnlC8a52F1G2V--FTIbf5M1_poHHi38vno5XE46qpscrE_FMEQYbFFCm_Yxv_pWKV69sRQ7YFbjaS6effvbAlO_0dmLHnfUMMcNCjdUFfOSc7_XIBhddAlc2lvkqmaPcox6QRn_IALG-FhXTqLOTpuUj31qVEYZoF9UvPFOE" />
              <div class="flex-1">
                <p class="font-label-md text-on-surface">Marc Dupont</p>
                <p class="font-body-sm text-on-surface-variant">Niveau 1 • Groupe A</p>
              </div>
              <span class="px-2 py-1 rounded-full bg-surface-container-low text-primary text-[10px] font-bold">ACTIF</span>
            </div>
            <div class="flex items-center gap-sm p-sm">
              <img alt="Avatar" class="w-10 h-10 rounded-full bg-surface-container" data-alt="A clean, minimalist 3D character avatar of a young girl with braided hair and a cheerful expression, wearing a warm yellow sweater. The artistic style is modern and high-contrast, set against a soft white background with gentle, diffused lighting that feels professional yet inviting for a community-based platform." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbaLJb_kfZ2WM-Otp6aChXurvK_kNfAtTFuZMwiQacwEgCfy1MKh8kAhrT1ucWZz3nXWXFbTcKmii6Zrt2PxaLTNxvBHpr8c-5tgyL-Df_5oR7g4o9KklK7ISz1E1NAc8r6LqGMPn-lZsFv7rA40zKB62uzjMQitvA_Eobo2sVzx4pd_nAbx5cHuapix1sakQEtcyemjYcMJHZYQ2otGoihTGJlWMgReULkmqJV2SKhd0uU8Wlo2H5dzrxMzugmVEAWImRcGXhTQI" />
              <div class="flex-1">
                <p class="font-label-md text-on-surface">Sophie Laurent</p>
                <p class="font-body-sm text-on-surface-variant">Niveau 2 • Groupe C</p>
              </div>
              <span class="px-2 py-1 rounded-full bg-surface-container-low text-primary text-[10px] font-bold">ACTIF</span>
            </div>
            <div class="flex items-center gap-sm p-sm">
              <img alt="Avatar" class="w-10 h-10 rounded-full bg-surface-container" data-alt="A high-definition minimalist 3D avatar of a young boy with dark curly hair and glasses, looking friendly and curious. The visual style is crisp and flat, using a palette of blues and warm whites to create an approachable administrative interface character, illuminated by high-key, natural light." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBijtzWV7t6wkLymvTd-R8Pq5ufR0BLQNWwpQVriMXwjIgTCu7FsNRbr-qStqybw4Zf85DhPkus6gCDQYpP1xFraEU4r3YVBC_Sa24uQ8VspJoctZUM2M6hcNqIsTuluiWV_ITv_A7DbQU_NlVvRI1mHMkj2gtvvKL_l6021NIZucqv7ox9WGI9rHhbZt-3bsPh7PXJk0GHwmr_0ISZBnue1Yu5jkwPuFk-Bhe1DwG1BFoHexIhnAEaXZnH3BjYNjgrLhWLZN7XvYc" />
              <div class="flex-1">
                <p class="font-label-md text-on-surface">Amine Benali</p>
                <p class="font-body-sm text-on-surface-variant">Niveau 1 • Groupe B</p>
              </div>
              <span class="px-2 py-1 rounded-full bg-surface-container-low text-primary text-[10px] font-bold">ACTIF</span>
            </div>
          </div>
        </div>
      </section>

      <section class="pb-xl">
        <h3 class="font-label-md text-on-surface mb-sm">Actions rapides</h3>
        <div class="grid grid-cols-2 gap-sm">
          <button class="flex flex-col items-center justify-center gap-2 p-md bg-[#F3F1ED] border border-[#E8E4DE] rounded-xl hover:bg-surface-container transition-colors">
            <Icon color="h-6 w-6 text-primary" name="person_add" />
            <span class="font-label-sm text-on-surface">Ajouter Enfant</span>
          </button>
          <button class="flex flex-col items-center justify-center gap-2 p-md bg-[#F3F1ED] border border-[#E8E4DE] rounded-xl hover:bg-surface-container transition-colors">
            <Icon color="h-6 w-6 text-primary" name="calendar_add_on" />
            <span class="font-label-sm text-on-surface">Nouvelle Séance</span>
          </button>
          <button class="flex flex-col items-center justify-center gap-2 p-md bg-[#F3F1ED] border border-[#E8E4DE] rounded-xl hover:bg-surface-container transition-colors">
            <Icon color="h-6 w-6 text-primary" name="description" />
            <span class="font-label-sm text-on-surface">Rapport Hebdo</span>
          </button>
          <button class="flex flex-col items-center justify-center gap-2 p-md bg-[#F3F1ED] border border-[#E8E4DE] rounded-xl hover:bg-surface-container transition-colors">
            <Icon color="h-6 w-6 text-primary" name="mail" />
            <span class="font-label-sm text-on-surface">Email Parents</span>
          </button>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref,computed } from 'vue'
import { classes } from '../stores/child'
import type { ClasseType } from '../types/classe'
import { useDashboard } from '../composables/useDashboard'


const {stats, pending, error, refresh} =useDashboard()



const classeEDCE = ref<ClasseType[]>(classes)

const filtreClasse=ref<ClasseType>("Petit")

const childStatistics = computed(() => {
  return stats.value?.childrenStats.childrenPerClass.find(
    (childStats: { classe: string; count: number; rate: number }) => childStats.classe === filtreClasse.value
  )
})



definePageMeta({
  layout: 'dashboard',
})

useHead({
  title: 'EDCE Admin Dashboard',
})

const desktopMain = ref<HTMLElement | null>(null)
const showDashboardMenu = inject<() => void>('showDashboardMenu')

onMounted(() => {
  document.querySelectorAll<HTMLElement>('.glass-card').forEach((card) => {
    card.addEventListener('mouseenter', () => {
      card.style.borderColor = '#2D5BE3'
    })
    card.addEventListener('mouseleave', () => {
      card.style.borderColor = '#E8E4DE'
    })
  })

  if (desktopMain.value) {
    desktopMain.value.style.opacity = '0'
    desktopMain.value.style.transform = 'translateY(10px)'
    desktopMain.value.style.transition = 'all 0.6s ease-out'

    window.setTimeout(() => {
      if (!desktopMain.value) return
      desktopMain.value.style.opacity = '1'
      desktopMain.value.style.transform = 'translateY(0)'
    }, 100)
  }

  document.querySelectorAll<HTMLElement>('.chart-bar').forEach((bar) => {
    const targetHeight = bar.style.height
    bar.style.height = '0px'
    window.setTimeout(() => {
      bar.style.height = targetHeight
    }, 100)
  })
})
</script>

<style scoped>
.ultra-shadow {
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.custom-shadow {
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.glass-card {
  background: #FFFFFF;
  border: 1px solid #E8E4DE;
  border-radius: 12px;
}

.chart-bar {
  transition: height 1s ease-out;
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #E8E4DE;
  border-radius: 10px;
}
</style>
