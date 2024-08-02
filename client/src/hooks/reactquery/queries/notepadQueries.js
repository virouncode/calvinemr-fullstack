import { useQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";

export const useNotepad = (staffId) => {
  return useQuery({
    queryKey: ["notepads", staffId],
    queryFn: () => {
      return xanoGet("/notepads_for_staff", "staff", { staff_id: staffId });
    },
  });
};
