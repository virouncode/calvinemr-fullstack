import React from "react";
import { useTopic } from "../../../../../../hooks/reactquery/queries/topicQueries";
import { useFetchAllPages } from "../../../../../../hooks/reactquery/useFetchAllPages";
import LoadingLi from "../../../../../UI/Lists/LoadingLi";
import EmptyParagraph from "../../../../../UI/Paragraphs/EmptyParagraph";
import ErrorParagraph from "../../../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../../../UI/Paragraphs/LoadingParagraph";

type PastHealthLetterProps = {
  patientId: number;
};

const PastHealthLetter = ({ patientId }: PastHealthLetterProps) => {
  //Queries
  const {
    data,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useTopic("PAST HEALTH", patientId);

  useFetchAllPages(fetchNextPage, hasNextPage);

  if (isPending) return <LoadingParagraph />;
  if (error) return <ErrorParagraph errorMsg={error.message} />;
  const topicDatas = data.pages.flatMap((page) => page.items);

  return (
    <div className="letter__record-infos">
      <p className="letter__record-infos-title">PAST HEALTH</p>
      {topicDatas.length > 0 ? (
        <ul>
          {topicDatas.map((item) => (
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
