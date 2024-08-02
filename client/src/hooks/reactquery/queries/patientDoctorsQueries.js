import { useInfiniteQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";

export const usePatientDoctors = (patientId) => {
  return useInfiniteQuery({
    queryKey: ["patientDoctors", patientId],
    queryFn: ({ pageParam }) =>
      xanoGet("/doctors_of_patient", "staff", {
        patient_id: patientId,
        page: pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (prevData) => prevData.nextPage,
  });
};
