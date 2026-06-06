// data/activitiesData.ts

export interface Participant {
  id: string
  name: string
  classe: string
  avatar: string
}

export interface Supervisor {
  id: string
  name: string
  role: string
  initials: string
}

export interface Activity {
  id: string
  type: 'INTERPRETATION' | 'CHORALE' | 'BALLET' | 'CHORE' | 'SKETCH' | 'LESSON'
  event: string
  year: number
  participants: Participant[]
  supervisors: Supervisor[]
  participantCount: number
  supervisorCount: number
  rehearsals: number
  preparationStatus: number // percentage
}

export const activitiesData: Activity[] = [
  {
    id: 'act-001',
    type: 'INTERPRETATION',
    event: 'ARBRE DE NOËL',
    year: 2026,
    participants: [
      {
        id: 'child-001',
        name: 'Marc Lavoine',
        classe: 'Benjamin',
        avatar: 'ML'
      },
      {
        id: 'child-002',
        name: 'Sarah Bernhardt',
        classe: 'Cadet',
        avatar: 'SB'
      },
      {
        id: 'child-003',
        name: 'Sophie Martin',
        classe: 'Débutant',
        avatar: 'SM'
      },
      {
        id: 'child-004',
        name: 'Luc Dupont',
        classe: 'Moyen',
        avatar: 'LD'
      },
      {
        id: 'child-005',
        name: 'Emma Blanc',
        classe: 'JuniorA',
        avatar: 'EB'
      }
    ],
    supervisors: [
      {
        id: 'teacher-001',
        name: 'Esther Lefebvre',
        role: 'Responsable Principal',
        initials: 'EL'
      },
      {
        id: 'teacher-002',
        name: 'Paul Durant',
        role: 'Assistant',
        initials: 'PD'
      },
      {
        id: 'teacher-003',
        name: 'Marie Leclerc',
        role: 'Coordinatrice',
        initials: 'ML'
      }
    ],
    participantCount: 18,
    supervisorCount: 3,
    rehearsals: 12,
    preparationStatus: 60
  },
  {
    id: 'act-002',
    type: 'CHORALE',
    event: 'SOIREE RECREATIVE',
    year: 2026,
    participants: [
      {
        id: 'child-006',
        name: 'Thomas Girard',
        classe: 'Petit',
        avatar: 'TG'
      },
      {
        id: 'child-007',
        name: 'Alice Fontaine',
        classe: 'Débutant',
        avatar: 'AF'
      },
      {
        id: 'child-008',
        name: 'Nicolas Renard',
        classe: 'Moyen',
        avatar: 'NR'
      }
    ],
    supervisors: [
      {
        id: 'teacher-004',
        name: 'Jean-Pierre Moreau',
        role: 'Chef Chorale',
        initials: 'JPM'
      },
      {
        id: 'teacher-005',
        name: 'Isabelle Rousseau',
        role: 'Assistant',
        initials: 'IR'
      }
    ],
    participantCount: 24,
    supervisorCount: 2,
    rehearsals: 8,
    preparationStatus: 45
  },
  {
    id: 'act-003',
    type: 'BALLET',
    event: 'ARBRE DE NOËL',
    year: 2026,
    participants: [
      {
        id: 'child-009',
        name: 'Lea Mercier',
        classe: 'JuniorB',
        avatar: 'LM'
      },
      {
        id: 'child-010',
        name: 'Julien Bernard',
        classe: 'JuniorA',
        avatar: 'JB'
      }
    ],
    supervisors: [
      {
        id: 'teacher-006',
        name: 'Camille Deschamps',
        role: 'Responsable',
        initials: 'CD'
      }
    ],
    participantCount: 15,
    supervisorCount: 1,
    rehearsals: 10,
    preparationStatus: 75
  },
  {
    id: 'act-004',
    type: 'SKETCH',
    event: 'SOIREE RECREATIVE',
    year: 2026,
    participants: [
      {
        id: 'child-011',
        name: 'Antoine Petit',
        classe: 'Moyen',
        avatar: 'AP'
      },
      {
        id: 'child-012',
        name: 'Céline Richard',
        classe: 'JuniorA',
        avatar: 'CR'
      },
      {
        id: 'child-013',
        name: 'David Lefevre',
        classe: 'JuniorB',
        avatar: 'DL'
      }
    ],
    supervisors: [
      {
        id: 'teacher-007',
        name: 'Vincent Durand',
        role: 'Metteur en scène',
        initials: 'VD'
      },
      {
        id: 'teacher-008',
        name: 'Sophie Arnould',
        role: 'Assistant',
        initials: 'SA'
      }
    ],
    participantCount: 12,
    supervisorCount: 2,
    rehearsals: 6,
    preparationStatus: 30
  },
  {
    id: 'act-005',
    type: 'LESSON',
    event: 'ARBRE DE NOËL',
    year: 2026,
    participants: [
      {
        id: 'child-014',
        name: 'Maxime Collard',
        classe: 'Débutant',
        avatar: 'MC'
      },
      {
        id: 'child-015',
        name: 'Vanessa Rossi',
        classe: 'Moyen',
        avatar: 'VR'
      }
    ],
    supervisors: [
      {
        id: 'teacher-009',
        name: 'Francoise Delorme',
        role: 'Responsable',
        initials: 'FD'
      }
    ],
    participantCount: 8,
    supervisorCount: 1,
    rehearsals: 4,
    preparationStatus: 50
  }
]

// Helper function to get activity details
export function getActivityDetails(id: string): Activity | undefined {
  return activitiesData.find(activity => activity.id === id)
}

// Helper function to get all activities for an event
export function getActivitiesByEvent(event: string): Activity[] {
  return activitiesData.filter(activity => activity.event === event)
}

// Helper function to get all activities by type
export function getActivitiesByType(type: Activity['type']): Activity[] {
  return activitiesData.filter(activity => activity.type === type)
}

// Helper function to format activity type
export function formatActivityType(type: Activity['type']): string {
  const typeMap: Record<Activity['type'], string> = {
    INTERPRETATION: 'Interprétation',
    CHORALE: 'Chorale',
    BALLET: 'Ballet',
    CHORE: 'Chorégraphie',
    SKETCH: 'Sketch',
    LESSON: 'Leçon'
  }
  return typeMap[type]
}