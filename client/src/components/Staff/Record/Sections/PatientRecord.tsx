import { FormControlLabel, Switch } from "@mui/material";
import React, { useState } from "react";
import { toast } from "react-toastify";
import useSocketContext from "../../../../hooks/context/useSocketContext";
import useStaffInfosContext from "../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../hooks/context/useUserContext";
import { usePatientPut } from "../../../../hooks/reactquery/mutations/patientsMutations";
import { DemographicsType } from "../../../../types/api";
import { UserStaffType } from "../../../../types/app";
import { toPatientName } from "../../../../utils/names/toPatientName";
import Button from "../../../UI/Buttons/Button";
import FakeWindow from "../../../UI/Windows/FakeWindow";
import ClinicalNotes from "../ClinicalNotes/ClinicalNotes";
import ExportChart from "../ExportChart/ExportChart";
import ClosedPracticianAccount from "./ClosedPracticianAccount";
import PatientMenuLeft from "./PatientMenuLeft";
import PatientMenuRight from "./PatientMenuRight";

type PatientRecordProps = {
  demographicsInfos: DemographicsType;
  patientId: number;
};

const PatientRecord = ({
  demographicsInfos,
  patientId,
}: PatientRecordProps) => {
  //Hooks
  const { staffInfos } = useStaffInfosContext();
  const { user } = useUserContext() as { user: UserStaffType };
  const { socket } = useSocketContext();
  const [allContentsVisible, setAllContentsVisible] = useState(true);
  const [leftContentsVisible, setLeftContentsVisible] = useState(true);
  const [rightContentsVisible, setRightContentsVisible] = useState(true);
  const [notesVisible, setNotesVisible] = useState(true);
  const [notesContentsVisible, setNotesContentsVisible] = useState(true);
  const [exportVisible, setExportVisible] = useState(false);
  const [messagesAuthorized, setMessagesAuthorized] = useState(
    (user.title === "Doctor" &&
      demographicsInfos.authorized_messages_md.includes(user.id)) ||
      (user.title !== "Doctor" &&
        !demographicsInfos.unauthorized_messages_practicians.includes(user.id))
  );
  //Queries
  const patientPut = usePatientPut(patientId);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setMessagesAuthorized(checked);
    const patientToPut: DemographicsType = {
      ...demographicsInfos,
      authorized_messages_md:
        user.title === "Doctor"
          ? checked
            ? [...demographicsInfos.authorized_messages_md, user.id]
            : demographicsInfos.authorized_messages_md.filter(
                (id) => id !== user.id
              )
          : [...demographicsInfos.authorized_messages_md],
      unauthorized_messages_practicians:
        user.title === "Doctor"
          ? [...demographicsInfos.unauthorized_messages_practicians]
          : checked
          ? demographicsInfos.unauthorized_messages_practicians.filter(
              (id) => id !== user.id
            )
          : [...demographicsInfos.unauthorized_messages_practicians, user.id],
    };
    patientPut.mutate(patientToPut, {
      onError: (err) =>
        toast.error(`Error: unable to save preference: ${err.message}`, {
          containerId: "A",
        }),
    });
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
      ?.account_status === "Closed"
  ) {
    return <ClosedPracticianAccount demographicsInfos={demographicsInfos} />;
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
        <div className="patient-record__btn-container">
          <Button
            onClick={handleClickAllFold}
            label={allContentsVisible ? "Fold All" : "Unfold All"}
          />
          <Button
            onClick={handleClickExport}
            disabled={exportVisible}
            label="Export chart"
          />
          {user.title !== "Secretary" && (
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
          )}
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
        />
        <ClinicalNotes
          demographicsInfos={demographicsInfos}
          notesVisible={notesVisible}
          setNotesVisible={setNotesVisible}
          contentsVisible={notesContentsVisible}
          setContentsVisible={setNotesContentsVisible}
          patientId={patientId}
        />
        <PatientMenuRight
          demographicsInfos={demographicsInfos}
          patientId={patientId}
          contentsVisible={rightContentsVisible}
        />
      </div>
      {exportVisible && (
        <FakeWindow
          title={`EXPORT ${toPatientName(demographicsInfos)}'s MEDICAL RECORD`}
          width={600}
          height={600}
          x={(window.innerWidth - 600) / 2}
          y={(window.innerHeight - 600) / 2}
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
