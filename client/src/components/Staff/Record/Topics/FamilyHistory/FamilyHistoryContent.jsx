
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import CircularProgressMedium from "../../../../UI/Progress/CircularProgressMedium";

const FamilyHistoryContent = ({ topicDatas, isPending, error }) => {
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
  return (
    <div className="topic-content">
      {datas && datas.length > 0 ? (
        <ul>
          {datas.slice(0, 4).map((event) => (
            <li key={event.id} className="topic-content__item">
              - {event.ProblemDiagnosisProcedureDescription} (
              {event.Relationship})
            </li>
          ))}
          <li>...</li>
        </ul>
      ) : (
        "No family history"
      )}
    </div>
  );
};

export default FamilyHistoryContent;
