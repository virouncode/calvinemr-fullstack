import { useInfiniteQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";

export const useMedsTemplates = (search) => {
  return useInfiniteQuery({
    queryKey: ["medsTemplates", search],
    queryFn: ({ pageParam }) =>
      xanoGet("/medications_templates", "staff", { search, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (prevData) => prevData.nextPage,
  });
};
