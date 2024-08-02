import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import useUserContext from "../../../../../../../hooks/context/useUserContext";
import { useSites } from "../../../../../../../hooks/reactquery/queries/sitesQueries";
import {
  nowTZTimestamp,
  timestampToDateTimeSecondsISOTZ,
} from "../../../../../../../utils/dates/formatDates";
import { toPatientName } from "../../../../../../../utils/names/toPatientName";
import ErrorParagraph from "../../../../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../../../../UI/Paragraphs/LoadingParagraph";
import FakeWindow from "../../../../../../UI/Windows/FakeWindow";
import MedicationForm from "../../MedicationForm";
import PrescriptionPreview from "../Preview/PrescriptionPreview";
import CalvinAIMedsChat from "./CalvinAIMedsChat";
import PrescriptionOptions from "./PrescriptionOptions";
import PrescriptionPage from "./PrescriptionPage";

const RxPU = ({
  demographicsInfos,
  setPresVisible,
  patientId,
  topicPost,
  activeMeds,
  allergies,
}) => {
  const { user } = useUserContext();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [siteSelectedId, setSiteSelectedId] = useState(user.site_id);
  const [addedMeds, setAddedMeds] = useState([]);
  const [freeText, setFreeText] = useState("");
  const [calvinAIVisible, setCalvinAIVisible] = useState(false);
  const [prescriptionStamp, setPrescriptionStamp] = useState("");
  const uniqueId = uuidv4();

  const { data: sites, isPending, error } = useSites();

  const handleCancel = () => {
    setPresVisible(false);
  };

  const handleAsk = (e) => {
    e.preventDefault();
    setCalvinAIVisible(true);
  };

  const handleSiteChange = async (e) => {
    setSiteSelectedId(parseInt(e.target.value));
  };

  const handlePreview = (e) => {
    e.preventDefault();
    handleAsk(e);
    setPrescriptionStamp(
      timestampToDateTimeSecondsISOTZ(nowTZTimestamp(), false, false)
    );
    setPreviewVisible(true);
  };

  if (isPending)
    return (
      <div style={{ marginBottom: "40px" }}>
        <LoadingParagraph />
      </div>
    );
  if (error)
    return (
      <div style={{ marginBottom: "40px" }}>
        <ErrorParagraph errorMsg={error.message} />
      </div>
    );

  return (
    <>
      <PrescriptionOptions
        handleAsk={handleAsk}
        handlePreview={handlePreview}
        handleCancel={handleCancel}
        handleSiteChange={handleSiteChange}
        sites={sites}
        siteSelectedId={siteSelectedId}
      />
      <div className="prescription__form">
        <PrescriptionPage
          sites={sites}
          siteSelectedId={siteSelectedId}
          patientId={patientId}
          demographicsInfos={demographicsInfos}
          addedMeds={addedMeds}
          setAddedMeds={setAddedMeds}
          uniqueId={uniqueId}
          freeText={freeText}
          setFreeText={setFreeText}
        />
        <div className="prescription__medications">
          <MedicationForm
            patientId={patientId}
            addedMeds={addedMeds}
            setAddedMeds={setAddedMeds}
            freeText={freeText}
            allergies={allergies}
          />
        </div>
      </div>
      {previewVisible && (
        <FakeWindow
          title={`NEW PRESCRIPTION to ${toPatientName(
            demographicsInfos
          )} (PREVIEW)`}
          width={860}
          height={790}
          x={(window.innerWidth - 860) / 2}
          y={(window.innerHeight - 790) / 2}
          color="#931621"
          setPopUpVisible={setPreviewVisible}
        >
          <PrescriptionPreview
            demographicsInfos={demographicsInfos}
            setPreviewVisible={setPreviewVisible}
            siteSelectedId={siteSelectedId}
            sites={sites}
            uniqueId={uniqueId}
            patientId={patientId}
            freeText={freeText}
            addedMeds={addedMeds}
            setAddedMeds={setAddedMeds}
            topicPost={topicPost}
            prescriptionStamp={prescriptionStamp}
          />
        </FakeWindow>
      )}
      {calvinAIVisible && (
        <FakeWindow
          title="CALVIN AI CHAT"
          width={500}
          height={600}
          x={window.innerWidth - 500}
          y={window.innerHeight - 600}
          color="#931621"
          setPopUpVisible={setCalvinAIVisible}
        >
          <CalvinAIMedsChat
            initialMessage={
              addedMeds.length
                ? `Hello i'm a doctor, please check the following drugs interactions:${
                    "\n\n" +
                    addedMeds
                      .map(
                        ({ PrescriptionInstructions }) =>
                          PrescriptionInstructions
                      )
                      .join("\n\n")
                  }
${
  activeMeds &&
  activeMeds.length > 0 &&
  "\n\nThe patient is already taking:\n\n" +
    activeMeds
      .map(({ PrescriptionInstructions }) => PrescriptionInstructions)
      .join("\n\n")
}
${
  allergies &&
  allergies.length > 0 &&
  "\nThe patient has the following allergies: " +
    allergies
      .map(({ OffendingAgentDescription }) => OffendingAgentDescription)
      .join(", ")
}`
                : null
            }
          />
        </FakeWindow>
      )}
    </>
  );
};

export default RxPU;
