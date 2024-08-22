import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
} from "@tanstack/react-query";
import React, { useState } from "react";
import useIntersection from "../../../../../hooks/useIntersection";
import {
  DemographicsType,
  ReportType,
  XanoPaginatedType,
} from "../../../../../types/api";
import { PromptTextType } from "../../../../../types/app";
import EmptyLi from "../../../../UI/Lists/EmptyLi";
import LoadingLi from "../../../../UI/Lists/LoadingLi";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../../UI/Paragraphs/LoadingParagraph";
import CircularProgressSmall from "../../../../UI/Progress/CircularProgressSmall";
import AddAIReportItem from "./AddAIReportItem";

type AddAIReportsProps = {
  reports: InfiniteData<XanoPaginatedType<ReportType>, unknown> | undefined;
  isPending: boolean;
  error: Error | null;
  isFetchingNextPage: boolean;
  fetchNextPage: (
    options?: FetchNextPageOptions
  ) => Promise<
    InfiniteQueryObserverResult<
      InfiniteData<XanoPaginatedType<ReportType>, unknown>,
      Error
    >
  >;
  isFetching: boolean;
  demographicsInfos: DemographicsType;
  isLoadingReportText: boolean;
  setIsLoadingReportText: React.Dispatch<React.SetStateAction<boolean>>;
  isLoadingAttachmentText: boolean;
  reportsTextToAdd: { id: number; content: string; date_created: number }[];
  setReportsTextsToAdd: React.Dispatch<
    React.SetStateAction<
      { id: number; content: string; date_created: number }[]
    >
  >;
  promptText: PromptTextType;
  setPromptText: React.Dispatch<React.SetStateAction<PromptTextType>>;
};

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
  promptText,
  setPromptText,
}: AddAIReportsProps) => {
  //Hooks
  const [reportsAddedIds, setReportsAddedIds] = useState<number[]>([]);
  //Intersection observer
  const { divRef, lastItemRef } = useIntersection(
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
    <div className="calvinai-prompt__reports" ref={divRef}>
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
                  promptText={promptText}
                  setPromptText={setPromptText}
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
                  promptText={promptText}
                  setPromptText={setPromptText}
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
