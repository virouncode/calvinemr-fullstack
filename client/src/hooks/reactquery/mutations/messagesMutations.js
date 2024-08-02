import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import xanoDelete from "../../../api/xanoCRUD/xanoDelete";
import xanoPost from "../../../api/xanoCRUD/xanoPost";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import useSocketContext from "../../context/useSocketContext";
import useUserContext from "../../context/useUserContext";

export const useMessagePost = (staffId, section) => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (messageToPost) => {
      if (section === "To-dos") {
        return xanoPost("/todos", "staff", messageToPost);
      } else {
        return xanoPost("/messages", "staff", messageToPost);
      }
    },
    onSuccess: (data) => {
      socket.emit("message", { key: ["messages", staffId] });
      if (section === "To-dos") {
        socket.emit("message", { key: ["messages", data.staff_id] });
      } else {
        for (let staff_id of data.to_staff_ids) {
          socket.emit("message", { key: ["messages", staff_id] });
        }
      }
      if (data.related_patient_id) {
        if (section === "To-dos") {
          socket.emit("message", {
            key: ["TODOS ABOUT PATIENT", data.related_patient_id],
          });
        } else {
          socket.emit("message", {
            key: ["MESSAGES ABOUT PATIENT", data.related_patient_id],
          });
        }
      }
      toast.success("Message post succesfully", { containerId: "A" });
    },
    onError: (error, variables, context) => {
      toast.error(`Error: unable to post message: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const useMessagePut = (staffId, section) => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (messageToPut) => {
      if (section === "To-dos") {
        return xanoPut(`/todos/${messageToPut.id}`, "staff", messageToPut);
      } else {
        return xanoPut(`/messages/${messageToPut.id}`, "staff", messageToPut);
      }
    },
    onSuccess: (data) => {
      socket.emit("message", { key: ["messages", staffId] });
      if (data.related_patient_id) {
        if (section === "To-dos") {
          socket.emit("message", {
            key: ["TODOS ABOUT PATIENT", data.related_patient_id],
          });
        } else {
          socket.emit("message", {
            key: ["MESSAGES ABOUT PATIENT", data.related_patient_id],
          });
        }
      }
    },
  });
};

export const useTodoDelete = (staffId) => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (todoToDeleteId) =>
      xanoDelete(`/todos/${todoToDeleteId}`, "staff"),
    onSuccess: (data) => {
      socket.emit("message", { key: ["messages", staffId] });
      socket.emit("message", {
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
  const userType = user.access_level;
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (messageToPost) =>
      xanoPost("/messages_external", userType, messageToPost),
    onSuccess: (data) => {
      if (userType === "staff") {
        socket.emit("message", { key: ["messagesExternal", "staff", user.id] });
        if (data.to_patients_ids) {
          for (let patientId of data.to_patients_ids.map(
            ({ to_patient_infos }) => to_patient_infos.id
          )) {
            socket.emit("message", {
              key: ["messagesExternal", "patient", patientId],
            });
            socket.emit("message", {
              key: ["MESSAGES WITH PATIENT", patientId],
            });
          }
        }
      } else {
        socket.emit("message", {
          key: ["messagesExternal", "patient", user.id],
        });
        if (data.to_staff_id) {
          socket.emit("message", {
            key: ["messagesExternal", "staff", data.to_staff_id],
          });
          socket.emit("message", {
            key: ["MESSAGES WITH PATIENT", user.id],
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

export const useMessageExternalPut = () => {
  const { user } = useUserContext();
  const userType = user.access_level;
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (messageToPut) => {
      return xanoPut(
        `/messages_external/${messageToPut.id}`,
        userType,
        messageToPut
      );
    },
    onSuccess: (data) => {
      if (userType === "staff") {
        socket.emit("message", { key: ["messagesExternal", "staff", user.id] });
        if (data.to_patients_ids) {
          for (let patientId of data.to_patients_ids.map(
            ({ to_patient_infos }) => to_patient_infos.id
          )) {
            socket.emit("message", {
              key: ["messagesExternal", "patient", patientId],
            });
            socket.emit("message", {
              key: ["MESSAGES WITH PATIENT", patientId],
            });
          }
        }
      } else {
        socket.emit("message", {
          key: ["messagesExternal", "patient", user.id],
        });
        if (data.to_staff_id) {
          socket.emit("message", {
            key: ["messagesExternal", "staff", data.to_staff_id],
          });
          socket.emit("message", {
            key: ["MESSAGES WITH PATIENT", user.id],
          });
        }
      }
    },
  });
};
