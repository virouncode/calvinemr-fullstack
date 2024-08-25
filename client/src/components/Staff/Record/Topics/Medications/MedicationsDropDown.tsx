import { InfiniteData } from "@tanstack/react-query";
import React from "react";
import { MedType, XanoPaginatedType } from "../../../../../types/api";
import { isMedicationActive } from "../../../../../utils/medications/isMedicationActive";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import CircularProgressMedium from "../../../../UI/Progress/CircularProgressMedium";

type MedicationsDropDownProps = {
  topicDatas: InfiniteData<XanoPaginatedType<MedType>, unknown> | undefined;
  isPending: boolean;
  error: Error | null;
};

const MedicationsDropDown = ({
  topicDatas,
  isPending,
  error,
}: MedicationsDropDownProps) => {
  if (isPending)
    return (
      <div className="topic-content">
        <CircularProgressMedium />
      </div>
    );
  if (error)
    return (
      <div className="topic-content">
        <ErrorParagraph errorMsg={error.message} />
      </div>
    );
  const datas = topicDatas?.pages.flatMap((page) => page.items);
  const activeMedications = datas?.filter((item) =>
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
