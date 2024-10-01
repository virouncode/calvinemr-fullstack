import { EventInput } from "@fullcalendar/core";
import * as _ from "lodash";
import {
  AppointmentType,
  DemographicsType,
  RoomType,
  SiteType,
  StaffType,
} from "../../types/api";
import { RemainingStaffType } from "../../types/app";
import { staffIdToTitleAndName } from "../names/staffIdToTitleAndName";
const colorsPalette = [
  { background: "#ffe119", text: "#3D375A" },
  { background: "#e6194b", text: "#3D375A" },
  { background: "#3cb44b", text: "#3D375A" },
  { background: "#f58231", text: "#3D375A" },
  { background: "#911eb4", text: "#FEFEFE" },
  { background: "#42d4f4", text: "#3D375A" },
  { background: "#f032e6", text: "#3D375A" },
  { background: "#bfef45", text: "#3D375A" },
  { background: "#fabed4", text: "#3D375A" },
  { background: "#469990", text: "#3D375A" },
  { background: "#dcbeff", text: "#3D375A" },
  { background: "#9a6324", text: "#FEFEFE" },
  { background: "#fffac8", text: "#3D375A" },
  { background: "#800000", text: "#FEFEFE" },
  { background: "#aaffc3", text: "#3D375A" },
  { background: "#808000", text: "#3D375A" },
  { background: "#ffd8b1", text: "#3D375A" },
  { background: "#000075", text: "#FEFEFE" },
  { background: "#808080", text: "#3D375A" },
];

export const getRemainingStaff = (userId: number, staffInfos: StaffType[]) => {
  return staffInfos
    .filter(({ account_status }) => account_status !== "Closed")
    .filter(({ id }) => id !== userId)
    .map((staff, index) => {
      const remainingStaff: RemainingStaffType = {
        id: staff.id as number,
        color: colorsPalette[index % colorsPalette.length].background,
        textColor: colorsPalette[index % colorsPalette.length].text,
      };
      return remainingStaff;
    });
};

export const parseToEvents = (
  appointments: AppointmentType[] | undefined,
  staffInfos: StaffType[],
  sites: SiteType[] | undefined,
  isSecretary: boolean,
  userId: number
) => {
  //give a color to each remaining member of the staff
  if (!sites || sites.length === 0 || !appointments) return undefined;
  const remainingStaffObjects = staffInfos
    .filter(({ account_status }) => account_status !== "Closed")
    .filter(({ id }) => id !== userId)
    .map((staff, index) => {
      return {
        id: staff.id,
        color: colorsPalette[index % colorsPalette.length].background,
        textColor: colorsPalette[index % colorsPalette.length].text,
      };
    });
  const events: EventInput[] = appointments.map(
    (appointment) =>
      appointment.host_id !== userId
        ? appointment.host_id === 0
          ? parseToEvent(
              appointment,
              "#bfbfbf",
              "#3D375A",
              isSecretary,
              userId,
              sites?.find(({ id }) => id === appointment.site_id)
                ?.rooms as RoomType[],
              staffInfos
            ) //grey
          : parseToEvent(
              appointment,
              remainingStaffObjects[
                _.findIndex(remainingStaffObjects, {
                  id: appointment.host_id,
                })
              ].color,
              remainingStaffObjects[
                _.findIndex(remainingStaffObjects, {
                  id: appointment.host_id,
                })
              ].textColor,
              isSecretary,
              userId,
              sites?.find(({ id }) => id === appointment.site_id)
                ?.rooms as RoomType[],
              staffInfos
            )
        : parseToEvent(
            appointment,
            "#93B5E9",
            "#3D375A",
            isSecretary,
            userId,
            sites?.find(({ id }) => id === appointment.site_id)
              ?.rooms as RoomType[],
            staffInfos
          ) //blue
  );
  return events;
};

export const parseToEvent = (
  appointment: AppointmentType,
  color: string,
  textColor: string,
  isSecretary: boolean,
  userId: number,
  rooms: RoomType[],
  staffInfos: StaffType[]
) => {
  console.log("appointment.invitations_sent", appointment.invitations_sent);

  const event: EventInput = {
    id: (appointment.id ?? -1).toString(),
    start: appointment.start,
    end: appointment.end,
    color: color,
    textColor: textColor,
    display: "block",
    allDay: appointment.all_day,
    editable: appointment.host_id === userId || isSecretary ? true : false, //if secretary give access
    resourceEditable:
      appointment.host_id === userId || isSecretary ? true : false, //if secretary give access
    resourceId: rooms?.find(({ id }) => id === appointment.room_id)
      ?.id as string,
    rrule: appointment.rrule?.freq
      ? {
          ...appointment.rrule,
          dtstart: appointment.rrule?.dtstart.slice(0, 19), //remove the timezone info from the string
          until: appointment.rrule?.until
            ? appointment.rrule.until.slice(0, 19)
            : "",
        }
      : undefined,
    exrule: appointment.exrule?.length
      ? appointment.exrule.map((exrule) => ({
          ...exrule,
          dtstart: exrule?.dtstart ? exrule.dtstart.slice(0, 19) : "",
          until: exrule?.until ? exrule.until.slice(0, 19) : "",
        }))
      : [],
    duration: appointment.Duration * 60000,
    extendedProps: {
      host: appointment.host_id,
      hostName: appointment.host_infos
        ? staffIdToTitleAndName(staffInfos, appointment.host_infos.id)
        : "",
      hostFirstName: appointment.host_infos
        ? appointment.host_infos.first_name
        : "",
      hostLastName: appointment.host_infos
        ? appointment.host_infos.last_name
        : "",
      hostOHIP: appointment.host_infos
        ? appointment.host_infos.ohip_billing_nbr
        : "",
      duration: appointment.Duration,
      purpose: appointment.AppointmentPurpose,
      status: appointment.AppointmentStatus,
      staffGuestsIds: appointment.staff_guests_ids as {
        staff_infos: StaffType;
      }[],
      patientsGuestsIds: appointment.patients_guests_ids as {
        patient_infos: DemographicsType;
      }[],
      siteId: appointment.site_id,
      siteName: appointment.site_infos?.name as string,
      roomId: appointment.room_id,
      roomTitle: appointment.site_infos?.rooms.find(
        ({ id }) => id === appointment.room_id
      )?.title as string,
      updates: appointment.updates ?? [],
      date_created: appointment.date_created,
      created_by_id: appointment.created_by_id,
      notes: appointment.AppointmentNotes as string,
      providerFirstName: appointment.Provider?.Name?.FirstName,
      providerLastName: appointment.Provider?.Name?.LastName,
      providerOHIP: appointment.Provider?.OHIPPhysicianId,
      recurrence: appointment.recurrence,
      rrule: appointment.rrule?.freq
        ? {
            ...appointment.rrule,
            dtstart: appointment.rrule?.dtstart.slice(0, 19),
            until: appointment.rrule?.until
              ? appointment.rrule.until.slice(0, 19)
              : "",
          }
        : undefined,
      exrule: appointment.exrule?.length
        ? appointment.exrule.map((exrule) => ({
            ...exrule,
            dtstart: exrule?.dtstart ? exrule.dtstart.slice(0, 19) : "",
            until: exrule?.until ? exrule.until.slice(0, 19) : "",
          }))
        : [],
      invitations_sent: appointment.invitations_sent,
    },
  };
  return event;
};
