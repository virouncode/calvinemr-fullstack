import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import xanoDelete from "../../../api/xanoCRUD/xanoDelete";
import xanoPost from "../../../api/xanoCRUD/xanoPost";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import { firstLetterUpper } from "../../../utils/strings/firstLetterUpper";
import { getTopicUrlMutation } from "../../../utils/topics/getTopicUrl";
import useSocketContext from "../../context/useSocketContext";

export const useTopicPost = (topic, patientId) => {
  const { socket } = useSocketContext();
  const queryClient = useQueryClient();
  const topicUrlMutation = getTopicUrlMutation(topic);
  return useMutation({
    mutationFn: (topicToPost) =>
      xanoPost(topicUrlMutation, "staff", topicToPost),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: [topic, patientId] });
    },
    onSuccess: () => {
      socket.emit("message", { key: [topic, patientId] });
      if (topic === "APPOINTMENTS") {
        socket.emit("message", { key: ["appointments"] });
        socket.emit("message", { key: ["appointment"] });
        socket.emit("message", { key: ["staffAppointments"] });
        socket.emit("message", { key: ["patientAppointments"] });
        socket.emit("message", { key: ["dashboardVisits"] });
      }
      if (topic === "MEDICATIONS & TREATMENTS") {
        socket.emit("message", { key: ["dashboardMedications"] });
      }
      if (topic === "PHARMACIES") {
        socket.emit("message", { key: [topic] });
      }
      if (topic === "CARE ELEMENTS") {
        socket.emit("message", { key: ["patient", patientId] });
      }
      toast.success(`${firstLetterUpper(topic)} post succesfully`, {
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

export const useTopicPut = (topic, patientId) => {
  const { socket } = useSocketContext();
  const queryClient = useQueryClient();
  const topicUrlMutation = getTopicUrlMutation(topic);
  return useMutation({
    mutationFn: (topicToPut) =>
      xanoPut(`${topicUrlMutation}/${topicToPut.id}`, "staff", topicToPut),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: [topic, patientId] });
    },
    onSuccess: () => {
      socket.emit("message", { key: [topic, patientId] });
      if (topic === "APPOINTMENTS") {
        socket.emit("message", { key: ["appointments"] });
        socket.emit("message", { key: ["appointment"] });
        socket.emit("message", { key: ["staffAppointments"] });
        socket.emit("message", { key: ["patientAppointments"] });
        socket.emit("message", { key: ["dashboardVisits"] });
      }
      if (topic === "MEDICATIONS & TREATMENTS") {
        socket.emit("message", { key: ["dashboardMedications"] });
      }
      if (topic === "PHARMACIES") {
        socket.emit("message", { key: [topic] });
      }
      toast.success(`${firstLetterUpper(topic)} updated succesfully`, {
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

export const useTopicDelete = (topic, patientId) => {
  const queryClient = useQueryClient();
  const { socket } = useSocketContext();
  const topicUrlMutation = getTopicUrlMutation(topic);
  return useMutation({
    mutationFn: (templateIdToDelete) =>
      xanoDelete(`${topicUrlMutation}/${templateIdToDelete}`, "staff"),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: [topic, patientId] });
    },
    onSuccess: () => {
      socket.emit("message", { key: [topic, patientId] });
      if (topic === "APPOINTMENTS") {
        socket.emit("message", { key: ["appointments"] });
        socket.emit("message", { key: ["appointment"] });
        socket.emit("message", { key: ["staffAppointments"] });
        socket.emit("message", { key: ["patientAppointments"] });
        socket.emit("message", { key: ["dashboardVisits"] });
      }
      if (topic === "MEDICATIONS & TREATMENTS") {
        socket.emit("message", { key: ["dashboardMedications"] });
      }
      if (topic === "PHARMACIES") {
        socket.emit("message", { key: [topic] });
      }
      toast.success(`${firstLetterUpper(topic)} deleted succesfully`, {
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
