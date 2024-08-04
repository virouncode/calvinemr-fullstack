import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import xanoDelete from "../../../api/xanoCRUD/xanoDelete";
import xanoPost from "../../../api/xanoCRUD/xanoPost";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import useSocketContext from "../../context/useSocketContext";

//Appointments with an (s) for event on the calendar
//Appointment for event form
//APPOINTMENTS for Appointment topic

export const useAppointmentsPost = (
  hostsIds,
  rangeStart,
  rangeEnd,
  timelineVisible,
  timelineSiteId,
  sitesIds
) => {
  const queryClient = useQueryClient();
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (appointmentToPost) => {
      const transformedAppointmentToPost = {
        ...appointmentToPost,
        patients_guests_ids: appointmentToPost.patients_guests_ids?.map(
          ({ patient_infos }) => patient_infos.patient_id
        ),
        staff_guests_ids: appointmentToPost.staff_guests_ids?.map(
          ({ staff_infos }) => staff_infos.id
        ),
      };
      return xanoPost("/appointments", "staff", transformedAppointmentToPost);
    },
    onMutate: async (appointmentToPost) => {
      await queryClient.cancelQueries({
        queryKey: [
          "appointments",
          hostsIds,
          rangeStart,
          rangeEnd,
          timelineVisible,
          timelineSiteId,
          sitesIds,
        ],
      });
      const previousAppointments = queryClient.getQueryData([
        "appointments",
        hostsIds,
        rangeStart,
        rangeEnd,
        timelineVisible,
        timelineSiteId,
        sitesIds,
      ]);
      queryClient.setQueryData(
        [
          "appointments",
          hostsIds,
          rangeStart,
          rangeEnd,
          timelineVisible,
          timelineSiteId,
          sitesIds,
        ],
        (oldData) => [...oldData, appointmentToPost]
      );
      return { previousAppointments };
    },
    onSuccess: () => {
      socket.emit("message", { key: ["appointments"] });
      socket.emit("message", { key: ["appointment"] });
      socket.emit("message", { key: ["APPOINTMENTS"] });
      socket.emit("message", { key: ["staffAppointments"] });
      socket.emit("message", { key: ["patientAppointments"] });
      socket.emit("message", { key: ["dashboardVisits"] });
      socket.emit("message", { key: ["allPatientAppointments"] });
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(
        [
          "appointments",
          hostsIds,
          rangeStart,
          rangeEnd,
          timelineVisible,
          timelineSiteId,
          sitesIds,
        ],
        context.previousEvents
      );
      toast.error(`Error: unable to save appointment: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const useAppointmentsPut = (
  hostsIds,
  rangeStart,
  rangeEnd,
  timelineVisible,
  timelineSiteId,
  sitesIds
) => {
  const queryClient = useQueryClient();
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (appointmentToPut) => {
      const transformedAppointmentToPut = {
        ...appointmentToPut,
        patients_guests_ids: appointmentToPut.patients_guests_ids.map(
          ({ patient_infos }) => patient_infos.patient_id
        ),
        staff_guests_ids: appointmentToPut.staff_guests_ids.map(
          ({ staff_infos }) => staff_infos.id
        ),
      };
      return xanoPut(
        `/appointments/${transformedAppointmentToPut.id}`,
        "staff",
        transformedAppointmentToPut
      );
    },
    onMutate: async (appointmentToPut) => {
      await queryClient.cancelQueries({
        queryKey: [
          "appointments",
          hostsIds,
          rangeStart,
          rangeEnd,
          timelineVisible,
          timelineSiteId,
          sitesIds,
        ],
      });
      const previousAppointments = queryClient.getQueryData([
        "appointments",
        hostsIds,
        rangeStart,
        rangeEnd,
        timelineVisible,
        timelineSiteId,
        sitesIds,
      ]);
      queryClient.setQueryData(
        [
          "appointments",
          hostsIds,
          rangeStart,
          rangeEnd,
          timelineVisible,
          timelineSiteId,
          sitesIds,
        ],
        (oldData) =>
          oldData.map((item) =>
            item.id === appointmentToPut.id ? appointmentToPut : item
          )
      );
      return { previousAppointments };
    },
    onSuccess: () => {
      socket.emit("message", { key: ["appointments"] });
      socket.emit("message", { key: ["appointment"] });
      socket.emit("message", { key: ["APPOINTMENTS"] });
      socket.emit("message", { key: ["staffAppointments"] });
      socket.emit("message", { key: ["patientAppointments"] });
      socket.emit("message", { key: ["dashboardVisits"] });
      socket.emit("message", { key: ["allPatientAppointments"] });
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(
        [
          "appointments",
          hostsIds,
          rangeStart,
          rangeEnd,
          timelineVisible,
          timelineSiteId,
          sitesIds,
        ],
        context.previousAppointments
      );
      toast.error(`Error: unable to update appointment: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const useAppointmentsDelete = (
  hostsIds,
  rangeStart,
  rangeEnd,
  timelineVisible,
  timelineSiteId,
  sitesIds
) => {
  const queryClient = useQueryClient();
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (appointmentIdToDelete) =>
      xanoDelete(`/appointments/${appointmentIdToDelete}`, "staff"),
    onMutate: async (appointmentIdToDelete) => {
      await queryClient.cancelQueries({
        queryKey: [
          "appointments",
          hostsIds,
          rangeStart,
          rangeEnd,
          timelineVisible,
          timelineSiteId,
          sitesIds,
        ],
      });
      const previousAppointments = queryClient.getQueryData([
        "appointments",
        hostsIds,
        rangeStart,
        rangeEnd,
        timelineVisible,
        timelineSiteId,
        sitesIds,
      ]);
      queryClient.setQueryData(
        [
          "appointments",
          hostsIds,
          rangeStart,
          rangeEnd,
          timelineVisible,
          timelineSiteId,
          sitesIds,
        ],
        (oldData) => oldData.filter((item) => item.id !== appointmentIdToDelete)
      );
      return { previousAppointments };
    },
    onSuccess: () => {
      socket.emit("message", { key: ["appointments"] });
      socket.emit("message", { key: ["appointment"] });
      socket.emit("message", { key: ["APPOINTMENTS"] });
      socket.emit("message", { key: ["staffAppointments"] });
      socket.emit("message", { key: ["patientAppointments"] });
      socket.emit("message", { key: ["dashboardVisits"] });
      socket.emit("message", { key: ["allPatientAppointments"] });
      toast.success("Appointment deleted succesfully", { containerId: "A" });
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(
        [
          "appointments",
          hostsIds,
          rangeStart,
          rangeEnd,
          timelineVisible,
          timelineSiteId,
          sitesIds,
        ],
        context.prepreviousAppointmentsviousEvents
      );
      toast.error(`Error: unable to delete appointment: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const useAppointmentPost = () => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (appointmentToPost) => {
      const transformedAppointmentToPost = {
        ...appointmentToPost,
        patients_guests_ids: appointmentToPost.patients_guests_ids.map(
          ({ patient_infos }) => patient_infos.patient_id
        ),
        staff_guests_ids: appointmentToPost.staff_guests_ids.map(
          ({ staff_infos }) => staff_infos.id
        ),
      };
      return xanoPost("/appointments", "staff", transformedAppointmentToPost);
    },
    onSuccess: () => {
      socket.emit("message", { key: ["appointments"] });
      socket.emit("message", { key: ["appointment"] });
      socket.emit("message", { key: ["APPOINTMENTS"] });
      socket.emit("message", { key: ["staffAppointments"] });
      socket.emit("message", { key: ["patientAppointments"] });
      socket.emit("message", { key: ["dashboardVisits"] });
      socket.emit("message", { key: ["allPatientAppointments"] });
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
export const useAppointmentPut = (appointmentId) => {
  const queryClient = useQueryClient();
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (appointmentToPut) => {
      const transformedAppointmentToPut = {
        ...appointmentToPut,
        patients_guests_ids: appointmentToPut.patients_guests_ids.map(
          ({ patient_infos }) => patient_infos.patient_id
        ),
        staff_guests_ids: appointmentToPut.staff_guests_ids.map(
          ({ staff_infos }) => staff_infos.id
        ),
      };
      return xanoPut(
        `/appointments/${transformedAppointmentToPut.id}`,
        "staff",
        transformedAppointmentToPut
      );
    },
    onMutate: async (appointmentToPut) => {
      await queryClient.cancelQueries({
        queryKey: ["appointment", appointmentId],
      });
      const previousAppointment = queryClient.getQueryData([
        "appointment",
        appointmentId,
      ]);
      queryClient.setQueryData(
        ["appointment", appointmentId],
        appointmentToPut
      );
      return { previousAppointment };
    },
    onSuccess: () => {
      socket.emit("message", { key: ["appointments"] });
      socket.emit("message", { key: ["appointment"] });
      socket.emit("message", { key: ["APPOINTMENTS"] });
      socket.emit("message", { key: ["staffAppointments"] });
      socket.emit("message", { key: ["patientAppointments"] });
      socket.emit("message", { key: ["dashboardVisits"] });
      socket.emit("message", { key: ["allPatientAppointments"] });
      toast.success(`Appointment saved successfully`, {
        containerId: "A",
      });
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(
        ["appointment", appointmentId],
        context.previousAppointment
      );
      toast.error(`Error: unable to save appointment: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};
