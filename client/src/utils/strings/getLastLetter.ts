export const getLastLetter = (str: string) => {
  // Check if the last character is a letter using a regular expression
  const lastChar = str.charAt(str.length - 1);
  if (/[a-zA-Z]/.test(lastChar)) {
    // If yes, return the last letter
    return lastChar;
  } else {
    // Otherwise, return an empty string
    return "";
  }
};
