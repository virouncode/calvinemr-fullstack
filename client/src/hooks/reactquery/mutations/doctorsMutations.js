import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import xanoDelete from "../../../api/xanoCRUD/xanoDelete";
import xanoPost from "../../../api/xanoCRUD/xanoPost";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import useSocketContext from "../../context/useSocketContext";

export const useDoctorPost = () => {
  const { socket } = useSocketContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (doctorToPost) => xanoPost("/doctors", "staff", doctorToPost),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["doctors"] });
    },
    onSuccess: () => {
      socket.emit("message", { key: ["doctors"] });
      toast.success(`Doctor post succesfully`, {
        containerId: "A",
      });
    },
    onError: (error) => {
      toast.error(`Error: unable to post new doctor: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const useDoctorPut = () => {
  const { socket } = useSocketContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (doctorToPut) =>
      xanoPut(`/doctors/${doctorToPut.id}`, "staff", doctorToPut),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["doctors"] });
      await queryClient.cancelQueries({ queryKey: ["patientDoctors"] });
    },
    onSuccess: () => {
      socket.emit("message", { key: ["doctors"] });
      socket.emit("message", { key: ["patientDoctors"] });
      toast.success(`Doctor updated succesfully`, {
        containerId: "A",
      });
    },
    onError: (error) => {
      toast.error(`Error: unable to update doctor: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const useDoctorDelete = () => {
  const queryClient = useQueryClient();
  const { socket } = useSocketContext();

  return useMutation({
    mutationFn: (doctorIdToDelete) =>
      xanoDelete(`/doctors/${doctorIdToDelete}`, "staff"),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["doctors"] });
      await queryClient.cancelQueries({ queryKey: ["patientDoctors"] });
    },
    onSuccess: () => {
      socket.emit("message", { key: ["doctors"] });
      socket.emit("message", { key: ["patientDoctors"] });
      toast.success(`Doctor deleted succesfully`, {
        containerId: "A",
      });
    },
    onError: (error) => {
      toast.error(`Error: unable to delete doctor: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};
