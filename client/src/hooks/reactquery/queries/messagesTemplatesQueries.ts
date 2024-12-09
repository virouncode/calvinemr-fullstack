import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
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

export const useMessagesFavoritesTemplates = (
  userId: number,
  search: string
) => {
  return useQuery<MessageTemplateType[]>({
    queryKey: ["messagesFavoritesTemplates", userId, search],
    queryFn: () =>
      xanoGet("/messages_templates_favorites_for_staff", "staff", {
        search,
        staff_id: userId,
      }),
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

export const useMessagesExternalFavoritesTemplates = (
  userId: number,
  search: string
) => {
  return useQuery<MessageExternalTemplateType[]>({
    queryKey: ["messagesExternalFavoritesTemplates", userId, search],
    queryFn: () =>
      xanoGet("/messages_external_templates_favorites_for_staff", "staff", {
        search,
        staff_id: userId,
      }),
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

export const useTodosFavoritesTemplates = (userId: number, search: string) => {
  return useQuery<TodoTemplateType[]>({
    queryKey: ["todosFavoritesTemplates", userId, search],
    queryFn: () =>
      xanoGet("/todos_templates_favorites_for_staff", "staff", {
        search,
        staff_id: userId,
      }),
  });
};
