import { DateTime } from "luxon";

export const getLimitDate = (
  dateOfTest: number,
  validity: { days: number; weeks: number; months: number; years: number }
) => {
  const parsedValidity = validity
    ? {
        days: isNaN(validity.days) ? 0 : validity.days,
        weeks: isNaN(validity.weeks) ? 0 : validity.weeks,
        months: isNaN(validity.months) ? 0 : validity.months,
        years: isNaN(validity.years) ? 0 : validity.years,
      }
    : { days: 0, weeks: 0, months: 0, years: 0 };
  if (
    !dateOfTest ||
    !validity ||
    (parsedValidity.days === 0 &&
      parsedValidity.weeks === 0 &&
      parsedValidity.months === 0 &&
      parsedValidity.years === 0)
  )
    return "N/A";
  const dateOfTestLuxon = DateTime.fromMillis(dateOfTest, {
    zone: "America/Toronto",
  });
  const limitDateLuxon = dateOfTestLuxon.plus(parsedValidity);
  return limitDateLuxon.toFormat("yyyy-MM-dd");
};

export const isTestExpired = (
  dateOfTest: number,
  validity: { days: number; weeks: number; months: number; years: number }
) => {
  const parsedValidity = validity
    ? {
        days: isNaN(validity.days) ? 0 : validity.days,
        weeks: isNaN(validity.weeks) ? 0 : validity.weeks,
        months: isNaN(validity.months) ? 0 : validity.months,
        years: isNaN(validity.years) ? 0 : validity.years,
      }
    : { days: 0, weeks: 0, months: 0, years: 0 };
  if (
    !dateOfTest ||
    !validity ||
    (parsedValidity.days === 0 &&
      parsedValidity.weeks === 0 &&
      parsedValidity.months === 0 &&
      parsedValidity.years === 0)
  )
    return "N/A";
  const dateOfTestLuxon = DateTime.fromMillis(dateOfTest, {
    zone: "America/Toronto",
  });
  const limitDateLuxon = dateOfTestLuxon.plus(parsedValidity);
  const nowLuxon = DateTime.now().setZone("America/Toronto");
  return nowLuxon > limitDateLuxon ? "Y" : "N";
};

export const toValidityText = (validity: {
  days: number;
  weeks: number;
  months: number;
  years: number;
}) => {
  const parsedValidity = validity
    ? {
        days: isNaN(validity.days) ? 0 : validity.days,
        weeks: isNaN(validity.weeks) ? 0 : validity.weeks,
        months: isNaN(validity.months) ? 0 : validity.months,
        years: isNaN(validity.years) ? 0 : validity.years,
      }
    : { days: 0, weeks: 0, months: 0, years: 0 };
  if (
    !validity ||
    (parsedValidity.days === 0 &&
      parsedValidity.weeks === 0 &&
      parsedValidity.months === 0 &&
      parsedValidity.years === 0)
  )
    return "N/A";
  const daysText = parsedValidity.days
    ? parsedValidity.days === 1
      ? `${parsedValidity.days} day`
      : `${parsedValidity.days} days`
    : "";
  const weeksText = parsedValidity.weeks
    ? parsedValidity.weeks === 1
      ? `${parsedValidity.weeks} week`
      : `${parsedValidity.weeks} weeks`
    : "";
  const monthsText = parsedValidity.months
    ? parsedValidity.months === 1
      ? `${parsedValidity.months} month`
      : `${parsedValidity.months} months`
    : "";
  const yearsText = parsedValidity.years
    ? parsedValidity.years === 1
      ? `${parsedValidity.years} year`
      : `${parsedValidity.years} years`
    : "";

  const validTexts = [yearsText, monthsText, weeksText, daysText]
    .filter((text) => text)
    .join(" ");

  return validTexts;
};
