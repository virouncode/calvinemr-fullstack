import { PDFCheckBox, PDFDocument, PDFRadioGroup, PDFTextField } from "pdf-lib";
import {
  genderCT,
  provinceStateTerritoryCT,
  toCodeTableName,
} from "../../omdDatas/codesTables";
import {
  nowTZTimestamp,
  timestampToDateISOTZ,
  timestampToTimeStrTZ,
} from "../dates/formatDates";
import { cmToFeet, kgToLbs } from "../measurements/measurements";
import { staffIdToTitleAndName } from "../names/staffIdToTitleAndName";
import {
  toPatientFirstName,
  toPatientLastName,
  toPatientMiddleName,
  toPatientName,
} from "../names/toPatientName";

export const fillPdfForm = async (
  url,
  demographicsInfos,
  staffInfos,
  doctorInfos,
  site,
  clinic
) => {
  if (!demographicsInfos) return;
  const formUrl = url;
  const formPdfBytes = await fetch(formUrl).then((res) => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(formPdfBytes);
  const form = pdfDoc.getForm();
  const address =
    demographicsInfos.Address.find(({ _addressType }) => _addressType === "R")
      ?.Structured ||
    demographicsInfos.Address.find(({ _addressType }) => _addressType === "M")
      ?.Structured;
  const [service_date_year, service_date_month, service_date_day] =
    timestampToDateISOTZ(nowTZTimestamp()).split("-");
  const service_time = timestampToTimeStrTZ(nowTZTimestamp());

  const textFieldsDatas = [
    {
      fieldName: "service_date",
      value: timestampToDateISOTZ(nowTZTimestamp()),
    },
    { fieldName: "service_date_year", value: service_date_year },
    { fieldName: "service_date_month", value: service_date_month },
    { fieldName: "service_date_day", value: service_date_day },
    { fieldName: "service_time", value: service_time },
    {
      fieldName: "doctor_full_name",
      value: staffIdToTitleAndName(staffInfos, doctorInfos.id),
    },
    { fieldName: "doctor_first_name", value: doctorInfos.first_name },
    { fieldName: "doctor_last_name", value: doctorInfos.last_name },
    {
      fieldName: "doctor_phone",
      value: doctorInfos.cell_phone || doctorInfos.backup_phone,
    },
    { fieldName: "doctor_email", value: doctorInfos.email },
    { fieldName: "doctor_licence_nbr", value: doctorInfos.licence_nbr },
    { fieldName: "doctor_ohip", value: doctorInfos.ohip_billing_nbr },
    { fieldName: "clinic_name", value: clinic.name },
    { fieldName: "clinic_email", value: clinic.email },
    { fieldName: "clinic_website", value: clinic.website },
    { fieldName: "site_name", value: site.name },
    {
      fieldName: "site_full_address",
      value: `${site.address} ${site.city}\n${site.province_state} ${
        site.postal_code || site.zip_code
      }`,
    },
    { fieldName: "site_address", value: site.address },
    { fieldName: "site_postal_code", value: site.postal_code },
    { fieldName: "site_zip_code", value: site.zip_code },
    { fieldName: "site_province_state", value: site.province_state },
    { fieldName: "site_city", value: site.city },
    { fieldName: "site_phone", value: site.phone },
    { fieldName: "site_fax", value: site.fax },
    { fieldName: "site_email", value: site.email },
    { fieldName: "patient_full_name", value: toPatientName(demographicsInfos) },
    {
      fieldName: "patient_first_name",
      value: toPatientFirstName(demographicsInfos),
    },
    {
      fieldName: "patient_middle_name",
      value: toPatientMiddleName(demographicsInfos),
    },
    {
      fieldName: "patient_last_name",
      value: toPatientLastName(demographicsInfos),
    },
    {
      fieldName: "patient_dob",
      value: timestampToDateISOTZ(demographicsInfos.DateOfBirth),
    },
    {
      fieldName: "patient_hcn_number",
      value: demographicsInfos.HealthCard?.Number,
    },
    {
      fieldName: "patient_hcn_version",
      value: demographicsInfos.HealthCard?.Version,
    },
    {
      fieldName: "patient_hcn_expiry",
      value: timestampToDateISOTZ(demographicsInfos.HealthCard?.ExpiryDate),
    },
    {
      fieldName: "patient_hcn_province_state",
      value: demographicsInfos.HealthCard?.ProvinceCode,
    },
    { fieldName: "patient_chart_number", value: demographicsInfos.ChartNumber },
    {
      fieldName: "patient_gender",
      value: toCodeTableName(genderCT, demographicsInfos.Gender),
    },
    {
      fieldName: "patient_full_address",
      value: `${address?.Line1} ${address?.City}\n${toCodeTableName(
        provinceStateTerritoryCT,
        address?.CountrySubDivisionCode
      )} ${
        address?.PostalZipCode.PostalCode || address?.PostalZipCode.ZipCode
      }`,
    },
    { fieldName: "patient_address", value: address?.Line1 },
    { fieldName: "patient_city", value: address?.City },
    {
      fieldName: "patient_province_state",
      value: toCodeTableName(
        provinceStateTerritoryCT,
        address?.CountrySubDivisionCode
      ),
    },
    {
      fieldName: "patient_postal_code",
      value: address?.PostalZipCode.PostalCode,
    },
    { fieldName: "patient_zip_code", value: address?.PostalZipCode.ZipCode },

    {
      fieldName: "patient_cellphone",
      value:
        demographicsInfos.PhoneNumber.find(
          ({ _phoneNumberType }) => _phoneNumberType === "C"
        ).phoneNumber ||
        demographicsInfos.PhoneNumber.find(
          ({ _phoneNumberType }) => _phoneNumberType === "R"
        ).phoneNumber,
    },

    { fieldName: "patient_email", value: demographicsInfos.Email },
    { fieldName: "patient_sin", value: demographicsInfos.SIN },
    {
      fieldName: "patient_height_cm",
      value: demographicsInfos.patient_care_elements?.Height?.sort(
        (a, b) => b.Date - a.Date
      )?.[0]?.Height,
    },
    {
      fieldName: "patient_height_feet",
      value: cmToFeet(
        demographicsInfos.patient_care_elements?.Height?.sort(
          (a, b) => b.Date - a.Date
        )?.[0]?.Height
      ),
    },
    {
      fieldName: "patient_weight_kg",
      value: demographicsInfos.patient_care_elements?.Weight?.sort(
        (a, b) => b.Date - a.Date
      )?.[0]?.Weight,
    },
    {
      fieldName: "patient_weight_lbs",
      value: kgToLbs(
        demographicsInfos.patient_care_elements?.Weight?.sort(
          (a, b) => b.Date - a.Date
        )?.[0]?.Weight
      ),
    },
  ];

  for (let data of textFieldsDatas) {
    if (form.getFieldMaybe(data.fieldName)) {
      const field = form.getFieldMaybe(data.fieldName);
      if (field instanceof PDFTextField) {
        field.setText(data.value);
      }
    }
  }

  if (form.getFieldMaybe("patient_gender_male_checkbox")) {
    const field = form.getFieldMaybe("patient_gender_male_checkbox");
    if (demographicsInfos.Gender === "M" && field instanceof PDFCheckBox) {
      field.check();
    }
  }
  if (form.getFieldMaybe("patient_gender_male_checkbox")) {
    const field = form.getFieldMaybe("patient_gender_female_checkbox");
    if (demographicsInfos.Gender === "F" && field instanceof PDFCheckBox) {
      field.check();
    }
  }
  if (form.getFieldMaybe("patient_gender_male_checkbox")) {
    const field = form.getFieldMaybe("patient_gender_female_checkbox");
    if (demographicsInfos.Gender === "O" && field instanceof PDFCheckBox) {
      field.check();
    }
  }
  if (form.getFieldMaybe("patient_gender_radio")) {
    const field = form.getFieldMaybe("patient_gender_radio");
    if (field instanceof PDFRadioGroup) {
      switch (demographicsInfos.Gender) {
        case "M":
          field.select("M");
          break;
        case "F":
          field.select("F");
          break;
        case "O":
          field.select("O");
          break;
        default:
          break;
      }
    }
  }
  if (form.getFieldMaybe("doctor_sign") && doctorInfos.sign?.url) {
    const signUrl = doctorInfos.sign.url;
    const signImageBytes = await fetch(signUrl).then((res) =>
      res.arrayBuffer()
    );
    const signImage = await pdfDoc.embedPng(signImageBytes);
    const signImageField = form.getButton("doctor_sign");
    signImageField.setImage(signImage);
  }

  const pdfBytes = await pdfDoc.save();
  const docUrl = URL.createObjectURL(
    new Blob([pdfBytes], { type: "application/pdf" })
  );
  return docUrl;
};

export default fillPdfForm;
