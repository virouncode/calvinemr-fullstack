import React from "react";
import { useTopic } from "../../../../../../../hooks/reactquery/queries/topicQueries";
import { useFetchAllPages } from "../../../../../../../hooks/reactquery/useFetchAllPages";
import { isMedicationActive } from "../../../../../../../utils/medications/isMedicationActive";
import LoadingLi from "../../../../../../UI/Lists/LoadingLi";
import EmptyParagraph from "../../../../../../UI/Paragraphs/EmptyParagraph";
import ErrorParagraph from "../../../../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../../../../UI/Paragraphs/LoadingParagraph";

type LetterMedicationsProps = {
  patientId: number;
};

const LetterMedications = ({ patientId }: LetterMedicationsProps) => {
  //Queries
  const {
    data,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useTopic("MEDICATIONS & TREATMENTS", patientId);

  useFetchAllPages(fetchNextPage, hasNextPage);

  if (isPending) return <LoadingParagraph />;
  if (error) return <ErrorParagraph errorMsg={error.message} />;

  const topicDatas = data.pages.flatMap((page) => page.items);
  const activeMeds = topicDatas.filter((med) =>
    isMedicationActive(med.StartDate, med.duration)
  );

  return (
    <div className="letter__record-infos">
      <p className="letter__record-infos-title">ACTIVE MEDICATIONS</p>
      {activeMeds && activeMeds.length > 0 ? (
        <ul>
          {activeMeds.map((medication) => (
            <li key={medication.id} className="letter__record-infos-item">
              - {medication.DrugName} {medication.Strength.Amount}{" "}
              {medication.Strength.UnitOfMeasure}
            </li>
          ))}
          {isFetchingNextPage && <LoadingLi />}
        </ul>
      ) : (
        !isFetchingNextPage && <EmptyParagraph text="No active medications" />
      )}
    </div>
  );
};

export default LetterMedications;
