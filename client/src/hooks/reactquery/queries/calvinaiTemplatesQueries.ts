import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import { CalvinAITemplateType, XanoPaginatedType } from "../../../types/api";

export const useCalvinAITemplates = (search: string) => {
  return useInfiniteQuery<XanoPaginatedType<CalvinAITemplateType>>({
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

export const useCalvinAIFavoritesTemplates = (
  userId: number,
  search: string
) => {
  return useQuery<CalvinAITemplateType[]>({
    queryKey: ["calvinaiFavoritesTemplates", userId, search],
    queryFn: () =>
      xanoGet("/calvinai_templates_favorites_for_staff", "staff", {
        search,
        staff_id: userId,
      }),
  });
};
