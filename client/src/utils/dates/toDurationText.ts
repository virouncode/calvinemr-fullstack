export const toDurationText = (
  y: number,
  m: number,
  w: number,
  d: number,
  type: "Y" | "M" | "W" | "D",
  value: number
) => {
  let yearText = "",
    monthText = "",
    weekText = "",
    daysText = "";

  switch (type) {
    case "Y":
      yearText = value
        ? value === 1
          ? `${value} year `
          : `${value} years `
        : "";
      monthText = m ? (m === 1 ? `${m} month ` : `${m} months `) : "";
      weekText = w ? (w === 1 ? `${w} week ` : `${w} weeks `) : "";
      daysText = d ? (d === 1 ? `${d} day ` : `${d} days `) : "";
      break;

    case "M":
      yearText = y ? (y === 1 ? `${y} year ` : `${y} years `) : "";
      monthText = value
        ? value === 1
          ? `${value} month `
          : `${value} months `
        : "";
      weekText = w ? (w === 1 ? `${w} week ` : `${w} weeks `) : "";
      daysText = d ? (d === 1 ? `${d} day ` : `${d} days `) : "";
      break;

    case "W":
      yearText = y ? (y === 1 ? `${y} year ` : `${y} years `) : "";
      monthText = m ? (m === 1 ? `${m} month ` : `${m} months `) : "";
      weekText = value
        ? value === 1
          ? `${value} week `
          : `${value} weeks `
        : "";
      daysText = d ? (d === 1 ? `${d} day ` : `${d} days `) : "";
      break;
    case "D":
      yearText = y ? (y === 1 ? `${y} year ` : `${y} years `) : "";
      monthText = m ? (m === 1 ? `${m} month ` : `${m} months `) : "";
      weekText = w ? (w === 1 ? `${w} week ` : `${w} weeks `) : "";
      daysText = value
        ? value === 1
          ? `${value} day `
          : `${value} days `
        : "";
      break;
  }
  return yearText + monthText + weekText + daysText;
};
