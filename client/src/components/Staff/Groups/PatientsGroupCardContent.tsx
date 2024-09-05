import React from "react";
import { DemographicsType, GroupType } from "../../../types/api";
import EmptyLi from "../../UI/Lists/EmptyLi";
import PatientsGroupItem from "./PatientsGroupItem";

type PatientsGroupCardContentProps = {
  group: GroupType;
};

const PatientsGroupCardContent = ({ group }: PatientsGroupCardContentProps) => {
  const patients = group.patients;
  const order = (group.patients as { patient_infos: DemographicsType }[]).map(
    ({ patient_infos }) => patient_infos.patient_id
  );
  return (
    <>
      <div className="groups__card-description">{group.description}</div>
      <div className="groups__card-list">
        <ul>
          {order.length > 0 ? (
            order.map((item, index) => (
              <PatientsGroupItem
                patient={(
                  patients as { patient_infos: DemographicsType }[]
                ).find(
                  ({ patient_infos }) => patient_infos.patient_id === item
                )}
                key={item}
                index={index}
              />
            ))
          ) : (
            <EmptyLi text="No patients in this group" paddingLateral={8} />
          )}
        </ul>
      </div>
    </>
  );
};

export default PatientsGroupCardContent;
