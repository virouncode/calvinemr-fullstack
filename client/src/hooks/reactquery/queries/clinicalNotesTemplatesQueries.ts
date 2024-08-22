import { useInfiniteQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import {
  ClinicalNoteTemplateType,
  XanoPaginatedType,
} from "../../../types/api";

export const useClinicalNotesTemplates = (search: string) => {
  return useInfiniteQuery<XanoPaginatedType<ClinicalNoteTemplateType>>({
    queryKey: ["clinicalNotesTemplates", search],
    queryFn: ({ pageParam }) =>
      xanoGet("/clinical_notes_templates", "staff", {
        search,
        page: pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (prevData) => prevData.nextPage,
  });
};
