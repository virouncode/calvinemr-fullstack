import React from "react";
import AddedMedItem from "./AddedMedItem";
import { MedFormType } from "../../../../../../../types/api";

type AddedMedsListProps = {
  addedMeds: MedFormType[];
  setAddedMeds: React.Dispatch<React.SetStateAction<MedFormType[]>>;
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
