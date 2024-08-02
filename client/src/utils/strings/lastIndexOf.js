export const lastIndexOf = (arr, stringToFind) => {
  let index = -1;
  for (let i = arr.length - 1; i > 0; i--) {
    if (arr[i].includes(stringToFind)) {
      index = i;
      break;
    }
  }
  return index;
};
