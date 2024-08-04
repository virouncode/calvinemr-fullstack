import { useRef, useState } from "react";
import {
  useReportDelete,
  useReportPost,
  useReportPut,
} from "../../../../../hooks/reactquery/mutations/reportsMutations";
import useIntersection from "../../../../../hooks/useIntersection";
import { toPatientName } from "../../../../../utils/names/toPatientName";
import { confirmAlert } from "../../../../All/Confirm/ConfirmGlobal";
import CloseButton from "../../../../UI/Buttons/CloseButton";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../../UI/Paragraphs/LoadingParagraph";
import EmptyRow from "../../../../UI/Tables/EmptyRow";
import LoadingRow from "../../../../UI/Tables/LoadingRow";
import FakeWindow from "../../../../UI/Windows/FakeWindow";
import NewFax from "../../../Fax/NewFax";
import NewMessageExternal from "../../../Messaging/External/NewMessageExternal";
import ReportForm from "./ReportForm";
import ReportItemReceived from "./ReportItemReceived";
import ReportItemSent from "./ReportItemSent";

const ReportsPU = ({
  reportsReceived,
  isPendingReportsReceived,
  errorReportsReceived,
  isFetchingNextPageReportsReceived,
  fetchNextPageReportsReceived,
  isFetchingReportsReceived,
  reportsSent,
  isPendingReportsSent,
  errorReportsSent,
  isFetchingNextPageReportsSent,
  fetchNextPageReportsSent,
  isFetchingReportsSent,
  patientId,
  setPopUpVisible,
  demographicsInfos,
}) => {
  //HOOKS
  const editCounter = useRef(0);
  const [addVisible, setAddVisible] = useState(false);
  const [errMsgPost, setErrMsgPost] = useState("");
  const [faxVisible, setFaxVisible] = useState(false);
  const [fileToFax, setFileToFax] = useState(null);
  const [newMessageExternalVisible, setNewMessageExternalVisible] =
    useState(false);
  const [attachmentsToSend, setAttachmentsToSend] = useState(null);

  //INTERSECTION OBSERVER
  const { rootRef: rootReceivedRef, lastItemRef: lastItemReceivedRef } =
    useIntersection(
      isFetchingNextPageReportsReceived,
      fetchNextPageReportsReceived,
      isFetchingReportsReceived
    );
  const { rootRef: rootSentRef, lastItemRef: lastItemSentRef } =
    useIntersection(
      isFetchingNextPageReportsSent,
      fetchNextPageReportsSent,
      isFetchingReportsSent
    );

  const reportPost = useReportPost(patientId);
  const reportPut = useReportPut(patientId);
  const reportDelete = useReportDelete(patientId);

  //HANDLERS
  const handleClose = async () => {
    if (
      editCounter.current === 0 ||
      (editCounter.current > 0 &&
        (await confirmAlert({
          content:
            "Do you really want to close the window ? Your changes will be lost",
        })))
    ) {
      setPopUpVisible(false);
    }
  };

  const handleAdd = () => {
    setErrMsgPost("");
    editCounter.current += 1;
    setAddVisible((v) => !v);
  };

  if (isPendingReportsReceived || isPendingReportsSent) {
    return (
      <>
        <h1 className="reports__title">
          Patient reports <i className="fa-regular fa-folder"></i>
        </h1>
        <LoadingParagraph />
      </>
    );
  }
  if (errorReportsReceived || errorReportsSent) {
    return (
      <>
        <h1 className="reports__title">
          Patient reports <i className="fa-regular fa-folder"></i>
        </h1>
        <ErrorParagraph
          errorMsg={errorReportsReceived?.message || errorReportsSent?.message}
        />
      </>
    );
  }

  const datasReportsReceived = reportsReceived.pages.flatMap(
    (page) => page.items
  );
  const datasReportsSent = reportsSent.pages.flatMap((page) => page.items);

  return (
    <>
      <h1 className="reports__title">
        Patient reports <i className="fa-regular fa-folder"></i>
      </h1>
      {errMsgPost && <div className="reports__err">{errMsgPost}</div>}
      <h2 className="reports__title reports__title--subtitle">Received</h2>
      <div className="reports__table-container" ref={rootReceivedRef}>
        <table className="reports__table">
          <thead>
            <tr>
              <th>Action</th>
              <th>Name</th>
              <th>Format</th>
              <th>File extension and version</th>
              <th>File</th>
              <th>Class</th>
              <th>Subclass</th>
              <th>Date of document</th>
              <th>Date received</th>
              <th>Author</th>
              <th>Reviewed by</th>
              <th>Date reviewed</th>
              <th>Notes</th>
              <th>Updated by</th>
              <th>Updated on</th>
            </tr>
          </thead>
          <tbody>
            {datasReportsReceived && datasReportsReceived.length > 0
              ? datasReportsReceived.map((item, index) =>
                  index === datasReportsReceived.length - 1 ? (
                    <ReportItemReceived
                      item={item}
                      key={item.id}
                      errMsgPost={errMsgPost}
                      setErrMsgPost={setErrMsgPost}
                      reportPut={reportPut}
                      reportDelete={reportDelete}
                      lastItemReceivedRef={lastItemReceivedRef}
                      setFaxVisible={setFaxVisible}
                      setFileToFax={setFileToFax}
                      setNewMessageExternalVisible={
                        setNewMessageExternalVisible
                      }
                      setAttachmentsToSend={setAttachmentsToSend}
                    />
                  ) : (
                    <ReportItemReceived
                      item={item}
                      key={item.id}
                      errMsgPost={errMsgPost}
                      setErrMsgPost={setErrMsgPost}
                      reportPut={reportPut}
                      reportDelete={reportDelete}
                      setFaxVisible={setFaxVisible}
                      setFileToFax={setFileToFax}
                      setNewMessageExternalVisible={
                        setNewMessageExternalVisible
                      }
                      setAttachmentsToSend={setAttachmentsToSend}
                    />
                  )
                )
              : !isFetchingNextPageReportsReceived && (
                  <EmptyRow colSpan="15" text="No reports received" />
                )}
            {isFetchingNextPageReportsReceived && <LoadingRow colSpan="15" />}
          </tbody>
        </table>
      </div>

      <h2 className="reports__title reports__title--subtitle">Sent</h2>
      <div className="reports__table-container" ref={rootSentRef}>
        <table className="reports__table">
          <thead>
            <tr>
              <th>Action</th>
              <th>Name</th>
              <th>Format</th>
              <th>File extension and version</th>
              <th>File</th>
              <th>Class</th>
              <th>Subclass</th>
              <th>Date of document</th>
              <th>Date sent</th>
              <th>Author</th>
              <th>Recipient</th>
              <th>Notes</th>
              <th>Updated by</th>
              <th>Updated on</th>
            </tr>
          </thead>
          <tbody>
            {datasReportsSent && datasReportsSent.length > 0
              ? datasReportsSent.map((item, index) =>
                  index === datasReportsSent.length - 1 ? (
                    <ReportItemSent
                      item={item}
                      key={item.id}
                      lastItemSentRef={lastItemSentRef}
                      errMsgPost={errMsgPost}
                      setErrMsgPost={setErrMsgPost}
                      reportPut={reportPut}
                      reportDelete={reportDelete}
                      setFaxVisible={setFaxVisible}
                      setFileToFax={setFileToFax}
                      setNewMessageExternalVisible={
                        setNewMessageExternalVisible
                      }
                      setAttachmentsToSend={setAttachmentsToSend}
                    />
                  ) : (
                    <ReportItemSent
                      item={item}
                      key={item.id}
                      errMsgPost={errMsgPost}
                      setErrMsgPost={setErrMsgPost}
                      reportPut={reportPut}
                      reportDelete={reportDelete}
                      setFaxVisible={setFaxVisible}
                      setFileToFax={setFileToFax}
                      setNewMessageExternalVisible={
                        setNewMessageExternalVisible
                      }
                      setAttachmentsToSend={setAttachmentsToSend}
                    />
                  )
                )
              : !isFetchingNextPageReportsSent && (
                  <EmptyRow colSpan="15" text="No reports sent" />
                )}
            {isFetchingNextPageReportsSent && <LoadingRow colSpan="15" />}
          </tbody>
        </table>
      </div>
      <div className="reports__btn-container">
        <button disabled={addVisible} onClick={handleAdd}>
          Add
        </button>
        <CloseButton onClick={handleClose} />
      </div>
      {addVisible && (
        <FakeWindow
          title={"ADD TO PATIENT REPORTS"}
          width={1000}
          height={800}
          x={(window.innerWidth - 1000) / 2}
          y={(window.innerHeight - 800) / 2}
          color="#E3AFCD"
          setPopUpVisible={setAddVisible}
        >
          <ReportForm
            patientId={patientId}
            setAddVisible={setAddVisible}
            editCounter={editCounter}
            setErrMsgPost={setErrMsgPost}
            demographicsInfos={demographicsInfos}
            errMsgPost={errMsgPost}
            reportPost={reportPost}
          />
        </FakeWindow>
      )}
      {faxVisible && (
        <FakeWindow
          title="NEW FAX"
          width={1300}
          height={700}
          x={(window.innerWidth - 1300) / 2}
          y={(window.innerHeight - 700) / 2}
          color={"#E3AFCD"}
          setPopUpVisible={setFaxVisible}
        >
          <NewFax setNewVisible={setFaxVisible} initialAttachment={fileToFax} />
        </FakeWindow>
      )}
      {newMessageExternalVisible && (
        <FakeWindow
          title="NEW EXTERNAL MESSAGE"
          width={1300}
          height={630}
          x={(window.innerWidth - 1300) / 2}
          y={(window.innerHeight - 630) / 2}
          color="#E3AFCD"
          setPopUpVisible={setNewMessageExternalVisible}
        >
          <NewMessageExternal
            setNewVisible={setNewMessageExternalVisible}
            initialAttachments={attachmentsToSend}
            initialRecipients={[
              {
                id: demographicsInfos.patient_id,
                name: toPatientName(demographicsInfos),
                email: demographicsInfos.Email,
                phone:
                  demographicsInfos.PhoneNumber.find(
                    ({ _phoneNumberType }) => _phoneNumberType === "C"
                  )?.phoneNumber || "",
              },
            ]}
          />
        </FakeWindow>
      )}
    </>
  );
};

export default ReportsPU;
