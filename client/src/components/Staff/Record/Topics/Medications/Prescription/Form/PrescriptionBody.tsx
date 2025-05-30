import React from "react";
import { MedFormType } from "../../../../../../../types/api";
import AddedMedsList from "./AddedMedsList";

type PrescriptionBodyProps = {
  addedMeds: MedFormType[];
  setAddedMeds: React.Dispatch<React.SetStateAction<MedFormType[]>>;
  freeText: string;
  setFreeText: React.Dispatch<React.SetStateAction<string>>;
};

const PrescriptionBody = ({
  addedMeds,
  setAddedMeds,
  freeText,
  setFreeText,
}: PrescriptionBodyProps) => {
  const handleFreeText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setFreeText(value);
  };
  return (
    <div className="prescription__body">
      <p className="prescription__body-title">Prescription</p>
      <div className="prescription__body-content">
        {addedMeds.length > 0 ? (
          <AddedMedsList addedMeds={addedMeds} setAddedMeds={setAddedMeds} />
        ) : (
          ""
        )}
        <textarea
          className="prescription__body-content-textarea"
          name="freeText"
          value={freeText}
          onChange={handleFreeText}
          placeholder="Free text: for the sake of medication traceability, we recommend that you include medications using either your templates list or the medication form located on the right side. While you can fill in the prescription as free text, please be aware that doing so will not add the medications to the patient's EMR."
        />
      </div>
    </div>
  );
};

export default PrescriptionBody;
