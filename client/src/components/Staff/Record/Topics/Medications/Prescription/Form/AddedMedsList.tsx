import React from "react";
import { MedType } from "../../../../../../../types/api";
import AddedMedItem from "./AddedMedItem";

type AddedMedsListProps = {
  addedMeds: Partial<MedType>[];
  setAddedMeds: React.Dispatch<React.SetStateAction<Partial<MedType>[]>>;
};

const AddedMedsList = ({ addedMeds, setAddedMeds }: AddedMedsListProps) => {
  return (
    <ul className="prescription__list">
      {addedMeds.map((med) => (
        <AddedMedItem
          med={med}
          setAddedMeds={setAddedMeds}
          addedMeds={addedMeds}
          key={med.temp_id}
        />
      ))}
    </ul>
  );
};

export default AddedMedsList;
