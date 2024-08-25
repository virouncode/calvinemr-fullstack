import { useInfiniteQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import { MedTemplateType, XanoPaginatedType } from "../../../types/api";

export const useMedsTemplates = (search: string) => {
  return useInfiniteQuery<XanoPaginatedType<MedTemplateType>>({
    queryKey: ["medsTemplates", search],
    queryFn: ({ pageParam }) =>
      xanoGet("/medications_templates", "staff", { search, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (prevData) => prevData.nextPage,
  });
};
