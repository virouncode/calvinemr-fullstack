import { DateTime, Duration } from "luxon";
//DATE Date object
//ISO "1984-04-25T23:54:23+UTCOffset"
//STR "1984-04-25, 11:54:23 PM"
//HUMAN "Thursday, Apr 10, 11:54 PM"
//TIMESTAMPS

//DATE
export const nowTZ = (timezone = "America/Toronto") => {
  return DateTime.local({ zone: timezone });
};

//ISO
export const timestampToDateISOTZ = (
  timestamp: number | undefined | null,
  timezone = "America/Toronto",
  locale = "en-CA"
) => {
  if (!timestamp) return "";
  return (
    DateTime.fromMillis(timestamp, {
      zone: timezone,
      locale,
    }).toISODate() || ""
  );
};
export const timestampToTimeISOTZ = (
  timestamp: number | undefined | null,
  timezone = "America/Toronto",
  locale = "en-CA"
) => {
  if (!timestamp) return "";
  return (
    DateTime.fromMillis(timestamp, {
      zone: timezone,
      locale,
    }).toISOTime() || ""
  );
};
export const timestampToDateTimeSecondsISOTZ = (
  timestamp: number | undefined | null,
  withMs = true,
  withOffset = true,
  timezone = "America/Toronto",
  locale = "en-CA"
) => {
  if (!timestamp) return "";
  return (
    DateTime.fromMillis(timestamp, {
      zone: timezone,
      locale,
    }).toISO({ includeOffset: withOffset, suppressMilliseconds: !withMs }) || ""
  );
};
export const timestampToDateMonthsLaterISOTZ = (
  timestamp: number | undefined | null,
  monthsLater: number,
  timezone = "America/Toronto"
) => {
  if (!timestamp) return "";
  return timestampToDateISOTZ(
    timestampMonthsLaterTZ(timestamp, monthsLater, timezone)
  );
};

export const timestampToDateYearsLaterISOTZ = (
  timestamp: number | undefined | null,
  yearsLater: number,
  timezone = "America/Toronto"
) => {
  if (!timestamp) return "";
  return timestampToDateISOTZ(
    timestampYearsLaterTZ(timestamp, yearsLater, timezone)
  );
};

//STR
export const timestampToHoursStrTZ = (
  timestamp: number | undefined | null,
  timezone = "America/Toronto",
  locale = "en-CA"
) => {
  if (!timestamp) return "";
  const hoursStr = DateTime.fromMillis(timestamp, {
    zone: timezone,
    locale,
  })
    .toISOTime({ suppressSeconds: true })
    ?.substring(0, 2);
  let hours = hoursStr ? parseInt(hoursStr) % 12 : 0;
  if (hours === 0) hours = 12;
  return hours.toString().padStart(2, "0");
};
export const timestampToMinutesStrTZ = (
  timestamp: number | undefined | null,
  timezone = "America/Toronto",
  locale = "en-CA"
) => {
  if (!timestamp) return "";
  return (
    DateTime.fromMillis(timestamp, {
      zone: timezone,
      locale,
    })
      .toISOTime({ suppressSeconds: true })
      ?.substring(3, 5) || ""
  );
};
export const timestampToAMPMStrTZ = (
  timestamp: number | undefined | null,
  timezone = "America/Toronto",
  locale = "en-CA"
) => {
  if (!timestamp) return "";
  const hoursStr = DateTime.fromMillis(timestamp, {
    zone: timezone,
    locale,
  })
    .toISOTime({ suppressSeconds: true })
    ?.substring(0, 2);
  const hours = hoursStr ? parseInt(hoursStr) : 0;
  return hours >= 12 ? "PM" : "AM";
};

export const timestampToTimeStrTZ = (
  timestamp: number | undefined | null,
  timezone = "America/Toronto",
  locale = "en-CA"
) => {
  if (!timestamp) return "";
  return DateTime.fromMillis(timestamp, {
    zone: timezone,
    locale,
  }).toLocaleString(DateTime.TIME_SIMPLE);
};
export const timestampToDateTimeStrTZ = (
  timestamp: number | undefined | null,
  timezone = "America/Toronto",
  locale = "en-CA"
) => {
  if (!timestamp) return "";
  return DateTime.fromMillis(timestamp, {
    zone: timezone,
    locale,
  }).toLocaleString(DateTime.DATETIME_SHORT);
};
export const timestampToDateStrTZ = (
  timestamp: number | undefined | null,
  timezone = "America/Toronto",
  locale = "en-CA"
) => {
  if (!timestamp) return "";
  return DateTime.fromMillis(timestamp, {
    zone: timezone,
    locale,
  }).toLocaleString(DateTime.DATE_SHORT);
};
export const timestampToDateTimeSecondsStrTZ = (
  timestamp: number | undefined | null,
  timezone = "America/Toronto",
  locale = "en-CA"
) => {
  if (!timestamp) return "";
  return DateTime.fromMillis(timestamp, {
    zone: timezone,
    locale,
  }).toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS);
};

//HUMAN
export const timestampToHumanDateTimeTZ = (
  timestamp: number | undefined | null,
  timezone = "America/Toronto",
  locale = "en-CA"
) => {
  if (!timestamp) return "";
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
export const timestampToHumanDateTimeSecondsTZ = (
  timestamp: number | undefined | null,
  timezone = "America/Toronto",
  locale = "en-CA"
) => {
  if (!timestamp) return "";
  return DateTime.fromMillis(timestamp, {
    zone: timezone,
    locale,
  }).toLocaleString({
    weekday: "short",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

export const timestampToHumanDateTZ = (
  timestamp: number | undefined | null,
  timezone = "America/Toronto",
  locale = "en-CA"
) => {
  if (!timestamp) return "";
  return DateTime.fromMillis(timestamp, {
    zone: timezone,
    locale,
  }).toLocaleString({
    weekday: "short",
    month: "short",
    day: "2-digit",
  });
};

export const timestampToHumanDateYearTZ = (
  timestamp: number | undefined | null,
  timezone = "America/Toronto",
  locale = "en-CA"
) => {
  if (!timestamp) return "";
  return DateTime.fromMillis(timestamp, {
    zone: timezone,
    locale,
  }).toLocaleString(DateTime.DATE_FULL);
};

export const timestampToHumanTimeTZ = (
  timestamp: number | undefined | null,
  timezone = "America/Toronto",
  locale = "en-CA"
) => {
  if (!timestamp) return "";
  return DateTime.fromMillis(timestamp, {
    zone: timezone,
    locale,
  }).toLocaleString({
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const nowHumanTZ = (
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
export const timestampMonthsLaterTZ = (
  timestamp: number,
  monthsLater: number,
  timezone = "America/Toronto"
) => {
  return DateTime.fromMillis(timestamp, { zone: timezone })
    .plus({ months: monthsLater })
    .toMillis();
};
export const timestampYearsLaterTZ = (
  timestamp: number,
  yearsLater: number,
  timezone = "America/Toronto"
) => {
  return DateTime.fromMillis(timestamp, { zone: timezone })
    .plus({ years: yearsLater })
    .toMillis();
};

export const dateISOToTimestampTZ = (
  dateISO: string | undefined | null,
  timezone = "America/Toronto"
) => {
  if (!dateISO) return null;
  return DateTime.fromISO(dateISO, { zone: timezone }).toMillis();
};

export const nowTZTimestamp = (timezone = "America/Toronto") => {
  return nowTZ(timezone).toMillis();
};

export const todayTZTimestamp = (timezone = "America/Toronto") => {
  return nowTZ(timezone).startOf("day").toMillis();
};

export const tzComponentsToTimestamp = (
  dateStr: string | undefined | null,
  hoursStr: string,
  minutesStr: string,
  ampm: "AM" | "PM",
  timezone = "America/Toronto",
  locale = "en-CA"
) => {
  if (!dateStr) return null;
  const [yearStr, monthStr, dayStr] = dateStr.split("-");
  let hour = hoursStr ? parseInt(hoursStr, 10) : 0;
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

export const getStartOfTheMonthTZ = () => {
  const now = nowTZ();
  const startOfMonth = now.startOf("month");
  const startOfMonthMidnight = startOfMonth.startOf("day");
  return startOfMonthMidnight.toMillis();
};

export const getEndOfTheMonthTZ = () => {
  const now = nowTZ();
  const endOfMonth = now.endOf("month");
  return endOfMonth.toMillis();
};

export const getTodayStartTZ = () => {
  return nowTZ().startOf("day").toMillis();
};
export const getTomorrowStartTZ = () => {
  return nowTZ().plus({ days: 1 }).startOf("day").toMillis();
};
export const getTodayEndTZ = () => {
  return nowTZ().endOf("day").toMillis();
};

//OTHER FUNCTIONS
export const getAgeTZ = (dateOfBirthMs: number | undefined | null) => {
  if (!dateOfBirthMs) return "";
  const dateOfBirth = DateTime.fromMillis(dateOfBirthMs, {
    zone: "America/Toronto",
  });
  const today = DateTime.local({ zone: "America/Toronto" });
  const age = today.diff(dateOfBirth, "years").years;
  return Math.floor(age);
};

export const isDateExceededTZ = (
  startMillis: number | undefined | null,
  duration: { Y: number; M: number; W: number; D: number },
  timezone = "America/Toronto"
) => {
  if (!startMillis) return false;
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

export const AMPMto24 = (hour: number, ampm: "AM" | "PM") => {
  if (ampm === "AM") {
    if (hour === 12) return 0;
    else return hour;
  } else if (ampm === "PM") {
    if (hour === 12) return hour;
    else return hour + 12;
  }
  return hour;
};

export const getWeekRange = (
  firstDayOfTheWeek: number,
  timezone = "America/Toronto"
) => {
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

export const getLimitTimestampForAge = (age: number) => {
  const today = DateTime.local({ zone: "America/Toronto" });
  const birthDate = today.minus({ years: age });
  return birthDate.toMillis();
};

export const dateStringToISO = (dateString: string | undefined | null) => {
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

export const toDayOfCycle = (date: number, lmp: number) => {
  const dateLmp = DateTime.fromMillis(lmp);
  const dateCurrent = DateTime.fromMillis(date);

  // Calculate the difference in days
  const diffInDays = Math.floor(dateCurrent.diff(dateLmp, "days").days) + 1;
  if (diffInDays < 0) return "";
  return diffInDays.toString();
};
