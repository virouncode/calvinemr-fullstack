import React, { useState } from "react";
import useUserContext from "../../../hooks/context/useUserContext";
import { useReportsInbox } from "../../../hooks/reactquery/queries/reportsQueries";
import useIntersection from "../../../hooks/useIntersection";
import { ReportType } from "../../../types/api";
import { UserStaffType } from "../../../types/app";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../UI/Paragraphs/LoadingParagraph";
import EmptyRow from "../../UI/Tables/EmptyRow";
import LoadingRow from "../../UI/Tables/LoadingRow";
import FakeWindow from "../../UI/Windows/FakeWindow";
import LabLinks from "./LabLinks";
import ReportInboxItem from "./ReportInboxItem";
import ReportsInboxForward from "./ReportsInboxForward";

const ReportsInbox = () => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const [forwardVisible, setForwardVisible] = useState(false);
  const [reportToForwardId, setReportToForwardId] = useState(0);
  const [labLinksVisible, setLabLinksVisible] = useState(false);
  const [errMsgPost, setErrMsgPost] = useState("");
  //Queries
  const {
    data: reports,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = useReportsInbox(user.id);

  //INTERSECTION OBSERVER
  const { divRef, lastItemRef } = useIntersection(
    isFetchingNextPage,
    fetchNextPage,
    isFetching
  );

  if (isPending)
    return (
      <>
        <h3 className="reportsinbox__subtitle">Reports to acknowledge</h3>
        <LoadingParagraph />
      </>
    );
  if (error)
    return (
      <>
        <h3 className="reportsinbox__subtitle">Reports to acknowledge</h3>
        <ErrorParagraph errorMsg={error.message} />
      </>
    );

  const reportsDatas = reports.pages.flatMap((page) => page.items);
  return (
    <>
      <h3 className="reportsinbox__subtitle">Reports to acknowledge</h3>
      {user.access_level === "staff" && user.title === "Doctor" && (
        <div
          className="reportsinbox__results"
          onClick={() => setLabLinksVisible(true)}
        >
          External Results
        </div>
      )}
      {errMsgPost && <ErrorParagraph errorMsg={errMsgPost} />}
      <div className="reportsinbox__table-container" ref={divRef}>
        <table className="reportsinbox__table">
          <thead>
            <tr>
              <th>Action</th>
              <th>Name</th>
              <th>Format</th>
              <th>File extension</th>
              <th>File</th>
              <th>Class</th>
              <th>Sub Class</th>
              <th>Related patient</th>
              <th>Next patient appointment</th>
              <th>Date of document</th>
              <th>Date received</th>
              <th>Author</th>
              <th>Notes</th>
              <th>Updated by</th>
              <th>Updated on</th>
            </tr>
          </thead>
          <tbody>
            {reportsDatas && reportsDatas.length > 0
              ? reportsDatas.map((item, index) =>
                  index === reportsDatas.length - 1 ? (
                    <ReportInboxItem
                      item={item}
                      key={item.id}
                      setForwardVisible={setForwardVisible}
                      forwardVisible={forwardVisible}
                      setReportToForwardId={setReportToForwardId}
                      lastItemRef={lastItemRef}
                      errMsgPost={errMsgPost}
                      setErrMsgPost={setErrMsgPost}
                    />
                  ) : (
                    <ReportInboxItem
                      item={item}
                      key={item.id}
                      setForwardVisible={setForwardVisible}
                      setReportToForwardId={setReportToForwardId}
                      forwardVisible={forwardVisible}
                      errMsgPost={errMsgPost}
                      setErrMsgPost={setErrMsgPost}
                    />
                  )
                )
              : !isFetchingNextPage && (
                  <EmptyRow colSpan={14} text="No inbox reports" />
                )}
            {isFetchingNextPage && <LoadingRow colSpan={14} />}
          </tbody>
        </table>
      </div>

      {forwardVisible && (
        <FakeWindow
          title="FORWARD REPORT"
          width={600}
          height={500}
          x={(window.innerWidth - 600) / 2}
          y={(window.innerHeight - 500) / 2}
          color="#93b5e9"
          setPopUpVisible={setForwardVisible}
        >
          <ReportsInboxForward
            reportToForward={
              reportsDatas.find(
                ({ id }) => id === reportToForwardId
              ) as ReportType
            }
            setForwardVisible={setForwardVisible}
          />
        </FakeWindow>
      )}
      {labLinksVisible && (
        <FakeWindow
          title="LABORATORY RESULTS LINKS"
          width={900}
          height={600}
          x={(window.innerWidth - 900) / 2}
          y={(window.innerHeight - 600) / 2}
          color="#93b5e9"
          setPopUpVisible={setLabLinksVisible}
        >
          <LabLinks />
        </FakeWindow>
      )}
    </>
  );
};

export default ReportsInbox;
