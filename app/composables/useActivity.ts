import {mockActivities,mockActivityatEvent} from '~/data/mockData'
import type { Activity, EventActivity } from '~/types/activity'

import {ref,computed} from 'vue'
export const useActivities = () => {

  const listActivities=ref(mockActivities) 

  const groupActivityperYear=computed(()=>{
    mockActivityatEvent.reduce((acc,event)=>{
          const activityFound= listActivities.value.filter(activity=>activity.id=== event.activityId) || {id: '', title:""}
        
          if(acc[event.year]) acc[event.year] = (activityFound|| [])

          return acc

      },{} as Record<string,Activity[]>)
  })
  
  

  const groupActivityperEvent=computed(()=>{
    const listEvent=mockActivityatEvent.reduce((acc,event)=>{
      if(!(event.eventType in acc)) acc.push(event.eventType)
      return acc
    },[] as String[])

    listEvent.reduce((acc,event)=>{
      const activitiesFound= mockActivityatEvent.filter(eventactivity=>eventactivity.eventType === event)
    
      if(activitiesFound){
        const activities=activitiesFound.map(activityFound=>{
          const activity=listActivities.value.find(activity=>activity.id===activityFound.activityId)
          return activity

        })
        acc[event] = (activities || [])
      
      }
      return acc
    },{} as Record<string,Activity[]>)
  })
  
  

  return {
    listActivities,
    groupActivityperYear,
    groupActivityperEvent
  }
}