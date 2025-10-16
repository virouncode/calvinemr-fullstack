import { useMediaQuery } from "@mui/material";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  useTopicDelete,
  useTopicPost,
  useTopicPut,
} from "../../../../../hooks/reactquery/mutations/topicMutations";
import { useTopic } from "../../../../../hooks/reactquery/queries/topicQueries";
import useIntersection from "../../../../../hooks/useIntersection";
import {
  DemographicsType,
  MessageAttachmentType,
} from "../../../../../types/api";
import { toPatientName } from "../../../../../utils/names/toPatientName";
import Button from "../../../../UI/Buttons/Button";
import CloseButton from "../../../../UI/Buttons/CloseButton";
import { confirmAlert } from "../../../../UI/Confirm/ConfirmGlobal";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../../UI/Paragraphs/LoadingParagraph";
import EmptyRow from "../../../../UI/Tables/EmptyRow";
import LoadingRow from "../../../../UI/Tables/LoadingRow";
import FakeWindow from "../../../../UI/Windows/FakeWindow";
import NewFax from "../../../Fax/NewFax";
import NewFaxMobile from "../../../Fax/NewFaxMobile";
import NewMessageExternal from "../../../Messaging/External/NewMessageExternal";
import NewMessageExternalMobile from "../../../Messaging/External/NewMessageExternalMobile";
import NewMessage from "../../../Messaging/Internal/NewMessage";
import NewMessageMobile from "../../../Messaging/Internal/NewMessageMobile";
import LetterForm from "./Form/LetterForm";
import LetterItem from "./LetterItem";

type LettersPopUpProps = {
  patientId: number;
  setPopUpVisible: React.Dispatch<React.SetStateAction<boolean>>;
  patientName: string;
  demographicsInfos: DemographicsType;
};

const LettersPopUp = ({
  patientId,
  setPopUpVisible,
  patientName,
  demographicsInfos,
}: LettersPopUpProps) => {
  //HOOKS
  const editCounter = useRef(0);
  const [addVisible, setAddVisible] = useState(false);
  const [errMsgPost, setErrMsgPost] = useState("");
  const isTabletOrMobile = useMediaQuery("(max-width: 1024px)");
  const largeScreen = useMediaQuery("(min-width: 1280px)");

  const {
    data: topicDatas,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = useTopic("LETTERS/REFERRALS", patientId);
  const topicPost = useTopicPost("LETTERS/REFERRALS", patientId);
  const topicPut = useTopicPut("LETTERS/REFERRALS", patientId);
  const topicDelete = useTopicDelete("LETTERS/REFERRALS", patientId);

  //INTERSECTION OBSERVER
  const { rootRef, targetRef } = useIntersection<HTMLDivElement | null>(
    isFetchingNextPage,
    fetchNextPage,
    isFetching
  );
  const [faxVisible, setFaxVisible] = useState(false);
  const [fileToFax, setFileToFax] = useState<
    Partial<MessageAttachmentType> | undefined
  >();
  const [newMessageExternalVisible, setNewMessageExternalVisible] =
    useState(false);
  const [newMessageInternalVisible, setNewMessageInternalVisible] =
    useState(false);
  const [attachmentsToSend, setAttachmentsToSend] = useState<
    Partial<MessageAttachmentType>[] | undefined
  >();

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
    if (!largeScreen) {
      toast.warning("This feature is not optimized for small screens", {
        containerId: "A",
      });
    }
    editCounter.current += 1;
    setAddVisible((v) => !v);
  };

  if (isPending) {
    return (
      <div className="letters">
        <h1 className="letters__title">Patient letters</h1>
        <LoadingParagraph />
      </div>
    );
  }
  if (error) {
    return (
      <div className="letters">
        <h1 className="letters__title">Patient letters</h1>
        <ErrorParagraph errorMsg={error.message} />
      </div>
    );
  }

  const datas = topicDatas?.pages.flatMap((page) => page.items);

  return (
    <div className="letters">
      <h1 className="letters__title">Patient letters</h1>
      {errMsgPost && <ErrorParagraph errorMsg={errMsgPost} />}

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
                      targetRef={targetRef}
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
                !addVisible && <EmptyRow colSpan={6} text="No letters" />}
            {isFetchingNextPage && <LoadingRow colSpan={6} />}
          </tbody>
        </table>
      </div>
      <div className="letters__btn-container">
        <Button onClick={handleAdd} disabled={addVisible} label="Add" />
        <CloseButton onClick={handleClose} />
      </div>

      {addVisible && (
        <FakeWindow
          title={`NEW LETTER/REFERRAL for ${patientName}`}
          width={window.innerWidth}
          height={750}
          x={0}
          y={(window.innerHeight - 750) / 2}
          color={"#848484"}
          setPopUpVisible={setPopUpVisible}
        >
          <LetterForm
            demographicsInfos={demographicsInfos}
            setAddVisible={setAddVisible}
            patientId={patientId}
          />
        </FakeWindow>
      )}
      {faxVisible && (
        <FakeWindow
          title="NEW FAX"
          width={1000}
          height={700}
          x={(window.innerWidth - 1000) / 2}
          y={(window.innerHeight - 700) / 2}
          color={"#848484"}
          setPopUpVisible={setFaxVisible}
        >
          {isTabletOrMobile ? (
            <NewFaxMobile
              setNewVisible={setFaxVisible}
              initialAttachments={fileToFax ? [fileToFax] : []}
              initialSubject="Consult report"
            />
          ) : (
            <NewFax
              setNewVisible={setFaxVisible}
              initialAttachments={fileToFax ? [fileToFax] : []}
              initialSubject="Consult report"
            />
          )}
        </FakeWindow>
      )}
      {newMessageExternalVisible && (
        <FakeWindow
          title="NEW EXTERNAL MESSAGE"
          width={1000}
          height={630}
          x={(window.innerWidth - 1000) / 2}
          y={(window.innerHeight - 630) / 2}
          color="#848484"
          setPopUpVisible={setNewMessageExternalVisible}
        >
          {isTabletOrMobile ? (
            <NewMessageExternalMobile
              setNewVisible={setNewMessageExternalVisible}
              initialAttachments={attachmentsToSend}
              initialRecipients={[
                {
                  id: demographicsInfos.patient_id,
                  name: toPatientName(demographicsInfos),
                  email: demographicsInfos.Email ?? "",
                  phone:
                    demographicsInfos.PhoneNumber.find(
                      ({ _phoneNumberType }) => _phoneNumberType === "C"
                    )?.phoneNumber || "",
                },
              ]}
            />
          ) : (
            <NewMessageExternal
              setNewVisible={setNewMessageExternalVisible}
              initialAttachments={attachmentsToSend}
              initialRecipients={[
                {
                  id: demographicsInfos.patient_id,
                  name: toPatientName(demographicsInfos),
                  email: demographicsInfos.Email ?? "",
                  phone:
                    demographicsInfos.PhoneNumber.find(
                      ({ _phoneNumberType }) => _phoneNumberType === "C"
                    )?.phoneNumber || "",
                },
              ]}
            />
          )}
        </FakeWindow>
      )}
      {newMessageInternalVisible && (
        <FakeWindow
          title="NEW MESSAGE"
          width={1024}
          height={630}
          x={(window.innerWidth - 1024) / 2}
          y={(window.innerHeight - 630) / 2}
          color="#848484"
          setPopUpVisible={setNewMessageInternalVisible}
        >
          {isTabletOrMobile ? (
            <NewMessageMobile
              setNewVisible={setNewMessageInternalVisible}
              initialAttachments={attachmentsToSend}
              initialPatient={{
                id: demographicsInfos.patient_id,
                name: toPatientName(demographicsInfos),
              }}
            />
          ) : (
            <NewMessage
              setNewVisible={setNewMessageInternalVisible}
              initialAttachments={attachmentsToSend}
              initialPatient={{
                id: demographicsInfos.patient_id,
                name: toPatientName(demographicsInfos),
              }}
            />
          )}
        </FakeWindow>
      )}
    </div>
  );
};

export default LettersPopUp;
