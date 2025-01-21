import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import { FaxInboxType, FaxNotesType, FaxOutboxType } from "../../../types/api";
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
