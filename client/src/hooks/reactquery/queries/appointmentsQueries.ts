import { useQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import { AppointmentType, SiteType } from "../../../types/api";

export const useAppointment = (appointmentId: number) => {
  return useQuery<AppointmentType>({
    queryKey: ["appointment", appointmentId],
    queryFn: () => xanoGet(`/appointments/${appointmentId}`, "staff"),
  });
};

export const useAppointments = (
  hostsIds: number[],
  rangeStart: number,
  rangeEnd: number,
  timelineVisible: boolean,
  timelineSiteId: number,
  sitesIds: number[],
  sites?: SiteType[]
) => {
  return useQuery<AppointmentType[]>({
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

export const usePatientAppointments = (patientId: number) => {
  return useQuery<AppointmentType[]>({
    queryKey: ["patientAppointments", patientId],
    queryFn: () =>
      xanoGet("/appointments_of_patient", "patient", { patient_id: patientId }),
  });
};

export const useStaffAppointments = (
  staffId: number,
  rangeStart: number,
  rangeEnd: number
) => {
  return useQuery<AppointmentType[]>({
    queryKey: ["staffAppointments", staffId, rangeStart, rangeEnd],
    queryFn: () =>
      xanoGet("/appointments_of_staff", "patient", {
        host_id: staffId,
        range_start: rangeStart,
        range_end: rangeEnd,
      }),
  });
};
