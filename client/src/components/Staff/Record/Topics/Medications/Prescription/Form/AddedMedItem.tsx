import React from "react";
import { MedFormType } from "../../../../../../../types/api";
import TrashIcon from "../../../../../../UI/Icons/TrashIcon";

type AddedMedItemProps = {
  med: MedFormType;
  addedMeds: MedFormType[];
  setAddedMeds: React.Dispatch<React.SetStateAction<MedFormType[]>>;
};

const AddedMedItem = ({ med, addedMeds, setAddedMeds }: AddedMedItemProps) => {
  const handleRemoveFromRx = (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setAddedMeds(addedMeds.filter(({ temp_id }) => temp_id !== med.temp_id));
  };

  const handleChangeItemInstruction = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setAddedMeds(
      addedMeds.map((addedMed) => {
        return addedMed.temp_id === med.temp_id
          ? { ...addedMed, PrescriptionInstructions: value }
          : addedMed;
      })
    );
  };

  return (
    <li className="prescription__item">
      <div>
        <textarea
          className="prescription__item-textarea"
          value={med.PrescriptionInstructions}
          onChange={handleChangeItemInstruction}
        />
        <div style={{ textAlign: "end" }}>
          <TrashIcon onClick={handleRemoveFromRx} />
        </div>
      </div>
    </li>
  );
};

export default AddedMedItem;
