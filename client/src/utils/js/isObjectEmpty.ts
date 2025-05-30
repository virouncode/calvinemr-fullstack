export const isObjectEmpty = (obj: object) => {
  if (!obj) return true;
  return Object.keys(obj).length === 0;
};
