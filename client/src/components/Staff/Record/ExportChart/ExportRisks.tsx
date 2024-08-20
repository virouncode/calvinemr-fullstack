import React from "react";
import { lifeStageCT, toCodeTableName } from "../../../../omdDatas/codesTables";
import { RiskFactorType } from "../../../../types/api";
import { timestampToDateISOTZ } from "../../../../utils/dates/formatDates";

type ExportRisksProps = {
  topicDatas: RiskFactorType[];
};

const ExportRisks = ({ topicDatas }: ExportRisksProps) => {
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
    backgroundColor: "#EE0B01",
  };
  const CONTENT_STYLE = {
    padding: "10px",
  };
  return (
    <div style={CARD_STYLE}>
      <p style={TITLE_STYLE}>RISK FACTORS</p>
      <div style={CONTENT_STYLE}>
        {topicDatas.length > 0 ? (
          <ul className="export__list">
            {topicDatas.map((item) => (
              <li className="export__list-item" key={item.id}>
                {toRisksCaption(item)}
              </li>
            ))}
          </ul>
        ) : (
          "No risk factors"
        )}
      </div>
    </div>
  );
};

export default ExportRisks;

const toRisksCaption = (item: RiskFactorType) => {
  if (!item) return "";
  const riskFactor = item.RiskFactor || "";
  const exposure = item.ExposureDetails
    ? `, exposure: ${item.ExposureDetails}`
    : "";
  const age = item.AgeOfOnset
    ? `, when the patient was ${item.AgeOfOnset} year-old`
    : "";
  const lifeStage = item.LifeStage
    ? ` (${toCodeTableName(lifeStageCT, item.LifeStage)})`
    : "";
  const startDate = item.StartDate
    ? `. Started: ${timestampToDateISOTZ(item.StartDate)}`
    : "";
  const endDate = item.EndDate
    ? `. Ended: ${timestampToDateISOTZ(item.EndDate)}`
    : "";
  const notes = item.Notes ? `. Notes: ${item.Notes}` : "";
  return `- ${riskFactor}${exposure}${age}${lifeStage}${startDate}${endDate}${notes}`;
};
