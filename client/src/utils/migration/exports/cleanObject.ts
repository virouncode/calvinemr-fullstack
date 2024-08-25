import { timestampToDateISOTZ } from "../../dates/formatDates";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const cleanObject = (objet: any) => {
  for (const cle in objet) {
    if (Object.prototype.hasOwnProperty.call(objet, cle)) {
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
