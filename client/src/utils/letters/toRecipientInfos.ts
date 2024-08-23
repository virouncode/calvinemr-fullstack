import {
  provinceStateTerritoryCT,
  toCodeTableName,
} from "../../omdDatas/codesTables";
import {
  ClinicType,
  DemographicsType,
  DoctorType,
  SiteType,
  StaffType,
} from "../../types/api";
import { toPatientName } from "../names/toPatientName";

export const toRecipientInfos = (
  recipient: DoctorType | StaffType | DemographicsType,
  sites: SiteType[],
  clinic: ClinicType | null
) => {
  if ("patient_id" in recipient) {
    const address =
      recipient.Address.find(({ _addressType }) => _addressType === "R")
        ?.Structured ||
      recipient.Address.find(({ _addressType }) => _addressType === "M")
        ?.Structured;
    const fullAddress = `${address?.Line1}, ${address?.City}\n${toCodeTableName(
      provinceStateTerritoryCT,
      address?.CountrySubDivisionCode
    )}, ${address?.PostalZipCode.PostalCode || address?.PostalZipCode.ZipCode}`;
    return toPatientName(recipient) + "\n" + fullAddress;
  } else if (
    "access_level" in recipient &&
    recipient.access_level === "staff"
  ) {
    const fullName = "Dr. " + recipient.full_name;
    const site = sites.find(({ id }) => id === recipient.site_id);
    const fullAddress = `${site?.address}, ${site?.city}\n${
      site?.province_state
    }, ${site?.postal_code || site?.zip_code}`;
    return (
      fullName + "\n" + clinic?.name + ", " + site?.name + "\n" + fullAddress
    );
  } else {
    const address = (recipient as DoctorType).Address?.Structured;
    const fullAddress = `${address?.Line1}, ${address?.City}\n${toCodeTableName(
      provinceStateTerritoryCT,
      address?.CountrySubDivisionCode
    )}, ${address?.PostalZipCode.PostalCode || address?.PostalZipCode.ZipCode}`;
    const fullName =
      "Dr. " +
      (recipient as DoctorType).LastName +
      ", " +
      (recipient as DoctorType).FirstName;
    return fullName + "\n" + fullAddress;
  }
};
