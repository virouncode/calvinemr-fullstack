import React from "react";
import { useTopic } from "../../../../hooks/reactquery/queries/topicQueries";
import { useFetchAllPages } from "../../../../hooks/reactquery/useFetchAllPages";
import { lifeStageCT, toCodeTableName } from "../../../../omdDatas/codesTables";
import { FamilyHistoryType } from "../../../../types/api";

type ExportFamHistoryProps = {
  patientId: number;
};

const ExportFamHistory = ({ patientId }: ExportFamHistoryProps) => {
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
    "FAMILY HISTORY",
    patientId
  );

  useFetchAllPages(fetchNextPage, hasNextPage);

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const topicDatas = data.pages.flatMap((page) => page.items);
  return (
    topicDatas.length > 0 && (
      <div style={CARD_STYLE}>
        <p style={TITLE_STYLE}>FAMILY HISTORY</p>
        <div style={CONTENT_STYLE}>
          <ul className="export__list">
            {topicDatas.map((item) => (
              <li className="export__list-item" key={item.id}>
                {toFamHistoryCaption(item)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  );
};

export default ExportFamHistory;

const toFamHistoryCaption = (item: FamilyHistoryType) => {
  if (!item) return "";
  const description = item.ProblemDiagnosisProcedureDescription || "";
  const relative = item.Relationship
    ? `, relative affected: ${item.Relationship}`
    : "";
  const eventDate = item.StartDate ? `, start date: ${item.StartDate}` : "";
  const age = item.AgeAtOnset ? `, age at onset: ${item.AgeAtOnset}` : "";
  const lifeStage = item.LifeStage
    ? ` (${toCodeTableName(lifeStageCT, item.LifeStage)})`
    : "";
  const treatment = item.Treatment ? `, treatment: ${item.Treatment}` : "";
  const notes = item.Notes ? `. Notes: ${item.Notes}` : "";
  return `- ${description}${relative}${eventDate}${age}${lifeStage}${treatment}${notes}`;
};
