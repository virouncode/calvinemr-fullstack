export const getLastLetter = (str) => {
  // Vérifie si le dernier caractère est une lettre
  if (isNaN(str.charAt(str.length - 1))) {
    // Si oui, retire la dernière lettre
    return str[str.length - 1];
  } else {
    // Sinon, retourne la chaîne d'origine
    return "";
  }
};
