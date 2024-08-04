import { FormControlLabel, Switch } from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";
import xanoPut from "../../../../api/xanoCRUD/xanoPut";
import useSocketContext from "../../../../hooks/context/useSocketContext";
import useStaffInfosContext from "../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../hooks/context/useUserContext";
import { toPatientName } from "../../../../utils/names/toPatientName";
import Button from "../../../UI/Buttons/Button";
import FakeWindow from "../../../UI/Windows/FakeWindow";
import ClinicalNotes from "../ClinicalNotes/ClinicalNotes";
import ExportChart from "../ExportChart/ExportChart";
import ClosedPractician from "./ClosedPractician";
import PatientMenuLeft from "./PatientMenuLeft";
import PatientMenuRight from "./PatientMenuRight";

const PatientRecord = ({
  demographicsInfos,
  loadingPatient,
  errPatient,
  patientId,
}) => {
  //HOOKS
  const { staffInfos } = useStaffInfosContext();
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const [allContentsVisible, setAllContentsVisible] = useState(false);
  const [leftContentsVisible, setLeftContentsVisible] = useState(false);
  const [rightContentsVisible, setRightContentsVisible] = useState(false);
  const [notesVisible, setNotesVisible] = useState(true);
  const [notesContentsVisible, setNotesContentsVisible] = useState(true);
  const [exportVisible, setExportVisible] = useState(false);
  const [messagesAuthorized, setMessagesAuthorized] = useState(
    user.settings.authorized_messages_patients_ids.includes(patientId)
  );

  const handleChange = async (e) => {
    console.log("allo");
    const checked = e.target.checked;
    setMessagesAuthorized(checked);
    try {
      const datasToPut = {
        ...user.settings,
        authorized_messages_patients_ids: checked
          ? [...user.settings.authorized_messages_patients_ids, patientId]
          : user.settings.authorized_messages_patients_ids.filter(
              (id) => id !== patientId
            ),
      };
      const response = await xanoPut(
        `/settings/${user.settings.id}`,
        "staff",
        datasToPut
      );
      socket.emit("message", {
        route: "USER",
        action: "update",
        content: {
          id: user.id,
          data: {
            ...user,
            settings: response,
          },
        },
      });
    } catch (err) {
      toast.error(`Error: unable to save preference: ${err.message}`, {
        containerId: "A",
      });
    }
  };

  const handleClickExport = () => {
    setExportVisible(true);
  };
  const handleClickAllFold = () => {
    if (allContentsVisible) {
      setAllContentsVisible(false);
      setLeftContentsVisible(false);
      setRightContentsVisible(false);
      setNotesContentsVisible(false);
      setNotesVisible(false);
    } else {
      setAllContentsVisible(true);
      setLeftContentsVisible(true);
      setRightContentsVisible(true);
      setNotesContentsVisible(true);
      setNotesVisible(true);
    }
  };
  const handleClickLeftFold = () => {
    setLeftContentsVisible((v) => !v);
  };
  const handleClickRightFold = () => {
    setRightContentsVisible((v) => !v);
  };

  if (
    staffInfos.find(({ id }) => id === demographicsInfos.assigned_staff_id)
      .account_status === "Closed"
  ) {
    return <ClosedPractician demographicsInfos={demographicsInfos} />;
  }

  return (
    <>
      <div className="patient-record__actions">
        <div className="patient-record__btn-container">
          <Button
            onClick={handleClickLeftFold}
            label={leftContentsVisible ? "Fold" : "Unfold"}
          />
        </div>
        <div className="patient-record__btn-container patient-record__btn-container--center">
          <div style={{ textAlign: "end" }}>
            <Button
              onClick={handleClickAllFold}
              label={allContentsVisible ? "Fold All" : "Unfold All"}
            />
            <Button
              onClick={handleClickExport}
              disabled={exportVisible}
              label="Export chart"
            />
          </div>
          <div style={{ textAlign: "end", marginRight: "10px" }}>
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={messagesAuthorized}
                  onChange={handleChange}
                />
              }
              label="Authorize messages"
              labelPlacement="start"
            />
          </div>
        </div>
        <div className="patient-record__btn-container">
          <Button
            onClick={handleClickRightFold}
            label={rightContentsVisible ? "Fold" : "Unfold"}
          />
        </div>
      </div>
      <div className="patient-record__content">
        <PatientMenuLeft
          demographicsInfos={demographicsInfos}
          patientId={patientId}
          contentsVisible={leftContentsVisible}
          loadingPatient={loadingPatient}
          errPatient={errPatient}
        />
        <ClinicalNotes
          demographicsInfos={demographicsInfos}
          notesVisible={notesVisible}
          setNotesVisible={setNotesVisible}
          contentsVisible={notesContentsVisible}
          setContentsVisible={setNotesContentsVisible}
          patientId={patientId}
          loadingPatient={loadingPatient}
          errPatient={errPatient}
        />
        <PatientMenuRight
          demographicsInfos={demographicsInfos}
          patientId={patientId}
          contentsVisible={rightContentsVisible}
          loadingPatient={loadingPatient}
          errPatient={errPatient}
        />
      </div>
      {exportVisible && (
        <FakeWindow
          title={`EXPORT ${toPatientName(demographicsInfos)}'s MEDICAL RECORD`}
          width={600}
          height={500}
          x={(window.innerWidth - 600) / 2}
          y={(window.innerHeight - 500) / 2}
          color="#94bae8"
          setPopUpVisible={setExportVisible}
        >
          <ExportChart
            setExportVisible={setExportVisible}
            patientId={patientId}
            demographicsInfos={demographicsInfos}
          />
        </FakeWindow>
      )}
    </>
  );
};

export default PatientRecord;
