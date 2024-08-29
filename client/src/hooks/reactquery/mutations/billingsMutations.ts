import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { xanoDelete, xanoDeleteBatch } from "../../../api/xanoCRUD/xanoDelete";
import { xanoPost, xanoPostBatch } from "../../../api/xanoCRUD/xanoPost";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import { BillingType } from "../../../types/api";
import useSocketContext from "../../context/useSocketContext";
import useUserContext from "../../context/useUserContext";

export const useBillingPost = () => {
  const { user } = useUserContext();
  const userType = user?.access_level;
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (billingToPost: Partial<BillingType>) =>
      xanoPost("/billings", userType as string, billingToPost),
    onSuccess: () => {
      socket?.emit("message", { key: ["billings"] });
      socket?.emit("message", { key: ["dashboardBillings"] });
      toast.success("Billing post succesfully", { containerId: "A" });
    },
    onError: (error) => {
      toast.error(`Error: unable to post billing: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const useBillingsPostsBatch = () => {
  let successfulRequests: { endpoint: "/billings"; id: number }[] = [];
  const { user } = useUserContext();
  const userType = user?.access_level;
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (billingsToPost: Partial<BillingType>[]) =>
      xanoPostBatch("/billings", userType as string, billingsToPost),
    onSuccess: (datas) => {
      socket?.emit("message", { key: ["billings"] });
      socket?.emit("message", { key: ["dashboardBillings"] });
      toast.success("Billing(s) post succesfully", { containerId: "A" });
      successfulRequests = datas.map((item) => ({
        endpoint: "/billings",
        id: item.id,
      }));
    },
    onError: (error) => {
      xanoDeleteBatch(successfulRequests, userType as string);
      toast.error(`Error: unable to post billing: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const useBillingPut = () => {
  const { user } = useUserContext();
  const userType = user?.access_level;
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (billingToPut: BillingType) =>
      xanoPut(`/billings/${billingToPut.id}`, userType as string, billingToPut),
    onSuccess: () => {
      socket?.emit("message", { key: ["billings"] });
      socket?.emit("message", { key: ["dashboardBillings"] });
      toast.success("Billing updated succesfully", { containerId: "A" });
    },
    onError: (error) => {
      toast.error(`Error: unable to update billing: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const useBillingDelete = () => {
  const { user } = useUserContext();
  const userType = user?.access_level;
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (billingToDeleteId: number) =>
      xanoDelete(`/billings/${billingToDeleteId}`, userType as string),
    onSuccess: () => {
      socket?.emit("message", { key: ["billings"] });
      socket?.emit("message", { key: ["dashboardBillings"] });
      toast.success("Billing deleted succesfully", { containerId: "A" });
    },
    onError: (error) => {
      toast.error(`Error: unable to delete billing: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};
