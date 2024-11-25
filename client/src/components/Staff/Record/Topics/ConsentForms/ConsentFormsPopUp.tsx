import { useMediaQuery } from "@mui/material";
import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
  UseMutationResult,
} from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import useIntersection from "../../../../../hooks/useIntersection";
import {
  ConsentFormType,
  DemographicsType,
  MessageAttachmentType,
  XanoPaginatedType,
} from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
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
import ConsentForm from "./ConsentForm";
import ConsentFormItem from "./ConsentFormItem";

type ConsentFormsPopUpProps = {
  topicDatas: InfiniteData<XanoPaginatedType<ConsentFormType>> | undefined;
  topicPost: UseMutationResult<
    ConsentFormType,
    Error,
    Partial<ConsentFormType>,
    void
  >;
  topicPut: UseMutationResult<ConsentFormType, Error, ConsentFormType, void>;
  topicDelete: UseMutationResult<void, Error, number, void>;
  isPending: boolean;
  error: Error | null;
  patientId: number;
  setPopUpVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isFetchingNextPage: boolean;
  fetchNextPage: (
    options?: FetchNextPageOptions
  ) => Promise<
    InfiniteQueryObserverResult<
      InfiniteData<XanoPaginatedType<ConsentFormType>, unknown>,
      Error
    >
  >;
  isFetching: boolean;
  demographicsInfos: DemographicsType;
};

const ConsentFormsPopUp = ({
  topicDatas,
  topicPost,
  topicPut,
  topicDelete,
  isPending,
  error,
  patientId,
  setPopUpVisible,
  isFetchingNextPage,
  fetchNextPage,
  isFetching,
  demographicsInfos,
}: ConsentFormsPopUpProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const editCounter = useRef(0);
  const [addVisible, setAddVisible] = useState(false);
  const [errMsgPost, setErrMsgPost] = useState("");
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const isTabletOrMobile = useMediaQuery("(max-width: 1024px)");

  //INTERSECTION OBSERVER
  const { divRef, lastItemRef } = useIntersection(
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
  const [attachmentsToSend, setAttachmentsToSend] = useState<
    Partial<MessageAttachmentType>[] | undefined
  >();

  //HANDLERS
  const handleAdd = () => {
    setErrMsgPost("");
    editCounter.current += 1;
    setAddVisible((v) => !v);
  };

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

  if (isPending) {
    return (
      <div className="consentforms">
        <h1 className="consentforms__title">Patient consent forms</h1>
        <LoadingParagraph />
      </div>
    );
  }
  if (error) {
    return (
      <div className="consentforms">
        <h1 className="consentforms__title">Patient consent forms</h1>
        <ErrorParagraph errorMsg={error.message} />
      </div>
    );
  }

  const datas = topicDatas?.pages.flatMap((page) => page.items);

  return (
    <div className="consentforms">
      <h1 className="consentforms__title">Patient consent forms</h1>
      <div className="consentforms__table-container" ref={divRef}>
        <table className="consentforms__table">
          <thead>
            <tr>
              <th>Action</th>
              <th>Name</th>
              <th>File</th>
              <th>Updated By</th>
              <th>Updated On</th>
            </tr>
          </thead>
          <tbody>
            {addVisible && (
              <ConsentForm
                editCounter={editCounter}
                setAddVisible={setAddVisible}
                patientId={patientId}
                setErrMsgPost={setErrMsgPost}
                errMsgPost={errMsgPost}
                topicPost={topicPost}
                setIsLoadingFile={setIsLoadingFile}
                isLoadingFile={isLoadingFile}
              />
            )}
            {datas && datas.length > 0
              ? datas.map((item, index) =>
                  index === datas.length - 1 ? (
                    <ConsentFormItem
                      editCounter={editCounter}
                      item={item}
                      key={item.id}
                      lastItemRef={lastItemRef}
                      topicPut={topicPut}
                      topicDelete={topicDelete}
                      setFaxVisible={setFaxVisible}
                      setFileToFax={setFileToFax}
                      setNewMessageExternalVisible={
                        setNewMessageExternalVisible
                      }
                      setAttachmentsToSend={setAttachmentsToSend}
                      setErrMsgPost={setErrMsgPost}
                      errMsgPost={errMsgPost}
                      setIsLoadingFile={setIsLoadingFile}
                      isLoadingFile={isLoadingFile}
                    />
                  ) : (
                    <ConsentFormItem
                      editCounter={editCounter}
                      item={item}
                      key={item.id}
                      topicPut={topicPut}
                      topicDelete={topicDelete}
                      setFaxVisible={setFaxVisible}
                      setFileToFax={setFileToFax}
                      setNewMessageExternalVisible={
                        setNewMessageExternalVisible
                      }
                      setAttachmentsToSend={setAttachmentsToSend}
                      setErrMsgPost={setErrMsgPost}
                      errMsgPost={errMsgPost}
                      setIsLoadingFile={setIsLoadingFile}
                      isLoadingFile={isLoadingFile}
                    />
                  )
                )
              : !isFetchingNextPage && (
                  <EmptyRow colSpan={4} text="No consent forms" />
                )}
            {isFetchingNextPage && <LoadingRow colSpan={4} />}
          </tbody>
        </table>
      </div>
      <div className="eforms__btn-container">
        <Button onClick={handleAdd} disabled={addVisible} label="Add" />
        <CloseButton onClick={handleClose} disabled={isLoadingFile} />
      </div>
      {faxVisible && (
        <FakeWindow
          title="NEW FAX"
          width={1000}
          height={700}
          x={(window.innerWidth - 1000) / 2}
          y={(window.innerHeight - 700) / 2}
          color="#009DA5"
          setPopUpVisible={setFaxVisible}
        >
          {isTabletOrMobile ? (
            <NewFaxMobile
              setNewVisible={setFaxVisible}
              initialAttachments={fileToFax ? [fileToFax] : []}
            />
          ) : (
            <NewFax
              setNewVisible={setFaxVisible}
              initialAttachments={fileToFax ? [fileToFax] : []}
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
          color="#009DA5"
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
                  email: demographicsInfos.Email,
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
                  email: demographicsInfos.Email,
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
    </div>
  );
};

export default ConsentFormsPopUp;
