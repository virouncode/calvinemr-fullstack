import React from "react";
import { useTopic } from "../../../../hooks/reactquery/queries/topicQueries";
import { useFetchAllPages } from "../../../../hooks/reactquery/useFetchAllPages";
import { MedType } from "../../../../types/api";
import { isMedicationActive } from "../../../../utils/medications/isMedicationActive";

type ExportMedicationsProps = {
  patientId: number;
};

const ExportMedications = ({ patientId }: ExportMedicationsProps) => {
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
  //Queries
  const { data, isPending, error, fetchNextPage, hasNextPage } = useTopic(
    "MEDICATIONS & TREATMENTS",
    patientId
  );

  useFetchAllPages(fetchNextPage, hasNextPage);

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const topicDatas = data.pages.flatMap((page) => page.items);

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

const toMedicationsCaption = (item: MedType) => {
  if (!item) return "";
  const drugName = item.DrugName || "";
  const prescriptionInstructions = item.PrescriptionInstructions
    ? `, ${item.PrescriptionInstructions}`
    : "";
  return `- ${drugName}${prescriptionInstructions}`;
};
