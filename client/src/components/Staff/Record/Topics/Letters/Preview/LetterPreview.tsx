import html2canvas from "html2canvas";
import { PDFDocument, PageSizes } from "pdf-lib";
import printJS from "print-js";
import React, { useRef, useState } from "react";
import xanoPost from "../../../../../../api/xanoCRUD/xanoPost";
import useUserContext from "../../../../../../hooks/context/useUserContext";
import { useTopicPost } from "../../../../../../hooks/reactquery/mutations/topicMutations";
import useLetterMultipage from "../../../../../../hooks/useLetterMultipage";
import useRecordInfosMultipage from "../../../../../../hooks/useRecordInfosMultipage";
import {
  AttachmentType,
  DemographicsType,
  LetterAttachmentType,
  LetterType,
  MessageAttachmentType,
  SiteType,
} from "../../../../../../types/api";
import { UserStaffType } from "../../../../../../types/app";
import { nowTZTimestamp } from "../../../../../../utils/dates/formatDates";
import { toPatientName } from "../../../../../../utils/names/toPatientName";
import FakeWindow from "../../../../../UI/Windows/FakeWindow";
import NewFax from "../../../../Fax/NewFax";
import NewMessageExternal from "../../../../Messaging/External/NewMessageExternal";
import NewMessage from "../../../../Messaging/Internal/NewMessage";
import LetterAdditionalPages from "./LetterAdditionalPages";
import LetterOptionsPreview from "./LetterOptionsPreview";
import LetterPagePreview from "./LetterPagePreview";
import LetterRecordInfosPagePreview from "./LetterRecordInfosPagePreview";

type LetterPreviewProps = {
  demographicsInfos: DemographicsType;
  body: string;
  bodyRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  recordInfosBodyRef: React.MutableRefObject<HTMLDivElement | null>;
  sites: SiteType[];
  siteSelectedId: number;
  dateStr: string;
  subject: string;
  recipientInfos: string;
  setPreviewVisible: React.Dispatch<React.SetStateAction<boolean>>;
  patientId: number;
  name: string;
  description: string;
  attachments: LetterAttachmentType[];
  isLoadingFile: boolean;
};

const LetterPreview = ({
  demographicsInfos,
  body,
  bodyRef,
  recordInfosBodyRef,
  sites,
  siteSelectedId,
  dateStr,
  subject,
  recipientInfos,
  setPreviewVisible,
  patientId,
  name,
  description,
  attachments,
  isLoadingFile,
}: LetterPreviewProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const [newMessageVisible, setNewMessageVisible] = useState(false);
  const [newMessageExternalVisible, setNewMessageExternalVisible] =
    useState(false);
  const [attachmentsToSend, setAttachmentsToSend] = useState<
    Partial<MessageAttachmentType>[]
  >([]);
  const [progress, setProgress] = useState(false);
  const [mainBody, setMainBody] = useState(body);
  const [pages, setPages] = useState<number[]>([]);
  const [additionalBodies, setAdditionalBodies] = useState<string[]>([]);
  const printRef = useRef<HTMLDivElement | null>(null);
  const printAdditionalRefs = useRef<HTMLDivElement[] | null>([]);

  const [recordInfosMainBody, setRecordInfosMainBody] = useState(
    recordInfosBodyRef?.current?.innerText || ""
  );
  const [recordInfosPages, setRecordInfosPages] = useState<number[]>([]);
  const [recordInfosAdditionalBodies, setRecordInfosAdditionalBodies] =
    useState<string[]>([]);
  const printRecordInfosRef = useRef<HTMLDivElement | null>(null);
  const printRecordInfosAdditionalRefs = useRef<HTMLDivElement[] | null>([]);

  const [letter, setLetter] = useState<AttachmentType | null>(null);
  const [faxVisible, setFaxVisible] = useState(false);

  useLetterMultipage(bodyRef, body, setMainBody, setAdditionalBodies, setPages);

  useRecordInfosMultipage(
    recordInfosBodyRef,
    setRecordInfosMainBody,
    setRecordInfosAdditionalBodies,
    setRecordInfosPages
  );

  const letterPost = useTopicPost("LETTERS/REFERRALS", patientId);

  const handleSave = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (letter) {
      alert("Letter already saved");
      return;
    }
    setProgress(true);
    const mainPage = printRef.current;
    const mainCanvas = await html2canvas(mainPage as HTMLElement, {
      useCORS: true,
      scale: 2,
    });
    const mainDataURL = mainCanvas.toDataURL("image/jpeg");
    const pdfDoc = await PDFDocument.create();
    const pdfPage1 = pdfDoc.addPage(PageSizes.Letter);
    const image1 = await pdfDoc.embedJpg(mainDataURL);
    pdfPage1.drawImage(image1, {
      x: 0,
      y: 0,
      width: pdfPage1.getWidth(),
      height: pdfPage1.getHeight(),
    });
    if (printAdditionalRefs.current) {
      for (const printAdditionalRef of printAdditionalRefs.current) {
        const page = printAdditionalRef;
        const canvas = await html2canvas(page, {
          useCORS: true,
          scale: 2,
        });
        const dataURL = canvas.toDataURL("image/jpeg");
        const pdfPage = pdfDoc.addPage(PageSizes.Letter);
        const image = await pdfDoc.embedJpg(dataURL);
        pdfPage.drawImage(image, {
          x: 0,
          y: 0,
          width: pdfPage.getWidth(),
          height: pdfPage.getHeight(),
        });
      }
    }

    if (printRecordInfosRef.current) {
      const page3 = printRecordInfosRef.current;
      const canvas3 = await html2canvas(page3, {
        useCORS: true,
        scale: 2,
      });
      const dataURL3 = canvas3.toDataURL("image/jpeg");
      const pdfPage3 = pdfDoc.addPage(PageSizes.Letter);
      const image3 = await pdfDoc.embedJpg(dataURL3);
      pdfPage3.drawImage(image3, {
        x: 0,
        y: 0,
        width: pdfPage3.getWidth(),
        height: pdfPage3.getHeight(),
      });
    }
    if (printRecordInfosAdditionalRefs.current) {
      for (const printRecordInfosAdditionalRef of printRecordInfosAdditionalRefs.current) {
        const page = printRecordInfosAdditionalRef;
        const canvas = await html2canvas(page, {
          useCORS: true,
          scale: 2,
        });
        const dataURL = canvas.toDataURL("image/jpeg");
        const pdfPage = pdfDoc.addPage(PageSizes.Letter);
        const image = await pdfDoc.embedJpg(dataURL);
        pdfPage.drawImage(image, {
          x: 0,
          y: 0,
          width: pdfPage.getWidth(),
          height: pdfPage.getHeight(),
        });
      }
    }

    for (const attachment of attachments) {
      if (attachment.file?.mime.includes("png")) {
        const pdfPage = pdfDoc.addPage(PageSizes.Letter);
        const url = `${import.meta.env.VITE_XANO_BASE_URL}${
          attachment.file.path
        }`;
        const arrayBuffer = await fetch(url).then((res) => res.arrayBuffer());
        const image = await pdfDoc.embedPng(arrayBuffer);
        const imageDims = image.scaleToFit(595, 1000);
        pdfPage.drawImage(image, {
          x: 0,
          y: 0,
          width: imageDims.width,
          height: imageDims.height,
        });
      } else if (
        attachment.file?.mime.includes("jpg") ||
        attachment.file?.mime.includes("jpeg")
      ) {
        const pdfPage = pdfDoc.addPage(PageSizes.Letter);
        const url = `${import.meta.env.VITE_XANO_BASE_URL}${
          attachment.file.path
        }`;
        const arrayBuffer = await fetch(url).then((res) => res.arrayBuffer());
        const image = await pdfDoc.embedJpg(arrayBuffer);
        const imageDims = image.scaleToFit(595, 1000);
        pdfPage.drawImage(image, {
          x: 0,
          y: 0,
          width: imageDims.width,
          height: imageDims.height,
        });
      } else if (attachment.file?.mime.includes("pdf")) {
        const sourcePdfUrl = `${import.meta.env.VITE_XANO_BASE_URL}${
          attachment.file.path
        }`;
        const sourcePdf = await fetch(sourcePdfUrl).then((res) =>
          res.arrayBuffer()
        );
        const pdfToEmbed = await PDFDocument.load(sourcePdf);
        const pdfToEmbedNbrPages = pdfToEmbed.getPageCount();
        for (let i = 0; i < pdfToEmbedNbrPages; i++) {
          const [embeddedPage] = await pdfDoc.embedPdf(sourcePdf, [i]);
          const page = pdfDoc.addPage(PageSizes.Letter);
          page.drawPage(embeddedPage, { x: 0, y: 0, xScale: 1, yScale: 1 });
        }
      }
    }
    const pdfURI = await pdfDoc.saveAsBase64({ dataUri: true });
    const fileToUpload: AttachmentType = await xanoPost(
      "/upload/attachment",
      "staff",
      {
        content: pdfURI,
      }
    );
    setLetter(fileToUpload);
    //Create the letter
    const letterToPost: Partial<LetterType> = {
      patient_id: patientId,
      file: fileToUpload,
      name,
      description,
      date_created: nowTZTimestamp(),
      created_by_id: user.id,
    };
    letterPost.mutate(letterToPost, {
      onSuccess: () => {
        setProgress(false);
      },
      onError: () => {
        setProgress(false);
      },
    });
    return fileToUpload;
  };

  const handlePrint = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (letter) {
      printJS(`${import.meta.env.VITE_XANO_BASE_URL}${letter.path}`);
      return;
    }
    const fileToUpload = await handleSave(e);
    printJS(`${import.meta.env.VITE_XANO_BASE_URL}${fileToUpload?.path}`);
  };

  const handleFax = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (letter) {
      setFaxVisible(true);
    } else {
      await handleSave(e);
      setFaxVisible(true);
    }
  };

  const handleSend = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    type: "Internal" | "External"
  ) => {
    e.preventDefault();
    setProgress(true);
    const mainPage = printRef.current;
    const mainCanvas = await html2canvas(mainPage as HTMLElement, {
      useCORS: true,
      scale: 2,
    });
    const mainDataURL = mainCanvas.toDataURL("image/jpeg");
    const pdfDoc = await PDFDocument.create();
    const pdfPage1 = pdfDoc.addPage(PageSizes.Letter);
    const image1 = await pdfDoc.embedJpg(mainDataURL);
    pdfPage1.drawImage(image1, {
      x: 0,
      y: 0,
      width: pdfPage1.getWidth(),
      height: pdfPage1.getHeight(),
    });

    if (printAdditionalRefs.current) {
      for (const printAdditionalRef of printAdditionalRefs.current) {
        const page = printAdditionalRef;
        const canvas = await html2canvas(page, {
          useCORS: true,
          scale: 2,
        });
        const dataURL = canvas.toDataURL("image/jpeg");
        const pdfPage = pdfDoc.addPage(PageSizes.Letter);
        const image = await pdfDoc.embedJpg(dataURL);
        pdfPage.drawImage(image, {
          x: 0,
          y: 0,
          width: pdfPage.getWidth(),
          height: pdfPage.getHeight(),
        });
      }
    }

    if (printRecordInfosRef.current) {
      const page3 = printRecordInfosRef.current;
      const canvas3 = await html2canvas(page3, {
        useCORS: true,
        scale: 2,
      });
      const dataURL3 = canvas3.toDataURL("image/jpeg");
      const pdfPage3 = pdfDoc.addPage(PageSizes.Letter);
      const image3 = await pdfDoc.embedJpg(dataURL3);
      pdfPage3.drawImage(image3, {
        x: 0,
        y: 0,
        width: pdfPage3.getWidth(),
        height: pdfPage3.getHeight(),
      });
    }

    if (printRecordInfosAdditionalRefs.current) {
      for (const printRecordInfosAdditionalRef of printRecordInfosAdditionalRefs.current) {
        const page = printRecordInfosAdditionalRef;
        const canvas = await html2canvas(page, {
          useCORS: true,
          scale: 2,
        });
        const dataURL = canvas.toDataURL("image/jpeg");
        const pdfPage = pdfDoc.addPage(PageSizes.Letter);
        const image = await pdfDoc.embedJpg(dataURL);
        pdfPage.drawImage(image, {
          x: 0,
          y: 0,
          width: pdfPage.getWidth(),
          height: pdfPage.getHeight(),
        });
      }
    }
    const pdfURI = await pdfDoc.saveAsBase64({ dataUri: true });
    //Create the letter for message and send
    const fileToUploadLetterForMessage: AttachmentType = await xanoPost(
      "/upload/attachment",
      "staff",
      {
        content: pdfURI,
      }
    );
    setAttachmentsToSend([
      {
        file: fileToUploadLetterForMessage,
        alias: name,
        date_created: nowTZTimestamp(),
        created_by_id: user.id,
        created_by_user_type: "staff",
      },
      ...attachments.map((attachment) => {
        return {
          file: attachment.file,
          alias: attachment.alias,
          date_created: attachment.date_created,
          created_by_id: user.id,
          created_by_user_type: "staff",
        } as MessageAttachmentType;
      }),
    ]);
    type === "Internal"
      ? setNewMessageVisible(true)
      : setNewMessageExternalVisible(true);

    //letter to save
    if (letter) {
      setProgress(false);
      return;
    } else {
      for (const attachment of attachments) {
        if (attachment.file?.mime.includes("png")) {
          const pdfPage = pdfDoc.addPage(PageSizes.Letter);
          const url = `${import.meta.env.VITE_XANO_BASE_URL}${
            attachment.file.path
          }`;
          const arrayBuffer = await fetch(url).then((res) => res.arrayBuffer());
          const image = await pdfDoc.embedPng(arrayBuffer);
          const imageDims = image.scaleToFit(595, 1000);
          pdfPage.drawImage(image, {
            x: 0,
            y: 0,
            width: imageDims.width,
            height: imageDims.height,
          });
        } else if (
          attachment.file?.mime.includes("jpg") ||
          attachment.file?.mime.includes("jpeg")
        ) {
          const pdfPage = pdfDoc.addPage(PageSizes.Letter);
          const url = `${import.meta.env.VITE_XANO_BASE_URL}${
            attachment.file.path
          }`;
          const arrayBuffer = await fetch(url).then((res) => res.arrayBuffer());
          const image = await pdfDoc.embedJpg(arrayBuffer);
          const imageDims = image.scaleToFit(595, 1000);
          pdfPage.drawImage(image, {
            x: 0,
            y: 0,
            width: imageDims.width,
            height: imageDims.height,
          });
        } else if (attachment.file?.mime.includes("pdf")) {
          const sourcePdfUrl = `${import.meta.env.VITE_XANO_BASE_URL}${
            attachment.file.path
          }`;
          const sourcePdf = await fetch(sourcePdfUrl).then((res) =>
            res.arrayBuffer()
          );
          const pdfToEmbed = await PDFDocument.load(sourcePdf);
          const pdfToEmbedNbrPages = pdfToEmbed.getPageCount();
          for (let i = 0; i < pdfToEmbedNbrPages; i++) {
            const [embeddedPage] = await pdfDoc.embedPdf(sourcePdf, [i]);
            const page = pdfDoc.addPage(PageSizes.Letter);
            page.drawPage(embeddedPage, { x: 0, y: 0, xScale: 1, yScale: 1 });
          }
        }
      }
      const pdfURIForRecord = await pdfDoc.saveAsBase64({ dataUri: true });
      const fileToUploadLetterForRecord: AttachmentType = await xanoPost(
        "/upload/attachment",
        "staff",
        {
          content: pdfURIForRecord,
        }
      );
      setLetter(fileToUploadLetterForRecord);
      const letterToPost = {
        patient_id: patientId,
        file: fileToUploadLetterForRecord,
        name,
        description,
        date_created: nowTZTimestamp(),
        created_by_id: user.id,
      };
      letterPost.mutate(letterToPost, {
        onSuccess: () => {
          setProgress(false);
        },
        onError: () => {
          setProgress(false);
        },
      });
    }
  };

  const numberOfPages =
    1 +
    pages.length +
    (recordInfosBodyRef.current ? 1 : 0) +
    recordInfosPages.length;

  return (
    <>
      <div className="letter__form">
        <div className="letter__container">
          <LetterPagePreview
            printRef={printRef}
            body={mainBody}
            demographicsInfos={demographicsInfos}
            sites={sites}
            siteSelectedId={siteSelectedId}
            dateStr={dateStr}
            subject={subject}
            recipientInfos={recipientInfos}
            numberOfPages={numberOfPages}
          />
          {pages.length > 0 ? (
            <LetterAdditionalPages
              pages={pages}
              additionalBodies={additionalBodies}
              printAdditionalRefs={printAdditionalRefs}
              demographicsInfos={demographicsInfos}
              numberOfPages={numberOfPages}
            />
          ) : null}
          {recordInfosBodyRef.current && (
            <LetterRecordInfosPagePreview
              printRecordInfosRef={printRecordInfosRef}
              recordInfosBody={recordInfosMainBody}
              demographicsInfos={demographicsInfos}
              numberOfPages={numberOfPages}
              pagesLength={pages.length + 1}
            />
          )}
          {recordInfosPages.length > 0 ? (
            <LetterAdditionalPages
              pages={recordInfosPages}
              additionalBodies={recordInfosAdditionalBodies}
              printAdditionalRefs={printRecordInfosAdditionalRefs}
              demographicsInfos={demographicsInfos}
              numberOfPages={numberOfPages}
            />
          ) : null}
        </div>
        <LetterOptionsPreview
          handleSave={handleSave}
          handlePrint={handlePrint}
          handleFax={handleFax}
          handleSend={handleSend}
          progress={progress}
          setPreviewVisible={setPreviewVisible}
          isLoadingFile={isLoadingFile}
          letter={letter}
        />
      </div>
      {newMessageVisible && (
        <FakeWindow
          title="NEW MESSAGE"
          width={1300}
          height={630}
          x={(window.innerWidth - 1300) / 2}
          y={(window.innerHeight - 630) / 2}
          color={"#848484"}
          setPopUpVisible={setNewMessageVisible}
        >
          <NewMessage
            setNewVisible={setNewMessageVisible}
            initialAttachments={attachmentsToSend}
            initialPatient={{
              id: demographicsInfos.patient_id,
              name: toPatientName(demographicsInfos),
            }}
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
          color="#848484"
          setPopUpVisible={setNewMessageExternalVisible}
        >
          <NewMessageExternal
            setNewVisible={setNewMessageExternalVisible}
            initialAttachments={attachmentsToSend}
            initialRecipients={[
              {
                id: patientId,
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
          <NewFax
            setNewVisible={setFaxVisible}
            initialAttachment={{
              alias: `${name.replaceAll(" ", "")}.pdf`,
              file: letter,
            }}
          />
        </FakeWindow>
      )}
    </>
  );
};

export default LetterPreview;
