import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import xanoDelete from "../../../api/xanoCRUD/xanoDelete";
import xanoPost from "../../../api/xanoCRUD/xanoPost";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import { firstLetterUpper } from "../../../utils/strings/firstLetterUpper";
import { getTopicUrlMutation } from "../../../utils/topics/getTopicUrl";
import useSocketContext from "../../context/useSocketContext";

// POST Mutation Hook
export const useTopicPost = <TData extends object>(
  topic: string,
  patientId: number
) => {
  const { socket } = useSocketContext();
  const queryClient = useQueryClient();
  const topicUrlMutation: string = getTopicUrlMutation(topic);

  return useMutation({
    mutationFn: (topicToPost: TData) =>
      xanoPost(topicUrlMutation, "staff", topicToPost),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: [topic, patientId] });
    },
    onSuccess: () => {
      socket?.emit("message", { key: [topic, patientId] });

      if (topic === "APPOINTMENTS") {
        socket?.emit("message", { key: ["appointments"] });
        socket?.emit("message", { key: ["appointment"] });
        socket?.emit("message", { key: ["staffAppointments"] });
        socket?.emit("message", { key: ["patientAppointments"] });
        socket?.emit("message", { key: ["dashboardVisits"] });
      }
      if (topic === "MEDICATIONS & TREATMENTS") {
        socket?.emit("message", { key: ["dashboardMedications"] });
      }
      if (topic === "PHARMACIES") {
        socket?.emit("message", { key: [topic] });
      }
      if (topic === "CARE ELEMENTS") {
        socket?.emit("message", { key: ["patient", patientId] });
      }
      toast.success(`${firstLetterUpper(topic)} post successfully`, {
        containerId: "A",
      });
    },
    onError: (error) => {
      toast.error(
        `Error: unable to post ${firstLetterUpper(topic)}: ${error.message}`,
        {
          containerId: "A",
        }
      );
    },
  });
};

// PUT Mutation Hook
export const useTopicPut = <TData extends { id: number }>(
  topic: string,
  patientId: number
) => {
  const { socket } = useSocketContext();
  const queryClient = useQueryClient();
  const topicUrlMutation: string = getTopicUrlMutation(topic);

  return useMutation({
    mutationFn: (topicToPut: TData) =>
      xanoPut(`${topicUrlMutation}/${topicToPut.id}`, "staff", topicToPut),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: [topic, patientId] });
    },
    onSuccess: () => {
      socket?.emit("message", { key: [topic, patientId] });

      if (topic === "APPOINTMENTS") {
        socket?.emit("message", { key: ["appointments"] });
        socket?.emit("message", { key: ["appointment"] });
        socket?.emit("message", { key: ["staffAppointments"] });
        socket?.emit("message", { key: ["patientAppointments"] });
        socket?.emit("message", { key: ["dashboardVisits"] });
      }
      if (topic === "MEDICATIONS & TREATMENTS") {
        socket?.emit("message", { key: ["dashboardMedications"] });
      }
      if (topic === "PHARMACIES") {
        socket?.emit("message", { key: [topic] });
      }
      toast.success(`${firstLetterUpper(topic)} updated successfully`, {
        containerId: "A",
      });
    },
    onError: (error) => {
      toast.error(
        `Error: unable to update ${firstLetterUpper(topic)}: ${error.message}`,
        {
          containerId: "A",
        }
      );
    },
  });
};

// DELETE Mutation Hook
export const useTopicDelete = (topic: string, patientId: number) => {
  const queryClient = useQueryClient();
  const { socket } = useSocketContext();
  const topicUrlMutation: string = getTopicUrlMutation(topic);

  return useMutation({
    mutationFn: (templateIdToDelete: number) =>
      xanoDelete(`${topicUrlMutation}/${templateIdToDelete}`, "staff"),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: [topic, patientId] });
    },
    onSuccess: () => {
      socket?.emit("message", { key: [topic, patientId] });

      if (topic === "APPOINTMENTS") {
        socket?.emit("message", { key: ["appointments"] });
        socket?.emit("message", { key: ["appointment"] });
        socket?.emit("message", { key: ["staffAppointments"] });
        socket?.emit("message", { key: ["patientAppointments"] });
        socket?.emit("message", { key: ["dashboardVisits"] });
      }
      if (topic === "MEDICATIONS & TREATMENTS") {
        socket?.emit("message", { key: ["dashboardMedications"] });
      }
      if (topic === "PHARMACIES") {
        socket?.emit("message", { key: [topic] });
      }
      toast.success(`${firstLetterUpper(topic)} deleted successfully`, {
        containerId: "A",
      });
    },
    onError: (error) => {
      toast.error(
        `Error: unable to delete ${firstLetterUpper(topic)}: ${error.message}`,
        {
          containerId: "A",
        }
      );
    },
  });
};
