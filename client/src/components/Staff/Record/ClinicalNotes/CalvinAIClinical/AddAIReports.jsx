import { useState } from "react";
import useIntersection from "../../../../../hooks/useIntersection";
import EmptyLi from "../../../../UI/Lists/EmptyLi";
import LoadingLi from "../../../../UI/Lists/LoadingLi";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../../UI/Paragraphs/LoadingParagraph";
import CircularProgressSmall from "../../../../UI/Progress/CircularProgressSmall";
import AddAIReportItem from "./AddAIReportItem";

const AddAIReports = ({
  reports,
  isPending,
  error,
  isFetchingNextPage,
  fetchNextPage,
  isFetching,
  demographicsInfos,
  isLoadingReportText,
  setIsLoadingReportText,
  isLoadingAttachmentText,
  reportsTextToAdd,
  setReportsTextsToAdd,
  msgText,
  setMsgText,
}) => {
  const [reportsAddedIds, setReportsAddedIds] = useState([]);
  //INTERSECTION OBSERVER
  const { rootRef, lastItemRef } = useIntersection(
    isFetchingNextPage,
    fetchNextPage,
    isFetching
  );

  if (isPending)
    return (
      <div className="calvinai-prompt__reports">
        <LoadingParagraph />
      </div>
    );

  if (error)
    return (
      <div className="calvinai-prompt__reports">
        <ErrorParagraph errorMsg={error.message} />
      </div>
    );

  const reportsDatas = reports?.pages?.flatMap((page) => page.items);

  return (
    <div className="calvinai-prompt__reports" ref={rootRef}>
      <p className="calvinai-prompt__reports-title">
        Add reports datas
        {isLoadingReportText && <CircularProgressSmall />}
      </p>
      <ul>
        {reportsDatas && reportsDatas.length > 0
          ? reportsDatas.map((report, index) =>
              index === reportsDatas.length - 1 ? (
                <AddAIReportItem
                  key={report.id}
                  report={report}
                  reportsAddedIds={reportsAddedIds}
                  setReportsAddedIds={setReportsAddedIds}
                  reportsTextToAdd={reportsTextToAdd}
                  setReportsTextsToAdd={setReportsTextsToAdd}
                  demographicsInfos={demographicsInfos}
                  isLoadingReportText={isLoadingReportText}
                  setIsLoadingReportText={setIsLoadingReportText}
                  isLoadingAttachmentText={isLoadingAttachmentText}
                  msgText={msgText}
                  setMsgText={setMsgText}
                  lastItemRef={lastItemRef}
                />
              ) : (
                <AddAIReportItem
                  key={report.id}
                  report={report}
                  reportsAddedIds={reportsAddedIds}
                  setReportsAddedIds={setReportsAddedIds}
                  reportsTextToAdd={reportsTextToAdd}
                  setReportsTextsToAdd={setReportsTextsToAdd}
                  demographicsInfos={demographicsInfos}
                  isLoadingReportText={isLoadingReportText}
                  setIsLoadingReportText={setIsLoadingReportText}
                  isLoadingAttachmentText={isLoadingAttachmentText}
                  msgText={msgText}
                  setMsgText={setMsgText}
                />
              )
            )
          : !isFetchingNextPage && <EmptyLi text="No reports" />}
        {isFetchingNextPage && <LoadingLi />}
      </ul>
    </div>
  );
};

export default AddAIReports;
