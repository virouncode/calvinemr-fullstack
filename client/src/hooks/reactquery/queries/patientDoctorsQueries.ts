import { useInfiniteQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import { DoctorType, XanoPaginatedType } from "../../../types/api";

export const usePatientDoctors = (patientId: number) => {
  return useInfiniteQuery<XanoPaginatedType<DoctorType>>({
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
