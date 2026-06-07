import { getInitials } from "./getInitials"

export const getFullName=(name: string)=>{
    const full_name= name
    const initials=getInitials(full_name)

    return {
      name: full_name,
      initials: initials
    }

  }