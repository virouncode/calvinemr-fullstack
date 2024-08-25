import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import xanoDelete from "../../../api/xanoCRUD/xanoDelete";
import xanoPost from "../../../api/xanoCRUD/xanoPost";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import { BillingCodeTemplateType } from "../../../types/api";
import useSocketContext from "../../context/useSocketContext";
import useUserContext from "../../context/useUserContext";

export const useBillingCodeTemplatePost = () => {
  const { user } = useUserContext();
  const userType = user?.access_level;
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (billingCodeTemplateToPost: Partial<BillingCodeTemplateType>) =>
      xanoPost(
        "/billing_codes_templates",
        userType as string,
        billingCodeTemplateToPost
      ),
    onSuccess: () => {
      socket?.emit("message", { key: ["billingCodesTemplates"] });
      toast.success("Template post succesfully", { containerId: "A" });
    },
    onError: (error) => {
      toast.error(`Error: unable to post template: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const useBillingCodeTemplatePut = () => {
  const { user } = useUserContext();
  const userType = user?.access_level;
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (billingCodeTemplateToPut: BillingCodeTemplateType) =>
      xanoPut(
        `/billing_codes_templates/${billingCodeTemplateToPut.id}`,
        userType as string,
        billingCodeTemplateToPut
      ),
    onSuccess: () => {
      socket?.emit("message", { key: ["billingCodesTemplates"] });
      toast.success("Template updated succesfully", { containerId: "A" });
    },
    onError: (error) => {
      toast.error(`Error: unable to update template: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const useBillingCodeTemplateDelete = () => {
  const { user } = useUserContext();
  const userType = user?.access_level;
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (billingCodeTemplateToDeleteId: number) =>
      xanoDelete(
        `/billing_codes_templates/${billingCodeTemplateToDeleteId}`,
        userType as string
      ),
    onSuccess: () => {
      socket?.emit("message", { key: ["billingCodesTemplates"] });
      toast.success("Template deleted succesfully", { containerId: "A" });
    },
    onError: (error) => {
      toast.error(`Error: unable to delete template: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};
