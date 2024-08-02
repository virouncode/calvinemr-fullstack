import { useTopic } from "../../../../../../hooks/reactquery/queries/topicQueries";
import { useFetchAllPages } from "../../../../../../hooks/reactquery/useFetchAllPages";
import ErrorParagraph from "../../../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../../../UI/Paragraphs/LoadingParagraph";
import AllergiesLetter from "./AllergiesLetter";
import FamilyHistoryLetter from "./FamilyHistoryLetter";
import MedicationsLetter from "./MedicationsLetter";
import PastHealthLetter from "./PastHealthLetter";
import PregnanciesLetter from "./PregnanciesLetter";

const LetterRecordInfosItem = ({ topic, patientId }) => {
  const {
    data,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useTopic(topic, patientId);

  useFetchAllPages(fetchNextPage, hasNextPage);

  if (isPending) return <LoadingParagraph />;
  if (error) return <ErrorParagraph errorMsg={error.message} />;

  const topicDatas = data.pages.flatMap((page) => page.items);

  if (isPending) return <LoadingParagraph />;

  return topicDatas && topicDatas.length > 0 ? (
    <div>
      {topic === "PAST HEALTH" && (
        <PastHealthLetter
          datas={topicDatas}
          isFetchingNextPage={isFetchingNextPage}
        />
      )}
      {topic === "FAMILY HISTORY" && (
        <FamilyHistoryLetter
          datas={topicDatas}
          isFetchingNextPage={isFetchingNextPage}
        />
      )}
      {topic === "MEDICATIONS & TREATMENTS" && (
        <MedicationsLetter
          datas={topicDatas}
          isFetchingNextPage={isFetchingNextPage}
        />
      )}
      {topic === "ALLERGIES & ADVERSE REACTIONS" && (
        <AllergiesLetter
          datas={topicDatas}
          isFetchingNextPage={isFetchingNextPage}
        />
      )}
      {topic === "PREGNANCIES" && (
        <PregnanciesLetter
          datas={topicDatas}
          isFetchingNextPage={isFetchingNextPage}
        />
      )}
    </div>
  ) : (
    <div>{`${topic}\nNo ${topic.toLowerCase()}`}</div>
  );
};
export default LetterRecordInfosItem;
