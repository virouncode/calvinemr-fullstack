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
import ClinicalNotesIcon from "../../../UI/Icons/ClinicalNotesIcon";
import FolderTreeIcon from "../../../UI/Icons/FolderTreeIcon";
import FakeWindow from "../../../UI/Windows/FakeWindow";
import ClinicalNotes from "../ClinicalNotes/ClinicalNotes";
import ExportChart from "../ExportChart/ExportChart";
import ClosedPracticianAccount from "./ClosedPracticianAccount";
import PatientMenuLeft from "./PatientMenuLeft";
import PatientMenuRight from "./PatientMenuRight";

type PatientRecordMobileProps = {
  demographicsInfos: DemographicsType;
  patientId: number;
};

const PatientRecordMobile = ({
  demographicsInfos,
  patientId,
}: PatientRecordMobileProps) => {
  //Hooks
  const { staffInfos } = useStaffInfosContext();
  const { user } = useUserContext() as { user: UserStaffType };
  const { socket } = useSocketContext();
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
  const [topicsVisible, setTopicsVisible] = useState(false);
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
    // if (window.matchMedia("(pointer: coarse)")) {
    //   toast.warning("This feature is not available on mobile devices", {
    //     containerId: "A",
    //     autoClose: 3000,
    //   });
    //   return;
    // }
    setExportVisible(true);
  };

  const handleClickFold = () => {
    if (topicsVisible) {
      setLeftContentsVisible((v) => !v);
      setRightContentsVisible((v) => !v);
    } else {
      setNotesVisible((v) => !v);
    }
  };

  const handleClickFolderTree = () => {
    setTopicsVisible(true);
  };
  const handleClickClinicalNotes = () => {
    setTopicsVisible(false);
  };

  if (
    staffInfos.find(({ id }) => id === demographicsInfos.assigned_staff_id)
      ?.account_status === "Closed"
  ) {
    return <ClosedPracticianAccount demographicsInfos={demographicsInfos} />;
  }

  return (
    <>
      <div className="patient-record-mobile__header">
        <div className="patient-record-mobile__header-row">
          <div className="patient-record-mobile__header-title">
            {topicsVisible ? "CATEGORIES" : "CLINICAL NOTES"}
          </div>
          <div className="patient-record-mobile__header-btns">
            <Button onClick={handleClickExport} label="Export chart" />
            <Button
              onClick={handleClickFold}
              label={
                topicsVisible
                  ? leftContentsVisible
                    ? "Fold"
                    : "Unfold"
                  : notesVisible
                  ? "Fold"
                  : "Unfold"
              }
            />
            {topicsVisible ? (
              <ClinicalNotesIcon onClick={handleClickClinicalNotes} ml={5} />
            ) : (
              <FolderTreeIcon onClick={handleClickFolderTree} ml={5} />
            )}
          </div>
        </div>
        {user.title !== "Secretary" && (
          <div className="patient-record-mobile__header-row patient-record-mobile__header-row--authorize">
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
        )}
      </div>
      <div className="patient-record-mobile__content">
        {topicsVisible ? (
          <div className="patient-record-mobile__topics">
            <PatientMenuLeft
              demographicsInfos={demographicsInfos}
              patientId={patientId}
              contentsVisible={leftContentsVisible}
            />
            <PatientMenuRight
              demographicsInfos={demographicsInfos}
              patientId={patientId}
              contentsVisible={rightContentsVisible}
            />
          </div>
        ) : (
          <ClinicalNotes
            demographicsInfos={demographicsInfos}
            notesVisible={notesVisible}
            setNotesVisible={setNotesVisible}
            contentsVisible={notesContentsVisible}
            setContentsVisible={setNotesContentsVisible}
            patientId={patientId}
          />
        )}
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

export default PatientRecordMobile;
