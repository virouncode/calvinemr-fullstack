export const addDashes = (number: string) => {
  return number.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
};
