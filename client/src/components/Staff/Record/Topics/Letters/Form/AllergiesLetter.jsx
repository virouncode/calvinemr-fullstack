
import LoadingLi from "../../../../../UI/Lists/LoadingLi";
import EmptyParagraph from "../../../../../UI/Paragraphs/EmptyParagraph";

const AllergiesLetter = ({ datas, isFetchingNextPage }) => {
  return (
    <div className="letter__record-infos">
      <p className="letter__record-infos-title">ALLERGIES</p>
      {datas && datas.length > 0 ? (
        <ul>
          {datas.map((item) => (
            <li key={item.id} className="letter__record-infos-item">
              - {item.OffendingAgentDescription}
            </li>
          ))}
          {isFetchingNextPage && <LoadingLi />}
        </ul>
      ) : (
        !isFetchingNextPage && <EmptyParagraph text="No allergies" />
      )}
    </div>
  );
};

export default AllergiesLetter;
