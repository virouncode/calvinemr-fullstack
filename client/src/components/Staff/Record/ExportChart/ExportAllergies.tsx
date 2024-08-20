import React from "react";
import {
  lifeStageCT,
  reactionTypeCT,
  toCodeTableName,
} from "../../../../omdDatas/codesTables";
import { AllergyType } from "../../../../types/api";
import { timestampToDateISOTZ } from "../../../../utils/dates/formatDates";

type ExportAllergiesProps = {
  topicDatas: AllergyType[];
};

const ExportAllergies = ({ topicDatas }: ExportAllergiesProps) => {
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
    backgroundColor: "#2B8C99",
  };
  const CONTENT_STYLE = {
    padding: "10px",
  };
  return (
    <div style={CARD_STYLE}>
      <p style={TITLE_STYLE}>ALLERGIES & ADVERSE REACTIONS</p>
      <div style={CONTENT_STYLE}>
        {topicDatas.length > 0 ? (
          <ul className="export__list">
            {topicDatas.map((item) => (
              <li className="export__list-item" key={item.id}>
                {toAllergyCaption(item)}
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

export default ExportAllergies;

const toAllergyCaption = (item: AllergyType) => {
  if (!item) return "";
  const offendingAgent = item.OffendingAgentDescription
    ? `${item.OffendingAgentDescription}`
    : "";
  const startDate = item.StartDate
    ? `since ${timestampToDateISOTZ(item.StartDate)}`
    : "";
  const lifeStage = item.LifeStage
    ? ` (${toCodeTableName(lifeStageCT, item.LifeStage)})`
    : "";
  const reactionType = item.ReactionType
    ? `. Reaction type: ${toCodeTableName(reactionTypeCT, item.ReactionType)}`
    : "";
  const notes = item.Notes ? `. Notes: ${item.Notes}` : "";
  return `- ${offendingAgent} ${startDate}${lifeStage}${reactionType}${notes}`;
};
