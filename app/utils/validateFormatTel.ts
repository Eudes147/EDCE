export const validateFormTel = (tel:string)=>{
  const format_regex=""

  if(!tel.trim()) return ""
  else if(tel.trim().startsWith('01') && (tel.trim().length == 10||tel.trim().split(' ').join('').length==10)){
    return tel.trim()
  }
  else return ""
}