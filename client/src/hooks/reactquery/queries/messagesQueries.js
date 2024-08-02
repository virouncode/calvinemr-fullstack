import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";

export const useStaffMessages = (staffId, section, search) => {
  return useInfiniteQuery({
    queryKey: ["messages", staffId, section, search],
    queryFn: ({ pageParam }) => {
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

export const useStaffExternalMessages = (staffId, section, search) => {
  return useInfiniteQuery({
    queryKey: ["messagesExternal", "staff", staffId, section, search],
    queryFn: ({ pageParam }) => {
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

const fetchPreviousMessages = async (message, section) => {
  if (!message || section === "To-dos") return;
  const previousInternal = await xanoGet("/messages_selected", "staff", {
    messages_ids: message.previous_messages
      .filter(({ message_type }) => message_type === "Internal")
      .map(({ id }) => id),
  });
  const previousExternal = await xanoGet(
    "/messages_external_selected",
    "staff",
    {
      messages_ids: message.previous_messages
        .filter(({ message_type }) => message_type === "External")
        .map(({ id }) => id),
    }
  );
  return [...previousInternal, ...previousExternal].sort(
    (a, b) => b.date_created - a.date_created
  );
};

export const usePreviousMessages = (message, section) => {
  return useQuery({
    queryKey: ["previousMessages"],
    queryFn: () => fetchPreviousMessages(message, section),
  });
};

export const usePatientExternalMessages = (patientId, section, search) => {
  return useInfiniteQuery({
    queryKey: ["messagesExternal", "patient", patientId, section, search],
    queryFn: ({ pageParam }) =>
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
