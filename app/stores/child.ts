import { defineStore } from "pinia";
import type{Child} from '~/types/child'
import type{ClasseType} from '~/types/classe'


export const classes: ClasseType[] = ["Petit", "Débutant", "Moyen", "JuniorA", "JuniorB"]

export const useChildStore = defineStore('child',{
  state: () =>({
    children: [] as Child[],
    loading: false
  }),
  getters: {
    getChildById: (state) => {
      return (id: string) => state.children.find(child => child.id == id)
    },
    getInfoParent: (state)=>{ 
      return (id: string) => {
        const child = state.children.find(child => child.id == id)
        if(child){
          return {
            sexeParent: child.sexeParent,
            telParent: child.telParent
          }
        }
      }
    }
  }
})