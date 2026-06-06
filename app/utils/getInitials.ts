export const getInitials=(name:string)=>{

  if(name){
    const initials = name?.toUpperCase().trim().split(' ')[0] + name?.toUpperCase().trim().split(' ')[1] 

    return initials
  }
  return ''
}