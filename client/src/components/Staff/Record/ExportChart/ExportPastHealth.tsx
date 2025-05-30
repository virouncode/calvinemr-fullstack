import React from "react";
import { useTopic } from "../../../../hooks/reactquery/queries/topicQueries";
import { useFetchAllPages } from "../../../../hooks/reactquery/useFetchAllPages";
import { lifeStageCT, toCodeTableName } from "../../../../omdDatas/codesTables";
import { PastHealthType } from "../../../../types/api";
import { timestampToDateISOTZ } from "../../../../utils/dates/formatDates";

type ExportPastHealthProps = {
  patientId: number;
};

const ExportPastHealth = ({ patientId }: ExportPastHealthProps) => {
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
    backgroundColor: "#577399",
  };

  const CONTENT_STYLE = {
    padding: "10px",
  };
  //Queries
  const { data, isPending, error, fetchNextPage, hasNextPage } = useTopic(
    "PAST HEALTH",
    patientId
  );

  useFetchAllPages(fetchNextPage, hasNextPage);

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const topicDatas = data.pages.flatMap((page) => page.items);

  return (
    <div style={CARD_STYLE}>
      <p style={TITLE_STYLE}>PAST HEALTH</p>
      <div style={CONTENT_STYLE}>
        {topicDatas.length > 0 ? (
          <ul className="export__list">
            {topicDatas.map((item) => (
              <li className="export__list-item" key={item.id}>
                {toPastHealthCaption(item)}
              </li>
            ))}
          </ul>
        ) : (
          "No past health"
        )}
      </div>
    </div>
  );
};

export default ExportPastHealth;

const toPastHealthCaption = (item: PastHealthType) => {
  if (!item) return "";
  const description = item.PastHealthProblemDescriptionOrProcedures || "";
  const onset = item.OnsetOrEventDate
    ? `, onset date: ${timestampToDateISOTZ(item.OnsetOrEventDate)}`
    : "";
  const lifeStage = item.LifeStage
    ? `, when patient was ${toCodeTableName(lifeStageCT, item.LifeStage)}`
    : "";
  const procedureDate = item.ProcedureDate
    ? `. Procedure date: ${timestampToDateISOTZ(item.ProcedureDate)}`
    : "";
  const resolvedDate = item.ResolvedDate
    ? `. Resolved date: ${timestampToDateISOTZ(item.ResolvedDate)}`
    : "";
  const notes = item.Notes ? `. Notes: ${item.Notes}` : "";
  return `- ${description}${onset}${lifeStage}${procedureDate}${resolvedDate}${notes}`;
};
