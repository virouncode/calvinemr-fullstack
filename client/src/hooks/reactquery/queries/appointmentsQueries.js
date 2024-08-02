import { useQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";

export const useAppointment = (appointmentId) => {
  return useQuery({
    queryKey: ["appointment", appointmentId],
    queryFn: () => xanoGet(`/appointments/${appointmentId}`, "staff"),
  });
};

export const useAppointments = (
  hostsIds,
  rangeStart,
  rangeEnd,
  timelineVisible,
  timelineSiteId,
  sitesIds,
  sites
) => {
  return useQuery({
    queryKey: [
      "appointments",
      hostsIds,
      rangeStart,
      rangeEnd,
      timelineVisible,
      timelineSiteId,
      sitesIds,
    ],
    queryFn: () =>
      xanoGet("/appointments_of_staff_and_sites", "staff", {
        hosts_ids: hostsIds,
        range_start: rangeStart,
        range_end: rangeEnd,
        sites_ids: timelineVisible ? [timelineSiteId] : sitesIds,
      }),
    enabled: !!(sites && sites.length > 0),
  });
};

export const usePatientAppointments = (patientId) => {
  return useQuery({
    queryKey: ["patientAppointments", patientId],
    queryFn: () =>
      xanoGet("/appointments_of_patient", "patient", { patient_id: patientId }),
  });
};

export const useStaffAppointments = (staffId, rangeStart, rangeEnd) => {
  return useQuery({
    queryKey: ["staffAppointments", staffId, rangeStart, rangeEnd],
    queryFn: () =>
      xanoGet("/appointments_of_staff", "patient", {
        host_id: staffId,
        range_start: rangeStart,
        range_end: rangeEnd,
      }),
  });
};
