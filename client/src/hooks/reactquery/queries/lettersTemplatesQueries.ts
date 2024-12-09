import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import { LetterTemplateType, XanoPaginatedType } from "../../../types/api";

export const useLettersTemplates = (search: string) => {
  return useInfiniteQuery<XanoPaginatedType<LetterTemplateType>>({
    queryKey: ["lettersTemplates", search],
    queryFn: ({ pageParam }) =>
      xanoGet("/letters_templates", "staff", {
        search,
        page: pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (prevData) => prevData.nextPage,
  });
};

export const useLettersFavoritesTemplates = (
  userId: number,
  search: string
) => {
  return useQuery<LetterTemplateType[]>({
    queryKey: ["lettersFavoritesTemplates", userId, search],
    queryFn: () =>
      xanoGet("/letters_templates_favorites_for_staff", "staff", {
        search,
        staff_id: userId,
      }),
  });
};
