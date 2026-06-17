import { defineStore } from "pinia";
import type{Child} from '~/types/child';
import type{ClasseType} from '~/types/classe';
import type { niveauScolaire } from "~/types/classe";


export const classes: ClasseType[] = ["Petit", "Débutant", "Moyen", "JuniorA", "JuniorB"]

export const nivScolaireClasse:Record<ClasseType,niveauScolaire[]> ={
  "Petit": ["M1","M2","CI","CP","Autres"],
  "Débutant": ["CE1","CE2",'Autres'],
  "Moyen": ["CM1","CM2",'Autres'],
  "JuniorA": ["6e","5e","4e",'Autres'],
  "JuniorB": ["3e","2nd","1e","Tle",'Autres'],
}

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