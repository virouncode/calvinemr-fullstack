const { DateTime, Duration } = require("luxon");
//DATE Date object
//ISO "1984-04-25T23:54:23+UTCOffset"
//STR "1984-04-25, 11:54:23 PM"
//HUMAN "Thursday, Apr 10, 11:54 PM"
//TIMESTAMPS

//DATE
const nowTZ = (timezone = "America/Toronto") => {
  return DateTime.local({ zone: timezone });
};

//ISO
const timestampToDateISOTZ = (
  timestamp,
  timezone = "America/Toronto",
  locale = "en-CA"
) => {
  if (!timestamp) return "";
  return DateTime.fromMillis(timestamp, {
    zone: timezone,
    locale,
  }).toISODate();
};
const timestampToTimeISOTZ = (
  timestamp,
  timezone = "America/Toronto",
  locale = "en-CA"
) => {
  if (!timestamp) return "";
  return DateTime.fromMillis(timestamp, {
    zone: timezone,
    locale,
  }).toISOTime();
};
const timestampToDateTimeSecondsISOTZ = (
  timestamp,
  withMs = true,
  withOffset = true,
  timezone = "America/Toronto",
  locale = "en-CA"
) => {
  if (!timestamp) return "";
  return DateTime.fromMillis(timestamp, {
    zone: timezone,
    locale,
  }).toISO({ includeOffset: withOffset, suppressMilliseconds: !withMs });
};
const timestampToDateMonthsLaterISOTZ = (
  timestamp,
  monthsLater,
  timezone = "America/Toronto"
) => {
  return timestampToDateISOTZ(
    timestampMonthsLaterTZ(timestamp, monthsLater, timezone)
  );
};

const timestampToDateYearsLaterISOTZ = (
  timestamp,
  yearsLater,
  timezone = "America/Toronto"
) => {
  return timestampToDateISOTZ(
    timestampYearsLaterTZ(timestamp, yearsLater, timezone)
  );
};

//STR
const timestampToHoursStrTZ = (timestamp, timezone, locale = "en-CA") => {
  if (!timestamp) return "";
  const hoursStr = DateTime.fromMillis(timestamp, {
    zone: timezone,
    locale,
  })
    .toISOTime({ suppressSeconds: true })
    .substring(0, 2);
  let hours = parseInt(hoursStr) % 12;
  if (hours === 0) hours = 12;
  return hours.toString().padStart(2, "0");
};
const timestampToMinutesStrTZ = (timestamp, timezone, locale = "en-CA") => {
  if (!timestamp) return "";
  return DateTime.fromMillis(timestamp, {
    zone: timezone,
    locale,
  })
    .toISOTime({ suppressSeconds: true })
    .substring(3, 5);
};
const timestampToAMPMStrTZ = (
  timestamp,
  timezone = "America/Toronto",
  locale = "en-CA"
) => {
  if (!timestamp) return "";
  const hoursStr = DateTime.fromMillis(timestamp, {
    zone: timezone,
    locale,
  })
    .toISOTime({ suppressSeconds: true })
    .substring(0, 2);
  let hours = parseInt(hoursStr);
  return hours >= 12 ? "PM" : "AM";
};

const timestampToTimeStrTZ = (
  timestamp,
  timezone = "America/Toronto",
  locale = "en-CA"
) => {
  if (!timestamp) return "";
  return DateTime.fromMillis(timestamp, {
    zone: timezone,
    locale,
  }).toLocaleString(DateTime.TIME_SIMPLE);
};
const timestampToDateTimeStrTZ = (
  timestamp,
  timezone = "America/Toronto",
  locale = "en-CA"
) => {
  if (!timestamp) return "";
  return DateTime.fromMillis(timestamp, {
    zone: timezone,
    locale,
  }).toLocaleString(DateTime.DATETIME_SHORT);
};
const timestampToDateStrTZ = (
  timestamp,
  timezone = "America/Toronto",
  locale = "en-CA"
) => {
  if (!timestamp) return "";
  return DateTime.fromMillis(timestamp, {
    zone: timezone,
    locale,
  }).toLocaleString(DateTime.DATE_SHORT);
};
const timestampToDateTimeSecondsStrTZ = (
  timestamp,
  timezone = "America/Toronto",
  locale = "en-CA"
) => {
  return DateTime.fromMillis(timestamp, {
    zone: timezone,
    locale,
  }).toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS);
};

//HUMAN
const timestampToHumanDateTimeTZ = (
  timestamp,
  timezone = "America/Toronto",
  locale = "en-CA"
) => {
  return DateTime.fromMillis(timestamp, {
    zone: timezone,
    locale,
  }).toLocaleString({
    weekday: "short",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const timestampToHumanDateTZ = (
  timestamp,
  timezone = "America/Toronto",
  locale = "en-CA"
) => {
  return DateTime.fromMillis(timestamp, {
    zone: timezone,
    locale,
  }).toLocaleString({
    weekday: "short",
    month: "short",
    day: "2-digit",
  });
};

const timestampToHumanDateYearTZ = (
  timestamp,
  timezone = "America/Toronto",
  locale = "en-CA"
) => {
  return DateTime.fromMillis(timestamp, {
    zone: timezone,
    locale,
  }).toLocaleString(DateTime.DATE_FULL);
};

const timestampToHumanTimeTZ = (
  timestamp,
  timezone = "America/Toronto",
  locale = "en-CA"
) => {
  return DateTime.fromMillis(timestamp, {
    zone: timezone,
    locale,
  }).toLocaleString({
    hour: "2-digit",
    minute: "2-digit",
  });
};

const nowHumanTZ = (
  withTime = true,
  timezone = "America/Toronto",
  locale = "en-CA"
) => {
  const currentDateTime = DateTime.local({ zone: timezone });
  // Formater la date et l'heure dans le format désiré avec le fuseau horaire inclus
  if (withTime) {
    const formattedDateTime = currentDateTime.toLocaleString(
      {
        month: "long",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZoneName: "short",
      },
      { locale }
    );
    return formattedDateTime;
  } else {
    const formattedDateTime = currentDateTime.toLocaleString(
      {
        locale,
        month: "long",
        day: "2-digit",
        year: "numeric",
      },
      { locale }
    );
    return formattedDateTime;
  }
};

//TIMESTAMP
const timestampMonthsLaterTZ = (
  timestamp,
  monthsLater,
  timezone = "America/Toronto"
) => {
  return DateTime.fromMillis(timestamp, { zone: timezone })
    .plus({ months: monthsLater })
    .toMillis();
};
const timestampYearsLaterTZ = (
  timestamp,
  yearsLater,
  timezone = "America/Toronto"
) => {
  return DateTime.fromMillis(timestamp, { zone: timezone })
    .plus({ years: yearsLater })
    .toMillis();
};

const dateISOToTimestampTZ = (dateISO, timezone = "America/Toronto") => {
  if (!dateISO) return null;
  return DateTime.fromISO(dateISO, { zone: timezone }).toMillis();
};

const nowTZTimestamp = (timezone = "America/Toronto") => {
  return nowTZ(timezone).toMillis();
};

const tzComponentsToTimestamp = (
  dateStr,
  hoursStr,
  minutesStr,
  ampm,
  timezone = "America/Toronto",
  locale = "en-CA"
) => {
  if (!dateStr) return null;
  const [yearStr, monthStr, dayStr] = dateStr.split("-");
  let hour = parseInt(hoursStr, 10);
  hour = AMPMto24(hour, ampm);
  return DateTime.fromObject(
    {
      year: parseInt(yearStr, 10),
      month: parseInt(monthStr, 10),
      day: parseInt(dayStr, 10),
      hour,
      minute: parseInt(minutesStr),
    },
    {
      zone: timezone,
      locale,
    }
  ).toMillis();
};

const getStartOfTheMonthTZ = (timezone = "America/Toronto") => {
  const now = nowTZ();
  const startOfMonth = now.startOf("month");
  const startOfMonthMidnight = startOfMonth.startOf("day");
  return startOfMonthMidnight.toMillis();
};

const getEndOfTheMonthTZ = (timezone = "America/Toronto") => {
  const now = nowTZ();
  const endOfMonth = now.endOf("month");
  return endOfMonth.toMillis();
};

const getTodayStartTZ = (timezone = "America/Toronto") => {
  return nowTZ().startOf("day").toMillis();
};
const getTomorrowStartTZ = (timezone = "America/Toronto") => {
  return nowTZ().plus({ days: 1 }).startOf("day").toMillis();
};
const getTodayEndTZ = (timezone = "America/Toronto") => {
  return nowTZ().endOf("day").toMillis();
};

//OTHER FUNCTIONS
const getAgeTZ = (dateOfBirthMs, timezone = "America/Toronto") => {
  if (!dateOfBirthMs) return "";
  const dateOfBirth = DateTime.fromMillis(dateOfBirthMs, {
    zone: "America/Toronto",
  });
  const today = DateTime.local({ zone: "America/Toronto" });
  const age = today.diff(dateOfBirth, "years").years;
  return Math.floor(age);
};

const isDateExceededTZ = (
  startMillis,
  duration,
  timezone = "America/Toronto"
) => {
  const startDate = DateTime.fromMillis(startMillis, { zone: timezone });
  const currentDate = DateTime.local({ zone: "America/Toronto" });
  const endDate = startDate.plus(
    Duration.fromObject({
      years: duration.Y,
      months: duration.M,
      weeks: duration.W,
      days: duration.D,
    })
  );
  return currentDate > endDate;
};

const AMPMto24 = (hour, ampm) => {
  if (ampm === "AM") {
    if (hour === 12) return 0;
    else return hour;
  }
  if (ampm === "PM") {
    if (hour === 12) return hour;
    else return hour + 12;
  }
};

const getWeekRange = (firstDayOfTheWeek, timezone = "America/Toronto") => {
  const today = DateTime.local({ zone: timezone });
  let startOfWeek = today
    .startOf("week")
    .plus({ days: firstDayOfTheWeek - today.weekday });
  if (startOfWeek < today) {
    startOfWeek = startOfWeek.plus({ weeks: 1 });
  }
  const endOfWeek = startOfWeek.plus({ weeks: 1 });

  return [startOfWeek.toMillis(), endOfWeek.toMillis()];
};

const getLimitTimestampForAge = (age) => {
  const today = DateTime.local({ zone: "America/Toronto" });
  const birthDate = today.minus({ years: age });
  return birthDate.toMillis();
};

const dateStringToISO = (dateString) => {
  // Ensure the input is a string and has the correct length
  if (typeof dateString !== "string" || dateString.length !== 8) {
    throw new Error(
      "Input must be an 8-character string in the format YYYYMMDD"
    );
  }
  // Extract the year, month, and day parts
  const year = dateString.slice(0, 4);
  const month = dateString.slice(4, 6);
  const day = dateString.slice(6, 8);

  // Combine them with hyphens
  return `${year}-${month}-${day}`;
};

module.exports = {
  nowTZ,
  timestampToDateISOTZ,
  timestampToTimeISOTZ,
  timestampToDateTimeSecondsISOTZ,
  timestampToDateMonthsLaterISOTZ,
  timestampToDateYearsLaterISOTZ,
  timestampToHoursStrTZ,
  timestampToMinutesStrTZ,
  timestampToAMPMStrTZ,
  timestampToTimeStrTZ,
  timestampToDateTimeStrTZ,
  timestampToDateStrTZ,
  timestampToDateTimeSecondsStrTZ,
  timestampToHumanDateTimeTZ,
  timestampToHumanDateTZ,
  timestampToHumanDateYearTZ,
  timestampToHumanTimeTZ,
  nowHumanTZ,
  timestampMonthsLaterTZ,
  timestampYearsLaterTZ,
  dateISOToTimestampTZ,
  nowTZTimestamp,
  tzComponentsToTimestamp,
  getStartOfTheMonthTZ,
  getEndOfTheMonthTZ,
  getTodayStartTZ,
  getTomorrowStartTZ,
  getTodayEndTZ,
  getAgeTZ,
  isDateExceededTZ,
  AMPMto24,
  getWeekRange,
  getLimitTimestampForAge,
  dateStringToISO,
};
