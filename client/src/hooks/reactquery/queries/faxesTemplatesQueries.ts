import { useInfiniteQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import { FaxTemplateType, PaginatedDatasType } from "../../../types/api";

export const useFaxesTemplates = (search: string) => {
  return useInfiniteQuery({
    queryKey: ["faxesTemplates", search],
    queryFn: ({ pageParam }): Promise<PaginatedDatasType<FaxTemplateType>> =>
      xanoGet("/faxes_templates", "staff", {
        search,
        page: pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (prevData) => prevData.nextPage,
  });
};
