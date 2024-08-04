import { useState } from "react";
import useIntersection from "../../../../../hooks/useIntersection";
import { toPatientName } from "../../../../../utils/names/toPatientName";
import CloseButton from "../../../../UI/Buttons/CloseButton";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../../UI/Paragraphs/LoadingParagraph";
import EmptyRow from "../../../../UI/Tables/EmptyRow";
import LoadingRow from "../../../../UI/Tables/LoadingRow";
import FakeWindow from "../../../../UI/Windows/FakeWindow";
import NewFax from "../../../Fax/NewFax";
import NewMessageExternal from "../../../Messaging/External/NewMessageExternal";
import PrescriptionItem from "./PrescriptionItem";

const PrescriptionsPU = ({
  topicDatas,
  isPending,
  error,
  setPopUpVisible,
  isFetchingNextPage,
  fetchNextPage,
  isFetching,
  topicDelete,
  demographicsInfos,
}) => {
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
  const [attachmentsToSend, setAttachmentsToSend] = useState(null);

  const handleClose = async () => {
    setPopUpVisible(false);
  };

  if (isPending) {
    return (
      <>
        <h1 className="prescriptions__title">
          Patient prescriptions <i className="fa-regular fa-newspaper"></i>
        </h1>
        <LoadingParagraph />
      </>
    );
  }
  if (error) {
    return (
      <>
        <h1 className="prescriptions__title">
          Patient prescriptions <i className="fa-regular fa-newspaper"></i>
        </h1>
        <ErrorParagraph errorMsg={error.message} />
      </>
    );
  }

  const datas = topicDatas.pages.flatMap((page) => page.items);

  return (
    <>
      <h1 className="prescriptions__title">
        Patient prescriptions <i className="fa-regular fa-newspaper"></i>
      </h1>
      <>
        <div className="prescriptions__table-container" ref={rootRef}>
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
                        topicDelete={topicDelete}
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
                        topicDelete={topicDelete}
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
                    <EmptyRow colSpan="5" text="No past prescriptions" />
                  )}
              {isFetchingNextPage && <LoadingRow colSpan="5" />}
            </tbody>
          </table>
        </div>
        <div className="prescriptions__btn-container">
          <CloseButton onClick={handleClose} />
        </div>
        {faxVisible && (
          <FakeWindow
            title="NEW FAX"
            width={1300}
            height={700}
            x={(window.innerWidth - 1300) / 2}
            y={(window.innerHeight - 700) / 2}
            color="#E3AFCD"
            setPopUpVisible={setFaxVisible}
          >
            <NewFax
              setNewVisible={setFaxVisible}
              initialAttachment={fileToFax}
            />
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
    </>
  );
};

export default PrescriptionsPU;
