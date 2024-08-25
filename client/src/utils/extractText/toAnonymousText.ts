import {
  provinceStateTerritoryCT,
  toCodeTableName,
} from "../../omdDatas/codesTables";
import { DemographicsType } from "../../types/api";

const replaceInsensitive = (text: string, searchValue: string) => {
  if (!searchValue) return text;
  const escapedSearchValue = searchValue.replace(
    /[-/\\^$*+?.()|[\]{}]/g,
    "\\$&"
  ); // Escape special characters in the search value
  const regex = new RegExp(escapedSearchValue, "gi");
  return text.replace(regex, "");
};

export const toAnonymousText = (
  text: string,
  demographicsInfos: DemographicsType
) => {
  let result = text;
  result = replaceInsensitive(
    result,
    demographicsInfos.Names?.LegalName?.FirstName?.Part
  );
  result = replaceInsensitive(
    result,
    demographicsInfos.Names?.LegalName?.OtherName?.[0]?.Part
  );
  result = replaceInsensitive(
    result,
    demographicsInfos.Names?.LegalName?.LastName?.Part
  );
  result = replaceInsensitive(result, demographicsInfos.SIN);
  result = replaceInsensitive(result, demographicsInfos.HealthCard?.Number);
  result = replaceInsensitive(
    result,
    demographicsInfos.PhoneNumber?.find(
      ({ _phoneNumberType }) => _phoneNumberType === "C"
    )?.phoneNumber ?? ""
  );
  result = replaceInsensitive(
    result,
    demographicsInfos.PhoneNumber?.find(
      ({ _phoneNumberType }) => _phoneNumberType === "W"
    )?.phoneNumber ?? ""
  );
  result = replaceInsensitive(
    result,
    demographicsInfos.PhoneNumber?.find(
      ({ _phoneNumberType }) => _phoneNumberType === "R"
    )?.phoneNumber ?? ""
  );
  result = replaceInsensitive(
    result,
    demographicsInfos.Address?.find(({ _addressType }) => _addressType === "R")
      ?.Structured?.Line1 ?? ""
  );
  result = replaceInsensitive(
    result,
    demographicsInfos.Address?.find(({ _addressType }) => _addressType === "R")
      ?.Structured?.PostalZipCode?.PostalCode ?? ""
  );
  result = replaceInsensitive(
    result,
    demographicsInfos.Address?.find(({ _addressType }) => _addressType === "R")
      ?.Structured?.PostalZipCode?.ZipCode ?? ""
  );
  result = replaceInsensitive(
    result,
    demographicsInfos.Address?.find(({ _addressType }) => _addressType === "R")
      ?.Structured?.CountrySubDivisionCode ?? ""
  );
  result = replaceInsensitive(
    result,
    toCodeTableName(
      provinceStateTerritoryCT,
      demographicsInfos.Address?.find(
        ({ _addressType }) => _addressType === "R"
      )?.Structured?.CountrySubDivisionCode ?? ""
    )
  );
  result = replaceInsensitive(
    result,
    demographicsInfos.Address?.find(({ _addressType }) => _addressType === "R")
      ?.Structured?.City ?? ""
  );
  result = replaceInsensitive(result, demographicsInfos.Email);
  return result;
};
