import { DateTime } from "luxon";
import { ExruleType, RruleType } from "../../types/api";
import { EventType } from "../../types/app";
import { dateISOToTimestampTZ } from "../dates/formatDates";

export const toNextOccurence = (
  currentOccurenceStart: number,
  currentOccurenceEnd: number,
  rrule: RruleType,
  exrule: ExruleType
) => {
  let nextOccurenceStart: number = 0;
  let nextOccurenceEnd: number = 0;
  switch (rrule?.freq) {
    case "daily":
      nextOccurenceStart = DateTime.fromMillis(currentOccurenceStart, {
        zone: "America/Toronto",
      })
        .plus({ days: rrule.interval })
        .toMillis();
      nextOccurenceEnd = DateTime.fromMillis(currentOccurenceEnd, {
        zone: "America/Toronto",
      })
        .plus({ days: rrule.interval })
        .toMillis();
      break;
    case "weekly":
      nextOccurenceStart = DateTime.fromMillis(currentOccurenceStart, {
        zone: "America/Toronto",
      })
        .plus({ weeks: rrule.interval })
        .toMillis();
      nextOccurenceEnd = DateTime.fromMillis(currentOccurenceEnd, {
        zone: "America/Toronto",
      })
        .plus({ weeks: rrule.interval })
        .toMillis();
      break;
    case "monthly":
      nextOccurenceStart = DateTime.fromMillis(currentOccurenceStart, {
        zone: "America/Toronto",
      })
        .plus({ months: rrule.interval })
        .toMillis();
      nextOccurenceEnd = DateTime.fromMillis(currentOccurenceEnd, {
        zone: "America/Toronto",
      })
        .plus({ months: rrule.interval })
        .toMillis();
      break;
    case "yearly":
      nextOccurenceStart = DateTime.fromMillis(currentOccurenceStart, {
        zone: "America/Toronto",
      })
        .plus({ years: rrule.interval })
        .toMillis();
      nextOccurenceEnd = DateTime.fromMillis(currentOccurenceEnd, {
        zone: "America/Toronto",
      })
        .plus({ years: rrule.interval })
        .toMillis();
      break;
    default:
      break;
  }
  if (exrule?.length) {
    for (const rule of exrule.sort(
      (a, b) =>
        dateISOToTimestampTZ(a.dtstart) - dateISOToTimestampTZ(b.dtstart)
    )) {
      if (
        nextOccurenceStart >= dateISOToTimestampTZ(rule.dtstart) &&
        nextOccurenceEnd <= dateISOToTimestampTZ(rule.until)
      ) {
        nextOccurenceStart = toNextOccurence(
          nextOccurenceStart,
          nextOccurenceEnd,
          rrule,
          exrule
        )[0];
        nextOccurenceEnd = toNextOccurence(
          nextOccurenceStart,
          nextOccurenceEnd,
          rrule,
          exrule
        )[1];
      }
    }
  }
  return [nextOccurenceStart, nextOccurenceEnd];
};

export const toLastOccurence = (
  currentOccurenceStart: number,
  currentOccurenceEnd: number,
  rrule: RruleType,
  exrule: ExruleType
) => {
  let lastOccurenceStart;
  let lastOccurenceEnd;
  switch (rrule?.freq) {
    case "daily":
      lastOccurenceStart = DateTime.fromMillis(currentOccurenceStart, {
        zone: "America/Toronto",
      })
        .minus({ days: rrule.interval })
        .toMillis();
      lastOccurenceEnd = DateTime.fromMillis(currentOccurenceEnd, {
        zone: "America/Toronto",
      })
        .minus({ days: rrule.interval })
        .toMillis();
      break;
    case "weekly":
      lastOccurenceStart = DateTime.fromMillis(currentOccurenceStart, {
        zone: "America/Toronto",
      })
        .minus({ weeks: rrule.interval })
        .toMillis();
      lastOccurenceEnd = DateTime.fromMillis(currentOccurenceEnd, {
        zone: "America/Toronto",
      })
        .minus({ weeks: rrule.interval })
        .toMillis();
      break;
    case "monthly":
      lastOccurenceStart = DateTime.fromMillis(currentOccurenceStart, {
        zone: "America/Toronto",
      })
        .minus({ months: rrule.interval })
        .toMillis();
      lastOccurenceEnd = DateTime.fromMillis(currentOccurenceEnd, {
        zone: "America/Toronto",
      })
        .minus({ months: rrule.interval })
        .toMillis();
      break;
    case "yearly":
      lastOccurenceStart = DateTime.fromMillis(currentOccurenceStart, {
        zone: "America/Toronto",
      })
        .minus({ years: rrule.interval })
        .toMillis();
      lastOccurenceEnd = DateTime.fromMillis(currentOccurenceEnd, {
        zone: "America/Toronto",
      })
        .minus({ years: rrule.interval })
        .toMillis();
      break;
    default:
      break;
  }
  if (exrule?.length) {
    for (const rule of exrule.sort(
      (a, b) =>
        dateISOToTimestampTZ(b.dtstart) - dateISOToTimestampTZ(a.dtstart)
    )) {
      if (
        lastOccurenceStart >= dateISOToTimestampTZ(rule.dtstart) &&
        lastOccurenceEnd <= dateISOToTimestampTZ(rule.until)
      ) {
        lastOccurenceStart = toLastOccurence(
          lastOccurenceStart,
          lastOccurenceEnd,
          rrule,
          exrule
        )[0];
        lastOccurenceEnd = toLastOccurence(
          lastOccurenceStart,
          lastOccurenceEnd,
          rrule,
          exrule
        )[1];
      }
    }
  }
  return [lastOccurenceStart, lastOccurenceEnd];
};

export const getTodaysEvents = (
  events: EventType[],
  rangeStart: number,
  rangeEnd: number
) => {
  const todaysNonRecurringEvents = events.filter(
    (event) => event.extendedProps.recurrence === "Once"
  );
  const possibleRecurringEvents = events.filter(
    (event) => event.extendedProps.recurrence !== "Once"
  );
  const todaysRecurringEvents: EventType[] = [];
  for (const recurringEvent of possibleRecurringEvents) {
    const occurence = recurringEvent;
    let occurenceStart = recurringEvent.start;
    let occurenceEnd = recurringEvent.end;
    switch (occurence.extendedProps.rrule?.freq) {
      case "daily":
        while (occurenceStart < rangeStart) {
          occurenceStart = toNextOccurence(
            occurenceStart,
            occurenceEnd,
            recurringEvent.rrule,
            recurringEvent.exrule
          )[0];
          occurenceEnd = toNextOccurence(
            occurenceStart,
            occurenceEnd,
            recurringEvent.rrule,
            recurringEvent.exrule
          )[1];
        }
        if (
          occurenceStart <= rangeEnd &&
          (occurenceStart <=
            DateTime.fromISO(occurence.extendedProps.rrule.until).toMillis() ||
            !occurence.extendedProps.rrule.until)
        )
          todaysRecurringEvents.push({
            ...occurence,
            start: occurenceStart,
            end: occurenceEnd,
          });
        break;
      case "weekly":
        while (occurenceStart < rangeStart) {
          occurenceStart = toNextOccurence(
            occurenceStart,
            occurenceEnd,
            recurringEvent.rrule,
            recurringEvent.exrule
          )[0];
          occurenceEnd = toNextOccurence(
            occurenceStart,
            occurenceEnd,
            recurringEvent.rrule,
            recurringEvent.exrule
          )[1];
        }
        if (
          occurenceStart <= rangeEnd &&
          (occurenceStart <=
            DateTime.fromISO(occurence.extendedProps.rrule.until).toMillis() ||
            !occurence.extendedProps.rrule.until)
        )
          todaysRecurringEvents.push({
            ...occurence,
            start: occurenceStart,
            end: occurenceEnd,
          });
        break;
      case "monthly":
        while (occurenceStart < rangeStart) {
          occurenceStart = toNextOccurence(
            occurenceStart,
            occurenceEnd,
            recurringEvent.rrule,
            recurringEvent.exrule
          )[0];
          occurenceEnd = toNextOccurence(
            occurenceStart,
            occurenceEnd,
            recurringEvent.rrule,
            recurringEvent.exrule
          )[1];
        }
        if (
          occurenceStart <= rangeEnd &&
          (occurenceStart <=
            DateTime.fromISO(occurence.extendedProps.rrule.until).toMillis() ||
            !occurence.extendedProps.rrule.until)
        )
          todaysRecurringEvents.push({
            ...occurence,
            start: occurenceStart,
            end: occurenceEnd,
          });
        break;
      case "yearly":
        while (occurenceStart < rangeStart) {
          occurenceStart = toNextOccurence(
            occurenceStart,
            occurenceEnd,
            recurringEvent.rrule,
            recurringEvent.exrule
          )[0];
          occurenceEnd = toNextOccurence(
            occurenceStart,
            occurenceEnd,
            recurringEvent.rrule,
            recurringEvent.exrule
          )[1];
        }
        if (
          occurenceStart <= rangeEnd &&
          (occurenceStart <=
            DateTime.fromISO(occurence.extendedProps.rrule.until).toMillis() ||
            !occurence.extendedProps.rrule.until)
        )
          todaysRecurringEvents.push({
            ...occurence,
            start: occurenceStart,
            end: occurenceEnd,
          });
        break;
      default:
        break;
    }
  }
  return [...todaysNonRecurringEvents, ...todaysRecurringEvents];
};
