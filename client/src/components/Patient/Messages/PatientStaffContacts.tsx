import React from "react";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";
import { UserPatientType } from "../../../types/app";
import { splitStaffInfosForPatient } from "../../../utils/appointments/splitStaffInfos";
import XmarkRectangleIcon from "../../UI/Icons/XmarkRectangleIcon";
import PatientStaffContactsCategory from "./PatientStaffContactsCategory";

type PatientStaffContactsProps = {
  isContactChecked: (id: number) => boolean;
  handleCheckContact: (e: React.ChangeEvent<HTMLInputElement>) => void;
  closeCross?: boolean;
  recipientsRef?: React.MutableRefObject<HTMLDivElement | null>;
};

const PatientStaffContacts = ({
  isContactChecked,
  handleCheckContact,
  closeCross,
  recipientsRef,
}: PatientStaffContactsProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserPatientType };
  const { staffInfos } = useStaffInfosContext();
  const categoryInfos = splitStaffInfosForPatient(
    staffInfos,
    user.demographics.authorized_messages_md,
    user.demographics.unauthorized_messages_practicians
  );
  const handleClose = () => {
    if (recipientsRef?.current)
      recipientsRef.current.style.transform = "translateX(-200%)";
  };

  return (
    <div className="contacts">
      <div className="contacts__title">
        Recipients{" "}
        {closeCross && (
          <XmarkRectangleIcon color=" #3d375a" onClick={handleClose} />
        )}
      </div>
      <div className="contacts__list">
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
