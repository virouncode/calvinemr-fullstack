import { isMedicationActive } from "../../../../../utils/medications/isMedicationActive";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import CircularProgressMedium from "../../../../UI/Progress/CircularProgressMedium";

const MedicationsContent = ({ topicDatas, isPending, error }) => {
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
  const datas = topicDatas.pages.flatMap((page) => page.items);
  const activeMedications = datas.filter((item) =>
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

export default MedicationsContent;
