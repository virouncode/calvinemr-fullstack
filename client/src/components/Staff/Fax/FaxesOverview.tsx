import { useMediaQuery } from "@mui/material";
import React from "react";
import {
  useFaxContactsNames,
  useFaxNotesForFilenames,
} from "../../../hooks/reactquery/queries/faxQueries";
import { FaxInboxType, FaxOutboxType } from "../../../types/api";
import { addDashes } from "../../../utils/phone/addDashes";
import { removeDashes } from "../../../utils/phone/removeDashes";
import EmptyParagraph from "../../UI/Paragraphs/EmptyParagraph";
import FaxesOverviewToolbar from "./FaxesOverviewToolbar";
import FaxThumbnail from "./FaxThumbnail";
import FaxThumbnailMobile from "./FaxThumbnailMobile";

type FaxesOverviewProps = {
  faxes: FaxInboxType[] | FaxOutboxType[];
  setCurrentFaxId: React.Dispatch<React.SetStateAction<string>>;
  setCurrentCallerId: React.Dispatch<React.SetStateAction<string>>;
  faxesSelectedIds: string[];
  setFaxesSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
  section: string;
  search: string;
};

const FaxesOverview = ({
  faxes,
  setCurrentFaxId,
  setCurrentCallerId,
  faxesSelectedIds,
  setFaxesSelectedIds,
  section,
  search,
}: FaxesOverviewProps) => {
  const emptySectionMessages = (sectionName: string) => {
    switch (sectionName) {
      case "Received faxes":
        return `No received faxes in this date range`;
      case "Sent":
        return `No sent faxes in this date range`;
      default:
        return "No faxes in this folder";
    }
  };

  const isTabletOrMobile = useMediaQuery("(max-width: 1024px)");

  const faxNumbers = faxes
    ? section === "Sent"
      ? [
          ...new Set(
            faxes.map((item) =>
              addDashes((item as FaxOutboxType).ToFaxNumber.slice(1))
            )
          ),
        ].filter(Boolean)
      : [
          ...new Set(
            faxes.map((item) => addDashes((item as FaxInboxType).CallerID))
          ),
        ].filter(Boolean)
    : [];

  const fileNames = faxes
    ? faxes.map((item) => (item as FaxInboxType | FaxOutboxType).FileName)
    : [];

  // Appeler les autres hooks avec les données calculées
  const { data: faxContactsNames } = useFaxContactsNames(faxNumbers);
  const { data: faxNotes } = useFaxNotesForFilenames(fileNames);

  const faxesWithNotesAndContactName = faxes
    ? faxes.map((item) => {
        const faxNumber =
          section === "Sent"
            ? (item as FaxOutboxType).ToFaxNumber.slice(1) // Remove leading '1'
            : (item as FaxInboxType).CallerID;
        const contactName =
          faxContactsNames?.find(
            ({ faxNumber: number }) => number === addDashes(faxNumber)
          )?.name || "";
        const note =
          faxNotes?.find(
            (note) =>
              note.FileName === (item as FaxInboxType | FaxOutboxType).FileName
          )?.Notes || "";
        return {
          ...item,
          contactName,
          note,
        };
      })
    : [];

  const faxesToShow = faxesWithNotesAndContactName.filter((item) => {
    const faxNumber =
      section === "Sent"
        ? (item as FaxOutboxType).ToFaxNumber
        : (item as FaxInboxType).CallerID;
    return (
      faxNumber.includes(
        section === "Sent" ? "1" + removeDashes(search) : removeDashes(search)
      ) || item.contactName.toLowerCase().includes(search.toLowerCase())
      // ||
      // item.note.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <>
      <FaxesOverviewToolbar section={section} />
      {faxesToShow && faxesToShow.length > 0 ? (
        faxesToShow.map((item) =>
          isTabletOrMobile ? (
            <FaxThumbnailMobile
              key={item.FileName}
              fax={item}
              setCurrentFaxId={setCurrentFaxId}
              setCurrentCallerId={setCurrentCallerId}
              setFaxesSelectedIds={setFaxesSelectedIds}
              faxesSelectedIds={faxesSelectedIds}
              section={section}
            />
          ) : (
            <FaxThumbnail
              key={item.FileName}
              fax={item}
              setCurrentFaxId={setCurrentFaxId}
              setCurrentCallerId={setCurrentCallerId}
              setFaxesSelectedIds={setFaxesSelectedIds}
              faxesSelectedIds={faxesSelectedIds}
              section={section}
            />
          )
        )
      ) : (
        <EmptyParagraph text={emptySectionMessages(section)} />
      )}
    </>
  );
};

export default FaxesOverview;
