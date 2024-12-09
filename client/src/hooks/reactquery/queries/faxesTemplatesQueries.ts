import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import { FaxTemplateType, XanoPaginatedType } from "../../../types/api";

export const useFaxesTemplates = (search: string) => {
  return useInfiniteQuery<XanoPaginatedType<FaxTemplateType>>({
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

export const useFaxesFavoritesTemplates = (userId: number, search: string) => {
  return useQuery<FaxTemplateType[]>({
    queryKey: ["faxesFavoritesTemplates", userId, search],
    queryFn: () =>
      xanoGet("/faxes_templates_favorites_for_staff", "staff", {
        search,
        staff_id: userId,
      }),
  });
};
