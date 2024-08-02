
import EmptyParagraph from "../../../../../UI/Paragraphs/EmptyParagraph";

const FamilyHistoryLetter = ({ datas, isFetchingNextPage }) => {
  return (
    <div className="letter__record-infos">
      <p className="letter__record-infos-title">FAMILY HISTORY</p>
      {datas && datas.length > 0 ? (
        <ul>
          {datas.map((event) => (
            <li key={event.id} className="letter__record-item">
              - {event.ProblemDiagnosisProcedureDescription} (
              {event.Relationship})
            </li>
          ))}
        </ul>
      ) : (
        !isFetchingNextPage && <EmptyParagraph text="No family history" />
      )}
    </div>
  );
};

export default FamilyHistoryLetter;
