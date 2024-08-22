import { useInfiniteQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import { ReportType, XanoPaginatedType } from "../../../types/api";

export const useReportsInbox = (staffId: number) => {
  return useInfiniteQuery<XanoPaginatedType<ReportType>>({
    queryKey: ["reportsInbox", staffId],
    queryFn: ({ pageParam }) => {
      return xanoGet(`/reports_of_staff`, "staff", {
        staff_id: staffId,
        page: pageParam,
      });
    },
    enabled: !!staffId,
    initialPageParam: 1,
    getNextPageParam: (prevData) => prevData.nextPage,
  });
};

export const useReports = (patientId: number) => {
  return useInfiniteQuery<XanoPaginatedType<ReportType>>({
    queryKey: ["reports", patientId],
    queryFn: ({ pageParam }) => {
      return xanoGet(`/reports_of_patient`, "staff", {
        patient_id: patientId,
        page: pageParam,
      });
    },
    enabled: !!patientId,
    initialPageParam: 1,
    getNextPageParam: (prevData) => prevData.nextPage,
  });
};
export const useReportsReceived = (patientId: number) => {
  return useInfiniteQuery<XanoPaginatedType<ReportType>>({
    queryKey: ["reportsReceived", patientId],
    queryFn: ({ pageParam }) => {
      return xanoGet(`/reports_received_of_patient`, "staff", {
        patient_id: patientId,
        page: pageParam,
      });
    },
    enabled: !!patientId,
    initialPageParam: 1,
    getNextPageParam: (prevData) => prevData.nextPage,
  });
};

export const useReportsSent = (patientId: number) => {
  return useInfiniteQuery<XanoPaginatedType<ReportType>>({
    queryKey: ["reportsSent", patientId],
    queryFn: ({ pageParam }) => {
      return xanoGet(`/reports_sent_of_patient`, "staff", {
        patient_id: patientId,
        page: pageParam,
      });
    },
    enabled: !!patientId,
    initialPageParam: 1,
    getNextPageParam: (prevData) => prevData.nextPage,
  });
};
