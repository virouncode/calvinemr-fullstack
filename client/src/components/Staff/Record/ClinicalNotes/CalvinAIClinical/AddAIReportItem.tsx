import React from "react";
import { toast } from "react-toastify";
import { DemographicsType, ReportType } from "../../../../../types/api";
import { PromptTextType } from "../../../../../types/app";
import { extractToText } from "../../../../../utils/extractText/extractToText";
import { toAnonymousText } from "../../../../../utils/extractText/toAnonymousText";
import Checkbox from "../../../../UI/Checkbox/Checkbox";

type AddAIReportItemProps = {
  report: ReportType;
  reportsAddedIds: number[];
  setReportsAddedIds: React.Dispatch<React.SetStateAction<number[]>>;
  reportsTextToAdd: { id: number; content: string; date_created: number }[];
  setReportsTextsToAdd: React.Dispatch<
    React.SetStateAction<
      { id: number; content: string; date_created: number }[]
    >
  >;
  demographicsInfos: DemographicsType;
  isLoadingReportText: boolean;
  setIsLoadingReportText: React.Dispatch<React.SetStateAction<boolean>>;
  isLoadingAttachmentText: boolean;
  promptText: PromptTextType;
  setPromptText: React.Dispatch<React.SetStateAction<PromptTextType>>;
  lastItemRef?: (node: Element | null) => void;
};

const AddAIReportItem = ({
  report,
  reportsAddedIds,
  setReportsAddedIds,
  reportsTextToAdd,
  setReportsTextsToAdd,
  demographicsInfos,
  isLoadingReportText,
  setIsLoadingReportText,
  isLoadingAttachmentText,
  promptText,
  setPromptText,
  lastItemRef,
}: AddAIReportItemProps) => {
  const isChecked = (id: number) => reportsAddedIds.includes(id);
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    const id = parseInt(e.target.id);
    let reportsTextsToAddUpdated;
    if (checked) {
      setReportsAddedIds([...reportsAddedIds, id]);
      let textToAdd;
      if (report.Format === "Binary") {
        setIsLoadingReportText(true);
        try {
          const response = await extractToText(
            report.File?.url ?? "",
            report.File?.mime ?? ""
          );
          textToAdd = response.join("");
          setIsLoadingReportText(false);
        } catch (err) {
          if (err instanceof Error)
            toast.error(
              `Error while extracting text from the document:${err.message}`,
              { containerId: "A" }
            );
          setIsLoadingReportText(false);
          return;
        }
      } else {
        textToAdd = report.Content.TextContent;
      }
      textToAdd = toAnonymousText(textToAdd, demographicsInfos);
      reportsTextsToAddUpdated = [
        ...reportsTextToAdd,
        { id, content: textToAdd, date_created: report.date_created },
      ];
      setReportsTextsToAdd(reportsTextsToAddUpdated);
    } else {
      let updatedIds = [...reportsAddedIds];
      updatedIds = updatedIds.filter((documentId) => documentId !== id);
      setReportsAddedIds(updatedIds);
      reportsTextsToAddUpdated = [...reportsTextToAdd].filter(
        (text) => text.id !== id
      );
      setReportsTextsToAdd(reportsTextsToAddUpdated);
    }
    setPromptText({
      ...promptText,
      reports: reportsTextsToAddUpdated
        .map(({ content }) => content)
        .join("\n\n"),
    });
  };

  return (
    <li className="calvinai-prompt__report-item" ref={lastItemRef}>
      <Checkbox
        id={report.id.toString()}
        onChange={handleChange}
        checked={isChecked(report.id)}
        disabled={isLoadingReportText || isLoadingAttachmentText}
        label={report.name}
      />
    </li>
  );
};

export default AddAIReportItem;
