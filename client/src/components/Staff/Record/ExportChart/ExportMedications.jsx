
import { isMedicationActive } from "../../../../utils/medications/isMedicationActive";

const ExportMedications = ({ topicDatas }) => {
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
    backgroundColor: "#931621",
  };
  const CONTENT_STYLE = {
    padding: "10px",
  };
  const activeMeds = topicDatas.filter((item) =>
    isMedicationActive(item.StartDate, item.duration)
  );
  return (
    <div style={CARD_STYLE}>
      <p style={TITLE_STYLE}>ACTIVE MEDICATIONS & TREATMENTS</p>
      <div style={CONTENT_STYLE}>
        {activeMeds.length > 0 ? (
          <ul className="export__list">
            {activeMeds.map((item) => (
              <li className="export__list-item" key={item.id}>
                {toMedicationsCaption(item)}
              </li>
            ))}
          </ul>
        ) : (
          "No active medications"
        )}
      </div>
    </div>
  );
};

export default ExportMedications;

const toMedicationsCaption = (item) => {
  const drugName = item.DrugName || "";
  const prescriptionInstructions = item.PrescriptionInstructions
    ? `, ${item.PrescriptionInstructions}`
    : "";
  return `- ${drugName}${prescriptionInstructions}`;
};
