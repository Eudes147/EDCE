export type EventType = "Arbre de noël" | "Soirée récréative des enfants"

export interface Activity {
  id: string
  title: string
}

export interface activitySubmit {
  title: string
}

export interface EventActivity {
  id: string
  activityId: string
  eventType: EventType
  year: string
}