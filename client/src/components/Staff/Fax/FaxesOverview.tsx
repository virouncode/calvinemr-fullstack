import { useMediaQuery } from "@mui/material";
import React from "react";
import { useFaxContactsNames } from "../../../hooks/reactquery/queries/faxQueries";
import { FaxInboxType, FaxOutboxType } from "../../../types/api";
import { addDashes } from "../../../utils/phone/addDashes";
import { removeDashes } from "../../../utils/phone/removeDashes";
import EmptyParagraph from "../../UI/Paragraphs/EmptyParagraph";
import FaxesOverviewToolbar from "./FaxesOverviewToolbar";
import FaxThumbnail from "./FaxThumbnail";
import FaxThumbnailMobile from "./FaxThumbnailMobile";

type FaxesOverviewProps = {
  faxes: FaxInboxType[] | FaxOutboxType[] | undefined;
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
        return "";
    }
  };

  const isTabletOrMobile = useMediaQuery("(max-width: 1024px)");

  // const faxesToShow = faxes
  //   ? section === "Received faxes"
  //     ? (faxes as FaxInboxType[]).filter(({ CallerID }) =>
  //         CallerID.includes(removeDashes(search))
  //       )
  //     : (faxes as FaxOutboxType[]).filter(({ ToFaxNumber }) =>
  //         ToFaxNumber.includes("1" + removeDashes(search))
  //       )
  //   : [];

  const faxNumbers = faxes
    ? section === "Received faxes"
      ? [
          ...new Set(
            faxes.map((item) => addDashes((item as FaxInboxType).CallerID))
          ),
        ]
      : [
          ...new Set(
            faxes.map((item) => addDashes((item as FaxOutboxType).ToFaxNumber))
          ),
        ]
    : [];

  const { data: faxContactsNames } = useFaxContactsNames(faxNumbers);

  const faxesWithContactName = faxes
    ? faxes.map((item) => {
        const faxNumber =
          section === "Received faxes"
            ? (item as FaxInboxType).CallerID
            : (item as FaxOutboxType).ToFaxNumber;
        const contactName =
          faxContactsNames?.find(
            ({ faxNumber: number }) => number === addDashes(faxNumber)
          )?.name || "";
        return {
          ...item,
          contactName,
        };
      })
    : [];

  const faxesToShow = faxesWithContactName.filter((item) => {
    const faxNumber =
      section === "Received faxes"
        ? (item as FaxInboxType).CallerID
        : (item as FaxOutboxType).ToFaxNumber;
    return (
      addDashes(faxNumber).includes(removeDashes(search)) ||
      item.contactName.toLowerCase().includes(search.toLowerCase())
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
