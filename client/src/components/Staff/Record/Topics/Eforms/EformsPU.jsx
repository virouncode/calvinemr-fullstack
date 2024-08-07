import { PDFDocument } from "pdf-lib";
import { useState } from "react";
import { toast } from "react-toastify";

import xanoPost from "../../../../../api/xanoCRUD/xanoPost";
import useUserContext from "../../../../../hooks/context/useUserContext";
import useIntersection from "../../../../../hooks/useIntersection";
import { nowTZTimestamp } from "../../../../../utils/dates/formatDates";
import { toPatientName } from "../../../../../utils/names/toPatientName";
import Button from "../../../../UI/Buttons/Button";
import CloseButton from "../../../../UI/Buttons/CloseButton";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../../UI/Paragraphs/LoadingParagraph";
import EmptyRow from "../../../../UI/Tables/EmptyRow";
import LoadingRow from "../../../../UI/Tables/LoadingRow";
import FakeWindow from "../../../../UI/Windows/FakeWindow";
import NewFax from "../../../Fax/NewFax";
import NewMessageExternal from "../../../Messaging/External/NewMessageExternal";
import Eform from "./Eform";
import EformEditPdfViewer from "./EformEditPdfViewer";
import EformItem from "./EformItem";

const EformsPU = ({
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
}) => {
  //HOOKS
  const { user } = useUserContext();
  const [addVisible, setAddVisible] = useState(false);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [eformToEdit, setEformToEdit] = useState(false);
  const [editVisible, setEditVisible] = useState(false);

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

  //HANDLERS
  const handleAdd = () => {
    setAddVisible((v) => !v);
  };

  const handleClose = async () => {
    setPopUpVisible(false);
  };

  const handleAddToRecord = (e) => {
    let input = e.nativeEvent.view.document.createElement("input");
    input.type = "file";
    input.accept = ".jpeg, .jpg, .png, .gif, .tif, .pdf, .svg";
    input.onchange = (e) => {
      // getting a hold of the file reference
      let file = e.target.files[0];
      if (file.size > 25000000) {
        toast.error("The file is over 25Mb, please choose another one", {
          containerId: "A",
        });
        return;
      }
      setIsLoadingFile(true);
      // setting up the reader`
      let reader = new FileReader();
      reader.readAsDataURL(file);
      // here we tell the reader what to do when it's done reading...
      reader.onload = async (e) => {
        let content = e.target.result;
        const response = await xanoPost("/upload/attachment", "staff", {
          content,
        });
        //flatten the pdf
        const formUrl = `${import.meta.env.VITE_XANO_BASE_URL}${response.path}`;
        const formPdfBytes = await fetch(formUrl).then((res) =>
          res.arrayBuffer()
        );
        const pdfDoc = await PDFDocument.load(formPdfBytes);
        const form = pdfDoc.getForm();
        form.flatten();
        const pdfBytes = await pdfDoc.save();
        //read the new flattened pdf
        let reader2 = new FileReader();
        reader2.readAsDataURL(
          new Blob([pdfBytes], { type: "application/pdf" })
        );
        // here we tell the reader what to do when it's done reading...
        reader2.onload = async (e) => {
          let content = e.target.result;

          const response2 = await xanoPost("/upload/attachment", "staff", {
            content,
          });
          const topicToPost = {
            patient_id: patientId,
            name: file.name,
            file: response2,
            date_created: nowTZTimestamp(),
            created_by_id: user.id,
          };
          topicPost.mutate(topicToPost, {
            onSuccess: () => {
              setIsLoadingFile(false);
              setAddVisible(false);
            },
            onError: () => {
              setIsLoadingFile(false);
            },
          });
        };
      };
    };
    input.click();
  };

  if (isPending) {
    return (
      <>
        <h1 className="eforms__title">Patient e-forms</h1>
        <LoadingParagraph />
      </>
    );
  }
  if (error) {
    return (
      <>
        <h1 className="eforms__title">Patient e-forms</h1>
        <ErrorParagraph errorMsg={error.message} />
      </>
    );
  }

  const datas = topicDatas.pages.flatMap((page) => page.items);

  return (
    <>
      <h1 className="eforms__title">Patient e-forms</h1>
      <>
        <div className="eforms__table-container" ref={rootRef}>
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
                    <EmptyRow colSpan="4" text="No e-forms" />
                  )}
              {isFetchingNextPage && <LoadingRow colSpan="4" />}
            </tbody>
          </table>
        </div>
        <div className="eforms__btn-container">
          <Button onClick={handleAdd} disabled={addVisible} label="Add" />
          <CloseButton onClick={handleClose} disabled={isLoadingFile} />
        </div>
      </>
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
            patientId={patientId}
            handleAddToRecord={handleAddToRecord}
            isLoadingFile={isLoadingFile}
            setIsLoadingFile={setIsLoadingFile}
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
            url={eformToEdit.file?.url}
            patientId={demographicsInfos.patient_id}
            patientFirstName=""
            patientLastName=""
            fileName={eformToEdit.name}
            setEditVisible={setEditVisible}
            eform={eformToEdit}
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
          color="#29CBD6"
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

export default EformsPU;
