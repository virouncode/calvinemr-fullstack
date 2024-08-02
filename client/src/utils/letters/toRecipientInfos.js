import {
  provinceStateTerritoryCT,
  toCodeTableName,
} from "../../omdDatas/codesTables";
import { toPatientName } from "../names/toPatientName";

export const toRecipientInfos = (recipient, sites, clinic) => {
  if (recipient.patient_id) {
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
  } else if (recipient.access_level === "staff") {
    const fullName = "Dr. " + recipient.full_name;
    const site = sites.find(({ id }) => id === recipient.site_id);
    const fullAddress = `${site.address}, ${site.city}\n${
      site.province_state
    }, ${site.postal_code || site.zip_code}`;
    return (
      fullName + "\n" + clinic.name + ", " + site.name + "\n" + fullAddress
    );
  } else {
    const address = recipient.Address?.Structured;
    const fullAddress = `${address?.Line1}, ${address?.City}\n${toCodeTableName(
      provinceStateTerritoryCT,
      address?.CountrySubDivisionCode
    )}, ${address?.PostalZipCode.PostalCode || address?.PostalZipCode.ZipCode}`;
    const fullName = "Dr. " + recipient.LastName + ", " + recipient.FirstName;
    return fullName + "\n" + fullAddress;
  }
};
