import { useInfiniteQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";

export const useLettersTemplates = (search) => {
  return useInfiniteQuery({
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
