import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { xanoDelete } from "../../../api/xanoCRUD/xanoDelete";
import { xanoPost } from "../../../api/xanoCRUD/xanoPost";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import {
  FaxesToDeleteType,
  FaxFolderType,
  FaxNotesType,
  FaxToDeleteType,
  FaxToPostType,
  FiledFaxType,
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

const markFaxesAs = async (fileNames: string[], viewedStatus: string) => {
  const response = await axios.post(`/api/srfax/markFaxesAs`, {
    fileNames,
    viewedStatus,
  });
  return response.data;
};

const postFaxFolder = async (faxFolderToPost: Partial<FaxFolderType>) => {
  const response = await xanoPost("/fax_folders", "staff", faxFolderToPost);
  return response;
};

const putFaxFolder = async (faxFolderToPut: FaxFolderType) => {
  const response = await xanoPut(
    `/fax_folders/${faxFolderToPut.id}`,
    "staff",
    faxFolderToPut
  );
  return response;
};

const deleteFaxFolder = async (faxFolderToDeleteId: number) => {
  const response = await xanoDelete(
    `/fax_folders/${faxFolderToDeleteId}`,
    "staff"
  );
  return response;
};

const postFiledFax = async (filedFaxToPost: Partial<FiledFaxType>) => {
  const response = await xanoPost("/filed_faxes", "staff", filedFaxToPost);
  return response;
};

const putFiledFax = async (filedFaxToPut: FiledFaxType) => {
  const response = await xanoPut(
    `/filed_faxes/${filedFaxToPut.id}`,
    "staff",
    filedFaxToPut
  );
  return response;
};

const deleteFiledFax = async (filedFaxToDeleteId: number) => {
  const response = await xanoDelete(
    `/filed_faxes/${filedFaxToDeleteId}`,
    "staff"
  );
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
      socket?.emit("message", { key: ["fax notes for filenames"] });
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
      socket?.emit("message", { key: ["fax notes for filenames"] });
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

export const useMarkFaxesAs = () => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (data: { fileNames: string[]; viewedStatus: string }) =>
      markFaxesAs(data.fileNames, data.viewedStatus),
    onSuccess: () => {
      socket?.emit("message", { key: ["faxes inbox"] });
      socket?.emit("message", { key: ["faxes outbox"] });
      toast.success("Faxes viewed status changed successfully", {
        containerId: "A",
      });
    },
    onError: (error) => {
      toast.error(`Error: unable to mark faxes: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const useFaxFolderPost = () => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (faxFolderToPost: Partial<FaxFolderType>) =>
      postFaxFolder(faxFolderToPost),
    onSuccess: () => {
      socket?.emit("message", { key: ["fax folders"] });
      toast.success("Fax label added succesfully", { containerId: "A" });
    },
    onError: (error) => {
      toast.error(`Error: unable to add fax label: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const useFaxFolderPut = () => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (faxFolderToPut: FaxFolderType) => putFaxFolder(faxFolderToPut),
    onSuccess: () => {
      socket?.emit("message", { key: ["fax folders"] });
      toast.success("Fax label updated successfully", { containerId: "A" });
    },
    onError: (error) => {
      toast.error(`Error: unable to update fax label: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const useFaxFolderDelete = () => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (faxFolderToDeleteId: number) =>
      deleteFaxFolder(faxFolderToDeleteId),
    onSuccess: () => {
      socket?.emit("message", { key: ["fax folders"] });
      toast.success("Fax label deleted successfully", { containerId: "A" });
    },
    onError: (error) => {
      toast.error(`Error: unable to delete fax label: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const useFiledFaxPost = () => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (filedFaxToPost: Partial<FiledFaxType>) =>
      postFiledFax(filedFaxToPost),
    onSuccess: (data: FiledFaxType) => {
      socket?.emit("message", {
        key: ["faxes for folder id", data.fax_folder_id],
      });
      toast.success("Label succesfully assigned to fax(es)", {
        containerId: "A",
      });
    },
    onError: (error) => {
      toast.error(`Error: unable to assign label to fax(es) ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const useFiledFaxPut = () => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (filedFaxToPut: FiledFaxType) => putFiledFax(filedFaxToPut),
    onSuccess: (data: FiledFaxType) => {
      socket?.emit("message", {
        key: ["faxes for folder id", data.fax_folder_id],
      });
      toast.success("Label succesfully assigned to fax(es)", {
        containerId: "A",
      });
    },
    onError: (error) => {
      toast.error(`Error: unable to assign label to fax(es) ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const useFiledFaxDelete = () => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (filedFaxToDeleteId: number) =>
      deleteFiledFax(filedFaxToDeleteId),
    onSuccess: () => {
      socket?.emit("message", { key: ["faxes for folder id"] });
      toast.success("Label succesfully removed from fax(es)", {
        containerId: "A",
      });
    },
    onError: (error) => {
      toast.error(
        `Error: unable to remove label from fax(es) ${error.message}`,
        {
          containerId: "A",
        }
      );
    },
  });
};
