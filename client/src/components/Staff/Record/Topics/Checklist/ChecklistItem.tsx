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
  results: ChecklistType[];
  index: number;
  setHistoryVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setTestHistoryToShow: React.Dispatch<
    React.SetStateAction<ChecklistType[] | null>
  >;
  setAddVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setTestNameToAdd: React.Dispatch<React.SetStateAction<string | null>>;
};

const ChecklistItem = ({
  results,
  index,
  setHistoryVisible,
  setTestHistoryToShow,
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
    setTestHistoryToShow(results);
  };

  return (
    <tr
      style={{
        color: isExpired === "Y" ? "red" : "",
      }}
      className="checklist__item"
    >
      <td className="checklist__item-btn-container">
        <Button label="Add" onClick={handleAddVisible} />
        <Button
          label="Show history"
          onClick={handleShowHistory}
          disabled={results.length === 0}
        />
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
