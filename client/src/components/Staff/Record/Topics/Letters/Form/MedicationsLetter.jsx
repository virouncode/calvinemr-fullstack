
import { isMedicationActive } from "../../../../../../utils/medications/isMedicationActive";
import LoadingLi from "../../../../../UI/Lists/LoadingLi";
import EmptyParagraph from "../../../../../UI/Paragraphs/EmptyParagraph";

const MedicationsLetter = ({ datas, isFetchingNextPage }) => {
  const activeMeds = datas.filter((med) =>
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

export default MedicationsLetter;
