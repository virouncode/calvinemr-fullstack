import { UpdateType } from "../../types/api";

type BaseItem = {
  created_by_id: number;
  date_created: number;
  created_by_user_type?: "staff" | "admin";
  updates?: UpdateType[];
};

export const isUpdated = <T extends BaseItem>(data: T): boolean => {
  return !!data.updates && data.updates.length > 0;
};

export const getLastUpdate = <T extends BaseItem>(
  data: T
): UpdateType | undefined => {
  if (!isUpdated(data)) {
    return undefined;
  }
  return data.updates!.sort((a, b) => b.date_updated - a.date_updated)[0];
};
