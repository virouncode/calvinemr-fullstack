import { DateTime } from "luxon";
import React, { useState } from "react";
import { toast } from "react-toastify";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";
import { AdminType, DemographicsType } from "../../../types/api";
import { SearchPatientType } from "../../../types/app";
import { nowTZ } from "../../../utils/dates/formatDates";
import { exportPatientEMR } from "../../../utils/migration/exports/exportsXML";
import { recordCategories } from "../../../utils/migration/exports/recordCategories";
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
  const { user } = useUserContext() as { user: AdminType };
  const { staffInfos } = useStaffInfosContext();
  const [search, setSearch] = useState<SearchPatientType>({
    name: "",
    email: "",
    phone: "",
    birth: "",
    chart: "",
    health: "",
  });
  const [checkedPatients, setCheckedPatients] = useState<DemographicsType[]>(
    []
  );
  const [allPatientsChecked, setAllPatientsChecked] = useState(false);
  const [checkedRecordsIds, setCheckedRecordsIds] = useState([1]);
  const [allRecordsIdsChecked, setAllRecordsIdsChecked] = useState(false);
  const [progress, setProgress] = useState(false);

  const isPatientChecked = (id: number) => {
    return checkedPatients.map(({ patient_id }) => patient_id).includes(id);
  };
  const isRecordIdChecked = (id: number) => {
    return checkedRecordsIds.includes(id) ? true : false;
  };
  const handleCheckPatient = (
    e: React.ChangeEvent<HTMLInputElement>,
    patient: DemographicsType
  ) => {
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
  const handleCheckRecordId = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    const checked = e.target.checked;
    if (checked) {
      setCheckedRecordsIds([...checkedRecordsIds, id]);
      if ([...checkedRecordsIds, id].length === recordCategories.length) {
        setAllRecordsIdsChecked(true);
      }
    } else {
      setAllRecordsIdsChecked(false);
      setCheckedRecordsIds(
        checkedRecordsIds.filter((recordId) => recordId !== id)
      );
    }
  };
  const isAllRecordsIdsChecked = () => {
    return allRecordsIdsChecked ? true : false;
  };

  const handleCheckAllPatients = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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
  const handleCheckAllRecordsIds = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      for (const patient of checkedPatients) {
        const patientFirstName = toPatientFirstName(patient);
        const patientLastName = toPatientLastName(patient);
        const patientDob = DateTime.fromMillis(patient.DateOfBirth ?? 0, {
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
      if (err instanceof Error)
        toast.error(
          `EMR export fail, please contact CalvinEMR: ${err.message}`,
          {
            containerId: "A",
            autoClose: 5000,
          }
        );
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            allPatientsChecked={allPatientsChecked}
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
            isLoading={progress}
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
