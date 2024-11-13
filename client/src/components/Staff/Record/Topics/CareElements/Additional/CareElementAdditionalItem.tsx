import { UseMutationResult } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  CareElementAdditionalType,
  CareElementType,
} from "../../../../../../types/api";
import { timestampToDateISOTZ } from "../../../../../../utils/dates/formatDates";
import Button from "../../../../../UI/Buttons/Button";
import { confirmAlert } from "../../../../../UI/Confirm/ConfirmGlobal";

type CareElementAdditionalItemProps = {
  results: CareElementAdditionalType;
  setGraphAdditionalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setGraphAdditionalData: React.Dispatch<CareElementAdditionalType>;
  setCareElementAdditionalToAdd: React.Dispatch<
    React.SetStateAction<{
      Name: string;
      Unit: string;
    }>
  >;
  setAddAdditionalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setCareElementAdditionalToEdit: React.Dispatch<
    React.SetStateAction<{
      Name: string;
      Unit: string;
    }>
  >;
  setEditAdditionalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  careElementsDatas: CareElementType;
  topicPut: UseMutationResult<CareElementType, Error, CareElementType, void>;
};

const CareElementAdditionalItem = ({
  results,
  setGraphAdditionalVisible,
  setGraphAdditionalData,
  setCareElementAdditionalToAdd,
  setAddAdditionalVisible,
  setCareElementAdditionalToEdit,
  setEditAdditionalVisible,
  careElementsDatas,
  topicPut,
}: CareElementAdditionalItemProps) => {
  const [progress, setProgress] = useState(false);
  const lastResults = results.Data.sort((a, b) => b.Date - a.Date)[0];
  const handleEditHistory = () => {
    setCareElementAdditionalToEdit({
      Name: results.Name,
      Unit: results.Unit,
    });
    setEditAdditionalVisible(true);
  };
  const handleAddVisible = () => {
    setAddAdditionalVisible(true);
    setCareElementAdditionalToAdd({
      Name: results.Name,
      Unit: results.Unit,
    });
  };
  const handleShowGraph = () => {
    setGraphAdditionalVisible(true);
    setGraphAdditionalData(results);
  };
  const handleRemoveItem = async () => {
    if (
      await confirmAlert({ content: "Do you really want to remove this item?" })
    ) {
      const topicToPut = {
        ...careElementsDatas,
        Additional: careElementsDatas.Additional.filter(
          (item) => item.Name !== results.Name
        ),
      };
      setProgress(true);
      topicPut.mutate(topicToPut, {
        onSettled: () => {
          setProgress(false);
        },
      });
    }
  };
  return (
    <tr className="care-elements__item">
      <td className="care-elements__item-btn-container">
        <Button label="Add" onClick={handleAddVisible} disabled={progress} />
        <Button
          label="Edit history"
          onClick={handleEditHistory}
          disabled={results.Data.length === 0 || progress}
        />
        <Button
          label="Show graph"
          onClick={handleShowGraph}
          disabled={
            results.Data.length === 0 ||
            isNaN(parseFloat(results.Data?.[0].Value)) ||
            progress
          }
        />
        <Button
          label="Remove item"
          onClick={handleRemoveItem}
          disabled={progress}
        />
      </td>
      <td>
        {results.Name} {results.Unit ? `(${results.Unit})` : ""}
      </td>
      <td>{lastResults.Value}</td>
      <td>{timestampToDateISOTZ(lastResults.Date)}</td>
    </tr>
  );
};

export default CareElementAdditionalItem;
