import React, { useState } from "react";
import NewWindow from "react-new-window";
import { useReportPost } from "../../../../hooks/reactquery/mutations/reportsMutations";
import {
  DemographicsType,
  MessageAttachmentType,
  MessageExternalType,
} from "../../../../types/api";
import Button from "../../../UI/Buttons/Button";
import XmarkIcon from "../../../UI/Icons/XmarkIcon";
import FakeWindow from "../../../UI/Windows/FakeWindow";
import ReportForm from "../../Record/Topics/Reports/ReportForm";
import ReportFormMultiplePatients from "../../Record/Topics/Reports/ReportFormMultiplePatients";

type MessageExternalAttachmentCardProps = {
  attachment: MessageAttachmentType;
  deletable?: boolean;
  cardWidth?: string;
  addable?: boolean;
  patientsNames: string[];
  message: MessageExternalType;
  handleRemoveAttachment?: (attachmentName: string) => void;
};

const MessageExternalAttachmentCard = ({
  attachment,
  deletable,
  cardWidth,
  addable,
  patientsNames,
  message,
  handleRemoveAttachment,
}: MessageExternalAttachmentCardProps) => {
  //Hooks
  const [popUpVisible, setPopUpVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [errMsgPost, setErrMsgPost] = useState("");
  //Queries
  const reportPost = useReportPost();

  const handleImgClick = () => {
    setPopUpVisible(true);
  };

  const handleAddToReports = () => {
    setAddVisible(true);
  };

  return (
    <>
      <div
        className="message__attachment-card"
        style={{ width: cardWidth ?? "" }}
      >
        <div className="message__attachment-card-thumbnail">
          {attachment.file?.mime.includes("image") ? (
            <img
              src={`${import.meta.env.VITE_XANO_BASE_URL}${
                attachment.file?.path
              }`}
              alt="attachment thumbnail"
              width="100%"
              onClick={handleImgClick}
            />
          ) : attachment.file?.mime.includes("video") ? (
            <video onClick={handleImgClick} width="100%">
              <source
                src={`${import.meta.env.VITE_XANO_BASE_URL}${
                  attachment.file?.path
                }`}
                type={attachment.file?.mime}
              />
            </video>
          ) : attachment.file?.mime.includes("officedocument") ? (
            <div>
              <div
                style={{ color: "blue", fontSize: "0.8rem" }}
                onClick={handleImgClick}
              >
                Preview document
              </div>{" "}
              <iframe
                title="office document"
                src={`https://docs.google.com/gview?url=${
                  import.meta.env.VITE_XANO_BASE_URL
                }${attachment.file?.path}&embedded=true&widget=false`}
                onClick={handleImgClick}
                width="150%"
                frameBorder="0"
              ></iframe>
            </div>
          ) : (
            <div>
              <iframe
                id="thumbnail-doc"
                title={attachment.alias}
                src={`${import.meta.env.VITE_XANO_BASE_URL}${
                  attachment.file?.path
                }`}
                width="100%"
              />
              <div
                style={{
                  position: "absolute",
                  top: "0",
                  width: "100%",
                  height: "100%",
                  opacity: "0",
                  cursor: "pointer",
                }}
                onClick={handleImgClick}
              ></div>
            </div>
          )}
        </div>
        <div className="message__attachment-card-footer">
          <div className="message__attachment-card-title">
            <p
              style={{
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: "0",
              }}
            >
              {attachment.alias}
            </p>
            {deletable && (
              <XmarkIcon
                onClick={() =>
                  (handleRemoveAttachment as (attachmentName: string) => void)(
                    attachment.file?.name ?? ""
                  )
                }
              />
            )}
          </div>
          {addable && (
            <div className="message__attachment-card-btn">
              <Button
                onClick={handleAddToReports}
                label="Add to patient(s) report"
              />
            </div>
          )}
        </div>
      </div>
      {popUpVisible && (
        <NewWindow
          title={attachment.alias}
          features={{
            toolbar: "no",
            scrollbars: "no",
            menubar: "no",
            status: "no",
            directories: "no",
            width: 800,
            height: 600,
            left: 320,
            top: 200,
          }}
          onUnload={() => setPopUpVisible(false)}
        >
          {attachment.file?.mime.includes("image") ? (
            <img
              src={`${import.meta.env.VITE_XANO_BASE_URL}${
                attachment.file?.path
              }`}
              alt=""
              width="100%"
              height="100%"
            />
          ) : attachment.file?.mime.includes("video") ? (
            <video width="100%" height="100%" controls>
              <source
                src={`${import.meta.env.VITE_XANO_BASE_URL}${
                  attachment.file?.path
                }`}
                type={attachment.file?.mime}
              />
            </video>
          ) : attachment.file?.mime.includes("officedocument") ? (
            <iframe
              title="office document"
              src={`https://docs.google.com/gview?url=${
                import.meta.env.VITE_XANO_BASE_URL
              }${attachment.file?.path}&embedded=true&widget=false`}
              width="100%"
              height="100%"
              frameBorder="0"
            />
          ) : (
            <iframe
              title={attachment.alias}
              src={`${import.meta.env.VITE_XANO_BASE_URL}${
                attachment.file?.path
              }`}
              width="100%"
              height="100%"
              style={{ border: "none" }}
            />
          )}
        </NewWindow>
      )}
      {addVisible && message.from_patient_id && (
        <FakeWindow
          title={`ADD TO ${patientsNames[0]} REPORTS`}
          width={1000}
          height={810}
          x={(window.innerWidth - 1000) / 2}
          y={(window.innerHeight - 810) / 2}
          color="#94bae8"
          setPopUpVisible={setAddVisible}
        >
          {errMsgPost && <span>{errMsgPost}</span>}

          <ReportForm
            demographicsInfos={message.from_patient_infos as DemographicsType}
            patientId={message.from_patient_id}
            setAddVisible={setAddVisible}
            initialAttachment={attachment}
            errMsgPost={errMsgPost}
            setErrMsgPost={setErrMsgPost}
            reportPost={reportPost}
          />
        </FakeWindow>
      )}
      {addVisible && !message.from_patient_id && (
        <FakeWindow
          title={`ADD TO ${patientsNames[0]} REPORTS`}
          width={1000}
          height={810}
          x={(window.innerWidth - 1000) / 2}
          y={(window.innerHeight - 810) / 2}
          color="#94bae8"
          setPopUpVisible={setAddVisible}
        >
          {errMsgPost && <span>{errMsgPost}</span>}

          <ReportFormMultiplePatients
            demographicsInfos={(
              message.to_patients_ids as {
                to_patient_infos: DemographicsType;
              }[]
            ).map(({ to_patient_infos }) => to_patient_infos)}
            patientsIds={(
              message.to_patients_ids as {
                to_patient_infos: DemographicsType;
              }[]
            ).map(({ to_patient_infos }) => to_patient_infos.patient_id)}
            setAddVisible={setAddVisible}
            initialAttachment={attachment}
            errMsgPost={errMsgPost}
            setErrMsgPost={setErrMsgPost}
          />
        </FakeWindow>
      )}
    </>
  );
};

export default MessageExternalAttachmentCard;
