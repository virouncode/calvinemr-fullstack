import { useState } from "react";
import Button from "../../../UI/Buttons/Button";
import CancelButton from "../../../UI/Buttons/CancelButton";
import FakeWindow from "../../../UI/Windows/FakeWindow";
import ExportRecordItem from "../Sections/ExportRecordItem";
import ExportChartPreview from "./ExportChartPreview";

const ExportChart = ({ setExportVisible, patientId, demographicsInfos }) => {
  const [recordsSelected, setRecordsSelected] = useState(["DEMOGRAPHICS"]);
  const [allRecordsSelected, setAllRecordsSelected] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const isRecordSelected = (recordName) => {
    return recordsSelected.includes(recordName);
  };
  const recordsNames =
    demographicsInfos.Gender === "M"
      ? [
          "DEMOGRAPHICS",
          "CLINICAL NOTES",
          "PAST HEALTH",
          "FAMILY HISTORY",
          "ALERTS & SPECIAL NEEDS",
          "RISK FACTORS",
          "MEDICATIONS & TREATMENTS",
          "FAMILY DOCTORS & SPECIALISTS",
          "PHARMACIES",
          "PERSONAL HISTORY",
          "CARE ELEMENTS",
          "PROBLEM LIST",
          "ALLERGIES & ADVERSE REACTIONS",
          "IMMUNIZATIONS",
          "PAST PRESCRIPTIONS",
          "REPORTS",
          "E-FORMS",
          "LETTERS/REFERRALS",
        ]
      : [
          "DEMOGRAPHICS",
          "CLINICAL NOTES",
          "PAST HEALTH",
          "FAMILY HISTORY",
          "ALERTS & SPECIAL NEEDS",
          "RISK FACTORS",
          "MEDICATIONS & TREATMENTS",
          "FAMILY DOCTORS & SPECIALISTS",
          "PHARMACIES",
          "PERSONAL HISTORY",
          "CARE ELEMENTS",
          "PROBLEM LIST",
          "PREGNANCIES",
          "CYCLES",
          "ALLERGIES & ADVERSE REACTIONS",
          "IMMUNIZATIONS",
          "PAST PRESCRIPTIONS",
          "REPORTS",
          "E-FORMS",
          "LETTERS/REFERRALS",
        ];

  const handleCancel = () => {
    setExportVisible(false);
  };
  const handleCheckAll = (e) => {
    const checked = e.target.checked;
    if (checked) {
      setAllRecordsSelected(true);
      setRecordsSelected(recordsNames);
    } else {
      setAllRecordsSelected(false);
      setRecordsSelected(["DEMOGRAPHICS"]);
    }
  };

  const handleCheckRecord = (e, recordName) => {
    const checked = e.target.checked;
    if (checked) {
      setRecordsSelected((r) => [...r, recordName]);
      if ([...recordsSelected, recordName].length === recordsNames.length) {
        setAllRecordsSelected(true);
      }
    } else {
      setRecordsSelected(recordsSelected.filter((name) => name !== recordName));
      setAllRecordsSelected(false);
    }
  };

  const handlePreview = () => {
    setPreviewVisible(true);
  };
  return (
    <div className="export-chart">
      <p className="export-chart__title">Records to export</p>
      <ul className="export-chart__records">
        <li className="export-chart__records-item">
          <input
            type="checkbox"
            checked={allRecordsSelected}
            onChange={handleCheckAll}
            id="all"
          />
          <label htmlFor="all">All</label>
        </li>
        {recordsNames.map((recordName) => (
          <ExportRecordItem
            recordName={recordName}
            isRecordSelected={isRecordSelected}
            key={recordName}
            handleCheckRecord={handleCheckRecord}
          />
        ))}
      </ul>
      <div className="export-chart__btn-container">
        <Button
          onClick={handlePreview}
          label="Preview"
          disabled={!recordsSelected.length}
        />
        <CancelButton onClick={handleCancel} />
      </div>
      {previewVisible && (
        <FakeWindow
          title="EXPORT CHART PREVIEW"
          width={900}
          height={800}
          x={(window.innerWidth - 900) / 2}
          y={(window.innerHeight - 800) / 2}
          color={"#94bae8"}
          setPopUpVisible={setPreviewVisible}
        >
          <ExportChartPreview
            recordsSelected={recordsSelected.sort(
              (a, b) => recordsNames.indexOf(a) - recordsNames.indexOf(b)
            )}
            patientId={patientId}
            demographicsInfos={demographicsInfos}
            setPreviewVisible={setPreviewVisible}
          />
        </FakeWindow>
      )}
    </div>
  );
};

export default ExportChart;
