import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { xanoDelete } from "../../../api/xanoCRUD/xanoDelete";
import { xanoPost } from "../../../api/xanoCRUD/xanoPost";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import {
  FaxesToDeleteType,
  FaxNotesType,
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

const postFaxNotes = async (faxNotesToPost: Partial<FaxNotesType>) => {
  const response = await xanoPost("/faxnotes", "staff", faxNotesToPost);
  return response;
};

const putFaxNotes = async (faxNotesToPut: FaxNotesType) => {
  const response = await xanoPut(
    `/faxnotes/${faxNotesToPut.id}`,
    "staff",
    faxNotesToPut
  );
  return response;
};

const deleteFaxNotes = async (faxNotesToDeleteId: number) => {
  const response = await xanoDelete(`/faxnotes/${faxNotesToDeleteId}`, "staff");
  return response;
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

export const useFaxNotesPost = () => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (faxNotesToPost: Partial<FaxNotesType>) =>
      postFaxNotes(faxNotesToPost),
    onSuccess: () => {
      socket?.emit("message", { key: ["fax notes"] });
      toast.success("Fax notes saved succesfully", { containerId: "A" });
    },
    onError: (error) => {
      toast.error(`Error: unable to save fax notes: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const useFaxNotesPut = () => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (faxNotesToPut: FaxNotesType) => putFaxNotes(faxNotesToPut),
    onSuccess: () => {
      socket?.emit("message", { key: ["fax notes"] });
      toast.success("Fax notes saved succesfully", { containerId: "A" });
    },
    onError: (error) => {
      toast.error(`Error: unable to save fax notes: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const useFaxNotesDelete = () => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (faxNotesToDeleteId: number) =>
      deleteFaxNotes(faxNotesToDeleteId),
    onSuccess: () => {
      socket?.emit("message", { key: ["fax notes"] });
      toast.success("Fax notes deleted succesfully", { containerId: "A" });
    },
    onError: (error) => {
      toast.error(`Error: unable to delete fax notes: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};
