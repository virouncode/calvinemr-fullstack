import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaxesToDeleteType,
  FaxToDeleteType,
  FaxToPostType,
} from "../../../types/api";
import useSocketContext from "../../context/useSocketContext";

axios.defaults.withCredentials = true;

const postFax = async (faxToPost: FaxToPostType) => {
  const response = await axios.post(`/api/srfax/postFax`, faxToPost);
  return response.data;
};

const deleteFax = async (faxFileName: string, direction: string) => {
  const response = await axios.post(`/api/srfax/deleteFax`, {
    faxFileName,
    direction,
  });
  return response.data;
};

const deleteFaxes = async (faxFileNames: string[], direction: string) => {
  const response = await axios.post(`/api/srfax/deleteFaxes`, {
    faxFileNames,
    direction,
  });
  return response.data;
};

export const useFaxPost = () => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (faxToPost: FaxToPostType) => postFax(faxToPost),
    onSuccess: () => {
      socket?.emit("message", { key: ["faxes inbox"] });
      socket?.emit("message", { key: ["faxes outbox"] });
      toast.success("Fax sent succesfully", { containerId: "A" });
    },
    onError: (error) => {
      toast.error(`Error: unable to send fax: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const useFaxDelete = () => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (faxToDelete: FaxToDeleteType) =>
      deleteFax(faxToDelete.faxFileName, faxToDelete.direction),
    onSuccess: () => {
      socket?.emit("message", { key: ["faxes inbox"] });
      socket?.emit("message", { key: ["faxes outbox"] });
      toast.success("Fax deleted succesfully", { containerId: "A" });
    },
    onError: (error) => {
      toast.error(`Error: unable to delete fax: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const useFaxesDelete = () => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (faxesToDelete: FaxesToDeleteType) =>
      deleteFaxes(faxesToDelete.faxFileNames, faxesToDelete.direction),
    onSuccess: () => {
      socket?.emit("message", { key: ["faxes inbox"] });
      socket?.emit("message", { key: ["faxes outbox"] });
      toast.success("Faxes deleted succesfully", { containerId: "A" });
    },
    onError: (error) => {
      toast.error(`Error: unable to delete faxes: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};
