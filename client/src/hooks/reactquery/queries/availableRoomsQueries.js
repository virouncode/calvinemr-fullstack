import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getAvailableRooms } from "../../../utils/appointments/getAvailableRooms";

const fetchAvailableRooms = async (
  appointmentId,
  rangeStart,
  rangeEnd,
  sites,
  siteId
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
    if (err.name !== "CanceledError")
      toast.error(`Error: unable to get available rooms ${err.message}`, {
        containerId: "A",
      });
  }
};

export const useAvailableRooms = (
  appointmentId,
  appointmentStart,
  appointmentEnd,
  sites,
  appointmentSiteId
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
