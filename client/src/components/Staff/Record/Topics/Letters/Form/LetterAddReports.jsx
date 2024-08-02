
import { useTopic } from "../../../../../../hooks/reactquery/queries/topicQueries";
import useIntersection from "../../../../../../hooks/useIntersection";
import EmptyLi from "../../../../../UI/Lists/EmptyLi";
import LoadingLi from "../../../../../UI/Lists/LoadingLi";
import ErrorParagraph from "../../../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../../../UI/Paragraphs/LoadingParagraph";
import LetterAddReportItem from "./LetterAddReportItem";

const LetterAddReports = ({
  setAttachments,
  reportsAddedIds,
  setReportsAddedIds,
  patientId,
}) => {
  const {
    data: reports,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = useTopic("REPORTS", patientId);
  //INTERSECTION OBSERVER
  const { rootRef, lastItemRef } = useIntersection(
    isFetchingNextPage,
    fetchNextPage,
    isFetching
  );

  if (isPending)
    return (
      <div className="letter__options-reports">
        <LoadingParagraph />
      </div>
    );
  if (error)
    return (
      <div className="letter__options-reports">
        <ErrorParagraph errorMsg={error.message} />
      </div>
    );
  const reportsDatas = reports.pages
    .flatMap((page) => page.items)
    .filter(({ Format }) => Format === "Binary");

  return (
    <div className="letter__options-reports" ref={rootRef}>
      <p className="letter__options-reports-title">Add patient files reports</p>
      <ul className="letter__options-reports-list">
        {reportsDatas.length > 0
          ? reportsDatas.map((report, index) =>
              index === reportsDatas.length - 1 ? (
                <LetterAddReportItem
                  key={report.id}
                  report={report}
                  reportsAddedIds={reportsAddedIds}
                  setReportsAddedIds={setReportsAddedIds}
                  lastItemRef={lastItemRef}
                  setAttachments={setAttachments}
                />
              ) : (
                <LetterAddReportItem
                  key={report.id}
                  report={report}
                  reportsAddedIds={reportsAddedIds}
                  setReportsAddedIds={setReportsAddedIds}
                  setAttachments={setAttachments}
                />
              )
            )
          : !isFetchingNextPage && <EmptyLi text="No patient reports" />}
        {isFetchingNextPage && <LoadingLi />}
      </ul>
    </div>
  );
};

export default LetterAddReports;
