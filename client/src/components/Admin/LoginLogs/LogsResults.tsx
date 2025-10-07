import React from "react";
import { useLogs } from "../../../hooks/reactquery/queries/logsQueries";
import useIntersection from "../../../hooks/useIntersection";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../UI/Paragraphs/LoadingParagraph";
import LoadingRow from "../../UI/Tables/LoadingRow";
import LogResultItem from "./LogResultItem";

type LogsResultsProps = {
  debouncedSearch: string;
  rangeStart: number;
  rangeEnd: number;
};

const LogsResults = ({
  debouncedSearch,
  rangeStart,
  rangeEnd,
}: LogsResultsProps) => {
  //Queries
  const {
    data,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = useLogs(debouncedSearch, rangeStart, rangeEnd);

  //Intersection observer
  const { rootRef, targetRef } = useIntersection<HTMLDivElement | null>(
    isFetchingNextPage,
    fetchNextPage,
    isFetching
  );
  if (isPending) return <LoadingParagraph />;
  if (error) return <ErrorParagraph errorMsg={error.message} />;

  const logsDatas = data.pages.flatMap((page) => page.items);

  return (
    data && (
      <div className="logs__table-container" ref={rootRef}>
        <table className="logs__table">
          <thead>
            <tr>
              <th>Date</th>
              <th>User ID</th>
              <th>User name</th>
              <th>User type</th>
              <th>IP Address</th>
            </tr>
          </thead>
          <tbody>
            {logsDatas.map((log, index) =>
              index === logsDatas.length - 1 ? (
                <LogResultItem log={log} key={log.id} lastLogRef={targetRef} />
              ) : (
                <LogResultItem log={log} key={log.id} />
              )
            )}
            {isFetchingNextPage && <LoadingRow colSpan={4} />}
          </tbody>
        </table>
      </div>
    )
  );
};

export default LogsResults;
