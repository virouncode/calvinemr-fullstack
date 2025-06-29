import { useQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import { SettingsType } from "../../../types/api";

export const useSettings = (hostId: number) => {
  return useQuery<SettingsType>({
    queryKey: ["settings", hostId],
    queryFn: () => {
      return xanoGet("/settings_of_staff", "staff", {
        staff_id: hostId,
      });
    },
  });
};
