import { ref } from 'vue'

// --- 1. INTERFACES STRICTES DES ENTITÉS ---

export interface Departement {
  code: string
  nom: string
}

export interface Commune {
  code: string
  nom: string
  departement: string
  departement_detail?: Departement
}

export interface Arrondissement {
  code: string
  nom: string
  commune: string
  commune_detail?: {
    code: string
    nom: string
    departement: string
  }
}

export interface Quartier {
  code: string
  nom: string
  arrondissement: string
  arrondissement_detail?: {
    code: string
    nom: string
    commune: string
  }
}

// --- 2. INTERFACES DES ENVELOPPES DE RÉPONSES API ---

export interface ApiListResponse<T> {
  total: number
  data: T[]
}

export interface ApiDeptCommunesResponse {
  departement: Departement
  total: number
  data: Commune[]
}

export interface ApiCommuneArrondissementsResponse {
  commune: {
    code: string
    nom: string
    departement: string
  }
  total: number
  data: Arrondissement[]
}

export interface ApiArrondissementQuartiersResponse {
  arrondissement: {
    code: string
    nom: string
    commune: string
  }
  total: number
  data: Quartier[]
}

// --- 3. CACHES GLOBAUX PARTAGÉS (Persistent entre les appels du hook) ---
const cachedDepartments = ref<Departement[]>([])
const cachedAllCommunes = ref<Commune[]>([])
const cachedCommunesByDept = ref<Record<string, Commune[]>>({})
const cachedArrondissementsByCommune = ref<Record<string, Arrondissement[]>>({})
const cachedQuartiersByArrondissement = ref<Record<string, Quartier[]>>({})

export function useGeoBJ() {
  const BASE_URL = 'https://geobj.emunadigitalsolution.com/api/v1'
  const isLoading = ref(false)

  /**
   * a. GET /departements
   */
  async function fetchDepartements(): Promise<Departement[]> {
    if (cachedDepartments.value.length > 0) return cachedDepartments.value
    isLoading.value = true
    try {
      const res = await $fetch<ApiListResponse<Departement>>(`${BASE_URL}/departements`)
      cachedDepartments.value = res.data || []
      return cachedDepartments.value
    } catch (err) {
      console.error('Erreur lors du fetch des départements :', err)
      return []
    } finally {
      isLoading.value = false
    }
  }

  /**
   * b. GET /departements/{code}
   */
  async function fetchDepartementByCode(code: string): Promise<Departement | null> {
    isLoading.value = true
    try {
      return await $fetch<Departement>(`${BASE_URL}/departements/${code}`)
    } catch (err) {
      console.error(`Erreur lors du fetch du département ${code} :`, err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * c. GET /departements/{code}/communes
   */
  async function fetchCommunesByDepartement(deptCode: string): Promise<Commune[]> {
    if (!deptCode) return []
    if (cachedCommunesByDept.value[deptCode]) return cachedCommunesByDept.value[deptCode]
    
    isLoading.value = true
    try {
      const res = await $fetch<ApiDeptCommunesResponse>(`${BASE_URL}/departements/${deptCode}/communes`)
      cachedCommunesByDept.value[deptCode] = res.data || []
      return cachedCommunesByDept.value[deptCode]
    } catch (err) {
      console.error(`Erreur lors du fetch des communes du département ${deptCode} :`, err)
      return []
    } finally {
      isLoading.value = false
    }
  }

  /**
   * d. GET /communes
   */
  async function fetchAllCommunes(): Promise<Commune[]> {
    if (cachedAllCommunes.value.length > 0) return cachedAllCommunes.value
    isLoading.value = true
    try {
      const res = await $fetch<ApiListResponse<Commune>>(`${BASE_URL}/communes`)
      cachedAllCommunes.value = res.data || []
      return cachedAllCommunes.value
    } catch (err) {
      console.error('Erreur lors du fetch de toutes les communes :', err)
      return []
    } finally {
      isLoading.value = false
    }
  }

  /**
   * e. GET /communes/{code}
   */
  async function fetchCommuneByCode(code: string): Promise<Commune | null> {
    isLoading.value = true
    try {
      return await $fetch<Commune>(`${BASE_URL}/communes/${code}`)
    } catch (err) {
      console.error(`Erreur lors du fetch de la commune ${code} :`, err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * f. GET /communes/{code}/arrondissements
   */
  async function fetchArrondissementsByCommune(communeCode: string): Promise<Arrondissement[]> {
    if (!communeCode) return []
    if (cachedArrondissementsByCommune.value[communeCode]) return cachedArrondissementsByCommune.value[communeCode]

    isLoading.value = true
    try {
      const res = await $fetch<ApiCommuneArrondissementsResponse>(`${BASE_URL}/communes/${communeCode}/arrondissements`)
      cachedArrondissementsByCommune.value[communeCode] = res.data || []
      return cachedArrondissementsByCommune.value[communeCode]
    } catch (err) {
      console.error(`Erreur lors du fetch des arrondissements de la commune ${communeCode} :`, err)
      return []
    } finally {
      isLoading.value = false
    }
  }

  /**
   * g. GET /arrondissements/{code}
   */
  async function fetchArrondissementByCode(code: string): Promise<Arrondissement | null> {
    isLoading.value = true
    try {
      return await $fetch<Arrondissement>(`${BASE_URL}/arrondissements/${code}`)
    } catch (err) {
      console.error(`Erreur lors du fetch de l'arrondissement ${code} :`, err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * h. GET /arrondissements/{code}/quartiers
   */
  async function fetchQuartiersByArrondissement(arrondissementCode: string): Promise<Quartier[]> {
    if (!arrondissementCode) return []
    if (cachedQuartiersByArrondissement.value[arrondissementCode]) return cachedQuartiersByArrondissement.value[arrondissementCode]

    isLoading.value = true
    try {
      const res = await $fetch<ApiArrondissementQuartiersResponse>(`${BASE_URL}/arrondissements/${arrondissementCode}/quartiers`)
      cachedQuartiersByArrondissement.value[arrondissementCode] = res.data || []
      return cachedQuartiersByArrondissement.value[arrondissementCode]
    } catch (err) {
      console.error(`Erreur lors du fetch des quartiers de l'arrondissement ${arrondissementCode} :`, err)
      return []
    } finally {
      isLoading.value = false
    }
  }

  /**
   * i. GET /quartiers/{code}
   */
  async function fetchQuartierByCode(code: string): Promise<Quartier | null> {
    isLoading.value = true
    try {
      return await $fetch<Quartier>(`${BASE_URL}/quartiers/${code}`)
    } catch (err) {
      console.error(`Erreur lors du fetch du quartier ${code} :`, err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    
    // Caches partagés accessibles si besoin
    departements: cachedDepartments,
    communesByDept: cachedCommunesByDept,
    arrondissementsByCommune: cachedArrondissementsByCommune,
    quartiersByArrondissement: cachedQuartiersByArrondissement,

    // Fonctions d'appels API
    fetchDepartements,
    fetchDepartementByCode,
    fetchCommunesByDepartement,
    fetchAllCommunes,
    fetchCommuneByCode,
    fetchArrondissementsByCommune,
    fetchArrondissementByCode,
    fetchQuartiersByArrondissement,
    fetchQuartierByCode
  }
}