import React from "react";
import { useTopic } from "../../../../hooks/reactquery/queries/topicQueries";
import { useFetchAllPages } from "../../../../hooks/reactquery/useFetchAllPages";
import { ProblemListType } from "../../../../types/api";
import { timestampToDateISOTZ } from "../../../../utils/dates/formatDates";

type ExportProblemlistProps = {
  patientId: number;
};

const ExportProblemlist = ({ patientId }: ExportProblemlistProps) => {
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
    backgroundColor: "#316771",
  };
  const CONTENT_STYLE = {
    padding: "10px",
  };
  //Queries
  const { data, isPending, error, fetchNextPage, hasNextPage } = useTopic(
    "PROBLEM LIST",
    patientId
  );

  useFetchAllPages(fetchNextPage, hasNextPage);

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const topicDatas = data.pages.flatMap((page) => page.items);
  return (
    <div style={CARD_STYLE}>
      <p style={TITLE_STYLE}>PROBLEM LIST</p>
      <div style={CONTENT_STYLE}>
        {topicDatas.length > 0 ? (
          <ul className="export__list">
            {topicDatas.map((item) => (
              <li className="export__list-item" key={item.id}>
                {toProblemListCaption(item)}
              </li>
            ))}
          </ul>
        ) : (
          "No problems"
        )}
      </div>
    </div>
  );
};

export default ExportProblemlist;

const toProblemListCaption = (item: ProblemListType) => {
  if (!item) return "";
  const diagnosis = item.ProblemDiagnosisDescription
    ? `Diagnosis: ${item.ProblemDiagnosisDescription}`
    : "";
  const problem = item.ProblemDescription
    ? `. Problem description: ${item.ProblemDescription}`
    : "";
  const status = item.ProblemStatus ? `. Status: ${item.ProblemStatus}` : "";
  const onset = item.OnsetDate
    ? `. Onset: ${timestampToDateISOTZ(item.OnsetDate)}`
    : "";
  const lifeStage = item.LifeStage ? ` (${item.LifeStage})` : "";
  const resolvedDate = item.ResolutionDate
    ? `. Resolved: ${timestampToDateISOTZ(item.ResolutionDate)}`
    : "";
  const notes = item.Notes ? `. Notes: ${item.Notes}` : "";
  return `${diagnosis}${problem}${status}${onset}${lifeStage}${resolvedDate}${notes}`;
};
