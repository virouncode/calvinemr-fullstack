import { useInfiniteQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import { PaginatedClinicalNoteTemplatesType } from "../../../types/api";

export const useClinicalNotesTemplates = (search: string) => {
  return useInfiniteQuery({
    queryKey: ["clinicalNotesTemplates", search],
    queryFn: ({ pageParam }): Promise<PaginatedClinicalNoteTemplatesType> =>
      xanoGet("/clinical_notes_templates", "staff", {
        search,
        page: pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (prevData) => prevData.nextPage,
  });
};
