import { PersonalHistoryType } from "../../../types/api";

export const getResidualInfo = (name: string, datas?: PersonalHistoryType) => {
  if (!datas) return "";
  return (
    datas.ResidualInfo.DataElement.find(({ Name }) => Name === name)?.Content ||
    ""
  );
};
