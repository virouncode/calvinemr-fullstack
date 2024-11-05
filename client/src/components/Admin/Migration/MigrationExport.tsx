import { useMediaQuery } from "@mui/material";
import JSZip from "jszip";
import { DateTime } from "luxon";
import React, { useState } from "react";
import { toast } from "react-toastify";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";
import useDebounce from "../../../hooks/useDebounce";
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
  const isTabletOrMobile = useMediaQuery("(max-width: 768px)");

  const debouncedSearch = useDebounce(search, 300);

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
    if (isTabletOrMobile) {
      toast.warning("This feature is not available on mobile devices", {
        containerId: "A",
        autoClose: 3000,
      });
      return;
    }
    if (checkedPatients.length === 0) {
      toast.warning("Please choose at least 1 patient !", {
        containerId: "A",
      });
      return;
    }
    setProgress(true);
    const dateOfExport = nowTZ().toFormat("yyyy-LL-dd_hh-mm-ss_a");

    try {
      const zip = new JSZip();
      const exportFolder = zip.folder(`CalvinEMR_Export_${dateOfExport}`);

      for (const patient of checkedPatients) {
        const patientId = patient.patient_id;
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
        const doctorFolder = exportFolder?.folder(
          `${doctorFirstName}_${doctorLastName}_${doctorOHIP}`
        );
        const patientFolder = doctorFolder?.folder(
          `${patientFirstName}_${patientLastName}_${patientId}_${patientDob}`
        );
        const patientReportsFolder = patientFolder?.folder(
          `Reports_files_${patientFirstName}_${patientLastName}`
        );
        const { xmlFinal, reportsFiles } = await exportPatientEMR(
          sortedCheckedRecordsIds,
          patientId,
          patient
        );
        patientFolder?.file(
          `${patientFirstName}_${patientLastName}_${patientId}_${patientDob}.xml`,
          xmlFinal
        );
        await Promise.all(
          reportsFiles.map(async (report) => {
            if (report.url) {
              try {
                const response = await fetch(report.url);
                const blob = await response.blob();
                const arrayBuffer = await blob.arrayBuffer();
                const fileName = report.name || `report_${Date.now()}.pdf`;
                patientReportsFolder?.file(fileName, arrayBuffer);
              } catch (err) {
                if (err instanceof Error)
                  console.error(
                    `Failed to fetch report from ${report.url}: ${err.message}`
                  );
              }
            }
          })
        );
      }
      // Create ReadMe text
      const currentDateTime = DateTime.local({
        zone: "America/Toronto",
        locale: "en-CA",
      });
      const formattedDateTime = currentDateTime.toLocaleString({
        month: "long",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZoneName: "short",
      });
      const readMeContent = `This EMR export from CalvinEMR software was performed by ${user.full_name} on ${formattedDateTime}.
The XML file follows the OntarioMD EMR Specification for EMR Data Migration. For more details, visit: https://www.ontariomd.ca/emr-certification/library/specifications`;

      exportFolder?.file("README.md", readMeContent);

      const content = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = `CalvinEMR_Export_${dateOfExport}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      setProgress(false);
      toast.success("EMR exported successfully in your Downloads folder", {
        containerId: "A",
        autoClose: 2000,
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
    <div className="migration__export">
      <div className="migration__export-form">
        <div className="migration__export-patients">
          <p className="migration__export-patients-title">Patients</p>
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
            search={debouncedSearch}
          />
        </div>
        <div className="migration__export-records">
          <p className="migration__export-records-title">Records</p>
          <MigrationRecordsList
            isRecordIdChecked={isRecordIdChecked}
            handleCheckRecordId={handleCheckRecordId}
            handleCheckAllRecordsIds={handleCheckAllRecordsIds}
            isAllRecordsIdsChecked={isAllRecordsIdsChecked}
            isLoading={progress}
          />
        </div>
      </div>
      <div className="migration__export-btn">
        <SaveButton onClick={handleExport} disabled={progress} label="Export" />
        {progress && <CircularProgressMedium />}
      </div>
    </div>
  );
};

export default MigrationExport;
