import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import {
  MessageExternalType,
  MessageType,
  PaginatedMessagesExternalType,
  PaginatedMessagesType,
} from "../../../types/api";

export const useStaffMessages = (
  staffId: number,
  section: string,
  search: string
) => {
  return useInfiniteQuery({
    queryKey: ["messages", staffId, section, search],
    queryFn: ({ pageParam }): Promise<PaginatedMessagesType> => {
      if (section === "To-dos") {
        return xanoGet(`/todos_of_staff`, "staff", {
          staff_id: staffId,
          page: pageParam,
          search,
        });
      } else {
        return xanoGet(`/messages_of_staff`, "staff", {
          staff_id: staffId,
          page: pageParam,
          search,
        });
      }
    },
    enabled: !!staffId,
    initialPageParam: 1,
    getNextPageParam: (prevData) => prevData.nextPage,
  });
};

export const useStaffExternalMessages = (
  staffId: number,
  section: string,
  search: string
) => {
  return useInfiniteQuery({
    queryKey: ["messagesExternal", "staff", staffId, section, search],
    queryFn: ({ pageParam }): Promise<PaginatedMessagesExternalType> => {
      return xanoGet(`/messages_external_of_staff`, "staff", {
        staff_id: staffId,
        page: pageParam,
        search,
      });
    },
    enabled: !!staffId,
    initialPageParam: 1,
    getNextPageParam: (prevData) => prevData.nextPage,
  });
};

const fetchPreviousMessages = async (message: MessageType, section: string) => {
  if (!message || section === "To-dos") return [];
  const previousInternal: MessageType[] = await xanoGet(
    "/messages_selected",
    "staff",
    {
      messages_ids: message.previous_messages
        .filter(({ message_type }) => message_type === "Internal")
        .map(({ id }) => id),
    }
  );
  const previousExternal: MessageExternalType[] = await xanoGet(
    "/messages_external_selected",
    "staff",
    {
      messages_ids: message.previous_messages
        .filter(({ message_type }) => message_type === "External")
        .map(({ id }) => id),
    }
  );
  return [...previousInternal, ...previousExternal].sort(
    (a, b) => (b.date_created ?? 0) - (a.date_created ?? 0)
  );
};

export const usePreviousMessages = (message: MessageType, section: string) => {
  return useQuery({
    queryKey: ["previousMessages"],
    queryFn: (): Promise<(MessageExternalType | MessageExternalType)[]> =>
      fetchPreviousMessages(message, section),
  });
};

export const usePatientExternalMessages = (
  patientId: number,
  section: string,
  search: string
) => {
  return useInfiniteQuery({
    queryKey: ["messagesExternal", "patient", patientId, section, search],
    queryFn: ({ pageParam }): Promise<PaginatedMessagesExternalType> =>
      xanoGet(`/messages_external_of_patient`, "patient", {
        patient_id: patientId,
        page: pageParam,
        search,
      }),
    enabled: !!patientId,
    initialPageParam: 1,
    getNextPageParam: (prevData) => prevData.nextPage,
  });
};
