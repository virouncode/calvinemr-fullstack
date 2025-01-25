import { useMediaQuery } from "@mui/material";
import React, { useState } from "react";
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
import PrescriptionItem from "./PrescriptionItem";

type PrescriptionsPopUpProps = {
  demographicsInfos: DemographicsType;
  patientId: number;
  setPopUpVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const PrescriptionsPopUp = ({
  demographicsInfos,
  patientId,
  setPopUpVisible,
}: PrescriptionsPopUpProps) => {
  const {
    data: topicDatas,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = useTopic("PAST PRESCRIPTIONS", patientId);
  const topicPost = useTopicPost("PAST PRESCRIPTIONS", patientId);
  const topicPut = useTopicPut("PAST PRESCRIPTIONS", patientId);
  const topicDelete = useTopicDelete("PAST PRESCRIPTIONS", patientId);
  //Intersection observer
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
  const isTabletOrMobile = useMediaQuery("(max-width: 1024px)");

  const handleClose = async () => {
    setPopUpVisible(false);
  };

  if (isPending) {
    return (
      <div className="prescriptions">
        <h1 className="prescriptions__title">Patient prescriptions</h1>
        <LoadingParagraph />
      </div>
    );
  }
  if (error) {
    return (
      <div className="prescriptions">
        <h1 className="prescriptions__title">Patient prescriptions</h1>
        <ErrorParagraph errorMsg={error.message} />
      </div>
    );
  }

  const datas = topicDatas?.pages.flatMap((page) => page.items);

  return (
    <div className="prescriptions">
      <h1 className="prescriptions__title">Patient prescriptions</h1>
      <>
        <div className="prescriptions__table-container" ref={divRef}>
          <table className="prescriptions__table">
            <thead>
              <tr>
                <th>Action</th>
                <th>Name</th>
                <th>Unique ID</th>
                <th>Created By</th>
                <th>Created On</th>
              </tr>
            </thead>
            <tbody>
              {datas && datas.length > 0
                ? datas.map((item, index) =>
                    index === datas.length - 1 ? (
                      <PrescriptionItem
                        item={item}
                        key={item.id}
                        lastItemRef={lastItemRef}
                        setFileToFax={setFileToFax}
                        setFaxVisible={setFaxVisible}
                        setNewMessageExternalVisible={
                          setNewMessageExternalVisible
                        }
                        setAttachmentsToSend={setAttachmentsToSend}
                      />
                    ) : (
                      <PrescriptionItem
                        item={item}
                        key={item.id}
                        setFileToFax={setFileToFax}
                        setFaxVisible={setFaxVisible}
                        setNewMessageExternalVisible={
                          setNewMessageExternalVisible
                        }
                        setAttachmentsToSend={setAttachmentsToSend}
                      />
                    )
                  )
                : !isFetchingNextPage && (
                    <EmptyRow colSpan={5} text="No past prescriptions" />
                  )}
              {isFetchingNextPage && <LoadingRow colSpan={5} />}
            </tbody>
          </table>
        </div>
        <div className="prescriptions__btn-container">
          <CloseButton onClick={handleClose} />
        </div>
        {faxVisible && (
          <FakeWindow
            title="NEW FAX"
            width={1000}
            height={700}
            x={(window.innerWidth - 1000) / 2}
            y={(window.innerHeight - 700) / 2}
            color="#E3AFCD"
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
            color="#E3AFCD"
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
      </>
    </div>
  );
};

export default PrescriptionsPopUp;
