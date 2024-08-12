import { useInfiniteQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import { PaginatedMedsTemplatesType } from "../../../types/api";

export const useMedsTemplates = (search: string) => {
  return useInfiniteQuery({
    queryKey: ["medsTemplates", search],
    queryFn: ({ pageParam }): Promise<PaginatedMedsTemplatesType> =>
      xanoGet("/medications_templates", "staff", { search, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (prevData) => prevData.nextPage,
  });
};
