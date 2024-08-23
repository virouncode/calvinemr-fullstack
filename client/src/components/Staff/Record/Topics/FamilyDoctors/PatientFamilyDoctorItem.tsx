import React, { useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { useDoctorPut } from "../../../../../hooks/reactquery/mutations/doctorsMutations";
import {
  provinceStateTerritoryCT,
  toCodeTableName,
} from "../../../../../omdDatas/codesTables";
import { DoctorType } from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
import { nowTZTimestamp } from "../../../../../utils/dates/formatDates";
import Button from "../../../../UI/Buttons/Button";

type PatientFamilyDoctorItemProps = {
  item: DoctorType;
  patientId: number;
  lastItemRef?: (node: Element | null) => void;
};

const PatientFamilyDoctorItem = ({
  item,
  patientId,
  lastItemRef,
}: PatientFamilyDoctorItemProps) => {
  const { user } = useUserContext() as { user: UserStaffType };
  const [progress, setProgress] = useState(false);
  const doctorPut = useDoctorPut();

  const handleRemoveFromPatient = async () => {
    setProgress(true);
    const doctorToPut: DoctorType = {
      ...item,
      patients: item.patients.filter((id) => id !== patientId),
      updates: [
        ...item.updates,
        {
          date_updated: nowTZTimestamp(),
          updated_by_id: user.id,
          updated_by_user_type: "staff",
        },
      ],
    };
    doctorPut.mutate(doctorToPut, {
      onSuccess: () => setProgress(false),
      onError: () => setProgress(false),
    });
  };

  return (
    <tr className="doctors__item" ref={lastItemRef}>
      <td>
        <Button
          onClick={handleRemoveFromPatient}
          disabled={progress}
          label="Remove from patient"
        />
      </td>
      <td>{item.LastName}</td>
      <td>{item.FirstName}</td>
      <td>{item.speciality}</td>
      <td>{item.licence_nbr}</td>
      <td>{item.ohip_billing_nbr}</td>
      <td>{item.Address.Structured.Line1}</td>
      <td>{item.Address.Structured.City}</td>
      <td>
        {toCodeTableName(
          provinceStateTerritoryCT,
          item.Address.Structured.CountrySubDivisionCode
        )}
      </td>
      <td>
        {item.Address.Structured.PostalZipCode.PostalCode ||
          item.Address.Structured.PostalZipCode.ZipCode}
      </td>
      <td>{item.PhoneNumber[0].phoneNumber}</td>
      <td>{item.FaxNumber.phoneNumber}</td>
      <td>{item.EmailAddress}</td>
    </tr>
  );
};

export default PatientFamilyDoctorItem;
