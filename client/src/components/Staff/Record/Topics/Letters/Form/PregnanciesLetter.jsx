
import { timestampToDateISOTZ } from "../../../../../../utils/dates/formatDates";
import LoadingLi from "../../../../../UI/Lists/LoadingLi";
import EmptyParagraph from "../../../../../UI/Paragraphs/EmptyParagraph";

const PregnanciesLetter = ({ datas, isFetchingNextPage }) => {
  return (
    <div className="letter__record-infos">
      <p className="letter__record-infos-title">PREGNANCIES</p>
      {datas && datas.length > 0 ? (
        <ul>
          {datas.map((item) => (
            <li key={item.id} className="letter__record-infos-item">
              - {item.description} ({timestampToDateISOTZ(item.date_of_event)})
            </li>
          ))}
          {isFetchingNextPage && <LoadingLi />}
        </ul>
      ) : (
        !isFetchingNextPage && <EmptyParagraph text="No pregnancies" />
      )}
    </div>
  );
};

export default PregnanciesLetter;
