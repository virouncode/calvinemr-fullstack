import { uniqueId } from "lodash";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import { xanoPost } from "../../../../../../api/xanoCRUD/xanoPost";
import useUserContext from "../../../../../../hooks/context/useUserContext";
import { useSites } from "../../../../../../hooks/reactquery/queries/sitesQueries";
import {
  AttachmentType,
  DemographicsType,
  LetterAttachmentType,
  LetterTemplateType,
  TopicType,
} from "../../../../../../types/api";
import { UserStaffType } from "../../../../../../types/app";
import {
  nowTZ,
  nowTZTimestamp,
} from "../../../../../../utils/dates/formatDates";
import { toPatientName } from "../../../../../../utils/names/toPatientName";
import ErrorParagraph from "../../../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../../../UI/Paragraphs/LoadingParagraph";
import FakeWindow from "../../../../../UI/Windows/FakeWindow";
import LetterPreview from "../Preview/LetterPreview";
import LettersTemplates from "../Templates/LettersTemplates";
import LetterOptions from "./LetterOptions";
import LetterPage from "./LetterPage";
import LetterRecordInfosPage from "./LetterRecordInfosPage";

type LetterFormProps = {
  demographicsInfos: DemographicsType;
  setAddVisible: React.Dispatch<React.SetStateAction<boolean>>;
  patientId: number;
};

const LetterForm = ({
  demographicsInfos,
  setAddVisible,
  patientId,
}: LetterFormProps) => {
  // Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const [siteSelectedId, setSiteSelectedId] = useState(user.site_id);
  const [dateStr, setDateStr] = useState(nowTZ().toISODate());
  const [subject, setSubject] = useState("");
  const [recipientInfos, setRecipientInfos] = useState("whom it may concern");
  const [body, setBody] = useState("");
  const [topicsSelected, setTopicsSelected] = useState<TopicType[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [templatesVisible, setTemplatesVisible] = useState(false);
  const [attachments, setAttachments] = useState<LetterAttachmentType[]>([]);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [reportsAddedIds, setReportsAddedIds] = useState<number[]>([]);
  const bodyRef = useRef<HTMLTextAreaElement | null>(null);
  const recordInfosBodyRef = useRef<HTMLDivElement | null>(null);

  //Queries
  const {
    data: sites,
    isPending: isPendingSites,
    error: errorSites,
  } = useSites();

  const handleRemoveAttachment = (attachmentAlias: string) => {
    setAttachments(
      attachments.filter(({ alias }) => alias !== attachmentAlias)
    );
  };

  const handleSelectTemplate = (template: LetterTemplateType) => {
    setSubject(template.subject);
    if (template.recipient_infos) {
      setRecipientInfos(template.recipient_infos);
    }
    setBody((b) => {
      if (b) return b + `\n\n${template.body}`;
      else return `${template.body}`;
    });
    if (bodyRef.current) {
      bodyRef.current.focus();
      bodyRef.current.setSelectionRange(
        bodyRef.current.value.length,
        bodyRef.current.value.length
      );
    }
  };
  const handleAttach = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".jpeg, .jpg, .png, .pdf";
    // ".jpeg, .jpg, .png, .gif, .tif, .pdf, .svg, .mp3, .aac, .aiff, .flac, .ogg, .wma, .wav, .mov, .mp4, .avi, .wmf, .flv, .doc, .docm, .docx, .txt, .csv, .xls, .xlsx, .ppt, .pptx";
    input.onchange = (event) => {
      // getting a hold of the file reference
      const e = event as unknown as React.ChangeEvent<HTMLInputElement>;
      const file = e.target.files?.[0];
      if (!file) return;
      if (file.size > 500000000) {
        toast.error(
          "The file is over 500Mb, please choose another file or send a link",
          { containerId: "A" }
        );
        return;
      }
      setIsLoadingFile(true);
      // setting up the reader`
      const reader = new FileReader();
      reader.readAsDataURL(file);
      // here we tell the reader what to do when it's done reading...
      reader.onload = async (e) => {
        const content = e.target?.result; // this is the content!
        try {
          const response: AttachmentType = await xanoPost(
            "/upload/attachment",
            "staff",
            { content }
          );
          if (!response.type) response.type = "document";
          setAttachments([
            ...attachments,
            {
              file: response,
              alias: file.name,
              date_created: nowTZTimestamp(),
              created_by_id: user.id,
              id: uniqueId("letter_attachment_"),
              type: "attachment",
            },
          ]); //meta, mime, name, path, size, type
          setIsLoadingFile(false);
        } catch (err) {
          if (err instanceof Error)
            toast.error(`Error: unable to load file: ${err.message}`, {
              containerId: "A",
            });
          setIsLoadingFile(false);
        }
      };
    };
    input.click();
  };
  const handleCancel = () => {
    setAddVisible(false);
  };

  if (isPendingSites)
    return (
      <div className="letter__form">
        <LoadingParagraph />
      </div>
    );
  if (errorSites)
    return (
      <div className="letter__form">
        <ErrorParagraph errorMsg={errorSites.message} />
      </div>
    );

  return (
    <>
      <div className="letter__form">
        <div className="letter__container">
          <LetterPage
            sites={sites}
            siteSelectedId={siteSelectedId}
            demographicsInfos={demographicsInfos}
            dateStr={dateStr}
            subject={subject}
            setSubject={setSubject}
            body={body}
            setBody={setBody}
            bodyRef={bodyRef}
            recipientInfos={recipientInfos}
            setRecipientInfos={setRecipientInfos}
          />
          {topicsSelected.length > 0 ? (
            <LetterRecordInfosPage
              topicsSelected={topicsSelected}
              patientId={patientId}
              demographicsInfos={demographicsInfos}
              recordInfosBodyRef={recordInfosBodyRef}
            />
          ) : null}
        </div>
        <LetterOptions
          sites={sites}
          siteSelectedId={siteSelectedId}
          setSiteSelectedId={setSiteSelectedId}
          handleCancel={handleCancel}
          dateStr={dateStr}
          setDateStr={setDateStr}
          name={name}
          setName={setName}
          description={description}
          setDescription={setDescription}
          setTemplatesVisible={setTemplatesVisible}
          setPreviewVisible={setPreviewVisible}
          topicsSelected={topicsSelected}
          setTopicsSelected={setTopicsSelected}
          setBody={setBody}
          handleAttach={handleAttach}
          isLoadingFile={isLoadingFile}
          attachments={attachments}
          setAttachments={setAttachments}
          handleRemoveAttachment={handleRemoveAttachment}
          reportsAddedIds={reportsAddedIds}
          setReportsAddedIds={setReportsAddedIds}
          patientId={patientId}
        />
      </div>
      {previewVisible && (
        <FakeWindow
          title={`NEW LETTER/REFERRAL for ${toPatientName(
            demographicsInfos
          )} PREVIEW`}
          width={innerWidth}
          height={750}
          x={0}
          y={(window.innerHeight - 750) / 2}
          color={"#848484"}
          setPopUpVisible={setPreviewVisible}
        >
          <LetterPreview
            sites={sites}
            siteSelectedId={siteSelectedId}
            demographicsInfos={demographicsInfos}
            dateStr={dateStr}
            subject={subject}
            recipientInfos={recipientInfos}
            body={body}
            bodyRef={bodyRef}
            recordInfosBodyRef={recordInfosBodyRef}
            setPreviewVisible={setPreviewVisible}
            patientId={patientId}
            name={name}
            description={description}
            attachments={attachments}
            isLoadingFile={isLoadingFile}
          />
        </FakeWindow>
      )}
      {templatesVisible && (
        <FakeWindow
          title={`CHOOSE LETTER TEMPLATE`}
          width={800}
          height={600}
          x={window.innerWidth - 800}
          y={0}
          color="#848484"
          setPopUpVisible={setTemplatesVisible}
        >
          <LettersTemplates handleSelectTemplate={handleSelectTemplate} />
        </FakeWindow>
      )}
    </>
  );
};

export default LetterForm;
