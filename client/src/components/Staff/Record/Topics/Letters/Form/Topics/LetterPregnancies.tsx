import React from "react";
import { useTopic } from "../../../../../../../hooks/reactquery/queries/topicQueries";
import { useFetchAllPages } from "../../../../../../../hooks/reactquery/useFetchAllPages";
import { timestampToDateISOTZ } from "../../../../../../../utils/dates/formatDates";
import LoadingLi from "../../../../../../UI/Lists/LoadingLi";
import EmptyParagraph from "../../../../../../UI/Paragraphs/EmptyParagraph";
import ErrorParagraph from "../../../../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../../../../UI/Paragraphs/LoadingParagraph";

type LetterPregnanciesProps = {
  patientId: number;
};

const LetterPregnancies = ({ patientId }: LetterPregnanciesProps) => {
  //Queries
  const {
    data,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useTopic("PREGNANCIES", patientId);

  useFetchAllPages(fetchNextPage, hasNextPage);

  if (isPending) return <LoadingParagraph />;
  if (error) return <ErrorParagraph errorMsg={error.message} />;

  const topicDatas = data.pages.flatMap((page) => page.items);
  return (
    <div className="letter__record-infos">
      <p className="letter__record-infos-title">PREGNANCIES</p>
      {topicDatas.length > 0 ? (
        <ul>
          {topicDatas.map((item) => (
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

export default LetterPregnancies;
