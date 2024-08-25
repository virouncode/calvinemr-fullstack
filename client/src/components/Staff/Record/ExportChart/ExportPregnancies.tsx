import React from "react";
import { useTopic } from "../../../../hooks/reactquery/queries/topicQueries";
import { useFetchAllPages } from "../../../../hooks/reactquery/useFetchAllPages";
import { PregnancyType } from "../../../../types/api";
import { timestampToDateISOTZ } from "../../../../utils/dates/formatDates";

type ExportPregnanciesProps = {
  patientId: number;
};

const ExportPregnancies = ({ patientId }: ExportPregnanciesProps) => {
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
    backgroundColor: "#00BA95",
  };
  const CONTENT_STYLE = {
    padding: "10px",
  };
  //Queries
  const { data, isPending, error, fetchNextPage, hasNextPage } = useTopic(
    "PREGNANCIES",
    patientId
  );

  useFetchAllPages(fetchNextPage, hasNextPage);

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const topicDatas = data.pages.flatMap((page) => page.items);
  return (
    <div style={CARD_STYLE}>
      <p style={TITLE_STYLE}>PREGNANCIES</p>
      <div style={CONTENT_STYLE}>
        {topicDatas.length > 0 ? (
          <ul className="export__list">
            {topicDatas.map((item) => (
              <li className="export__list-item" key={item.id}>
                {toPregnancyCaption(item)}
              </li>
            ))}
          </ul>
        ) : (
          "No pregnancies"
        )}
      </div>
    </div>
  );
};

export default ExportPregnancies;

const toPregnancyCaption = (item: PregnancyType) => {
  if (!item) return "";
  const description = item.description ? `${item.description}` : "";
  const date = item.date_of_event
    ? `. Date: ${timestampToDateISOTZ(item.date_of_event)})`
    : "";
  const termWeeks = item.term_nbr_of_weeks
    ? `. Term: ${item.term_nbr_of_weeks} weeks`
    : "";
  const termDays = item.term_nbr_of_days
    ? ` and ${item.term_nbr_of_days} days`
    : "";
  const premises = item.premises ? `. At ${item.premises}` : "";
  return `- ${description}${date}${termWeeks}${termDays}${premises}`;
};
