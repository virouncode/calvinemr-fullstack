import { useInfiniteQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import {
  PaginatedMessageExternalTemplatesType,
  PaginatedMessageTemplatesType,
  PaginatedTodosType,
} from "../../../types/api";

export const useMessagesTemplates = (search: string) => {
  return useInfiniteQuery({
    queryKey: ["messagesTemplates", search],
    queryFn: ({ pageParam }): Promise<PaginatedMessageTemplatesType> =>
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
    queryFn: ({ pageParam }): Promise<PaginatedMessageExternalTemplatesType> =>
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
    queryFn: ({ pageParam }): Promise<PaginatedTodosType> =>
      xanoGet("/todos_templates", "staff", {
        search,
        page: pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (prevData) => prevData.nextPage,
  });
};
