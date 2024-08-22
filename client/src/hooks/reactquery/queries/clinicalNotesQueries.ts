import { useInfiniteQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import { ClinicalNoteType, XanoPaginatedType } from "../../../types/api";

export const useClinicalNotes = (
  patientId: number,
  search: string,
  order: string
) => {
  return useInfiniteQuery<XanoPaginatedType<ClinicalNoteType>>({
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
