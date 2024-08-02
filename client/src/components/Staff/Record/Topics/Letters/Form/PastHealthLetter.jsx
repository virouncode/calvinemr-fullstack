
import LoadingLi from "../../../../../UI/Lists/LoadingLi";
import EmptyParagraph from "../../../../../UI/Paragraphs/EmptyParagraph";

const PastHealthLetter = ({ datas, isFetchingNextPage }) => {
  return (
    <div className="letter__record-infos">
      <p className="letter__record-infos-title">PAST HEALTH</p>
      {datas && datas.length > 0 ? (
        <ul>
          {datas.map((item) => (
            <li key={item.id} className="letter__record-infos-item">
              - {item.PastHealthProblemDescriptionOrProcedures}
            </li>
          ))}
          {isFetchingNextPage && <LoadingLi />}
        </ul>
      ) : (
        !isFetchingNextPage && <EmptyParagraph text="No past health" />
      )}
    </div>
  );
};

export default PastHealthLetter;
