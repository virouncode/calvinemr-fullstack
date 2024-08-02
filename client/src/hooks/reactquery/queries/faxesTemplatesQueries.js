import { useInfiniteQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";

export const useFaxesTemplates = (search) => {
  return useInfiniteQuery({
    queryKey: ["faxesTemplates", search],
    queryFn: ({ pageParam }) =>
      xanoGet("/faxes_templates", "staff", {
        search,
        page: pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (prevData) => prevData.nextPage,
  });
};
