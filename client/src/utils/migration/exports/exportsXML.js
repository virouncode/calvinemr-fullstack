import axios from "axios";
import xmlFormat from "xml-formatter";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import { recordCategories } from "./recordCategories";
import { removeEmptyTags } from "./removeEmptyTags";
axios.defaults.withCredentials = true;

export const exportPatientEMR = async (
  checkedRecordCategoriesIds,
  patientFirstName,
  patientLastName,
  patientId,
  patientDob,
  doctorFirstName,
  doctorLastName,
  doctorOHIP,
  authorName,
  dateOfExport,
  patientInfos
) => {
  const xmlHeader = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><!--file created by CALVIN EMR, compliant with EMR Data Migration 5.0 - Schema v1.0; Publication Date: August 4,2017; Status: Final-->
`;
  let xmlContent = "";
  for (let categoryId of checkedRecordCategoriesIds) {
    const categoryName = recordCategories.find(
      ({ id }) => id === categoryId
    ).name;
    const categoryURL = recordCategories.find(
      ({ id }) => id === categoryId
    ).url;
    const categoryTemplate = recordCategories.find(
      ({ id }) => id === categoryId
    ).template;

    xmlContent += await exportEMRCategory(
      categoryName,
      categoryURL,
      categoryTemplate,
      [patientId],
      patientInfos
    );
  }

  //xmlFormat for identation
  const xmlFinal = xmlFormat(
    removeEmptyTags(
      xmlHeader +
        `<OmdCds xmlns="cds"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="cds /Users/virounkattygnarath/Desktop/EMR_Data_Schema.xsd"
    xmlns:cdsd="cds_dt"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"><PatientRecord>${xmlContent}</PatientRecord></OmdCds>`
    ),
    { collapseContent: true, indentation: "  " }
  );

  let reportsFiles = [];
  if (checkedRecordCategoriesIds.includes(13)) {
    reportsFiles = (
      await xanoGet("/reports_of_patient", "admin", {
        patient_id: patientId,
      })
    )
      .filter(({ Format }) => Format === "Binary")
      .map(({ File }) => File);
  }

  await axios.post(`/api/writeXML`, {
    xmlFinal,
    patientFirstName,
    patientLastName,
    patientId,
    patientDob,
    doctorFirstName,
    doctorLastName,
    doctorOHIP,
    authorName,
    dateOfExport,
    reportsFiles,
  });
};

export const exportEMRCategory = async (
  categoryName,
  categoryURL,
  categoryTemplate,
  checkedPatients = null,
  patientInfos
) => {
  let jsArrayToExport = [];
  if (checkedPatients) {
    try {
      jsArrayToExport = await xanoGet(`${categoryURL}_of_patients`, "admin", {
        patients: checkedPatients,
      });
    } catch (err) {
      console.log(err.message);
    }
  } else {
    //All patients
    try {
      jsArrayToExport = await xanoGet(categoryURL, "admin");
    } catch (err) {
      console.log(err.message);
    }
  }
  let xmlContent = "";

  for (let jsObj of jsArrayToExport) {
    if (categoryName === "Demographics") {
      jsObj.UniqueVendorIdSequence = jsObj.patient_id;
      delete jsObj.patient_id;
      jsObj.PreferredPharmacy = jsObj.preferred_pharmacy;
      delete jsObj.preferred_pharmacy;
    }
    xmlContent += categoryTemplate(jsObj, patientInfos);
  }

  return xmlContent;
};
