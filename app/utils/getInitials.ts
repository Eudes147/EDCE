export const getInitials=(name:string)=>{

  if(name){
    const initialsList = name?.toUpperCase().trim().split(' ')

    const initials=initialsList.reduce((acc,initial)=>{

      acc = (acc||"")+(initial[0] ||"")
      return acc
    },"" as String)
    return initials
  }
  return ''
}