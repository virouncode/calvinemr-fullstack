import { useInfiniteQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";

export const useMessagesTemplates = (search) => {
  return useInfiniteQuery({
    queryKey: ["messagesTemplates", search],
    queryFn: ({ pageParam }) =>
      xanoGet("/messages_templates", "staff", {
        search,
        page: pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (prevData) => prevData.nextPage,
  });
};

export const useMessagesExternalTemplates = (search) => {
  return useInfiniteQuery({
    queryKey: ["messagesExternalTemplates", search],
    queryFn: ({ pageParam }) =>
      xanoGet("/messages_external_templates", "staff", {
        search,
        page: pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (prevData) => prevData.nextPage,
  });
};

export const useTodosTemplates = (search) => {
  return useInfiniteQuery({
    queryKey: ["todosTemplates", search],
    queryFn: ({ pageParam }) =>
      xanoGet("/todos_templates", "staff", {
        search,
        page: pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (prevData) => prevData.nextPage,
  });
};
