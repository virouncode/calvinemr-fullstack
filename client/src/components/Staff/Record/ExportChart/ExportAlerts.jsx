
import { timestampToDateISOTZ } from "../../../../utils/dates/formatDates";

const ExportAlerts = ({ topicDatas }) => {
  const CARD_STYLE = {
    width: "95%",
    margin: "20px auto",
    border: "solid 1px #cecdcd",
    borderRadius: "6px",
    overflow: "hidden",
    fontFamily: "Lato, Arial,sans-serif",
  };
  const TITLE_STYLE = {
    fontWeight: "bold",
    padding: "10px",
    color: "#FEFEFE",
    backgroundColor: "#2B8C99",
  };
  const CONTENT_STYLE = {
    padding: "10px",
  };
  return (
    <div style={CARD_STYLE}>
      <p style={TITLE_STYLE}>ALERTS & SPECIAL NEEDS</p>
      <div style={CONTENT_STYLE}>
        {topicDatas.length > 0 ? (
          <ul className="export__list">
            {topicDatas.map((item) => (
              <li className="export__list-item" key={item.id}>
                {toAlertCaption(item)}
              </li>
            ))}
          </ul>
        ) : (
          "No alerts"
        )}
      </div>
    </div>
  );
};

export default ExportAlerts;

const toAlertCaption = (item) => {
  const description = item.AlertDescription || "";
  const startDate = item.DateActive
    ? `, date: ${timestampToDateISOTZ(item.DateActive)}`
    : "";
  const endDate = item.EndDate
    ? `, ended: ${timestampToDateISOTZ(item.EndDate)}`
    : "";
  const notes = item.Notes ? `. Notes: ${item.Notes}` : "";
  return `- ${description}${startDate}${endDate}${notes}`;
};
