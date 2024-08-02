import { DateTime } from "luxon";
import { dateISOToTimestampTZ } from "../dates/formatDates";

export const toNextOccurence = (
  currentOccurenceStart,
  currentOccurenceEnd,
  rrule,
  exrule
) => {
  let nextOccurenceStart;
  let nextOccurenceEnd;
  switch (rrule.freq) {
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
    for (let rule of exrule.sort((a, b) => a.dtstart - b.dtstart)) {
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
  currentOccurenceStart,
  currentOccurenceEnd,
  rrule,
  exrule
) => {
  let lastOccurenceStart;
  let lastOccurenceEnd;
  switch (rrule.freq) {
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
    for (let rule of exrule.sort((a, b) => b.dtstart - a.dtstart)) {
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

export const getTodaysEvents = (events, rangeStart, rangeEnd) => {
  const todaysNonRecurringEvents = events.filter(
    (event) => event.extendedProps.recurrence === "Once"
  );
  const possibleRecurringEvents = events.filter(
    (event) => event.extendedProps.recurrence !== "Once"
  );
  let todaysRecurringEvents = [];
  for (let recurringEvent of possibleRecurringEvents) {
    let occurence = recurringEvent;
    let occurenceStart = recurringEvent.start;
    let occurenceEnd = recurringEvent.end;
    switch (occurence.extendedProps.rrule.freq) {
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
