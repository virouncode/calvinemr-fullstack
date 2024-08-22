import { UpdateType } from "../../types/api";

export const isUpdated = <T extends { updates?: UpdateType[] }>(
  data: T
): boolean => {
  return !!data.updates && data.updates.length > 0;
};

export const getLastUpdate = <T extends { updates?: UpdateType[] }>(
  data: T
): UpdateType | undefined => {
  if (!isUpdated(data)) {
    return undefined;
  }
  return data.updates!.sort((a, b) => b.date_updated - a.date_updated)[0];
};
