import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { SiteType } from "../../../types/api";
import { getAvailableRooms } from "../../../utils/appointments/getAvailableRooms";

const fetchAvailableRooms = async (
  appointmentId: number,
  rangeStart: number,
  rangeEnd: number,
  sites: SiteType[],
  siteId: number
) => {
  try {
    return await getAvailableRooms(
      appointmentId,
      rangeStart,
      rangeEnd,
      sites,
      siteId
    );
  } catch (err) {
    if (err instanceof Error)
      toast.error(`Error: unable to get available rooms ${err.message}`, {
        containerId: "A",
      });
  }
};

export const useAvailableRooms = (
  appointmentId: number,
  appointmentStart: number,
  appointmentEnd: number,
  sites: SiteType[],
  appointmentSiteId: number
) => {
  return useQuery({
    queryKey: [
      "availableRooms",
      appointmentId,
      appointmentStart,
      appointmentEnd,
      sites,
      appointmentSiteId,
    ],
    queryFn: () =>
      fetchAvailableRooms(
        appointmentId,
        appointmentStart,
        appointmentEnd,
        sites,
        appointmentSiteId
      ),
    placeholderData: sites
      ?.find(({ id }) => id === appointmentSiteId)
      ?.rooms?.map(({ id }) => id),
    enabled: !!sites,
  });
};
