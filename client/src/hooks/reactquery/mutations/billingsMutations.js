import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import xanoDelete from "../../../api/xanoCRUD/xanoDelete";
import xanoPost from "../../../api/xanoCRUD/xanoPost";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import useSocketContext from "../../context/useSocketContext";
import useUserContext from "../../context/useUserContext";

export const useBillingPost = () => {
  const { user } = useUserContext();
  const userType = user.access_level;
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (billingToPost) =>
      xanoPost("/billings", userType, billingToPost),
    onSuccess: () => {
      socket.emit("message", { key: ["billings"] });
      socket.emit("message", { key: ["dashboardBillings"] });
      toast.success("Billing post succesfully", { containerId: "A" });
    },
    onError: (error) => {
      toast.error(`Error: unable to post billing: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const useBillingPut = () => {
  const { user } = useUserContext();
  const userType = user.access_level;
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (billingToPut) =>
      xanoPut(`/billings/${billingToPut.id}`, userType, billingToPut),
    onSuccess: () => {
      socket.emit("message", { key: ["billings"] });
      socket.emit("message", { key: ["dashboardBillings"] });
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
  const userType = user.access_level;
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (billingToDeleteId) =>
      xanoDelete(`/billings/${billingToDeleteId}`, userType),
    onSuccess: () => {
      socket.emit("message", { key: ["billings"] });
      socket.emit("message", { key: ["dashboardBillings"] });
      toast.success("Billing deleted succesfully", { containerId: "A" });
    },
    onError: (error) => {
      toast.error(`Error: unable to delete billing: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};
