import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  xanoDelete,
  xanoDeleteBatchSuccessfulRequests,
} from "../../../api/xanoCRUD/xanoDelete";
import { xanoPost, xanoPostBatch } from "../../../api/xanoCRUD/xanoPost";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import { ReportType } from "../../../types/api";
import useSocketContext from "../../context/useSocketContext";

export const useReportPost = () => {
  const { socket } = useSocketContext();
  // const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reportToPost: Partial<ReportType>) =>
      xanoPost("/reports", "staff", reportToPost),
    // onMutate: async (reportToPost) => {
    //   await queryClient.cancelQueries({
    //     queryKey: ["reportsReceived", reportToPost.patient_id],
    //   });
    //   await queryClient.cancelQueries({
    //     queryKey: ["reportsSent", reportToPost.patient_id],
    //   });
    //   await queryClient.cancelQueries({
    //     queryKey: ["reports", reportToPost.patient_id],
    //   });
    //   await queryClient.cancelQueries({
    //     queryKey: ["reportsInbox", reportToPost.assigned_staff_id],
    //   });
    // },
    onSuccess: (data: ReportType) => {
      socket?.emit("message", { key: ["reportsReceived", data.patient_id] });
      socket?.emit("message", { key: ["reportsSent", data.patient_id] });
      socket?.emit("message", {
        key: ["reports", data.patient_id],
      });
      socket?.emit("message", {
        key: ["reportsInbox", data.assigned_staff_id],
      });
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

export const useReportsPostBatch = () => {
  let successfulRequests: { endpoint: "/reports"; id: number }[] = [];
  const { socket } = useSocketContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reportsToPost: Partial<ReportType>[]) =>
      xanoPostBatch("/reports", "staff", reportsToPost),
    onSuccess: (datas: ReportType[]) => {
      for (const data of datas) {
        socket?.emit("message", { key: ["reportsReceived", data.patient_id] });
        socket?.emit("message", { key: ["reportsSent", data.patient_id] });
        socket?.emit("message", {
          key: ["reports", data.patient_id],
        });
        socket?.emit("message", {
          key: ["reportsInbox", data.assigned_staff_id],
        });
      }
      toast.success(`Report(s) post succesfully`, {
        containerId: "A",
      });
      successfulRequests = datas.map((item) => ({
        endpoint: "/reports",
        id: item.id,
      }));
    },
    onError: (error) => {
      toast.error(`Error: unable to post report(s): ${error.message}`, {
        containerId: "A",
      });
      xanoDeleteBatchSuccessfulRequests(successfulRequests, "staff");
    },
  });
};

export const useReportPut = (patientId: number) => {
  const { socket } = useSocketContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reportToPut: ReportType) =>
      xanoPut(`/reports/${reportToPut.id}`, "staff", reportToPut),
    // onMutate: async (reportToPut) => {
    //   await queryClient.cancelQueries({
    //     queryKey: ["reportsReceived", patientId],
    //   });
    //   await queryClient.cancelQueries({ queryKey: ["reportsSent", patientId] });
    //   await queryClient.cancelQueries({ queryKey: ["reports", patientId] });
    //   await queryClient.cancelQueries({
    //     queryKey: ["reportsInbox", reportToPut.assigned_staff_id],
    //   });
    // },
    onSuccess: (data: ReportType) => {
      socket?.emit("message", { key: ["reportsReceived", patientId] });
      socket?.emit("message", { key: ["reportsSent", patientId] });
      socket?.emit("message", { key: ["reports", patientId] });
      socket?.emit("message", {
        key: ["reportsInbox", data.assigned_staff_id],
      });
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

export const useReportInboxPut = (staffId: number) => {
  const { socket } = useSocketContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reportToPut: ReportType) =>
      xanoPut(`/reports/${reportToPut.id}`, "staff", reportToPut),
    // onMutate: async (reportToPut) => {
    //   await queryClient.cancelQueries({
    //     queryKey: ["reportsInbox", staffId],
    //   });
    //   await queryClient.cancelQueries({
    //     queryKey: ["reportsInbox", reportToPut.assigned_staff_id],
    //   });
    //   await queryClient.cancelQueries({
    //     queryKey: ["reportsReceived", reportToPut.patient_id],
    //   });
    //   await queryClient.cancelQueries({
    //     queryKey: ["reportsSent", reportToPut.patient_id],
    //   });
    //   await queryClient.cancelQueries({
    //     queryKey: ["reports", reportToPut.patient_id],
    //   });
    // },
    onSuccess: (data: ReportType) => {
      socket?.emit("message", { key: ["reportsReceived", data.patient_id] });
      socket?.emit("message", { key: ["reportsSent", data.patient_id] });
      socket?.emit("message", { key: ["reports", data.patient_id] });
      socket?.emit("message", { key: ["reportsInbox", staffId] });
      socket?.emit("message", {
        key: ["reportsInbox", data.assigned_staff_id],
      });
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

export const useReportDelete = (patientId: number) => {
  const queryClient = useQueryClient();
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (reportIdToDelete: number) =>
      xanoDelete(`/reports/${reportIdToDelete}`, "staff"),
    // onMutate: async () => {
    //   await queryClient.cancelQueries({
    //     queryKey: ["reportsReceived", patientId],
    //   });
    //   await queryClient.cancelQueries({ queryKey: ["reportsSent", patientId] });
    //   await queryClient.cancelQueries({ queryKey: ["reports", patientId] });
    //   await queryClient.cancelQueries({ queryKey: ["reportsInbox"] });
    // },
    onSuccess: () => {
      socket?.emit("message", { key: ["reportsReceived", patientId] });
      socket?.emit("message", { key: ["reportsSent", patientId] });
      socket?.emit("message", { key: ["reports", patientId] });
      socket?.emit("message", { key: ["reportsInbox"] });
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
