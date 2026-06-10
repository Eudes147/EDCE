export const getAgeByBirthDate = (birthDate: Date): number|string => {
  if(!birthDate) return 'Non défini'
  const today = new Date();
  const birth = birthDate;
  let age = today.getFullYear() - birth.getFullYear();
  const monthDifference = today.getMonth() - birth.getMonth();

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};