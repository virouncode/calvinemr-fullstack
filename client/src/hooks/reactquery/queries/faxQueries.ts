import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import {
  FaxFolderType,
  FaxInboxType,
  FaxNotesType,
  FaxOutboxType,
  FiledFaxType,
} from "../../../types/api";
axios.defaults.withCredentials = true;

const fetchFaxesInbox = async (
  viewedStatus: string,
  all: boolean,
  start: string,
  end: string
) => {
  const response = await axios.post(`/api/srfax/inbox`, {
    viewedStatus,
    all,
    start,
    end,
  });
  const faxesInbox: FaxInboxType[] = response.data;
  return faxesInbox;
};

const fetchFaxNotes = async (fileName: string) => {
  const response: FaxNotesType = await xanoGet(
    "/faxnotes_for_filename",
    "staff",
    {
      file_name: fileName,
    }
  );
  return response;
};

const fetchFaxesOutbox = async (all: boolean, start: string, end: string) => {
  const response = await axios.post(`/api/srfax/outbox`, {
    all,
    start,
    end,
  });
  const faxesOutbox: FaxOutboxType[] = response.data;
  return faxesOutbox;
};

const fetchFax = async (id: string, direction: string) => {
  const response = await axios.post(`/api/srfax/faxFile`, {
    id,
    direction,
  });
  const faxBase64: string = response.data;
  return faxBase64;
};

const fetchFaxContactName = async (faxNumber: string) => {
  const response = await xanoGet("/contact_with_fax_number", "staff", {
    fax_number: faxNumber,
  });
  return response;
};

const fetchFaxContactsNames = async (
  faxNumbers: string[]
): Promise<{ faxNumber: string; name: string }[]> => {
  const response = await xanoGet("/contacts_with_fax_numbers", "staff", {
    fax_numbers: faxNumbers,
  });
  return response;
};

const fetchFaxNotesForFilenames = async (
  fileNames: string[]
): Promise<FaxNotesType[]> => {
  if (fileNames.length === 0) return [];

  const response = await xanoGet("/fax_notes_for_filenames", "staff", {
    filenames: fileNames,
  });

  return response;
};

const fetchFaxFolders = async (): Promise<FaxFolderType[]> => {
  const response = await xanoGet("/fax_folders", "staff");
  return response;
};

const fetchFaxesForFolderId = async (
  folderId: number
): Promise<FiledFaxType[]> => {
  const response = await xanoGet("/faxes_for_folder_id", "staff", {
    folder_id: folderId,
  });
  return response;
};

export const useFaxesInbox = (
  viewedStatus = "ALL",
  all = true,
  start = "",
  end = ""
) => {
  return useQuery({
    queryKey: ["faxes inbox", viewedStatus, all, start, end],
    queryFn: () => fetchFaxesInbox(viewedStatus, all, start, end),
  });
};

export const useFaxesOutbox = (all = true, start = "", end = "") => {
  return useQuery({
    queryKey: ["faxes outbox", all, start, end],
    queryFn: () => fetchFaxesOutbox(all, start, end),
  });
};

export const useFax = (id: string, direction: string) => {
  return useQuery({
    queryKey: ["fax", id, direction],
    queryFn: () => fetchFax(id, direction),
  });
};

export const useFaxNotes = (fileName: string) => {
  return useQuery({
    queryKey: ["fax notes", fileName],
    queryFn: () => fetchFaxNotes(fileName),
  });
};

export const useFaxContactName = (faxNumber: string) => {
  return useQuery({
    queryKey: ["fax contact name", faxNumber],
    queryFn: () => fetchFaxContactName(faxNumber),
    enabled: !!faxNumber,
  });
};

export const useFaxContactsNames = (faxNumbers: string[]) => {
  return useQuery({
    queryKey: ["fax contacts names", faxNumbers],
    queryFn: () => fetchFaxContactsNames(faxNumbers),
    enabled: faxNumbers.length > 0,
  });
};

export const useFaxNotesForFilenames = (fileNames: string[]) => {
  return useQuery({
    queryKey: ["fax notes for filenames", fileNames],
    queryFn: () => fetchFaxNotesForFilenames(fileNames),
    enabled: fileNames.length > 0,
  });
};

export const useFaxFolders = () => {
  return useQuery({
    queryKey: ["fax folders"],
    queryFn: () => fetchFaxFolders(),
  });
};

export const useFaxesForFolderId = (folderId: string) => {
  return useQuery({
    queryKey: ["faxes for folder id", folderId],
    queryFn: () => {
      return isNaN(parseInt(folderId))
        ? []
        : fetchFaxesForFolderId(parseInt(folderId));
    },
    enabled: !!folderId,
  });
};
