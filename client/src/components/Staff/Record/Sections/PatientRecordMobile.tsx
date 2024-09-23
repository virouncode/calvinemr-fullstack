import React, { useState } from "react";
import { toast } from "react-toastify";
import xanoPut from "../../../../api/xanoCRUD/xanoPut";
import useSocketContext from "../../../../hooks/context/useSocketContext";
import useStaffInfosContext from "../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../hooks/context/useUserContext";
import { DemographicsType, SettingsType } from "../../../../types/api";
import { UserStaffType } from "../../../../types/app";
import { toPatientName } from "../../../../utils/names/toPatientName";
import Button from "../../../UI/Buttons/Button";
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
  const [allContentsVisible, setAllContentsVisible] = useState(false);
  const [leftContentsVisible, setLeftContentsVisible] = useState(false);
  const [rightContentsVisible, setRightContentsVisible] = useState(false);
  const [notesVisible, setNotesVisible] = useState(true);
  const [notesContentsVisible, setNotesContentsVisible] = useState(true);
  const [exportVisible, setExportVisible] = useState(false);
  const [messagesAuthorized, setMessagesAuthorized] = useState(
    user.settings.authorized_messages_patients_ids.includes(patientId)
  );
  const [topicsVisible, setTopicsVisible] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setMessagesAuthorized(checked);
    try {
      const datasToPut: SettingsType = {
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
      socket?.emit("message", {
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
      if (err instanceof Error)
        toast.error(`Error: unable to save preference: ${err.message}`, {
          containerId: "A",
        });
    }
  };

  const handleClickExport = () => {
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
    setTopicsVisible((v) => !v);
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
        <div className="patient-record-mobile__header-title">PATIENT EMR</div>
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

          <FolderTreeIcon onClick={handleClickFolderTree} ml={5} />
        </div>
      </div>
      <div className="patient-record-mobile__content">
        {topicsVisible && (
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
        )}
        <ClinicalNotes
          demographicsInfos={demographicsInfos}
          notesVisible={notesVisible}
          setNotesVisible={setNotesVisible}
          contentsVisible={notesContentsVisible}
          setContentsVisible={setNotesContentsVisible}
          patientId={patientId}
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

export default PatientRecordMobile;
