import { useInfiniteQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";

export const useClinicalNotes = (patientId, search, order) => {
  return useInfiniteQuery({
    queryKey: ["clinicalNotes", patientId, search, order],
    queryFn: ({ pageParam }) => {
      return xanoGet("/clinical_notes_of_patient", "staff", {
        patient_id: patientId,
        orderBy: order,
        page: pageParam,
        search,
      });
    },
    initialPageParam: 1,
    getNextPageParam: (prevData) => prevData.nextPage,
  });
};
