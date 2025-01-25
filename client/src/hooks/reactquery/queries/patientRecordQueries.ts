import { useQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import { PatientRecordType } from "../../../types/api";

export const usePatientRecord = (patientId: number) => {
  return useQuery<PatientRecordType>({
    queryKey: ["patientRecord", patientId],
    queryFn: () => {
      return xanoGet("/record", "staff", { patient_id: patientId });
    },
  });
};
