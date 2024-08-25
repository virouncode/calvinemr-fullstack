import { useQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import { AppointmentType } from "../../../types/api";

export const useAllPatientAppointments = (patientId: number) => {
  return useQuery<AppointmentType[]>({
    queryKey: ["allPatientAppointments", patientId],
    queryFn: () =>
      xanoGet(`/appointments_of_patient_all`, "staff", {
        patient_id: patientId,
      }),
  });
};
