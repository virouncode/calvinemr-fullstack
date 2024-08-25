import { SiteType } from "../../types/api";

export const toRoomTitle = (
  sites: SiteType[] | undefined,
  siteId: number,
  roomId: string
) => {
  if (!siteId || !roomId) return "";
  return (
    sites
      ?.find(({ id }) => id === siteId)
      ?.rooms.find(({ id }) => id === roomId)?.title ?? ""
  );
};
