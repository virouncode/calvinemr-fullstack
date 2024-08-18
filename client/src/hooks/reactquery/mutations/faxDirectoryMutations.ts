import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import xanoPost from "../../../api/xanoCRUD/xanoPost";
import { FaxContactType } from "../../../types/api";
import useSocketContext from "../../context/useSocketContext";

export const useFaxDirectoryPost = () => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (otherToPost: Partial<FaxContactType>) => {
      return xanoPost("/fax_directory", "staff", otherToPost);
    },
    onSuccess: () => {
      socket?.emit("message", { key: ["fax directory"] });
      toast.success("Contact saved succesfully", { containerId: "A" });
    },
    onError: (error) => {
      toast.error(`Error: unable to save contact: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};
