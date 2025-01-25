import React from "react";
import { MedType } from "../../../../../types/api";
import { isMedicationActive } from "../../../../../utils/medications/isMedicationActive";

type MedicationsDropDownProps = {
  data: MedType[];
};

const MedicationsDropDown = ({ data }: MedicationsDropDownProps) => {
  const activeMedications = data?.filter((item) =>
    isMedicationActive(item?.StartDate, item?.duration)
  );
  return (
    <div className="topic-content">
      {activeMedications && activeMedications.length > 0 ? (
        <ul>
          {activeMedications.slice(0, 4).map((item) => (
            <li key={item.id} className="topic-content__item">
              - {item.DrugName} {item.Strength.Amount}{" "}
              {item.Strength.UnitOfMeasure}
            </li>
          ))}
          <li>...</li>
        </ul>
      ) : (
        "No active medications"
      )}
    </div>
  );
};

export default MedicationsDropDown;
