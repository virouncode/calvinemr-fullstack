import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import useUserContext from "../../context/useUserContext";

export const usePatients = (search) => {
  const { user } = useUserContext();
  const userType = user.access_level;
  return useInfiniteQuery({
    queryKey: ["patients", search],
    queryFn: ({ pageParam }) => {
      return xanoGet("/demographics_search", userType, {
        page: pageParam,
        search,
      });
    },
    initialPageParam: 1,
    getNextPageParam: (prevData) => prevData.nextPage,
  });
};

export const usePatientsSimpleSearch = (search) => {
  const { user } = useUserContext();
  const userType = user.access_level;
  return useInfiniteQuery({
    queryKey: ["patients", search],
    queryFn: ({ pageParam }) => {
      return xanoGet("/demographics_simple_search", userType, {
        page: pageParam,
        search,
      });
    },
    initialPageParam: 1,
    getNextPageParam: (prevData) => prevData.nextPage,
  });
};

export const usePatient = (patientId) => {
  return useQuery({
    queryKey: ["patient", patientId],
    queryFn: () => {
      return xanoGet(`/demographics_of_patient`, "staff", {
        patient_id: patientId,
      });
    },
    enabled: !!patientId,
  });
};
