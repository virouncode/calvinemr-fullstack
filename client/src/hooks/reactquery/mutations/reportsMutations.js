import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import xanoDelete from "../../../api/xanoCRUD/xanoDelete";
import xanoPost from "../../../api/xanoCRUD/xanoPost";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import useSocketContext from "../../context/useSocketContext";

export const useReportPost = () => {
  const { socket } = useSocketContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reportToPost) => xanoPost("/reports", "staff", reportToPost),
    onMutate: async (reportToPost) => {
      await queryClient.cancelQueries({
        queryKey: ["reportsReceived", reportToPost.patient_id],
      });
      await queryClient.cancelQueries({
        queryKey: ["reportsSent", reportToPost.patient_id],
      });
      await queryClient.cancelQueries({
        queryKey: ["reportsInbox", reportToPost.assigned_staff_id],
      });
    },
    onSuccess: (data) => {
      socket.emit("message", { key: ["reportsReceived", data.patient_id] });
      socket.emit("message", { key: ["reportsSent", data.patient_id] });
      socket.emit("message", { key: ["reportsInbox", data.assigned_staff_id] });
      toast.success(`Report post succesfully`, {
        containerId: "A",
      });
    },
    onError: (error) => {
      toast.error(`Error: unable to post report: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};
export const useReportInboxPost = () => {
  const { socket } = useSocketContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reportToPost) => xanoPost("/reports", "staff", reportToPost),
    onMutate: async (reportToPost) => {
      await queryClient.cancelQueries({
        queryKey: ["reportsReceived", reportToPost.related_patient_id],
      });
      await queryClient.cancelQueries({
        queryKey: ["reportsSent", reportToPost.related_patient_id],
      });
      await queryClient.cancelQueries({
        queryKey: ["reportsInbox", reportToPost.assigned_staff_id],
      });
    },
    onSuccess: (data) => {
      socket.emit("message", {
        key: ["reportsReceived", data.related_patient_id],
      });
      socket.emit("message", { key: ["reportsSent", data.related_patient_id] });
      socket.emit("message", { key: ["reportsInbox", data.assigned_staff_id] });
    },
  });
};

export const useReportPut = (patientId) => {
  const { socket } = useSocketContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reportToPut) =>
      xanoPut(`/reports/${reportToPut.id}`, "staff", reportToPut),
    onMutate: async (reportToPut) => {
      await queryClient.cancelQueries({
        queryKey: ["reportsReceived", patientId],
      });
      await queryClient.cancelQueries({ queryKey: ["reportsSent", patientId] });
      await queryClient.cancelQueries({
        queryKey: ["reportsInbox", reportToPut.assigned_staff_id],
      });
    },
    onSuccess: (data) => {
      socket.emit("message", { key: ["reportsReceived", patientId] });
      socket.emit("message", { key: ["reportsSent", patientId] });
      socket.emit("message", { key: ["reportsInbox", data.assigned_staff_id] });
      toast.success(`Report updated succesfully`, {
        containerId: "A",
      });
    },
    onError: (error) => {
      toast.error(`Error: unable to update report: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const useReportInboxPut = (staffId) => {
  const { socket } = useSocketContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reportToPut) =>
      xanoPut(`/reports/${reportToPut.id}`, "staff", reportToPut),
    onMutate: async (reportToPut) => {
      await queryClient.cancelQueries({
        queryKey: ["reportsInbox", staffId],
      });
      await queryClient.cancelQueries({
        queryKey: ["reportsInbox", reportToPut.assigned_staff_id],
      });
      await queryClient.cancelQueries({
        queryKey: ["reportsReceived", reportToPut.patient_id],
      });
      await queryClient.cancelQueries({
        queryKey: ["reportsSent", reportToPut.patient_id],
      });
    },
    onSuccess: (data) => {
      socket.emit("message", { key: ["reportsReceived", data.patient_id] });
      socket.emit("message", { key: ["reportsSent", data.patient_id] });
      socket.emit("message", { key: ["reportsInbox", staffId] });
      socket.emit("message", { key: ["reportsInbox", data.assigned_staff_id] });
      toast.success(`Report updated succesfully`, {
        containerId: "A",
      });
    },
    onError: (error) => {
      toast.error(`Error: unable to update report: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const useReportDelete = (patientId) => {
  const queryClient = useQueryClient();
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (reportIdToDelete) =>
      xanoDelete(`/reports/${reportIdToDelete}`, "staff"),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["reportsReceived", patientId],
      });
      await queryClient.cancelQueries({ queryKey: ["reportsSent", patientId] });
    },
    onSuccess: () => {
      socket.emit("message", { key: ["reportsReceived", patientId] });
      socket.emit("message", { key: ["reportsSent", patientId] });
      socket.emit("message", { key: ["reportsInbox"] });
      toast.success(`Report deleted succesfully`, {
        containerId: "A",
      });
    },
    onError: (error) => {
      toast.error(`Error: unable to delete report: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};
