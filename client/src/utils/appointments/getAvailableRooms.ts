import _ from "lodash";
import xanoGet from "../../api/xanoCRUD/xanoGet";
import {
  AppointmentType,
  ExruleType,
  RruleType,
  SiteType,
} from "../../types/api";
import {
  dateISOToTimestampTZ,
  timestampToDateISOTZ,
  timestampToTimeISOTZ,
} from "../dates/formatDates";
import { toNextOccurence } from "./occurences";

export const getAvailableRooms = async (
  currentAppointmentId: number,
  rangeStart: number,
  rangeEnd: number,
  sites: SiteType[],
  siteId: number,
  abortController?: AbortController
) => {
  const appointmentsInRange: AppointmentType[] = await xanoGet(
    "/appointments_in_range_and_sites",
    "staff",
    {
      range_start: rangeStart,
      range_end: rangeEnd,
      sites_ids: [siteId],
    },
    abortController
  );
  const otherNonRecAppointments: AppointmentType[] = appointmentsInRange
    .filter(({ id }) => id !== currentAppointmentId)
    .filter(({ recurrence }) => recurrence === "Once");

  const otherRecAppointments: AppointmentType[] = appointmentsInRange
    .filter(({ id }) => id !== currentAppointmentId)
    .filter(({ recurrence }) => recurrence !== "Once");

  const otherRecAppointmentsInRange: AppointmentType[] = [];
  for (const otherRecAppointment of otherRecAppointments) {
    let start = otherRecAppointment.start;
    let end = otherRecAppointment.end;
    while (end <= rangeStart) {
      const nextOccurence = toNextOccurence(
        start,
        end,
        otherRecAppointment.rrule as RruleType,
        otherRecAppointment.exrule as ExruleType
      );
      start = nextOccurence[0];
      end = nextOccurence[1];
    }
    if (
      start < rangeEnd &&
      ((otherRecAppointment.rrule?.until &&
        start < dateISOToTimestampTZ(otherRecAppointment.rrule.until)) ||
        !otherRecAppointment.rrule?.until)
    ) {
      otherRecAppointmentsInRange.push({
        ...otherRecAppointment,
        start,
        end,
        AppointmentDate: timestampToDateISOTZ(start),
        AppointmentTime: timestampToTimeISOTZ(start),
        rrule: { freq: "", interval: 0, dtstart: "", until: "" },
        recurrence: "Once",
        exrule: [],
      });
    }
  }
  const otherAppointments = [
    ...otherNonRecAppointments,
    ...otherRecAppointmentsInRange,
  ];
  const occupiedRooms = _.uniq(
    otherAppointments
      .filter(({ room_id }) => room_id !== "z")
      .map(({ room_id }) => room_id) ?? []
  ) as string[];
  const allRooms =
    sites
      .find(({ id }) => id === siteId)
      ?.rooms.filter(({ id }) => id !== "z")
      .map(({ id }) => id) ?? [];
  const availableRooms =
    (_.difference(allRooms, occupiedRooms) as string[]) ?? [];
  return availableRooms;
};
