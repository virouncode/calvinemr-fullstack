import { EventInput } from "@fullcalendar/core";
import { EventImpl } from "@fullcalendar/core/internal";
import { DateTime } from "luxon";

export const eventImplToEventInput = (eventImpl: EventImpl) => {
  const event: EventInput = {
    id: eventImpl.id,
    start: DateTime.fromJSDate(eventImpl.start ?? new Date(), {
      zone: "America/Toronto",
    }).toMillis(),
    end: DateTime.fromJSDate(eventImpl.end ?? new Date(), {
      zone: "America/Toronto",
    }).toMillis(),
    color: eventImpl.borderColor,
    textColor: eventImpl.textColor,
    display: eventImpl.display,
    allDay: eventImpl.allDay,
    editable: eventImpl.startEditable && eventImpl.durationEditable,
    resourceEditable: eventImpl._def.resourceEditable,
    resourceId: eventImpl._def.resourceIds?.[0],
    rrule: eventImpl.extendedProps?.rrule,
    exrule: eventImpl.extendedProps?.exrule,
    duration: eventImpl.extendedProps?.duration * 60000,
    extendedProps: eventImpl.extendedProps,
  };
  return event;
};
