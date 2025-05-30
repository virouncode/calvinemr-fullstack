import { useMediaQuery } from "@mui/material";
import { UseMutationResult } from "@tanstack/react-query";
import axios from "axios";
import html2canvas from "html2canvas";
import { PDFDocument, PageSizes } from "pdf-lib";
import printJS from "print-js";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import { xanoDeleteBatchSuccessfulRequests } from "../../../../../../../api/xanoCRUD/xanoDelete";
import { xanoPost } from "../../../../../../../api/xanoCRUD/xanoPost";
import useStaffInfosContext from "../../../../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../../../../hooks/context/useUserContext";
import { useClinicalNotePost } from "../../../../../../../hooks/reactquery/mutations/clinicalNotesMutations";
import { useMedsPostBatch } from "../../../../../../../hooks/reactquery/mutations/medsMutations";
import { useTopicPost } from "../../../../../../../hooks/reactquery/mutations/topicMutations";
import usePrescriptionMultipage from "../../../../../../../hooks/usePrescriptionMultipage";
import {
  AttachmentType,
  ClinicalNoteAttachmentType,
  ClinicalNoteType,
  DemographicsType,
  MedType,
  MessageAttachmentType,
  PrescriptionType,
  SiteType,
} from "../../../../../../../types/api";
import { UserStaffType } from "../../../../../../../types/app";
import { nowTZTimestamp } from "../../../../../../../utils/dates/formatDates";
import {
  staffIdToFirstName,
  staffIdToLastName,
  staffIdToOHIP,
} from "../../../../../../../utils/names/staffIdToName";
import { confirmAlert } from "../../../../../../UI/Confirm/ConfirmGlobal";
import FakeWindow from "../../../../../../UI/Windows/FakeWindow";
import NewFax from "../../../../../Fax/NewFax";
import NewFaxMobile from "../../../../../Fax/NewFaxMobile";
import NewMessageExternal from "../../../../../Messaging/External/NewMessageExternal";
import NewMessageExternalMobile from "../../../../../Messaging/External/NewMessageExternalMobile";
import PrescriptionAdditionalPages from "./PrescriptionAdditionalPages";
import PrescriptionOptionsPreview from "./PrescriptionOptionsPreview";
import PrescriptionPagePreview from "./PrescriptionPagePreview";

type PrescriptionPreviewProps = {
  demographicsInfos: DemographicsType;
  siteSelectedId: number;
  setPreviewVisible: React.Dispatch<React.SetStateAction<boolean>>;
  sites: SiteType[];
  uniqueId: string;
  patientId: number;
  freeText: string;
  addedMeds: Partial<MedType>[];
  topicPost: UseMutationResult<MedType, Error, Partial<MedType>, void>;
  prescriptionStamp: string;
};

const PrescriptionPreview = ({
  demographicsInfos,
  siteSelectedId,
  setPreviewVisible,
  sites,
  uniqueId,
  patientId,
  freeText,
  addedMeds,
  topicPost,
  prescriptionStamp,
}: PrescriptionPreviewProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const { staffInfos } = useStaffInfosContext();
  const [newMessageExternalVisible, setNewMessageExternalVisible] =
    useState(false);
  const [faxVisible, setFaxVisible] = useState(false);
  const [attachmentToSend, setAttachmentToSend] = useState<
    Partial<MessageAttachmentType>[] | undefined
  >();
  const [progress, setProgress] = useState(false);
  const [mainBody, setMainBody] = useState(
    addedMeds
      .map(({ PrescriptionInstructions }) => PrescriptionInstructions)
      .join("\n\n") +
      "\n\n" +
      freeText
  );
  const [pages, setPages] = useState<number[]>([]);
  const [additionalBodies, setAdditionalBodies] = useState<string[]>([]);
  const [prescription, setPrescription] = useState<
    AttachmentType | undefined
  >();
  const printRef = useRef<HTMLDivElement | null>(null);
  const printAdditionalRefs = useRef<HTMLDivElement[]>([]);
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const isTabletOrMobile = useMediaQuery("(max-width: 1024px)");

  //Queries
  const clinicalNotePost = useClinicalNotePost();
  const prescriptionPost = useTopicPost("PAST PRESCRIPTIONS", patientId);
  const medsPost = useMedsPostBatch(patientId);

  usePrescriptionMultipage(
    bodyRef,
    freeText,
    addedMeds,
    setMainBody,
    setAdditionalBodies,
    setPages
  );

  const handleSave = async () => {
    if (prescription) {
      alert("This prescription has already been saved.");
      return;
    }
    if (!siteSelectedId) {
      alert("Please choose a site first");
      return;
    }
    if (!freeText.trim() && addedMeds.length === 0) {
      alert("Your prescription is empty !");
      return;
    }
    if (
      addedMeds.find(
        ({ PrescriptionInstructions }) => !PrescriptionInstructions?.trim()
      )
    ) {
      alert(
        "It seems that you have added one or more medications and deleted the corresponding instructions. Please click on the trash icon to remove the medication(s)."
      );
      return;
    }

    if (
      addedMeds.length !== 0 ||
      (addedMeds.length === 0 &&
        (await confirmAlert({
          content:
            "It appears that you haven't utilized the forms on the right to add medications but instead entered free text. Please be aware that the prescription will be generated without recording any medications in the patient's electronic medical record. Continue ?",
        })))
    ) {
      const successfulRequests: { endpoint: string; id: number }[] = [];
      try {
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

        const pdfURI = await pdfDoc.saveAsBase64({ dataUri: true });
        const formData = new FormData();
        formData.append("content", pdfURI);
        const response = await axios.post(
          import.meta.env.VITE_XANO_UPLOAD_ATTACHMENT,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        const fileToUpload: AttachmentType = response.data;
        //Post the meds
        const medsToPost: Partial<MedType>[] = [];
        if (addedMeds.length !== 0) {
          for (const med of addedMeds) {
            const medToPost: Partial<MedType> = {
              ...med,
              patient_id: patientId,
              PrescriptionWrittenDate: nowTZTimestamp(),
              StartDate: nowTZTimestamp(),
              PrescribedBy: {
                Name: {
                  FirstName: staffIdToFirstName(staffInfos, user.id),
                  LastName: staffIdToLastName(staffInfos, user.id),
                },
                OHIPPhysicianId: staffIdToOHIP(staffInfos, user.id),
              },
              PrescriptionIdentifier: uniqueId,
              site_id: siteSelectedId,
            };

            const propertiesToDelete: (keyof MedType)[] = [
              "id",
              "temp_id",
              "date_created",
              "created_by_id",
              "updates",
            ];

            for (const prop of propertiesToDelete) {
              if (prop in medToPost) {
                delete medToPost[prop];
              }
            }
            medToPost.date_created = nowTZTimestamp();
            medToPost.created_by_id = user.id;
            medsToPost.push(medToPost);
          }
          medsPost.mutate(medsToPost);
        }
        //Post prescription
        const datasAttachment: Partial<ClinicalNoteAttachmentType>[] = [
          {
            file: fileToUpload,
            alias: `Prescription_${prescriptionStamp}.pdf`,
            date_created: nowTZTimestamp(),
            created_by_id: user.id,
          },
        ];
        const attach_ids: number[] = await xanoPost(
          "/clinical_notes_attachments",
          "staff",
          {
            attachments_array: datasAttachment,
          }
        );
        const prescriptionToPost: Partial<PrescriptionType> = {
          patient_id: patientId,
          attachment_id: attach_ids[0],
          unique_id: uniqueId,
          date_created: nowTZTimestamp(),
        };
        prescriptionPost.mutate(prescriptionToPost, {
          onSuccess: (data) => {
            successfulRequests.push({
              endpoint: "/prescriptions",
              id: data.id,
            });
          },
        });

        //Post clinical note
        const clinicalNoteToPost: Partial<ClinicalNoteType> = {
          patient_id: demographicsInfos.patient_id,
          subject: `Prescription_${prescriptionStamp}`,
          MyClinicalNotesContent: "See attachment",
          ParticipatingProviders: [
            {
              Name: {
                FirstName: staffIdToFirstName(staffInfos, user.id),
                LastName: staffIdToLastName(staffInfos, user.id),
              },
              OHIPPhysicianId: staffIdToOHIP(staffInfos, user.id),
              DateTimeNoteCreated: nowTZTimestamp(),
            },
          ],
          version_nbr: 1,
          attachments_ids: attach_ids,
          date_created: nowTZTimestamp(),
          created_by_id: user.id,
        };
        clinicalNotePost.mutate(clinicalNoteToPost, {
          onSuccess: (data) => {
            successfulRequests.push({
              endpoint: "/clinical_notes",
              id: data.id,
            });
          },
        });
        setPrescription(fileToUpload);
        return fileToUpload;
      } catch (err) {
        if (err instanceof Error)
          toast.error(`Unable to save the prescription: ${err.message}`, {
            containerId: "A",
          });
        await xanoDeleteBatchSuccessfulRequests(successfulRequests, "staff");
      } finally {
        setProgress(false);
      }
    }
  };

  const handlePrint = async () => {
    if (prescription) {
      printJS(`${import.meta.env.VITE_XANO_BASE_URL}${prescription.path}`);
      return;
    }
    const fileToPrint = await handleSave();
    if (!fileToPrint) return;
    printJS(`${import.meta.env.VITE_XANO_BASE_URL}${fileToPrint?.path}`);
  };

  const handleFax = async () => {
    if (prescription) {
      setFaxVisible(true);
    } else {
      await handleSave();
      setFaxVisible(true);
    }
  };

  const handleSend = async () => {
    setAttachmentToSend([
      {
        file: (prescription || (await handleSave())) ?? null,
        alias: `Prescription_${prescriptionStamp}.pdf`,
        date_created: nowTZTimestamp(),
        created_by_id: user.id,
        created_by_user_type: "staff",
      },
    ]);
    setNewMessageExternalVisible(true);
  };

  return (
    <div className="prescription__preview">
      <div className="prescription__preview-options">
        <PrescriptionOptionsPreview
          handleSave={handleSave}
          handlePrint={handlePrint}
          handleSend={handleSend}
          handleFax={handleFax}
          setPreviewVisible={setPreviewVisible}
          progress={progress}
          prescription={prescription}
        />
      </div>
      <div className="prescription__preview-pages">
        <PrescriptionPagePreview
          printRef={printRef}
          bodyRef={bodyRef}
          sites={sites}
          siteSelectedId={siteSelectedId}
          demographicsInfos={demographicsInfos}
          uniqueId={uniqueId}
          mainBody={mainBody}
        />
        {pages.length > 0 ? (
          <PrescriptionAdditionalPages
            pages={pages}
            additionalBodies={additionalBodies}
            printAdditionalRefs={printAdditionalRefs}
            demographicsInfos={demographicsInfos}
            sites={sites}
            siteSelectedId={siteSelectedId}
            uniqueId={uniqueId}
          />
        ) : null}
      </div>
      {newMessageExternalVisible && (
        <FakeWindow
          title="NEW EXTERNAL MESSAGE"
          width={1000}
          height={630}
          x={(window.innerWidth - 1000) / 2}
          y={(window.innerHeight - 630) / 2}
          color="#931621"
          setPopUpVisible={setNewMessageExternalVisible}
        >
          {isTabletOrMobile ? (
            <NewMessageExternalMobile
              setNewVisible={setNewMessageExternalVisible}
              initialAttachments={attachmentToSend}
            />
          ) : (
            <NewMessageExternal
              setNewVisible={setNewMessageExternalVisible}
              initialAttachments={attachmentToSend}
            />
          )}
        </FakeWindow>
      )}
      {faxVisible && (
        <FakeWindow
          title="NEW FAX"
          width={1000}
          height={700}
          x={(window.innerWidth - 1000) / 2}
          y={(window.innerHeight - 700) / 2}
          color={"#931621"}
          setPopUpVisible={setFaxVisible}
        >
          {isTabletOrMobile ? (
            <NewFaxMobile
              setNewVisible={setFaxVisible}
              initialAttachments={[
                {
                  alias: `Prescription_${prescriptionStamp}.pdf`,
                  file: prescription,
                },
              ]}
              initialRecipient={{
                ToFaxNumber:
                  demographicsInfos.preferred_pharmacy?.FaxNumber.phoneNumber.replaceAll(
                    "-",
                    ""
                  ) || "",
              }}
            />
          ) : (
            <NewFax
              setNewVisible={setFaxVisible}
              initialAttachments={[
                {
                  alias: `Prescription_${prescriptionStamp}.pdf`,
                  file: prescription,
                },
              ]}
              initialRecipient={{
                ToFaxNumber:
                  demographicsInfos.preferred_pharmacy?.FaxNumber.phoneNumber.replaceAll(
                    "-",
                    ""
                  ) || "",
              }}
            />
          )}
        </FakeWindow>
      )}
    </div>
  );
};

export default PrescriptionPreview;
