import React from "react";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";
import { UserPatientType } from "../../../types/app";
import { splitStaffInfos } from "../../../utils/appointments/splitStaffInfos";
import PatientStaffContactsCategory from "./PatientStaffContactsCategory";

type PatientStaffContactsProps = {
  isContactChecked: (id: number) => boolean;
  handleCheckContact: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const PatientStaffContacts = ({
  isContactChecked,
  handleCheckContact,
}: PatientStaffContactsProps) => {
  const { staffInfos } = useStaffInfosContext();
  const { user } = useUserContext() as { user: UserPatientType };
  const categoryInfos = splitStaffInfos(staffInfos);

  return (
    <div className="contacts">
      <div className="contacts__title">Recipients</div>
      <div className="contacts__lists">
        {categoryInfos
          .filter((category) => category.infos.length !== 0)
          .map((category) => (
            <PatientStaffContactsCategory
              categoryInfos={category.infos}
              categoryName={category.name}
              handleCheckContact={handleCheckContact}
              isContactChecked={isContactChecked}
              key={category.name}
            />
          ))}
      </div>
    </div>
  );
};

export default PatientStaffContacts;
