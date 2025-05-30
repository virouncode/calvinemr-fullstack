import React from "react";
import { useTopic } from "../../../../hooks/reactquery/queries/topicQueries";
import { useFetchAllPages } from "../../../../hooks/reactquery/useFetchAllPages";
import { getResidualInfo } from "../../../../utils/migration/exports/getResidualInfo";

type ExportPersonalHistoryProps = {
  patientId: number;
};

const ExportPersonalHistory = ({ patientId }: ExportPersonalHistoryProps) => {
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
    backgroundColor: "#495867",
  };
  const CONTENT_STYLE = {
    padding: "10px",
  };
  //Queries
  const { data, isPending, error, fetchNextPage, hasNextPage } = useTopic(
    "PERSONAL HISTORY",
    patientId
  );

  useFetchAllPages(fetchNextPage, hasNextPage);

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const topicDatas = data.pages.flatMap((page) => page.items);

  return (
    <div style={CARD_STYLE}>
      <p style={TITLE_STYLE}>PERSONAL HISTORY</p>
      <div style={CONTENT_STYLE}>
        {topicDatas.length > 0 ? (
          <ul className="export__list">
            <li className="export__list-item">
              - Occupations: {getResidualInfo("Occupations", topicDatas[0])}
            </li>
            <li className="export__list-item">
              - Income: {getResidualInfo("Income", topicDatas[0])}
            </li>
            <li className="export__list-item">
              - Religion: {getResidualInfo("Religion", topicDatas[0])}
            </li>
            <li className="export__list-item">
              - Sexual orientation:{" "}
              {getResidualInfo("SexualOrientation", topicDatas[0])}
            </li>
            <li className="export__list-item">
              - Special diet: {getResidualInfo("SpecialDiet", topicDatas[0])}
            </li>
            <li className="export__list-item">
              - Smoking: {getResidualInfo("Smoking", topicDatas[0])}
            </li>
            <li className="export__list-item">
              - Alcohol: {getResidualInfo("Alcohol", topicDatas[0])}
            </li>
            <li className="export__list-item">
              - Recreational drugs:{" "}
              {getResidualInfo("RecreationalDrugs", topicDatas[0])}
            </li>
          </ul>
        ) : (
          "No personal history"
        )}
      </div>
    </div>
  );
};

export default ExportPersonalHistory;
