import React from "react";
import { ChecklistType } from "../../../../../types/api";
import {
  getLimitDate,
  isTestExpired,
  toValidityText,
} from "../../../../../utils/checklist/checklistUtils";
import { tests } from "../../../../../utils/checklist/splitResults";
import { timestampToDateISOTZ } from "../../../../../utils/dates/formatDates";
import Button from "../../../../UI/Buttons/Button";

type ChecklistItemProps = {
  testName: string;
  results: ChecklistType[];
  index: number;
  setHistoryVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setTestNameToShow: React.Dispatch<React.SetStateAction<string>>;
  setAddVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setTestNameToAdd: React.Dispatch<React.SetStateAction<string | null>>;
};

const ChecklistItem = ({
  testName,
  results,
  index,
  setHistoryVisible,
  setTestNameToShow,
  setAddVisible,
  setTestNameToAdd,
}: ChecklistItemProps) => {
  const lastResult = results?.[0];
  const isExpired = isTestExpired(lastResult?.date, lastResult?.validity);
  const handleAddVisible = () => {
    setAddVisible(true);
    setTestNameToAdd(tests[index].name);
  };
  const handleShowHistory = () => {
    setHistoryVisible(true);
    setTestNameToShow(testName);
  };

  return (
    <tr
      style={{
        color:
          isExpired === "Y"
            ? "red"
            : isExpired === "N" || (isExpired === "N/A" && results.length)
            ? "green"
            : "",
      }}
      className="checklist__item"
    >
      <td className="checklist__item-btn-container">
        <Button label="Add" onClick={handleAddVisible} />
        <Button label="Show history" onClick={handleShowHistory} />
      </td>
      <td>{tests[index].name}</td>
      <td>
        {toValidityText(lastResult?.validity ?? tests[index].defaultValidity)}
      </td>
      <td>{lastResult?.result}</td>
      <td>{timestampToDateISOTZ(lastResult?.date)}</td>
      <td>{getLimitDate(lastResult?.date, lastResult?.validity)}</td>
      <td>{isExpired}</td>
    </tr>
  );
};

export default ChecklistItem;
