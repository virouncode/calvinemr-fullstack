import { useInfiniteQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import {
  MessageExternalTemplateType,
  MessageTemplateType,
  TodoTemplateType,
  XanoPaginatedType,
} from "../../../types/api";

export const useMessagesTemplates = (search: string) => {
  return useInfiniteQuery<XanoPaginatedType<MessageTemplateType>>({
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

export const useMessagesExternalTemplates = (search: string) => {
  return useInfiniteQuery<XanoPaginatedType<MessageExternalTemplateType>>({
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

export const useTodosTemplates = (search: string) => {
  return useInfiniteQuery<XanoPaginatedType<TodoTemplateType>>({
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
