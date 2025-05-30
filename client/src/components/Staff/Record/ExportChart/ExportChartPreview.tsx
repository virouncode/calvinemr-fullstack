import { useMediaQuery } from "@mui/material";
import axios from "axios";
import html2canvas from "html2canvas";
import { uniqueId } from "lodash";
import { PDFDocument, PageSizes, StandardFonts, rgb } from "pdf-lib";
import printJS from "print-js";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import useUserContext from "../../../../hooks/context/useUserContext";
import {
  AttachmentType,
  DemographicsType,
  MessageAttachmentType,
  TopicExportType,
} from "../../../../types/api";
import { UserStaffType } from "../../../../types/app";
import { nowTZTimestamp } from "../../../../utils/dates/formatDates";
import { toPatientName } from "../../../../utils/names/toPatientName";
import Button from "../../../UI/Buttons/Button";
import CloseButton from "../../../UI/Buttons/CloseButton";
import PrintButton from "../../../UI/Buttons/PrintButton";
import CircularProgressSmall from "../../../UI/Progress/CircularProgressSmall";
import FakeWindow from "../../../UI/Windows/FakeWindow";
import NewFax from "../../Fax/NewFax";
import NewFaxMobile from "../../Fax/NewFaxMobile";
import NewMessageExternal from "../../Messaging/External/NewMessageExternal";
import NewMessageExternalMobile from "../../Messaging/External/NewMessageExternalMobile";
import ExportClinicalNotes from "./ExportClinicalNotes";
import ExportDemographics from "./ExportDemographics";
import ExportFamilyDoctors from "./ExportFamilyDoctors";
import ExportTopic from "./ExportTopic";

type ExportChartPreviewProps = {
  recordsSelected: TopicExportType[];
  patientId: number;
  demographicsInfos: DemographicsType;
  setPreviewVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const ExportChartPreview = ({
  recordsSelected,
  patientId,
  demographicsInfos,
  setPreviewVisible,
}: ExportChartPreviewProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const [progress, setProgress] = useState(false);
  const [chart, setChart] = useState("");
  const [fileToFax, setFileToFax] = useState<
    Partial<MessageAttachmentType> | undefined
  >();
  const [faxVisible, setFaxVisible] = useState(false);
  const [newMessageExternalVisible, setNewMessageExternalVisible] =
    useState(false);
  const [attachmentsToSend, setAttachmentsToSend] = useState<
    MessageAttachmentType[]
  >([]);
  const textContentRef = useRef<HTMLDivElement | null>(null);
  const pdfContentRef = useRef<HTMLDivElement | null>(null);
  const reportsFilesRef = useRef<AttachmentType[]>([]);
  const reportsTextRef = useRef<HTMLDivElement | null>(null);
  const prescriptionsFilesRef = useRef<AttachmentType[]>([]);
  const eformsFilesRef = useRef<AttachmentType[]>([]);
  const lettersFilesRef = useRef<AttachmentType[]>([]);
  const isTabletOrMobile = useMediaQuery("(max-width: 1024px)");

  const handleGeneratePDF = async () => {
    if (!textContentRef.current) return;
    try {
      setProgress(true);
      const largeComponent = textContentRef.current;
      const componentHeight = largeComponent.offsetHeight * 2;
      const componentWidth = largeComponent.offsetWidth * 2;
      const pageHeight = 1056 * 2; // Letter page height in pixels at 96 DPI
      const nbrOfPages = Math.ceil(componentHeight / pageHeight);

      const largeCanvas = await html2canvas(largeComponent, {
        useCORS: true,
        scale: 2,
        allowTaint: true,
      });
      const pdfDoc = await PDFDocument.create();

      for (let y = 0; y < nbrOfPages; y++) {
        // Create a canvas for each page
        const segmentCanvas = document.createElement("canvas");
        segmentCanvas.width = componentWidth; // Use the actual width of the large component
        segmentCanvas.height = pageHeight;
        const segmentContext = segmentCanvas.getContext("2d");
        if (segmentContext) {
          segmentContext.fillStyle = "white";
          segmentContext.fillRect(
            0,
            0,
            segmentCanvas.width,
            segmentCanvas.height
          );

          // Calculate the position of the segment in the large component
          const sy = y * pageHeight;
          const sh = Math.min(pageHeight, componentHeight - sy);

          // Draw the segment from the large canvas to the segment canvas
          segmentContext.drawImage(
            largeCanvas,
            0,
            sy,
            componentWidth,
            sh,
            0,
            0,
            componentWidth,
            sh
          );
        }
        // Convert the segment canvas to an image (base64 data URL)
        const segmentDataURL = segmentCanvas.toDataURL("image/jpeg");
        const pdfPage = pdfDoc.addPage(PageSizes.Letter);
        const image = await pdfDoc.embedJpg(segmentDataURL);
        pdfPage.drawImage(image, {
          x: 0,
          y: 0,
          width: pdfPage.getWidth(),
          height: pdfPage.getHeight(),
        });
      }
      //PRESCRIPTIONS
      if (prescriptionsFilesRef.current.length > 0) {
        const pdfPage = pdfDoc.addPage();
        const helveticaFont = await pdfDoc.embedFont(
          StandardFonts.HelveticaBold
        );
        pdfPage.setFont(helveticaFont);
        pdfPage.drawRectangle({
          x: 15,
          y: pdfPage.getHeight() / 2 - 50,
          width: pdfPage.getWidth() - 30,
          height: 30,
          color: rgb(227 / 255, 175 / 255, 205 / 255),
        });
        pdfPage.drawText("PAST PRESCRIPTIONS", {
          x: 25,
          y: pdfPage.getHeight() / 2 - 38,
          font: helveticaFont,
          size: 10,
          color: rgb(254 / 255, 254 / 255, 254 / 255),
          lineHeight: 24,
        });
        for (const file of prescriptionsFilesRef.current) {
          const url = file.url;
          const arrayBuffer = await fetch(url).then((res) => res.arrayBuffer());
          if (file.mime.includes("png")) {
            const image = await pdfDoc.embedPng(arrayBuffer);
            const imageDims = image.scaleToFit(595, 1000);
            const pdfPage = pdfDoc.addPage();
            pdfPage.drawImage(image, {
              x: 0,
              y: 0,
              width: imageDims.width,
              height: imageDims.height,
            });
          } else if (file.mime.includes("jpg") || file.mime.includes("jpeg")) {
            const image = await pdfDoc.embedJpg(arrayBuffer);
            const imageDims = image.scaleToFit(595, 1000);
            const pdfPage = pdfDoc.addPage();
            pdfPage.drawImage(image, {
              x: 0,
              y: 0,
              width: imageDims.width,
              height: imageDims.height,
            });
          } else if (file.mime.includes("pdf")) {
            const pdfToEmbed = await PDFDocument.load(arrayBuffer);
            const pdfToEmbedNbrPages = pdfToEmbed.getPageCount();
            for (let i = 0; i < pdfToEmbedNbrPages; i++) {
              const [embeddedPage] = await pdfDoc.embedPdf(arrayBuffer, [i]);
              const pdfPage = pdfDoc.addPage();
              pdfPage.drawPage(embeddedPage, {
                x: 0,
                y: 0,
                xScale: 1,
                yScale: 1,
              });
            }
          }
        }
      }

      //REPORTS
      if (reportsTextRef.current) {
        const pdfPage = pdfDoc.addPage();
        const helveticaFont = await pdfDoc.embedFont(
          StandardFonts.HelveticaBold
        );
        pdfPage.setFont(helveticaFont);
        pdfPage.drawRectangle({
          x: 15,
          y: pdfPage.getHeight() / 2 - 50,
          width: pdfPage.getWidth() - 30,
          height: 30,
          color: rgb(147 / 255, 22 / 255, 33 / 255),
        });
        pdfPage.drawText("REPORTS (TEXT REPORTS)", {
          x: 25,
          y: pdfPage.getHeight() / 2 - 38,
          font: helveticaFont,
          size: 10,
          color: rgb(254 / 255, 254 / 255, 254 / 255),
          lineHeight: 24,
        });
        //NbrOfPages needed
        const largeComponent = reportsTextRef.current;
        const componentHeight = largeComponent.offsetHeight * 2;
        const componentWidth = largeComponent.offsetWidth * 2;
        const pageHeight = 1123 * 2; // A4 page height in pixels at 96 DPI
        const nbrOfPages = Math.ceil(componentHeight / pageHeight);
        const largeCanvas = await html2canvas(largeComponent, {
          useCORS: true,
          scale: 2,
        });
        for (let y = 0; y < nbrOfPages; y++) {
          // Create a canvas for each page
          const segmentCanvas = document.createElement("canvas");
          segmentCanvas.width = componentWidth; // Use the actual width of the large component
          segmentCanvas.height = pageHeight;
          const segmentContext = segmentCanvas.getContext("2d");
          if (segmentContext) {
            segmentContext.fillStyle = "white";
            segmentContext.fillRect(
              0,
              0,
              segmentCanvas.width,
              segmentCanvas.height
            );

            // Calculate the position of the segment in the large component
            const sy = y * pageHeight;
            const sh = Math.min(pageHeight, componentHeight - sy);

            // Draw the segment from the large canvas to the segment canvas
            segmentContext.drawImage(
              largeCanvas,
              0,
              sy,
              componentWidth,
              sh,
              0,
              0,
              componentWidth,
              sh
            );
          }
          // Convert the segment canvas to an image (base64 data URL)
          const segmentDataURL = segmentCanvas.toDataURL("image/jpeg");
          const pdfPage = pdfDoc.addPage();
          const image = await pdfDoc.embedJpg(segmentDataURL);
          pdfPage.drawImage(image, {
            x: 0,
            y: 0,
            width: pdfPage.getWidth(),
            height: pdfPage.getHeight(),
          });
        }
      }

      if (reportsFilesRef.current.length > 0) {
        const pdfPage = pdfDoc.addPage();
        const helveticaFont = await pdfDoc.embedFont(
          StandardFonts.HelveticaBold
        );
        pdfPage.setFont(helveticaFont);
        pdfPage.drawRectangle({
          x: 15,
          y: pdfPage.getHeight() / 2 - 50,
          width: pdfPage.getWidth() - 30,
          height: 30,
          color: rgb(147 / 255, 22 / 255, 33 / 255),
        });
        pdfPage.drawText("REPORTS (FILES REPORTS)", {
          x: 25,
          y: pdfPage.getHeight() / 2 - 38,
          font: helveticaFont,
          size: 10,
          color: rgb(254 / 255, 254 / 255, 254 / 255),
          lineHeight: 24,
        });
        for (const file of reportsFilesRef.current) {
          const url = file.url;
          const arrayBuffer = await fetch(url).then((res) => res.arrayBuffer());
          if (file.mime.includes("png")) {
            const image = await pdfDoc.embedPng(arrayBuffer);
            const imageDims = image.scaleToFit(595, 1000);
            const pdfPage = pdfDoc.addPage();
            pdfPage.drawImage(image, {
              x: 0,
              y: 0,
              width: imageDims.width,
              height: imageDims.height,
            });
          } else if (file.mime.includes("jpg") || file.mime.includes("jpeg")) {
            const image = await pdfDoc.embedJpg(arrayBuffer);
            const imageDims = image.scaleToFit(595, 1000);
            const pdfPage = pdfDoc.addPage();
            pdfPage.drawImage(image, {
              x: 0,
              y: 0,
              width: imageDims.width,
              height: imageDims.height,
            });
          } else if (file.mime.includes("pdf")) {
            const pdfToEmbed = await PDFDocument.load(arrayBuffer);
            const pdfToEmbedNbrPages = pdfToEmbed.getPageCount();
            for (let i = 0; i < pdfToEmbedNbrPages; i++) {
              const [embeddedPage] = await pdfDoc.embedPdf(arrayBuffer, [i]);
              const pdfPage = pdfDoc.addPage();
              pdfPage.drawPage(embeddedPage, {
                x: 0,
                y: 0,
                xScale: 1,
                yScale: 1,
              });
            }
          }
        }
      }

      //EFORMS
      if (eformsFilesRef.current.length > 0) {
        const pdfPage = pdfDoc.addPage();
        const helveticaFont = await pdfDoc.embedFont(
          StandardFonts.HelveticaBold
        );
        pdfPage.setFont(helveticaFont);
        pdfPage.drawRectangle({
          x: 15,
          y: pdfPage.getHeight() / 2 - 50,
          width: pdfPage.getWidth() - 30,
          height: 30,
          color: rgb(41 / 255, 203 / 255, 214 / 255),
        });
        pdfPage.drawText("E-FORMS", {
          x: 25,
          y: pdfPage.getHeight() / 2 - 38,
          font: helveticaFont,
          size: 10,
          color: rgb(254 / 255, 254 / 255, 254 / 255),
          lineHeight: 24,
        });
        for (const file of eformsFilesRef.current) {
          const url = file.url;
          const arrayBuffer = await fetch(url).then((res) => res.arrayBuffer());
          if (file.mime.includes("png")) {
            const image = await pdfDoc.embedPng(arrayBuffer);
            const imageDims = image.scaleToFit(595, 1000);
            const pdfPage = pdfDoc.addPage();
            pdfPage.drawImage(image, {
              x: 0,
              y: 0,
              width: imageDims.width,
              height: imageDims.height,
            });
          } else if (file.mime.includes("jpg") || file.mime.includes("jpeg")) {
            const image = await pdfDoc.embedJpg(arrayBuffer);
            const imageDims = image.scaleToFit(595, 1000);
            const pdfPage = pdfDoc.addPage();
            pdfPage.drawImage(image, {
              x: 0,
              y: 0,
              width: imageDims.width,
              height: imageDims.height,
            });
          } else if (file.mime.includes("pdf")) {
            const pdfToEmbed = await PDFDocument.load(arrayBuffer);
            const pdfToEmbedNbrPages = pdfToEmbed.getPageCount();
            for (let i = 0; i < pdfToEmbedNbrPages; i++) {
              const [embeddedPage] = await pdfDoc.embedPdf(arrayBuffer, [i]);
              const pdfPage = pdfDoc.addPage();
              pdfPage.drawPage(embeddedPage, {
                x: 0,
                y: 0,
                xScale: 1,
                yScale: 1,
              });
            }
          }
        }
      }

      //LETTERS
      if (lettersFilesRef.current.length > 0) {
        const pdfPage = pdfDoc.addPage();
        const helveticaFont = await pdfDoc.embedFont(
          StandardFonts.HelveticaBold
        );
        pdfPage.setFont(helveticaFont);
        pdfPage.drawRectangle({
          x: 15,
          y: pdfPage.getHeight() / 2 - 50,
          width: pdfPage.getWidth() - 30,
          height: 30,
          color: rgb(132 / 255, 132 / 255, 132 / 255),
        });
        pdfPage.drawText("LETTERS/REFERRALS", {
          x: 25,
          y: pdfPage.getHeight() / 2 - 38,
          font: helveticaFont,
          size: 10,
          color: rgb(254 / 255, 254 / 255, 254 / 255),
          lineHeight: 24,
        });
        for (const file of lettersFilesRef.current) {
          const url = file.url;
          const arrayBuffer = await fetch(url).then((res) => res.arrayBuffer());
          if (file.mime.includes("png")) {
            const image = await pdfDoc.embedPng(arrayBuffer);
            const imageDims = image.scaleToFit(595, 1000);
            const pdfPage = pdfDoc.addPage();
            pdfPage.drawImage(image, {
              x: 0,
              y: 0,
              width: imageDims.width,
              height: imageDims.height,
            });
          } else if (file.mime.includes("jpg") || file.mime.includes("jpeg")) {
            const image = await pdfDoc.embedJpg(arrayBuffer);
            const imageDims = image.scaleToFit(595, 1000);
            const pdfPage = pdfDoc.addPage();
            pdfPage.drawImage(image, {
              x: 0,
              y: 0,
              width: imageDims.width,
              height: imageDims.height,
            });
          } else if (file.mime.includes("pdf")) {
            const pdfToEmbed = await PDFDocument.load(arrayBuffer);
            const pdfToEmbedNbrPages = pdfToEmbed.getPageCount();
            for (let i = 0; i < pdfToEmbedNbrPages; i++) {
              const [embeddedPage] = await pdfDoc.embedPdf(arrayBuffer, [i]);
              const pdfPage = pdfDoc.addPage();
              pdfPage.drawPage(embeddedPage, {
                x: 0,
                y: 0,
                xScale: 1,
                yScale: 1,
              });
            }
          }
        }
      }
      const pdfURI = await pdfDoc.saveAsBase64({ dataUri: true });
      setChart(pdfURI);
      setProgress(false);
      return pdfURI;
    } catch {
      setProgress(false);
      toast.error("An error occured while generating the PDF");
    }
  };
  const handleFax = async () => {
    setProgress(true);
    let pdfFile;
    if (!chart) {
      try {
        const pdfURI = await handleGeneratePDF();
        const formData = new FormData();
        formData.append("content", pdfURI as string);
        pdfFile = (
          await axios.post(
            import.meta.env.VITE_XANO_UPLOAD_ATTACHMENT,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          )
        ).data;
        setFileToFax({
          alias: `${toPatientName(demographicsInfos).replaceAll(" ", "")}.pdf`,
          file: pdfFile,
        });
      } catch (err) {
        setProgress(false);
        if (err instanceof Error)
          toast.error(`Unable to fax: ${err.message}`, {
            containerId: "A",
          });
        return;
      }
    } else {
      const formData = new FormData();
      formData.append("content", chart);
      pdfFile = (
        await axios.post(
          import.meta.env.VITE_XANO_UPLOAD_ATTACHMENT,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
      ).data;
      setFileToFax({
        alias: `${toPatientName(demographicsInfos).replaceAll(" ", "")}.pdf`,
        file: pdfFile,
      });
    }
    setFaxVisible(true);
    setProgress(false);
  };

  const handlePrint = async () => {
    setProgress(true);
    let pdfFile;
    if (!chart) {
      try {
        const pdfURI = await handleGeneratePDF();
        const formData = new FormData();
        formData.append("content", pdfURI as string);
        pdfFile = (
          await axios.post(
            import.meta.env.VITE_XANO_UPLOAD_ATTACHMENT,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          )
        ).data;
      } catch (err) {
        setProgress(false);
        if (err instanceof Error) {
          toast.error(`Unable to print: ${err.message}`, {
            containerId: "A",
          });
          return;
        }
      }
    } else {
      const formData = new FormData();
      formData.append("content", chart);
      try {
        pdfFile = (
          await axios.post(
            import.meta.env.VITE_XANO_UPLOAD_ATTACHMENT,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          )
        ).data;
      } catch (err) {
        setProgress(false);
        if (err instanceof Error) {
          toast.error(`Unable to print: ${err.message}`, {
            containerId: "A",
          });
          return;
        }
      }
    }
    printJS({
      printable: `${import.meta.env.VITE_XANO_BASE_URL}${pdfFile.path}`,
      maxWidth: 794,
    });
    setProgress(false);
  };

  const handleSend = async () => {
    setProgress(true);
    let pdfFile: AttachmentType;
    if (!chart) {
      try {
        const pdfURI = await handleGeneratePDF();
        const formData = new FormData();
        formData.append("content", pdfURI as string);
        pdfFile = (
          await axios.post(
            import.meta.env.VITE_XANO_UPLOAD_ATTACHMENT,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          )
        ).data;
        setAttachmentsToSend([
          {
            id: uniqueId("export_chart_"),
            file: pdfFile,
            alias: pdfFile.name,
            date_created: nowTZTimestamp(),
            created_by_id: user.id,
            created_by_user_type: "staff",
          },
        ]);
        setNewMessageExternalVisible(true);
        setProgress(false);
      } catch (err) {
        setProgress(false);
        if (err instanceof Error) {
          toast.error(`Unable to send: ${err.message}`, {
            containerId: "A",
          });
          return;
        }
      }
    } else {
      const formData = new FormData();
      formData.append("content", chart);
      try {
        pdfFile = (
          await axios.post(
            import.meta.env.VITE_XANO_UPLOAD_ATTACHMENT,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          )
        ).data;
        setAttachmentsToSend([
          {
            id: uniqueId("export_chart_"),
            file: pdfFile,
            alias: pdfFile.name,
            date_created: nowTZTimestamp(),
            created_by_id: user.id,
            created_by_user_type: "staff",
          },
        ]);
        setNewMessageExternalVisible(true);
        setProgress(false);
      } catch (err) {
        setProgress(false);
        if (err instanceof Error) {
          toast.error(`Unable to send: ${err.message}`, {
            containerId: "A",
          });
          return;
        }
      }
    }
  };

  const handleClose = () => {
    setPreviewVisible(false);
  };

  return (
    <div className="export-chart__preview">
      <div className="export-chart__preview-options">
        <PrintButton onClick={handlePrint} disabled={progress} />
        <Button
          onClick={handleSend}
          disabled={progress}
          label="Send (External)"
        />
        <Button onClick={handleFax} disabled={progress} label="Fax" />
        <CloseButton onClick={handleClose} disabled={progress} />
        {progress && <CircularProgressSmall />}
      </div>
      <div className="export-chart__preview-content">
        <div
          ref={textContentRef}
          style={{ padding: "5px 0", width: "816px", margin: "0 auto" }}
        >
          <ExportDemographics demographicsInfos={demographicsInfos} />
          {recordsSelected.includes("CLINICAL NOTES") && (
            <ExportClinicalNotes patientId={patientId} />
          )}
          {recordsSelected
            .filter(
              (topic) =>
                topic !== "DEMOGRAPHICS" &&
                topic !== "REPORTS" &&
                topic !== "LETTERS/REFERRALS" &&
                topic !== "E-FORMS" &&
                topic !== "PAST PRESCRIPTIONS" &&
                topic !== "CLINICAL NOTES"
            )
            .map((topic) =>
              topic !== "FAMILY DOCTORS & SPECIALISTS" ? (
                <ExportTopic
                  topic={topic}
                  patientId={patientId}
                  key={topic}
                  demographicsInfos={demographicsInfos}
                />
              ) : (
                <ExportFamilyDoctors patientId={patientId} key={topic} />
              )
            )}
        </div>
        <div
          ref={pdfContentRef}
          style={{ padding: "5px 0", width: "816px", margin: "0 auto" }}
        >
          {recordsSelected
            .filter(
              (topic) =>
                topic === "REPORTS" ||
                topic === "LETTERS/REFERRALS" ||
                topic === "E-FORMS" ||
                topic === "PAST PRESCRIPTIONS"
            )
            .map((topic) => (
              <ExportTopic
                topic={topic}
                patientId={patientId}
                key={topic}
                demographicsInfos={demographicsInfos}
                lettersFilesRef={lettersFilesRef}
                eformsFilesRef={eformsFilesRef}
                prescriptionsFilesRef={prescriptionsFilesRef}
                reportsFilesRef={reportsFilesRef}
                reportsTextRef={reportsTextRef}
              />
            ))}
        </div>
      </div>
      {faxVisible && (
        <FakeWindow
          title="NEW FAX"
          width={1000}
          height={700}
          x={(window.innerWidth - 1000) / 2}
          y={(window.innerHeight - 700) / 2}
          color={"#94bae8"}
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
          color="#94BAE8"
          setPopUpVisible={setNewMessageExternalVisible}
        >
          {isTabletOrMobile ? (
            <NewMessageExternalMobile
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
          ) : (
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
          )}
        </FakeWindow>
      )}
    </div>
  );
};

export default ExportChartPreview;
