import { useInfiniteQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";

export const useCalvinAITemplates = (search) => {
  return useInfiniteQuery({
    queryKey: ["calvinaiTemplates", search],
    queryFn: ({ pageParam }) =>
      xanoGet("/calvinai_templates", "staff", {
        search,
        page: pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (prevData) => prevData.nextPage,
  });
};
