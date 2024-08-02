import { useQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";

export const useAllPatientAppointments = (patientId) => {
  return useQuery({
    queryKey: ["allPatientAppointments", patientId],
    queryFn: () =>
      xanoGet(`/appointments_of_patient_all`, "staff", {
        patient_id: patientId,
      }),
  });
};
