export const getExtension = (path: string | undefined) => {
  if (!path) return "";
  const baseName = path.split(/[\\/]/).pop() as string, // extracts file name from full path
    // (supports separators `\\` and `/`)
    pos = baseName?.lastIndexOf("."); // gets the last position of `.`
  if (pos) {
    if (baseName === "" || pos < 1)
      // if the file name is empty or ...
      return ""; // the dot not found (-1) or comes first (0)
    return baseName?.slice(pos + 1); // extracts extension ignoring "."
  } else return "";
};
