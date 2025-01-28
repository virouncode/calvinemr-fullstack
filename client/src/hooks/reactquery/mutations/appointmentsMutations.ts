import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { xanoDelete } from "../../../api/xanoCRUD/xanoDelete";
import { xanoPost } from "../../../api/xanoCRUD/xanoPost";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import {
  AppointmentType,
  DemographicsType,
  StaffType,
} from "../../../types/api";
import useSocketContext from "../../context/useSocketContext";

//Appointments with an (s) for event on the calendar
//Appointment for event form
//APPOINTMENTS for Appointment topic

export const useAppointmentsPost = (
  hostsIds: number[],
  rangeStart: number,
  rangeEnd: number,
  timelineVisible: boolean,
  timelineSiteId: number,
  sitesIds: number[]
) => {
  const queryClient = useQueryClient();
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (appointmentToPost: Partial<AppointmentType>) => {
      return xanoPost("/appointments", "staff", appointmentToPost);
    },
    // onMutate: async (appointmentToPost: Partial<AppointmentType>) => {
    //   await queryClient.cancelQueries({
    //     queryKey: [
    //       "appointments",
    //       hostsIds,
    //       rangeStart,
    //       rangeEnd,
    //       timelineVisible,
    //       timelineSiteId,
    //       sitesIds,
    //     ],
    //   });
    //   const previousAppointments: AppointmentType[] | undefined =
    //     queryClient.getQueryData([
    //       "appointments",
    //       hostsIds,
    //       rangeStart,
    //       rangeEnd,
    //       timelineVisible,
    //       timelineSiteId,
    //       sitesIds,
    //     ]);
    //   queryClient.setQueryData(
    //     [
    //       "appointments",
    //       hostsIds,
    //       rangeStart,
    //       rangeEnd,
    //       timelineVisible,
    //       timelineSiteId,
    //       sitesIds,
    //     ],
    //     (oldData: AppointmentType[]) => [...oldData, appointmentToPost]
    //   );
    //   return { previousAppointments };
    // },
    onSuccess: () => {
      socket?.emit("message", { key: ["appointments"] });
      socket?.emit("message", { key: ["appointment"] });
      socket?.emit("message", { key: ["APPOINTMENTS"] });
      socket?.emit("message", { key: ["staffAppointments"] });
      socket?.emit("message", { key: ["patientAppointments"] });
      socket?.emit("message", { key: ["dashboardVisits"] });
      socket?.emit("message", { key: ["allPatientAppointments"] });
      socket?.emit("message", { key: ["patientRecord"] });
    },
    onError: (error, variables, context) => {
      // queryClient.setQueryData(
      //   [
      //     "appointments",
      //     hostsIds,
      //     rangeStart,
      //     rangeEnd,
      //     timelineVisible,
      //     timelineSiteId,
      //     sitesIds,
      //   ],
      //   context?.previousAppointments
      // );
      toast.error(`Error: unable to save appointment: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const useAppointmentsPut = (
  hostsIds: number[],
  rangeStart: number,
  rangeEnd: number,
  timelineVisible: boolean,
  timelineSiteId: number,
  sitesIds: number[]
) => {
  const queryClient = useQueryClient();
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (appointmentToPut: AppointmentType) => {
      const transformedAppointmentToPut = {
        ...appointmentToPut,
        patients_guests_ids: (
          appointmentToPut.patients_guests_ids as {
            patient_infos: DemographicsType;
          }[]
        ).map(({ patient_infos }) => patient_infos.patient_id),
        staff_guests_ids: (
          appointmentToPut.staff_guests_ids as { staff_infos: StaffType }[]
        ).map(({ staff_infos }) => staff_infos.id),
      };
      return xanoPut(
        `/appointments/${transformedAppointmentToPut.id}`,
        "staff",
        transformedAppointmentToPut
      );
    },
    // onMutate: async (appointmentToPut: AppointmentType) => {
    //   await queryClient.cancelQueries({
    //     queryKey: [
    //       "appointments",
    //       hostsIds,
    //       rangeStart,
    //       rangeEnd,
    //       timelineVisible,
    //       timelineSiteId,
    //       sitesIds,
    //     ],
    //   });
    //   const previousAppointments: AppointmentType[] | undefined =
    //     queryClient.getQueryData([
    //       "appointments",
    //       hostsIds,
    //       rangeStart,
    //       rangeEnd,
    //       timelineVisible,
    //       timelineSiteId,
    //       sitesIds,
    //     ]);
    //   queryClient.setQueryData(
    //     [
    //       "appointments",
    //       hostsIds,
    //       rangeStart,
    //       rangeEnd,
    //       timelineVisible,
    //       timelineSiteId,
    //       sitesIds,
    //     ],
    //     (oldData: AppointmentType[]) =>
    //       oldData.map((item) =>
    //         item.id === appointmentToPut.id ? appointmentToPut : item
    //       )
    //   );
    //   return { previousAppointments };
    // },
    onSuccess: () => {
      socket?.emit("message", { key: ["appointments"] });
      socket?.emit("message", { key: ["appointment"] });
      socket?.emit("message", { key: ["APPOINTMENTS"] });
      socket?.emit("message", { key: ["staffAppointments"] });
      socket?.emit("message", { key: ["patientAppointments"] });
      socket?.emit("message", { key: ["dashboardVisits"] });
      socket?.emit("message", { key: ["allPatientAppointments"] });
    },
    onError: (error, variables, context) => {
      // queryClient.setQueryData(
      //   [
      //     "appointments",
      //     hostsIds,
      //     rangeStart,
      //     rangeEnd,
      //     timelineVisible,
      //     timelineSiteId,
      //     sitesIds,
      //   ],
      //   context?.previousAppointments
      // );
      toast.error(`Error: unable to update appointment: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const useAppointmentsDelete = (
  hostsIds: number[],
  rangeStart: number,
  rangeEnd: number,
  timelineVisible: boolean,
  timelineSiteId: number,
  sitesIds: number[]
) => {
  const queryClient = useQueryClient();
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (appointmentIdToDelete: number) =>
      xanoDelete(`/appointments/${appointmentIdToDelete}`, "staff"),
    // onMutate: async (appointmentIdToDelete: number) => {
    //   await queryClient.cancelQueries({
    //     queryKey: [
    //       "appointments",
    //       hostsIds,
    //       rangeStart,
    //       rangeEnd,
    //       timelineVisible,
    //       timelineSiteId,
    //       sitesIds,
    //     ],
    //   });
    //   const previousAppointments: AppointmentType[] | undefined =
    //     queryClient.getQueryData([
    //       "appointments",
    //       hostsIds,
    //       rangeStart,
    //       rangeEnd,
    //       timelineVisible,
    //       timelineSiteId,
    //       sitesIds,
    //     ]);
    //   queryClient.setQueryData(
    //     [
    //       "appointments",
    //       hostsIds,
    //       rangeStart,
    //       rangeEnd,
    //       timelineVisible,
    //       timelineSiteId,
    //       sitesIds,
    //     ],
    //     (oldData: AppointmentType[]) =>
    //       oldData.filter((item) => item.id !== appointmentIdToDelete)
    //   );
    //   return { previousAppointments };
    // },
    onSuccess: () => {
      socket?.emit("message", { key: ["appointments"] });
      socket?.emit("message", { key: ["appointment"] });
      socket?.emit("message", { key: ["APPOINTMENTS"] });
      socket?.emit("message", { key: ["staffAppointments"] });
      socket?.emit("message", { key: ["patientAppointments"] });
      socket?.emit("message", { key: ["dashboardVisits"] });
      socket?.emit("message", { key: ["allPatientAppointments"] });
      toast.success("Appointment deleted succesfully", { containerId: "A" });
    },
    onError: (error, variables, context) => {
      // queryClient.setQueryData(
      //   [
      //     "appointments",
      //     hostsIds,
      //     rangeStart,
      //     rangeEnd,
      //     timelineVisible,
      //     timelineSiteId,
      //     sitesIds,
      //   ],
      //   context?.previousAppointments
      // );
      toast.error(`Error: unable to delete appointment: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const useAppointmentPost = () => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (appointmentToPost: Partial<AppointmentType>) => {
      return xanoPost("/appointments", "staff", appointmentToPost);
    },
    onSuccess: () => {
      socket?.emit("message", { key: ["appointments"] });
      socket?.emit("message", { key: ["appointment"] });
      socket?.emit("message", { key: ["APPOINTMENTS"] });
      socket?.emit("message", { key: ["staffAppointments"] });
      socket?.emit("message", { key: ["patientAppointments"] });
      socket?.emit("message", { key: ["dashboardVisits"] });
      socket?.emit("message", { key: ["allPatientAppointments"] });
      toast.success(`Appointment saved successfully`, {
        containerId: "A",
      });
    },
    onError: (error) => {
      toast.error(`Error: unable to save appointment: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};
export const useAppointmentPut = () => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (appointmentToPut: AppointmentType) => {
      const transformedAppointmentToPut = {
        ...appointmentToPut,
        patients_guests_ids: (
          appointmentToPut.patients_guests_ids as {
            patient_infos: DemographicsType;
          }[]
        ).map(({ patient_infos }) => patient_infos.patient_id),
        staff_guests_ids: (
          (appointmentToPut.staff_guests_ids as { staff_infos: StaffType }[]) ??
          []
        ).map(({ staff_infos }) => staff_infos.id),
      };
      return xanoPut(
        `/appointments/${transformedAppointmentToPut.id}`,
        "staff",
        transformedAppointmentToPut
      );
    },
    onSuccess: () => {
      socket?.emit("message", { key: ["appointments"] });
      socket?.emit("message", { key: ["appointment"] });
      socket?.emit("message", { key: ["APPOINTMENTS"] });
      socket?.emit("message", { key: ["staffAppointments"] });
      socket?.emit("message", { key: ["patientAppointments"] });
      socket?.emit("message", { key: ["dashboardVisits"] });
      socket?.emit("message", { key: ["allPatientAppointments"] });
      toast.success(`Appointment saved successfully`, {
        containerId: "A",
      });
    },
    onError: (error) => {
      toast.error(`Error: unable to save appointment: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const useAppointmentDelete = () => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (appointmentIdToDelete: number) =>
      xanoDelete(`/appointments/${appointmentIdToDelete}`, "staff"),
    onSuccess: () => {
      socket?.emit("message", { key: ["appointments"] });
      socket?.emit("message", { key: ["appointment"] });
      socket?.emit("message", { key: ["APPOINTMENTS"] });
      socket?.emit("message", { key: ["staffAppointments"] });
      socket?.emit("message", { key: ["patientAppointments"] });
      socket?.emit("message", { key: ["dashboardVisits"] });
      socket?.emit("message", { key: ["allPatientAppointments"] });
      toast.success(`Appointment deleted successfully`, {
        containerId: "A",
      });
    },
    onError: (error) => {
      toast.error(`Error: unable to delete appointment: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};
