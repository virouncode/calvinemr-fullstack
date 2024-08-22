import React from "react";
import { useTopic } from "../../../../hooks/reactquery/queries/topicQueries";
import { useFetchAllPages } from "../../../../hooks/reactquery/useFetchAllPages";
import { ImmunizationType } from "../../../../types/api";
import { timestampToDateISOTZ } from "../../../../utils/dates/formatDates";

type ExportImmunizationsProps = {
  patientId: number;
};

const ExportImmunizations = ({ patientId }: ExportImmunizationsProps) => {
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
  //Queries
  const { data, isPending, error, fetchNextPage, hasNextPage } = useTopic(
    "IMMUNIZATIONS",
    patientId
  );

  useFetchAllPages(fetchNextPage, hasNextPage);

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const topicDatas = data.pages.flatMap((page) => page.items);
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
const toImmunizationCaption = (item: ImmunizationType) => {
  if (!item) return "";
  const immunizationName = item.ImmunizationName
    ? `${item.ImmunizationName}`
    : "";
  const immunizationType = item.ImmunizationType
    ? ` (${item.ImmunizationType})`
    : "";
  const date = item.Date ? `, date: ${timestampToDateISOTZ(item.Date)}` : "";
  const dose = item.doseNumber ? `, dose#: ${item.doseNumber}` : "";
  return `- ${immunizationName}${immunizationType}${date}${dose}`;
};
