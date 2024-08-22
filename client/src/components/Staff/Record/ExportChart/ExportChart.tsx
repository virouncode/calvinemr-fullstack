import React, { useState } from "react";
import { DemographicsType, TopicExportType } from "../../../../types/api";
import Button from "../../../UI/Buttons/Button";
import CancelButton from "../../../UI/Buttons/CancelButton";
import Checkbox from "../../../UI/Checkbox/Checkbox";
import FakeWindow from "../../../UI/Windows/FakeWindow";
import ExportChartPreview from "./ExportChartPreview";
import ExportRecordItem from "./ExportRecordItem";

type ExportChartProps = {
  setExportVisible: React.Dispatch<React.SetStateAction<boolean>>;
  patientId: number;
  demographicsInfos: DemographicsType;
};

const ExportChart = ({
  setExportVisible,
  patientId,
  demographicsInfos,
}: ExportChartProps) => {
  //Hooks
  const [recordsSelected, setRecordsSelected] = useState<TopicExportType[]>([
    "DEMOGRAPHICS",
  ]);
  const [allRecordsSelected, setAllRecordsSelected] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);

  const recordsNames: TopicExportType[] =
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

  const isRecordSelected = (recordName: TopicExportType) => {
    return recordsSelected.includes(recordName);
  };

  const handleCancel = () => {
    setExportVisible(false);
  };
  const handleCheckAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    if (checked) {
      setAllRecordsSelected(true);
      setRecordsSelected(recordsNames);
    } else {
      setAllRecordsSelected(false);
      setRecordsSelected(["DEMOGRAPHICS"]);
    }
  };

  const handleCheckRecord = (
    e: React.ChangeEvent<HTMLInputElement>,
    recordName: TopicExportType
  ) => {
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
          <Checkbox
            id="all"
            onChange={handleCheckAll}
            checked={allRecordsSelected}
            label="All"
            mr={10}
          />
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
