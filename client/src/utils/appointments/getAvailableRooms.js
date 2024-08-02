import xanoGet from "../../api/xanoCRUD/xanoGet";
import {
  dateISOToTimestampTZ,
  timestampToDateISOTZ,
  timestampToTimeISOTZ,
} from "../dates/formatDates";
import { toNextOccurence } from "./occurences";

import _ from "lodash";
export const getAvailableRooms = async (
  currentAppointmentId,
  rangeStart,
  rangeEnd,
  sites,
  siteId,
  abortController = null
) => {
  try {
    const appointmentsInRange = await xanoGet(
      "/appointments_in_range_and_sites",
      "staff",
      {
        range_start: rangeStart,
        range_end: rangeEnd,
        sites_ids: [siteId],
      },
      abortController
    );
    const otherNonRecAppointments = appointmentsInRange
      .filter(({ id }) => id !== currentAppointmentId)
      .filter(({ recurrence }) => recurrence === "Once");

    const otherRecAppointments = appointmentsInRange
      .filter(({ id }) => id !== currentAppointmentId)
      .filter(({ recurrence }) => recurrence !== "Once");

    let otherRecAppointmentsInRange = [];
    for (let otherRecAppointment of otherRecAppointments) {
      let start = otherRecAppointment.start;
      let end = otherRecAppointment.end;
      while (end <= rangeStart) {
        const nextOccurence = toNextOccurence(
          start,
          end,
          otherRecAppointment.rrule,
          otherRecAppointment.exrule
        );
        start = nextOccurence[0];
        end = nextOccurence[1];
      }
      if (
        start < rangeEnd &&
        ((otherRecAppointment.rrule.until &&
          start < dateISOToTimestampTZ(otherRecAppointment.rrule.until)) ||
          !otherRecAppointment.rrule.until)
      ) {
        otherRecAppointmentsInRange.push({
          ...otherRecAppointment,
          start,
          end,
          AppointmentDate: timestampToDateISOTZ(start),
          AppointmentTime: timestampToTimeISOTZ(start),
          rrule: null,
          recurrence: "Once",
          exrule: null,
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
        .map(({ room_id }) => room_id)
    );
    const allRooms = sites
      .find(({ id }) => id === siteId)
      ?.rooms.filter(({ id }) => id !== "z")
      .map(({ id }) => id);
    const availableRooms = _.difference(allRooms, occupiedRooms);
    return availableRooms;
  } catch (err) {
    if (err.name !== "CanceledError") throw err;
  }
};
