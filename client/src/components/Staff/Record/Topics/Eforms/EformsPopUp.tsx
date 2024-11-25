import { useState } from "react";

import { useMediaQuery } from "@mui/material";
import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
  UseMutationResult,
} from "@tanstack/react-query";
import React from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import useIntersection from "../../../../../hooks/useIntersection";
import {
  DemographicsType,
  EformType,
  MessageAttachmentType,
  XanoPaginatedType,
} from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
import { toPatientName } from "../../../../../utils/names/toPatientName";
import Button from "../../../../UI/Buttons/Button";
import CloseButton from "../../../../UI/Buttons/CloseButton";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../../UI/Paragraphs/LoadingParagraph";
import EmptyRow from "../../../../UI/Tables/EmptyRow";
import LoadingRow from "../../../../UI/Tables/LoadingRow";
import FakeWindow from "../../../../UI/Windows/FakeWindow";
import NewFax from "../../../Fax/NewFax";
import NewFaxMobile from "../../../Fax/NewFaxMobile";
import NewMessageExternal from "../../../Messaging/External/NewMessageExternal";
import NewMessageExternalMobile from "../../../Messaging/External/NewMessageExternalMobile";
import Eform from "./Eform";
import EformEditPdfViewer from "./EformEditPdfViewer";
import EformItem from "./EformItem";

type EformsPopUpProps = {
  topicDatas: InfiniteData<XanoPaginatedType<EformType>> | undefined;
  topicPost: UseMutationResult<EformType, Error, Partial<EformType>, void>;
  topicPut: UseMutationResult<EformType, Error, EformType, void>;
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
      InfiniteData<XanoPaginatedType<EformType>, unknown>,
      Error
    >
  >;
  isFetching: boolean;
  demographicsInfos: DemographicsType;
};

const EformsPopUp = ({
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
}: EformsPopUpProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const [addVisible, setAddVisible] = useState(false);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [eformToEdit, setEformToEdit] = useState<EformType | undefined>();
  const [editVisible, setEditVisible] = useState(false);
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
    setAddVisible((v) => !v);
  };

  const handleClose = async () => {
    setPopUpVisible(false);
  };

  if (isPending) {
    return (
      <div className="eforms">
        <h1 className="eforms__title">Patient e-forms</h1>
        <LoadingParagraph />
      </div>
    );
  }
  if (error) {
    return (
      <div className="eforms">
        <h1 className="eforms__title">Patient e-forms</h1>
        <ErrorParagraph errorMsg={error.message} />
      </div>
    );
  }

  const datas = topicDatas?.pages.flatMap((page) => page.items);

  return (
    <div className="eforms">
      <h1 className="eforms__title">Patient e-forms</h1>
      <div className="eforms__table-container" ref={divRef}>
        <table className="eforms__table">
          <thead>
            <tr>
              <th>Action</th>
              <th>Name</th>
              <th>Updated By</th>
              <th>Updated On</th>
            </tr>
          </thead>
          <tbody>
            {datas && datas.length > 0
              ? datas.map((item, index) =>
                  index === datas.length - 1 ? (
                    <EformItem
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
                      setEformToEdit={setEformToEdit}
                      setEditVisible={setEditVisible}
                    />
                  ) : (
                    <EformItem
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
                      setEformToEdit={setEformToEdit}
                      setEditVisible={setEditVisible}
                    />
                  )
                )
              : !isFetchingNextPage && (
                  <EmptyRow colSpan={4} text="No e-forms" />
                )}
            {isFetchingNextPage && <LoadingRow colSpan={4} />}
          </tbody>
        </table>
      </div>
      <div className="eforms__btn-container">
        <Button onClick={handleAdd} disabled={addVisible} label="Add" />
        <CloseButton onClick={handleClose} disabled={isLoadingFile} />
      </div>

      {addVisible && (
        <FakeWindow
          title={`NEW E-FORM for ${toPatientName(demographicsInfos)}`}
          width={1000}
          height={800}
          x={(window.innerWidth - 1000) / 2}
          y={(window.innerHeight - 800) / 2}
          color="#29CBD6"
          setPopUpVisible={setAddVisible}
        >
          <Eform
            setAddVisible={setAddVisible}
            demographicsInfos={demographicsInfos}
          />
        </FakeWindow>
      )}
      {editVisible && (
        <FakeWindow
          title={`EDIT E-FORM for ${toPatientName(demographicsInfos)}`}
          width={1000}
          height={800}
          x={(window.innerWidth - 1000) / 2}
          y={(window.innerHeight - 800) / 2}
          color="#29CBD6"
          setPopUpVisible={setEditVisible}
        >
          <EformEditPdfViewer
            url={eformToEdit?.file?.url ?? ""}
            patientId={demographicsInfos.patient_id}
            patientFirstName=""
            patientLastName=""
            fileName={eformToEdit?.name ?? ""}
            setEditVisible={setEditVisible}
            eform={eformToEdit as EformType}
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
          color={"#29CBD6"}
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
          color="#29CBD6"
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

export default EformsPopUp;
