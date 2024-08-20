import React, { useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useParams } from "react-router-dom";
import PatientsClinicGroups from "../../components/Staff/Groups/PatientsClinicGroups";
import PatientsGroups from "../../components/Staff/Groups/PatientsGroups";
import PatientsGroupsToggle from "../../components/Staff/Groups/PatientsGroupsToggle";
import useTitle from "../../hooks/useTitle";

const StaffPatientsGroupsPage = () => {
  const { gtype } = useParams();
  const [groupType, setGroupType] = useState(gtype || "My groups");
  const isTypeChecked = (type: string) => {
    return type === groupType ? true : false;
  };
  const handleTypeChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGroupType(value);
  };
  useTitle("Patients Groups");
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Patients</title>
        </Helmet>
      </HelmetProvider>
      <section className="patients-groups-section">
        <PatientsGroupsToggle
          isTypeChecked={isTypeChecked}
          handleTypeChanged={handleTypeChanged}
        />
        {groupType === "My groups" ? (
          <PatientsGroups />
        ) : (
          <PatientsClinicGroups />
        )}
      </section>
    </>
  );
};

export default StaffPatientsGroupsPage;
