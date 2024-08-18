import { useInfiniteQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import { PaginatedDatasType, ClinicalNoteType } from "../../../types/api";

export const useClinicalNotes = (
  patientId: number,
  search: string,
  order: string
) => {
  return useInfiniteQuery({
    queryKey: ["clinicalNotes", patientId, search, order],
    queryFn: ({ pageParam }): Promise<PaginatedDatasType<ClinicalNoteType>> => {
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
