import { useRef, useState } from "react";
import useIntersection from "../../../../../hooks/useIntersection";
import { toPatientName } from "../../../../../utils/names/toPatientName";
import Button from "../../../../UI/Buttons/Button";
import CloseButton from "../../../../UI/Buttons/CloseButton";
import { confirmAlert } from "../../../../UI/Confirm/ConfirmGlobal";
import PaperPlaneIcon from "../../../../UI/Icons/PaperPlaneIcon";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../../UI/Paragraphs/LoadingParagraph";
import EmptyRow from "../../../../UI/Tables/EmptyRow";
import LoadingRow from "../../../../UI/Tables/LoadingRow";
import FakeWindow from "../../../../UI/Windows/FakeWindow";
import NewFax from "../../../Fax/NewFax";
import NewMessageExternal from "../../../Messaging/External/NewMessageExternal";
import NewMessage from "../../../Messaging/Internal/NewMessage";
import LetterForm from "./Form/LetterForm";
import LetterItem from "./LetterItem";

const LettersPU = ({
  topicDatas,
  topicPost,
  topicPut,
  topicDelete,
  isPending,
  error,
  isFetchingNextPage,
  fetchNextPage,
  isFetching,
  patientId,
  setPopUpVisible,
  patientName,
  demographicsInfos,
}) => {
  //HOOKS
  const editCounter = useRef(0);
  const [addVisible, setAddVisible] = useState(false);
  const [errMsgPost, setErrMsgPost] = useState("");

  //INTERSECTION OBSERVER
  const { rootRef, lastItemRef } = useIntersection(
    isFetchingNextPage,
    fetchNextPage,
    isFetching
  );
  const [faxVisible, setFaxVisible] = useState(false);
  const [fileToFax, setFileToFax] = useState(null);
  const [newMessageExternalVisible, setNewMessageExternalVisible] =
    useState(false);
  const [newMessageInternalVisible, setNewMessageInternalVisible] =
    useState(false);
  const [attachmentsToSend, setAttachmentsToSend] = useState(null);

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

  if (isPending) {
    return (
      <>
        <h1 className="letters__title">
          Patient letters <PaperPlaneIcon clickable={false} />
        </h1>
        <LoadingParagraph />
      </>
    );
  }
  if (error) {
    return (
      <>
        <h1 className="letters__title">
          Patient letters <PaperPlaneIcon clickable={false} />
        </h1>
        <ErrorParagraph errorMsg={error.message} />
      </>
    );
  }

  const datas = topicDatas.pages.flatMap((page) => page.items);

  return (
    <>
      <h1 className="letters__title">
        Patient letters <PaperPlaneIcon clickable={false} />
      </h1>
      {errMsgPost && <ErrorParagraph errorMsg={errMsgPost} />}
      <>
        <div className="letters__table-container" ref={rootRef}>
          <table className="letters__table">
            <thead>
              <tr>
                <th>Action</th>
                <th>Name</th>
                <th>File</th>
                <th>Description</th>
                <th>Updated By</th>
                <th>Updated On</th>
              </tr>
            </thead>
            <tbody>
              {datas && datas.length > 0
                ? datas.map((item, index) =>
                    index === datas.length - 1 ? (
                      <LetterItem
                        item={item}
                        key={item.id}
                        editCounter={editCounter}
                        setErrMsgPost={setErrMsgPost}
                        errMsgPost={errMsgPost}
                        lastItemRef={lastItemRef}
                        topicPut={topicPut}
                        topicDelete={topicDelete}
                        setFaxVisible={setFaxVisible}
                        setFileToFax={setFileToFax}
                        setNewMessageInternalVisible={
                          setNewMessageInternalVisible
                        }
                        setNewMessageExternalVisible={
                          setNewMessageExternalVisible
                        }
                        setAttachmentsToSend={setAttachmentsToSend}
                      />
                    ) : (
                      <LetterItem
                        item={item}
                        key={item.id}
                        editCounter={editCounter}
                        setErrMsgPost={setErrMsgPost}
                        errMsgPost={errMsgPost}
                        topicPut={topicPut}
                        topicDelete={topicDelete}
                        setFaxVisible={setFaxVisible}
                        setFileToFax={setFileToFax}
                        setNewMessageInternalVisible={
                          setNewMessageInternalVisible
                        }
                        setNewMessageExternalVisible={
                          setNewMessageExternalVisible
                        }
                        setAttachmentsToSend={setAttachmentsToSend}
                      />
                    )
                  )
                : !isFetchingNextPage &&
                  !addVisible && <EmptyRow colSpan="6" text="No letters" />}
              {isFetchingNextPage && <LoadingRow colSpan="6" />}
            </tbody>
          </table>
        </div>
        <div className="letters__btn-container">
          <Button onClick={handleAdd} disabled={addVisible} label="Add" />
          <CloseButton onClick={handleClose} />
        </div>
      </>
      {addVisible && (
        <FakeWindow
          title={`NEW LETTER/REFERRAL for ${patientName}`}
          width={1300}
          height={750}
          x={(window.innerWidth - 1300) / 2}
          y={(window.innerHeight - 750) / 2}
          color={"#848484"}
          setPopUpVisible={setPopUpVisible}
        >
          <LetterForm
            demographicsInfos={demographicsInfos}
            setAddVisible={setAddVisible}
            patientId={patientId}
            topicPost={topicPost}
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
          color={"#94bae8"}
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
          color="#848484"
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
      {newMessageInternalVisible && (
        <FakeWindow
          title="NEW MESSAGE"
          width={1300}
          height={630}
          x={(window.innerWidth - 1300) / 2}
          y={(window.innerHeight - 630) / 2}
          color="#848484"
          setPopUpVisible={setNewMessageInternalVisible}
        >
          <NewMessage
            setNewVisible={setNewMessageInternalVisible}
            initialAttachments={attachmentsToSend}
            initialPatient={{
              id: demographicsInfos.patient_id,
              name: toPatientName(demographicsInfos),
            }}
          />
        </FakeWindow>
      )}
    </>
  );
};

export default LettersPU;
