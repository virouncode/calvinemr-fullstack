import html2canvas from "html2canvas";
import { PDFDocument, PageSizes } from "pdf-lib";
import printJS from "print-js";
import { useRef, useState } from "react";
import xanoPost from "../../../../../../../api/xanoCRUD/xanoPost";
import useStaffInfosContext from "../../../../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../../../../hooks/context/useUserContext";
import { useClinicalNotePost } from "../../../../../../../hooks/reactquery/mutations/clinicalNotesMutations";
import { useTopicPost } from "../../../../../../../hooks/reactquery/mutations/topicMutations";
import usePrescriptionMultipage from "../../../../../../../hooks/usePrescriptionMultipage";
import { nowTZTimestamp } from "../../../../../../../utils/dates/formatDates";
import {
  staffIdToFirstName,
  staffIdToLastName,
  staffIdToOHIP,
} from "../../../../../../../utils/names/staffIdToName";
import { confirmAlert } from "../../../../../../All/Confirm/ConfirmGlobal";
import FakeWindow from "../../../../../../UI/Windows/FakeWindow";
import NewFax from "../../../../../Fax/NewFax";
import NewMessageExternal from "../../../../../Messaging/External/NewMessageExternal";
import PrescriptionAdditionalPages from "./PrescriptionAdditionalPages";
import PrescriptionOptionsPreview from "./PrescriptionOptionsPreview";
import PrescriptionPagePreview from "./PrescriptionPagePreview";

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
}) => {
  const { user } = useUserContext();
  const { staffInfos } = useStaffInfosContext();
  const [newMessageExternalVisible, setNewMessageExternalVisible] =
    useState(false);
  const [faxVisible, setFaxVisible] = useState(false);
  const [attachmentToSend, setAttachmentToSend] = useState({});
  const [progress, setProgress] = useState(false);
  const [mainBody, setMainBody] = useState(
    addedMeds
      .map(({ PrescriptionInstructions }) => PrescriptionInstructions)
      .join("\n\n") +
      "\n\n" +
      freeText
  );
  const [pages, setPages] = useState([]);
  const [additionalBodies, setAdditionalBodies] = useState([]);
  const [prescription, setPrescription] = useState(null);
  const printRef = useRef(null);
  const printAdditionalRefs = useRef([]);
  const bodyRef = useRef(null);

  const clinicalNotePost = useClinicalNotePost(patientId);
  const prescriptionPost = useTopicPost("PAST PRESCRIPTIONS", patientId);

  usePrescriptionMultipage(
    bodyRef,
    freeText,
    addedMeds,
    setMainBody,
    setAdditionalBodies,
    setPages
  );

  const handleSave = async (e) => {
    e.preventDefault();
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
        ({ PrescriptionInstructions }) => !PrescriptionInstructions.trim()
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
      setProgress(true);
      const mainPage = printRef.current;
      const mainCanvas = await html2canvas(mainPage, {
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

      for (let printAdditionalRef of printAdditionalRefs.current) {
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
      let fileToUpload = await xanoPost("/upload/attachment", "staff", {
        content: pdfURI,
      });

      //Post the meds
      if (addedMeds.length !== 0) {
        for (let med of addedMeds) {
          const medToPost = {
            ...med,
            patient_id: patientId,
            PrescriptionWrittenDate: nowTZTimestamp(),
            StartDate: nowTZTimestamp(),
            PrescribedBy: {
              Name: {
                FirstName: staffIdToFirstName(staffInfos, user.id),
                LastName: staffIdToLastName(staffInfos, user.id),
              },
            },
            PrescriptionIdentifier: uniqueId,
            site_id: siteSelectedId,
          };
          if (medToPost.hasOwnProperty("id")) delete medToPost.id;
          if (medToPost.hasOwnProperty("temp_id")) delete medToPost.temp_id;
          if (medToPost.hasOwnProperty("staff_id")) delete medToPost.staff_id;
          if (medToPost.hasOwnProperty("date_created"))
            delete medToPost.date_created;
          if (medToPost.hasOwnProperty("created_by_id"))
            delete medToPost.created_by_id;
          if (medToPost.hasOwnProperty("updates")) delete medToPost.updates;
          medToPost.date_created = nowTZTimestamp();
          medToPost.created_by_id = user.id;
          topicPost.mutate(medToPost);
        }
      }
      //Post prescription
      const datasAttachment = [
        {
          file: fileToUpload,
          alias: `Prescription_${prescriptionStamp}.pdf`,
          date_created: nowTZTimestamp(),
          created_by_id: user.id,
        },
      ];
      const attach_ids = await xanoPost(
        "/clinical_notes_attachments",
        "staff",
        {
          attachments_array: datasAttachment,
        }
      );
      const prescriptionToPost = {
        patient_id: patientId,
        attachment_id: attach_ids[0],
        unique_id: uniqueId,
        date_created: nowTZTimestamp(),
      };
      prescriptionPost.mutate(prescriptionToPost);

      //Post clinical note
      const clinicalNoteToPost = {
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
        onSuccess: () => {
          setProgress(false);
        },
        onError: () => {
          setProgress(false);
        },
      });
      setPrescription(fileToUpload);
      return fileToUpload;
    }
  };

  const handlePrint = async (e) => {
    e.preventDefault();
    if (prescription) {
      printJS(`${import.meta.env.VITE_XANO_BASE_URL}${prescription.path}`);
      return;
    }
    const fileToPrint = await handleSave(e);
    printJS(`${import.meta.env.VITE_XANO_BASE_URL}${fileToPrint.path}`);
  };

  const handleFax = async (e) => {
    e.preventDefault();
    if (prescription) {
      setFaxVisible(true);
    } else {
      await handleSave(e);
      setFaxVisible(true);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    setAttachmentToSend([
      {
        file: prescription || (await handleSave(e)),
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
          width={1300}
          height={630}
          x={(window.innerWidth - 1300) / 2}
          y={(window.innerHeight - 630) / 2}
          color="#931621"
          setPopUpVisible={setNewMessageExternalVisible}
        >
          <NewMessageExternal
            setNewVisible={setNewMessageExternalVisible}
            initialAttachments={attachmentToSend}
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
          color={"#931621"}
          setPopUpVisible={setFaxVisible}
        >
          <NewFax
            setNewVisible={setFaxVisible}
            initialAttachment={{
              alias: `Prescription_${prescriptionStamp}.pdf`,
              file: prescription,
            }}
          />
        </FakeWindow>
      )}
    </div>
  );
};

export default PrescriptionPreview;
