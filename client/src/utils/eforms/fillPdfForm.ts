import { PDFCheckBox, PDFDocument, PDFRadioGroup, PDFTextField } from "pdf-lib";
import {
  genderCT,
  provinceStateTerritoryCT,
  toCodeTableName,
} from "../../omdDatas/codesTables";
import {
  ClinicType,
  DemographicsType,
  SiteType,
  StaffType,
} from "../../types/api";
import { UserStaffType } from "../../types/app";
import {
  nowTZTimestamp,
  timestampToDateISOTZ,
  timestampToTimeStrTZ,
} from "../dates/formatDates";
import { cmToFeetAndInches, kgToLbs } from "../measurements/measurements";
import { staffIdToTitleAndName } from "../names/staffIdToTitleAndName";
import {
  toPatientFirstName,
  toPatientLastName,
  toPatientMiddleName,
  toPatientName,
} from "../names/toPatientName";

export const fillPdfForm = async (
  url: string,
  demographicsInfos: DemographicsType,
  staffInfos: StaffType[],
  doctorInfos: UserStaffType,
  site: SiteType,
  clinic: ClinicType
) => {
  if (!demographicsInfos) return;

  try {
    const formUrl = url;
    // Fetch the PDF form
    const formPdfBytes = await fetch(formUrl).then((res) => res.arrayBuffer());
    // Load the PDF document
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
      {
        fieldName: "patient_full_name",
        value: toPatientName(demographicsInfos),
      },
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
      {
        fieldName: "patient_chart_number",
        value: demographicsInfos.ChartNumber,
      },
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
          )?.phoneNumber ||
          demographicsInfos.PhoneNumber.find(
            ({ _phoneNumberType }) => _phoneNumberType === "R"
          )?.phoneNumber,
      },
      { fieldName: "patient_email", value: demographicsInfos.Email ?? "" },
      { fieldName: "patient_sin", value: demographicsInfos.SIN },
      {
        fieldName: "patient_height_cm",
        value:
          demographicsInfos.patient_care_elements?.Height?.sort(
            (a, b) => b.Date - a.Date
          )?.[0]?.Height ?? "",
      },
      {
        fieldName: "patient_height_feet",
        value: cmToFeetAndInches(
          demographicsInfos.patient_care_elements?.Height?.sort(
            (a, b) => b.Date - a.Date
          )?.[0]?.Height ?? ""
        ),
      },
      {
        fieldName: "patient_weight_kg",
        value:
          demographicsInfos.patient_care_elements?.Weight?.sort(
            (a, b) => b.Date - a.Date
          )?.[0]?.Weight ?? "",
      },
      {
        fieldName: "patient_weight_lbs",
        value: kgToLbs(
          demographicsInfos.patient_care_elements?.Weight?.sort(
            (a, b) => b.Date - a.Date
          )?.[0]?.Weight ?? ""
        ),
      },
    ];

    // Loop through the text fields and populate
    for (const data of textFieldsDatas) {
      const field = form.getFieldMaybe(data.fieldName);
      if (field && field instanceof PDFTextField) {
        field.setText(data.value);
      }
    }

    // Handle checkboxes and radio buttons for gender
    if (demographicsInfos.Gender) {
      if (
        form.getFieldMaybe("patient_gender_male_checkbox") &&
        demographicsInfos.Gender === "M"
      ) {
        const field = form.getFieldMaybe("patient_gender_male_checkbox");
        if (field instanceof PDFCheckBox) field.check();
      }
      if (
        form.getFieldMaybe("patient_gender_female_checkbox") &&
        demographicsInfos.Gender === "F"
      ) {
        const field = form.getFieldMaybe("patient_gender_female_checkbox");
        if (field instanceof PDFCheckBox) field.check();
      }
      if (
        form.getFieldMaybe("patient_gender_other_checkbox") &&
        demographicsInfos.Gender === "O"
      ) {
        const field = form.getFieldMaybe("patient_gender_other_checkbox");
        if (field instanceof PDFCheckBox) field.check();
      }
      if (form.getFieldMaybe("patient_gender_radio")) {
        const field = form.getFieldMaybe("patient_gender_radio");
        if (field instanceof PDFRadioGroup) {
          field.select(demographicsInfos.Gender);
        }
      }
    }

    // Embed doctor's signature if available
    if (form.getFieldMaybe("doctor_sign") && doctorInfos.sign?.url) {
      try {
        const signUrl = doctorInfos.sign.url;
        const signImageBytes = await fetch(signUrl).then((res) =>
          res.arrayBuffer()
        );
        let signImage;
        if (signUrl.endsWith(".png")) {
          signImage = await pdfDoc.embedPng(signImageBytes);
        } else if (signUrl.endsWith(".jpg") || signUrl.endsWith(".jpeg")) {
          signImage = await pdfDoc.embedJpg(signImageBytes);
        } else {
          throw new Error("Unsupported image format for signature");
        }

        const signImageField = form.getButton("doctor_sign");
        signImageField.setImage(signImage);
      } catch (error) {
        console.error("Error embedding signature: ", error);
      }
    }

    // Save and return the PDF
    const pdfBytes = await pdfDoc.save();

    const docUrl = URL.createObjectURL(
      new Blob([pdfBytes], { type: "application/pdf" })
    );

    return docUrl;
  } catch (error) {
    console.error("Error processing PDF form: ", error);
    return null;
  }
};

export default fillPdfForm;
