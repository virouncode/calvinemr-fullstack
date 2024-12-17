import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { xanoDelete } from "../../../api/xanoCRUD/xanoDelete";
import { xanoPost } from "../../../api/xanoCRUD/xanoPost";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import { TopicDataMap, TopicType } from "../../../types/api";
import { UserPatientType, UserStaffType } from "../../../types/app";
import { firstLetterUpper } from "../../../utils/strings/firstLetterUpper";
import { getTopicUrlMutation } from "../../../utils/topics/getTopicUrl";
import useSocketContext from "../../context/useSocketContext";
import useUserContext from "../../context/useUserContext";

export const useTopicPost = <T extends TopicType>(
  topic: T,
  patientId: number
) => {
  const { socket } = useSocketContext();
  const { user } = useUserContext() as {
    user: UserStaffType | UserPatientType;
  };
  const userType = user.access_level;
  const queryClient = useQueryClient();
  const topicUrlMutation: string = getTopicUrlMutation(topic);

  return useMutation<TopicDataMap[T], Error, Partial<TopicDataMap[T]>, void>({
    mutationFn: (topicToPost: Partial<TopicDataMap[T]>) =>
      xanoPost(topicUrlMutation, userType, topicToPost),
    // onMutate: async () => {
    //   await queryClient.cancelQueries({ queryKey: [topic, patientId] });
    // },
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
        socket?.emit("message", { key: ["pharmacies"] });
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
export const useTopicPut = <T extends TopicType>(
  topic: T,
  patientId: number
) => {
  const { socket } = useSocketContext();
  const { user } = useUserContext() as {
    user: UserStaffType | UserPatientType;
  };
  const userType = user.access_level;
  const queryClient = useQueryClient();
  const topicUrlMutation: string = getTopicUrlMutation(topic);

  return useMutation<TopicDataMap[T], Error, TopicDataMap[T], void>({
    mutationFn: (topicToPut: TopicDataMap[T]) =>
      xanoPut(`${topicUrlMutation}/${topicToPut.id}`, userType, topicToPut),
    // onMutate: async () => {
    //   await queryClient.cancelQueries({ queryKey: [topic, patientId] });
    // },
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
export const useTopicDelete = <T extends TopicType>(
  topic: T,
  patientId: number
) => {
  const queryClient = useQueryClient();
  const { socket } = useSocketContext();
  const topicUrlMutation: string = getTopicUrlMutation(topic);

  return useMutation<void, Error, number, void>({
    mutationFn: (templateIdToDelete: number) =>
      xanoDelete(`${topicUrlMutation}/${templateIdToDelete}`, "staff"),
    // onMutate: async () => {
    //   await queryClient.cancelQueries({ queryKey: [topic, patientId] });
    // },
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
