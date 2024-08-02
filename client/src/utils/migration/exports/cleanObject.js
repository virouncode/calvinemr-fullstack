import { timestampToDateISOTZ } from "./formatDates";

export const cleanObject = (objet) => {
  for (const cle in objet) {
    if (objet.hasOwnProperty(cle)) {
      if (!objet[cle]) {
        delete objet[cle];
      } else if (cle.includes("Date") || cle.includes("date")) {
        objet[cle] = timestampToDateISOTZ(objet[cle]);
      } else if (typeof objet[cle] === "object") {
        cleanObject(objet[cle]);
        if (Object.keys(objet[cle]).length === 0) {
          delete objet[cle];
        }
      }
    }
  }
  return objet;
};
