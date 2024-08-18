import { useInfiniteQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import { LetterTemplateType, PaginatedDatasType } from "../../../types/api";

export const useLettersTemplates = (search: string) => {
  return useInfiniteQuery({
    queryKey: ["lettersTemplates", search],
    queryFn: ({ pageParam }): Promise<PaginatedDatasType<LetterTemplateType>> =>
      xanoGet("/letters_templates", "staff", {
        search,
        page: pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (prevData) => prevData.nextPage,
  });
};
