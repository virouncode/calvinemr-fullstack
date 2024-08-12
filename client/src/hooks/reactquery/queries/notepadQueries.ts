import { useQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import { NotepadType } from "../../../types/api";

export const useNotepad = (staffId: number) => {
  return useQuery({
    queryKey: ["notepads", staffId],
    queryFn: (): Promise<NotepadType> => {
      return xanoGet("/notepads_for_staff", "staff", { staff_id: staffId });
    },
  });
};
