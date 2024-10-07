import React, { useState } from "react";
import useClinicContext from "../../../../../hooks/context/useClinicContext";
import useStaffInfosContext from "../../../../../hooks/context/useStaffInfosContext";
import { useSites } from "../../../../../hooks/reactquery/queries/sitesQueries";
import { DemographicsType, SiteType } from "../../../../../types/api";
import { toPatientLastName } from "../../../../../utils/names/toPatientName";
import Button from "../../../../UI/Buttons/Button";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../../UI/Paragraphs/LoadingParagraph";
import EmptyRow from "../../../../UI/Tables/EmptyRow";
import FakeWindow from "../../../../UI/Windows/FakeWindow";
import ClinicDoctorsList from "./ClinicDoctorsList";
import PatientClinicDoctorItem from "./PatientClinicDoctorItem";

type PatientClinicDoctorsListProps = {
  patientId: number;
  demographicsInfos: DemographicsType;
};

const PatientClinicDoctorsList = ({
  patientId,
  demographicsInfos,
}: PatientClinicDoctorsListProps) => {
  const { staffInfos } = useStaffInfosContext();
  const { clinic } = useClinicContext();
  const patientDoctors = staffInfos.filter(
    (staff) => staff.title === "Doctor" && staff.patients.includes(patientId)
  );
  const [addVisible, setAddVisible] = useState(false);
  const {
    data: sites,
    isPending: isPendingSites,
    error: errorSites,
  } = useSites();

  const handleAdd = () => {
    setAddVisible(true);
  };

  if (isPendingSites) return <LoadingParagraph />;
  if (errorSites) return <ErrorParagraph errorMsg={errorSites.message} />;

  return (
    <>
      <div className="doctors__table-title">
        <span style={{ marginRight: "10px" }}>{`${toPatientLastName(
          demographicsInfos,
          true
        )}'s doctors at ${clinic?.name ?? ""}`}</span>
        <Button onClick={handleAdd} label="Add" disabled={addVisible} />
      </div>
      <div className="doctors__table-container">
        <table className="doctors__table">
          <thead>
            <tr>
              <th>Action</th>
              <th>Last name</th>
              <th>First name</th>
              <th>Speciality</th>
              <th>Licence#</th>
              <th>OHIP#</th>
              <th>Address</th>
              <th>City</th>
              <th>Province/State</th>
              <th>Postal/Zip Code</th>
              <th>Phone</th>
              <th>Fax</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {patientDoctors && patientDoctors.length > 0 ? (
              patientDoctors.map((item) => (
                <PatientClinicDoctorItem
                  item={item}
                  patientId={patientId}
                  key={item.id}
                  site={
                    sites?.find(({ id }) => id === item.site_id) as SiteType
                  }
                  demographicsInfos={demographicsInfos}
                />
              ))
            ) : (
              <EmptyRow colSpan={13} text="No doctors" />
            )}
          </tbody>
        </table>
        {addVisible && (
          <FakeWindow
            title="ADD A NEW CLINIC DOCTOR TO PATIENT"
            width={window.innerWidth}
            height={600}
            x={0}
            y={(window.innerHeight - 600) / 2}
            color="#21201E"
            setPopUpVisible={setAddVisible}
          >
            <ClinicDoctorsList patientId={patientId} sites={sites} />
          </FakeWindow>
        )}
      </div>
    </>
  );
};

export default PatientClinicDoctorsList;
