import { useRef, useState } from "react";
import {
  useReportsReceived,
  useReportsSent,
} from "../../../../hooks/reactquery/queries/reportsQueries";
import FakeWindow from "../../../UI/Windows/FakeWindow";
import ReportsContent from "../Topics/Reports/ReportsContent";
import ReportsPU from "../Topics/Reports/ReportsPU";
import PatientTopicHeader from "./PatientTopicHeader";

const PatientTopicReports = ({
  backgroundColor,
  textColor,
  patientName,
  patientId,
  contentsVisible,
  side,
  demographicsInfos,
}) => {
  //HOOKS
  const [popUpVisible, setPopUpVisible] = useState(false);
  const containerRef = useRef(null);
  const triangleRef = useRef(null);

  //STYLE
  const TOPIC_STYLE = { color: textColor, background: backgroundColor };

  //DATAS
  const {
    data: reportsReceived,
    isPending: isPendingReportsReceived,
    error: errorReportsReceived,
    isFetchingNextPage: isFetchingNextPageReportsReceived,
    fetchNextPage: fetchNextPageReportsReceived,
    isFetching: isFetchingReportsReceived,
  } = useReportsReceived(patientId);
  const {
    data: reportsSent,
    isPending: isPendingReportsSent,
    error: errorReportsSent,
    isFetchingNextPage: isFetchingNextPageReportsSent,
    fetchNextPage: fetchNextPageReportsSent,
    isFetching: isFetchingReportsSent,
  } = useReportsSent(patientId);

  //HANDLERS
  const handlePopUpClick = (e) => {
    e.stopPropagation();
    setPopUpVisible((v) => !v);
  };

  const handleTriangleClick = (e) => {
    e.stopPropagation();
    e.target.classList.toggle("triangle--active");
    containerRef.current.classList.toggle(
      `patient-record__topic-container--active`
    );
  };

  const handleClickHeader = () => {
    triangleRef.current.classList.toggle("triangle--active");
    containerRef.current.classList.toggle(
      `patient-record__topic-container--active`
    );
  };

  return (
    <div className="patient-record__topic">
      <div
        className={`patient-record__topic-header patient-record__topic-header--${side}`}
        style={TOPIC_STYLE}
        onClick={handleClickHeader}
      >
        <PatientTopicHeader
          topic="REPORTS"
          handleTriangleClick={handleTriangleClick}
          handlePopUpClick={handlePopUpClick}
          contentsVisible={contentsVisible}
          popUpButton="popUp"
          triangleRef={triangleRef}
        />
      </div>
      <div
        className={
          contentsVisible
            ? `patient-record__topic-container patient-record__topic-container--${side} patient-record__topic-container--active`
            : `patient-record__topic-container patient-record__topic-container--${side} `
        }
        ref={containerRef}
      >
        <ReportsContent
          reportsReceived={reportsReceived}
          isPendingReportsReceived={isPendingReportsReceived}
          errorReportsReceived={errorReportsReceived}
          reportsSent={reportsSent}
          isPendingReportsSent={isPendingReportsSent}
          errorReportsSent={errorReportsSent}
        />
        {popUpVisible && (
          <FakeWindow
            title={`REPORTS about ${patientName}`}
            width={1400}
            height={750}
            x={(window.innerWidth - 1400) / 2}
            y={(window.innerHeight - 750) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <ReportsPU
              reportsReceived={reportsReceived}
              isPendingReportsReceived={isPendingReportsReceived}
              errorReportsReceived={errorReportsReceived}
              isFetchingNextPageReportsReceived={
                isFetchingNextPageReportsReceived
              }
              fetchNextPageReportsReceived={fetchNextPageReportsReceived}
              isFetchingReportsReceived={isFetchingReportsReceived}
              reportsSent={reportsSent}
              isPendingReportsSent={isPendingReportsSent}
              errorReportsSent={errorReportsSent}
              isFetchingNextPageReportsSent={isFetchingNextPageReportsSent}
              fetchNextPageReportsSent={fetchNextPageReportsSent}
              isFetchingReportsSent={isFetchingReportsSent}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
              demographicsInfos={demographicsInfos}
            />
          </FakeWindow>
        )}
        {/*******************/}
      </div>
    </div>
  );
};

export default PatientTopicReports;
