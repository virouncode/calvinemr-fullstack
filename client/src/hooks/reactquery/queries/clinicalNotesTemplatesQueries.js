import { useInfiniteQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";

export const useClinicalNotesTemplates = (search) => {
  return useInfiniteQuery({
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
