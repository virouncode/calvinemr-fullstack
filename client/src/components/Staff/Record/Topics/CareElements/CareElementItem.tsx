import React from "react";
import {
  CareElementGraphDataType,
  CareElementListItemType,
  CareElementType,
} from "../../../../../types/api";
import { timestampToDateISOTZ } from "../../../../../utils/dates/formatDates";
import {
  cmToFeetAndInches,
  kgToLbs,
} from "../../../../../utils/measurements/measurements";
import Button from "../../../../UI/Buttons/Button";

type CareElementItemProps = {
  careElement: CareElementListItemType;
  results: { Date: number; [key: string]: string | number }[];
  setAddVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setEditVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setCareElementToAdd: React.Dispatch<
    React.SetStateAction<CareElementListItemType>
  >;
  setCareElementToShow: React.Dispatch<
    React.SetStateAction<CareElementListItemType>
  >;
  setCareElementToEdit: React.Dispatch<
    React.SetStateAction<CareElementListItemType>
  >;
  setGraphVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setGraphTopic: React.Dispatch<React.SetStateAction<string>>;
  setGraphData: React.Dispatch<
    React.SetStateAction<
      CareElementGraphDataType[] | CareElementGraphDataType[][]
    >
  >;
  setGraphUnit: React.Dispatch<React.SetStateAction<string | string[]>>;
  careElementsDatas?: CareElementType;
};

const CareElementItem = ({
  careElement,
  results,
  setAddVisible,
  setEditVisible,
  setCareElementToAdd,
  setCareElementToShow,
  setCareElementToEdit,
  setGraphVisible,
  setGraphTopic,
  setGraphData,
  setGraphUnit,
  careElementsDatas,
}: CareElementItemProps) => {
  const lastResults = results.sort((a, b) => b.Date - a.Date)[0];
  const handleEditHistory = () => {
    setEditVisible(true);
    setCareElementToEdit(careElement);
  };
  const handleAddVisible = () => {
    setAddVisible(true);
    setCareElementToAdd(careElement);
  };
  const handleShowGraph = () => {
    setGraphVisible(true);
    setGraphTopic(careElement.key);
    setCareElementToShow(careElement);
    if (
      careElement.key === "E2" ||
      careElement.key === "LH" ||
      careElement.key === "P4"
    ) {
      setGraphData([
        careElementsDatas?.E2 as CareElementGraphDataType[],
        careElementsDatas?.LH as CareElementGraphDataType[],
        careElementsDatas?.P4 as CareElementGraphDataType[],
      ]);
      setGraphUnit(["pmol/L", "IU/L", "ng/ml"]);
    } else {
      setGraphData(results);
      setGraphUnit(careElement.unit);
    }
  };
  return (
    <tr className="care-elements__item">
      <td className="care-elements__item-btn-container">
        {careElement.key !== "bodyMassIndex" &&
          careElement.key !== "bodySurfaceArea" &&
          careElement.key !== "E2" &&
          careElement.key !== "LH" &&
          careElement.key !== "P4" && (
            <>
              <Button label="Add" onClick={handleAddVisible} />
              <Button
                label="Edit history"
                onClick={handleEditHistory}
                disabled={results.length === 0}
              />
            </>
          )}
        <Button
          label="Show graph"
          onClick={handleShowGraph}
          disabled={results.length === 0}
        />
      </td>
      <td>{careElement.name}</td>
      <td>
        {careElement.unit === "lbs"
          ? kgToLbs(lastResults?.[careElement.valueKey] as string)
          : careElement.unit === "ft in"
          ? cmToFeetAndInches(lastResults?.[careElement.valueKey] as string)
          : lastResults?.[careElement.valueKey]}
      </td>
      <td>{timestampToDateISOTZ(lastResults?.Date)}</td>
    </tr>
  );
};

export default CareElementItem;
