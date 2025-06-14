import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import { DemographicsType, XanoPaginatedType } from "../../../types/api";
import { SearchPatientType } from "../../../types/app";
import useUserContext from "../../context/useUserContext";

export const usePatients = (search: SearchPatientType) => {
  const { user } = useUserContext();
  const userType = user?.access_level;
  return useInfiniteQuery<XanoPaginatedType<DemographicsType>>({
    queryKey: ["patients", search],
    queryFn: ({ pageParam }) => {
      return xanoGet("/demographics_search", userType as string, {
        page: pageParam,
        search,
      });
    },
    initialPageParam: 1,
    getNextPageParam: (prevData) => prevData.nextPage,
  });
};

export const usePatientsSimpleSearch = (search: string) => {
  const { user } = useUserContext();
  const userType = user?.access_level;
  return useInfiniteQuery<XanoPaginatedType<DemographicsType>>({
    queryKey: ["patients", search],
    queryFn: ({ pageParam }) => {
      return xanoGet("/demographics_simple_search", userType as string, {
        page: pageParam,
        search,
      });
    },
    initialPageParam: 1,
    getNextPageParam: (prevData) => prevData.nextPage,
  });
};

export const usePatient = (patientId: number | null) => {
  return useQuery<DemographicsType>({
    queryKey: ["patient", patientId],
    queryFn: () => {
      return xanoGet(`/demographics_of_patient`, "staff", {
        patient_id: patientId,
      });
    },
    enabled: !!patientId,
  });
};
