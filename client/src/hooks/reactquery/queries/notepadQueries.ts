import { useQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import { NotepadType } from "../../../types/api";

export const useNotepad = (staffId: number) => {
  return useQuery<NotepadType>({
    queryKey: ["notepads", staffId],
    queryFn: () => {
      return xanoGet("/notepads_for_staff", "staff", { staff_id: staffId });
    },
  });
};
