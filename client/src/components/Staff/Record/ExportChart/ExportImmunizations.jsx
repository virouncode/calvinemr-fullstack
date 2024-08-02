
import { timestampToDateISOTZ } from "../../../../utils/dates/formatDates";

const ExportImmunizations = ({ topicDatas }) => {
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
    backgroundColor: "#21201E",
  };
  const CONTENT_STYLE = {
    padding: "10px",
  };
  return (
    <div style={CARD_STYLE}>
      <p style={TITLE_STYLE}>IMMUNIZATIONS</p>
      <div style={CONTENT_STYLE}>
        {topicDatas.length > 0 ? (
          <ul className="export__list">
            {topicDatas.map((item) => (
              <li className="export__list-item" key={item.id}>
                {toImmunizationCaption(item)}
              </li>
            ))}
          </ul>
        ) : (
          "No immunizations"
        )}
      </div>
    </div>
  );
};

export default ExportImmunizations;
const toImmunizationCaption = (item) => {
  const immunizationName = item.ImmunizationName
    ? `${item.ImmunizationName}`
    : "";
  const immunizationType = item.ImmunizationType
    ? ` (${item.ImmunizationType})`
    : "";
  const date = item.Date ? `, date: ${timestampToDateISOTZ(item.Date)}` : "";
  const dose = item.doseNumber ? `, dose#: ${item.item.doseNumber}` : "";
  return `- ${immunizationName}${immunizationType}${date}${dose}`;
};
