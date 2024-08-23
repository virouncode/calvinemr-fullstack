import { uniqueId } from "lodash";
import React from "react";
import { LetterAttachmentType, ReportType } from "../../../../../../types/api";
import Checkbox from "../../../../../UI/Checkbox/Checkbox";

type LetterAddReportItemProps = {
  report: ReportType;
  reportsAddedIds: number[];
  setReportsAddedIds: React.Dispatch<React.SetStateAction<number[]>>;
  lastItemRef?: (node: Element | null) => void;
  setAttachments: React.Dispatch<React.SetStateAction<LetterAttachmentType[]>>;
};

const LetterAddReportItem = ({
  report,
  reportsAddedIds,
  setReportsAddedIds,
  lastItemRef,
  setAttachments,
}: LetterAddReportItemProps) => {
  const isChecked = (id: number) => reportsAddedIds.includes(id);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    if (checked) {
      setReportsAddedIds([...reportsAddedIds, report.id]);
      setAttachments((a) => [
        ...a,
        {
          file: report.File,
          alias: report.name,
          date_created: report.date_created,
          created_by_id: report.created_by_id,
          type: "report",
          id: uniqueId("letter_attachment_"),
        },
      ]);
    } else {
      setReportsAddedIds(
        reportsAddedIds.filter((reportId) => reportId !== report.id)
      );
      setAttachments((a) => a.filter((item) => item.alias !== report.name));
    }
  };

  return (
    <li className="letter__options-reports-item" ref={lastItemRef}>
      <Checkbox
        id={report.name}
        onChange={handleChange}
        checked={isChecked(report.id)}
        label={report.name}
      />
    </li>
  );
};

export default LetterAddReportItem;
