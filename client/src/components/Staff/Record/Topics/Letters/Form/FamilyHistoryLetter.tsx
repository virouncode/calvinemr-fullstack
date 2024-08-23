import React from "react";
import { useTopic } from "../../../../../../hooks/reactquery/queries/topicQueries";
import { useFetchAllPages } from "../../../../../../hooks/reactquery/useFetchAllPages";
import EmptyParagraph from "../../../../../UI/Paragraphs/EmptyParagraph";
import ErrorParagraph from "../../../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../../../UI/Paragraphs/LoadingParagraph";

type FamilyHistoryLetterProps = {
  patientId: number;
};

const FamilyHistoryLetter = ({ patientId }: FamilyHistoryLetterProps) => {
  //Queries
  const {
    data,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useTopic("FAMILY HISTORY", patientId);

  useFetchAllPages(fetchNextPage, hasNextPage);

  if (isPending) return <LoadingParagraph />;
  if (error) return <ErrorParagraph errorMsg={error.message} />;
  const topicDatas = data.pages.flatMap((page) => page.items);

  return (
    <div className="letter__record-infos">
      <p className="letter__record-infos-title">FAMILY HISTORY</p>
      {topicDatas.length > 0 ? (
        <ul>
          {topicDatas.map((event) => (
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
