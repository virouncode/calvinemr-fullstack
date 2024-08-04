import { useState } from "react";
import { toast } from "react-toastify";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";
import { exportPatientEMR } from "../../../utils/migration/exports/exportsXML";
import { recordCategories } from "../../../utils/migration/exports/recordCategories";

import { DateTime } from "luxon";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import { nowTZ } from "../../../utils/dates/formatDates";
import {
  staffIdToFirstName,
  staffIdToLastName,
  staffIdToOHIP,
} from "../../../utils/names/staffIdToName";
import {
  toPatientFirstName,
  toPatientLastName,
} from "../../../utils/names/toPatientName";
import SaveButton from "../../UI/Buttons/SaveButton";
import CircularProgressMedium from "../../UI/Progress/CircularProgressMedium";
import MigrationPatientSearchForm from "./MigrationPatientSearchForm";
import MigrationPatientsList from "./MigrationPatientsList";
import MigrationRecordsList from "./MigrationRecordsList";

const MigrationExport = () => {
  const { user } = useUserContext();
  const { staffInfos } = useStaffInfosContext();
  const [search, setSearch] = useState({
    name: "",
    email: "",
    phone: "",
    birth: "",
    chart: "",
    health: "",
  });

  const [checkedPatients, setCheckedPatients] = useState([]);
  const [allPatientsChecked, setAllPatientsChecked] = useState(false);
  const [checkedRecordsIds, setCheckedRecordsIds] = useState([1]);
  const [allRecordsIdsChecked, setAllRecordsIdsChecked] = useState(false);
  const [progress, setProgress] = useState(false);

  const isPatientChecked = (id) => {
    return checkedPatients
      .map(({ patient_id }) => patient_id)
      .includes(parseInt(id));
  };
  const isRecordIdChecked = (id) => {
    return checkedRecordsIds.includes(parseInt(id)) ? true : false;
  };
  const handleCheckPatient = (e, patient) => {
    const checked = e.target.checked;
    if (checked) {
      setCheckedPatients([...checkedPatients, patient]);
    } else {
      setAllPatientsChecked(false);
      setCheckedPatients(
        checkedPatients.filter(
          ({ patient_id }) => patient_id !== patient.patient_id
        )
      );
    }
  };
  const handleCheckRecordId = (e, id) => {
    const checked = e.target.checked;
    if (checked) {
      setCheckedRecordsIds([...checkedRecordsIds, id]);
    } else {
      setAllRecordsIdsChecked(false);
      setCheckedRecordsIds(
        checkedRecordsIds.filter((recordId) => recordId !== id)
      );
    }
  };
  const isAllPatientsChecked = () => {
    return allPatientsChecked ? true : false;
  };
  const isAllRecordsIdsChecked = () => {
    return allRecordsIdsChecked ? true : false;
  };

  const handleCheckAllPatients = async (e) => {
    const checked = e.target.checked;
    if (checked) {
      const allPatients = await xanoGet("/demographics", "admin");
      setCheckedPatients(allPatients);
      setAllPatientsChecked(true);
    } else {
      setCheckedPatients([]);
      setAllPatientsChecked(false);
    }
  };
  const handleCheckAllRecordsIds = (e) => {
    const checked = e.target.checked;
    if (checked) {
      setAllRecordsIdsChecked(true);
      setCheckedRecordsIds(recordCategories.map(({ id }) => id));
    } else {
      setCheckedRecordsIds([1]);
      setAllRecordsIdsChecked(false);
    }
  };

  const handleExport = async () => {
    if (checkedPatients.length === 0) {
      alert("Please choose at least 1 patient !");
      return;
    }
    setProgress(true);
    const dateOfExport = nowTZ().toFormat("yyyy-LL-dd_hh-mm-ss_a");
    try {
      for (let patient of checkedPatients) {
        const patientFirstName = toPatientFirstName(patient);
        const patientLastName = toPatientLastName(patient);
        const patientDob = DateTime.fromMillis(patient.DateOfBirth, {
          zone: "America/Toronto",
        }).toFormat("ddLLyyyy");
        const doctorFirstName = staffIdToFirstName(
          staffInfos,
          patient.assigned_staff_id
        );

        const doctorLastName = staffIdToLastName(
          staffInfos,
          patient.assigned_staff_id
        );
        const doctorOHIP = staffIdToOHIP(staffInfos, patient.assigned_staff_id);
        const sortedCheckedRecordsIds = [...checkedRecordsIds].sort(
          (a, b) => a - b
        );
        await exportPatientEMR(
          sortedCheckedRecordsIds,
          patientFirstName,
          patientLastName,
          patient.patient_id,
          patientDob,
          doctorFirstName,
          doctorLastName,
          doctorOHIP,
          user.full_name,
          dateOfExport,
          patient
        );
      }
      setProgress(false);
      toast.success("EMR exported successfully in your Downloads folder", {
        containerId: "A",
        autoClose: 5000,
      });
    } catch (err) {
      setProgress(false);
      toast.error(`EMR export fail, please contact CalvinEMR: ${err.message}`, {
        containerId: "A",
        autoClose: 5000,
      });
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setSearch({ ...search, [name]: value });
  };

  return (
    <div className="migration-export">
      <div className="migration-export__form">
        <div className="migration-export__patients">
          <p className="migration-export__patients-title">Patients</p>
          <MigrationPatientSearchForm
            search={search}
            handleSearch={handleSearch}
          />
          <MigrationPatientsList
            isPatientChecked={isPatientChecked}
            handleCheckPatient={handleCheckPatient}
            handleCheckAllPatients={handleCheckAllPatients}
            isAllPatientsChecked={isAllPatientsChecked}
            progress={progress}
            search={search}
          />
        </div>
        <div className="migration-export__records">
          <p className="migration-export__records-title">Records</p>
          <MigrationRecordsList
            isRecordIdChecked={isRecordIdChecked}
            handleCheckRecordId={handleCheckRecordId}
            handleCheckAllRecordsIds={handleCheckAllRecordsIds}
            isAllRecordsIdsChecked={isAllRecordsIdsChecked}
            progress={progress}
          />
        </div>
      </div>
      <div className="migration-export__btn">
        <SaveButton onClick={handleExport} disabled={progress} label="Export" />
        {progress && <CircularProgressMedium />}
      </div>
    </div>
  );
};

export default MigrationExport;
