import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  xanoDelete,
  xanoDeleteBatchSuccessfulRequests,
} from "../../../api/xanoCRUD/xanoDelete";
import { xanoPost, xanoPostBatch } from "../../../api/xanoCRUD/xanoPost";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import {
  DemographicsType,
  MessageExternalType,
  MessageType,
  TodoType,
} from "../../../types/api";
import useSocketContext from "../../context/useSocketContext";
import useUserContext from "../../context/useUserContext";

export const useMessagePost = (staffId: number, section: string) => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (messageToPost: Partial<MessageType | TodoType>) => {
      if (section === "To-dos") {
        return xanoPost("/todos", "staff", messageToPost);
      } else {
        return xanoPost("/messages", "staff", messageToPost);
      }
    },
    onSuccess: (data: MessageType | TodoType) => {
      socket?.emit("message", { key: ["messages", staffId] });
      if (section === "To-dos") {
        socket?.emit("message", {
          key: ["messages", (data as TodoType).to_staff_id],
        });
      } else {
        for (const staff_id of (data as MessageType).to_staff_ids) {
          socket?.emit("message", { key: ["messages", staff_id] });
        }
      }
      if (data.related_patient_id) {
        if (section === "To-dos") {
          socket?.emit("message", {
            key: ["TODOS ABOUT PATIENT", data.related_patient_id],
          });
        } else {
          socket?.emit("message", {
            key: ["MESSAGES ABOUT PATIENT", data.related_patient_id],
          });
        }
      }
      toast.success("Message/To-do post succesfully", { containerId: "A" });
    },
    onError: (error) => {
      toast.error(`Error: unable to post message/to-do: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const useMessagesPostBatch = (staffId: number, section: string) => {
  const { socket } = useSocketContext();
  let successfulRequests: { endpoint: "/messages" | "/todos"; id: number }[] =
    [];
  return useMutation({
    mutationFn: (
      messagesToPost: Partial<MessageType>[] | Partial<TodoType>
    ) => {
      if (section === "To-dos") {
        return xanoPostBatch(
          "/todos",
          "staff",
          messagesToPost as Partial<TodoType>[]
        );
      } else {
        return xanoPostBatch(
          "/messages",
          "staff",
          messagesToPost as Partial<MessageType>[]
        );
      }
    },
    onSuccess: (datas: MessageType[] | TodoType[]) => {
      socket?.emit("message", { key: ["messages", staffId] });
      for (const data of datas) {
        if (section === "To-dos") {
          socket?.emit("message", {
            key: ["messages", (data as TodoType).to_staff_id],
          });
          if ((data as TodoType).to_staff_id !== staffId) {
            socket?.emit("message", {
              route: "UNREAD TO-DO",
              action: "update",
              content: {
                userId: (data as TodoType).to_staff_id,
              },
            });
          }
        } else {
          for (const staff_id of (data as MessageType).to_staff_ids) {
            socket?.emit("message", { key: ["messages", staff_id] });
          }
        }
      }
      toast.success("Message(s)/Todo(s) post succesfully", {
        containerId: "A",
      });
      if (section === "To-dos") {
        successfulRequests = datas.map((item) => ({
          endpoint: "/todos",
          id: item.id,
        }));
      } else {
        successfulRequests = datas.map((item) => ({
          endpoint: "/messages",
          id: item.id,
        }));
      }
    },
    onError: (error) => {
      toast.error(
        `Error: unable to post message(s)/todo(s): ${error.message}`,
        {
          containerId: "A",
        }
      );
      xanoDeleteBatchSuccessfulRequests(successfulRequests, "staff");
    },
  });
};

export const useMessagePut = (staffId: number, section: string) => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (messageToPut: MessageType | TodoType) => {
      if (section === "To-dos") {
        return xanoPut(`/todos/${messageToPut.id}`, "staff", messageToPut);
      } else {
        return xanoPut(`/messages/${messageToPut.id}`, "staff", messageToPut);
      }
    },
    onSuccess: (data) => {
      socket?.emit("message", { key: ["messages", staffId] });
      if (data.related_patient_id) {
        if (section === "To-dos") {
          socket?.emit("message", {
            key: ["TODOS ABOUT PATIENT", data.related_patient_id],
          });
        } else {
          socket?.emit("message", {
            key: ["MESSAGES ABOUT PATIENT", data.related_patient_id],
          });
        }
      }
    },
  });
};

export const useTodoDelete = (staffId: number) => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (todoToDeleteId: number) =>
      xanoDelete(`/todos/${todoToDeleteId}`, "staff"),
    onSuccess: () => {
      socket?.emit("message", { key: ["messages", staffId] });
      socket?.emit("message", {
        key: ["TODOS ABOUT PATIENT"],
      });
      toast.success("To-do deleted succesfully", { containerId: "A" });
    },
    onError: (error) => {
      toast.error(`Error: unable to delete to-do: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const useMessageExternalPost = () => {
  const { user } = useUserContext();
  const userType = user?.access_level as string;
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (messageToPost: Partial<MessageExternalType>) =>
      xanoPost("/messages_external", userType, messageToPost),
    onSuccess: (data) => {
      if (userType === "staff") {
        socket?.emit("message", {
          key: ["messagesExternal", "staff", user?.id],
        });
        if (data.to_patients_ids) {
          for (const patientId of (
            data.to_patients_ids as { to_patient_infos: DemographicsType }[]
          ).map(({ to_patient_infos }) => to_patient_infos.patient_id)) {
            socket?.emit("message", {
              key: ["messagesExternal", "patient", patientId],
            });
            socket?.emit("message", {
              key: ["MESSAGES WITH PATIENT", patientId],
            });
          }
        }
      } else {
        socket?.emit("message", {
          key: ["messagesExternal", "patient", user?.id],
        });
        if (data.to_staff_id) {
          socket?.emit("message", {
            key: ["messagesExternal", "staff", data.to_staff_id],
          });
          socket?.emit("message", {
            key: ["MESSAGES WITH PATIENT", user?.id],
          });
        }
      }
      toast.success("Message post succesfully", { containerId: "A" });
    },
    onError: (error) => {
      toast.error(`Error: unable to post message: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const useMessagesExternalPostBatch = () => {
  const { user } = useUserContext();
  const userType = user?.access_level as string;
  const { socket } = useSocketContext();
  let successfulRequests: { endpoint: "/messages_external"; id: number }[] = [];
  return useMutation({
    mutationFn: (messagesToPost: Partial<MessageExternalType>[]) =>
      xanoPostBatch("/messages_external", userType, messagesToPost),
    onSuccess: (datas: MessageExternalType[]) => {
      if (userType === "staff") {
        socket?.emit("message", {
          key: ["messagesExternal", "staff", user?.id],
        });
        for (const data of datas) {
          if (data.to_patients_ids) {
            for (const patientId of (
              data.to_patients_ids as { to_patient_infos: DemographicsType }[]
            ).map(({ to_patient_infos }) => to_patient_infos.patient_id)) {
              socket?.emit("message", {
                key: ["messagesExternal", "patient", patientId],
              });
              socket?.emit("message", {
                key: ["MESSAGES WITH PATIENT", patientId],
              });
            }
          }
        }
      } else {
        socket?.emit("message", {
          key: ["messagesExternal", "patient", user?.id],
        });
        for (const data of datas) {
          if (data.to_staff_id) {
            socket?.emit("message", {
              key: ["messagesExternal", "staff", data.to_staff_id],
            });
            socket?.emit("message", {
              key: ["MESSAGES WITH PATIENT", user?.id],
            });
          }
        }
      }
      toast.success("Message(s) post succesfully", { containerId: "A" });
      successfulRequests = datas.map((item) => ({
        endpoint: "/messages_external",
        id: item.id,
      }));
    },
    onError: (error) => {
      toast.error(`Error: unable to post message(s): ${error.message}`, {
        containerId: "A",
      });
      xanoDeleteBatchSuccessfulRequests(successfulRequests, userType as string);
    },
  });
};

export const useMessageExternalPut = () => {
  const { user } = useUserContext();
  const userType = user?.access_level as string;
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (messageToPut: MessageExternalType) => {
      return xanoPut(
        `/messages_external/${messageToPut.id}`,
        userType,
        messageToPut
      );
    },
    onSuccess: (data) => {
      if (userType === "staff") {
        socket?.emit("message", {
          key: ["messagesExternal", "staff", user?.id],
        });
        if (data.to_patients_ids) {
          for (const patientId of (
            data.to_patients_ids as { to_patient_infos: DemographicsType }[]
          ).map(({ to_patient_infos }) => to_patient_infos.patient_id)) {
            socket?.emit("message", {
              key: ["messagesExternal", "patient", patientId],
            });
            socket?.emit("message", {
              key: ["MESSAGES WITH PATIENT", patientId],
            });
          }
        }
      } else {
        socket?.emit("message", {
          key: ["messagesExternal", "patient", user?.id],
        });
        if (data.to_staff_id) {
          socket?.emit("message", {
            key: ["messagesExternal", "staff", data.to_staff_id],
          });
          socket?.emit("message", {
            key: ["MESSAGES WITH PATIENT", user?.id],
          });
        }
      }
    },
  });
};
