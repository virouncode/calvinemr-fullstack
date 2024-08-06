import { useState } from "react";
import useUserContext from "../../../hooks/context/useUserContext";
import { useReportsInbox } from "../../../hooks/reactquery/queries/reportsQueries";
import useIntersection from "../../../hooks/useIntersection";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../UI/Paragraphs/LoadingParagraph";
import EmptyRow from "../../UI/Tables/EmptyRow";
import LoadingRow from "../../UI/Tables/LoadingRow";
import FakeWindow from "../../UI/Windows/FakeWindow";
import LabLinks from "./LabLinks";
import ReportsInboxAssignedPracticianForward from "./ReportsInboxAssignedPracticianForward";
import ReportsInboxItem from "./ReportsInboxItem";

const ReportsInbox = () => {
  //HOOKS
  const { user } = useUserContext();
  const [forwardVisible, setForwardVisible] = useState(false);
  const [reportToForwardId, setReportToForwardId] = useState("0");
  const [labLinksVisible, setLabLinksVisible] = useState(false);
  const [errMsgPost, setErrMsgPost] = useState("");

  const {
    data: reports,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = useReportsInbox(user.id);

  //INTERSECTION OBSERVER
  const { rootRef, lastItemRef } = useIntersection(
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
          className="reportsinbox__lablinks"
          onClick={() => setLabLinksVisible(true)}
        >
          External Results
        </div>
      )}
      {errMsgPost && <ErrorParagraph errorMsg={errMsgPost} />}
      <div className="reportsinbox__table-container" ref={rootRef}>
        <table className="reportsinbox__table">
          <thead>
            <tr>
              <th>Action</th>
              <th>Name</th>
              <th>Format</th>
              <th>File extension and version</th>
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
                    <ReportsInboxItem
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
                    <ReportsInboxItem
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
                  <EmptyRow colSpan="14" text="No inbox reports" />
                )}
            {isFetchingNextPage && <LoadingRow colSpan="14" />}
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
          <ReportsInboxAssignedPracticianForward
            reportToForward={reportsDatas.find(
              ({ id }) => id === parseInt(reportToForwardId)
            )}
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
          <LabLinks setLabLinksVisible={setLabLinksVisible} />
        </FakeWindow>
      )}
    </>
  );
};

export default ReportsInbox;
