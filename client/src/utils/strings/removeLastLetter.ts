export const removeLastLetter = (str: string) => {
  const lastChar = str.charAt(str.length - 1);
  if (/[a-zA-Z]/.test(lastChar)) {
    return str.slice(0, -1);
  } else {
    return str;
  }
};
