export const validateFormTel = (tel: string): string => {
  // 1. Nettoyage : on enlève les espaces au début, à la fin et à l'intérieur
  const cleanTel = tel.trim().replace(/\s+/g, '');

  // 2. La Regex pour valider 10 chiffres commençant par 01
  const format_regex = /^01\d{8}$/;

  // 3. Test et retour
  if (format_regex.test(cleanTel)) {
    return cleanTel; // Retourne le numéro propre (ou `tel` si tu veux garder les espaces d'origine)
  }

  return "";
};