import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FaxInboxType, FaxOutboxType } from "../../../types/api";

axios.defaults.withCredentials = true;

const fetchFaxesInbox = async (
  viewedStatus: string,
  all: boolean,
  start: string,
  end: string
): Promise<FaxInboxType[]> => {
  const response = await axios.post(`/api/srfax/inbox`, {
    viewedStatus,
    all,
    start,
    end,
  });
  return response.data;
};

const fetchFaxesOutbox = async (
  all: boolean,
  start: string,
  end: string
): Promise<FaxOutboxType[]> => {
  const response = await axios.post(`/api/srfax/outbox`, {
    all,
    start,
    end,
  });
  return response.data;
};

const fetchFax = async (id: string, direction: string): Promise<string> => {
  const response = await axios.post(`/api/srfax/faxFile`, {
    id,
    direction,
  });
  return response.data;
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
