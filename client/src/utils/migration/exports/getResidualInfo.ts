import { PersonalHistoryType } from "../../../types/api";

export const getResidualInfo = (name: string, datas: PersonalHistoryType) => {
  return (
    datas.ResidualInfo.DataElement.find(({ Name }) => Name === name)?.Content ||
    ""
  );
};
