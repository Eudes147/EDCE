import {defineStore} from 'pinia'

// Types imports
import type { Moderator } from '~/types/moderator'

export const useModeratorStore=defineStore('moderator',{
  state: ()=>({
    moderators: [] as Moderator[],
    loading: false
  }),
  getters:{
    availableModerator: (state)=>state.moderators.filter(moderator=>moderator.isAvailable),
    unavailableModerator: (state)=>state.moderators.filter(moderator=>!moderator.isAvailable)
  },
  actions: {
    setLoading(value: boolean):void {
      this.loading=value
    },
    async fetchTeachers() {
      return 
    },
  }
})