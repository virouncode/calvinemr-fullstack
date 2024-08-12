import { useInfiniteQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import { PaginatedCalvinAITemplatesType } from "../../../types/api";

export const useCalvinAITemplates = (search: string) => {
  return useInfiniteQuery({
    queryKey: ["calvinaiTemplates", search],
    queryFn: ({ pageParam }): Promise<PaginatedCalvinAITemplatesType> =>
      xanoGet("/calvinai_templates", "staff", {
        search,
        page: pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (prevData) => prevData.nextPage,
  });
};
