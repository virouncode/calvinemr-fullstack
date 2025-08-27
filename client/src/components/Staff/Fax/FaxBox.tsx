import { useMediaQuery } from "@mui/material";
import React from "react";
import { FaxInboxType, FaxOutboxType } from "../../../types/api";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../UI/Paragraphs/LoadingParagraph";
import FakeWindow from "../../UI/Windows/FakeWindow";
import FaxDetail from "./FaxDetail";
import FaxesOverview from "./FaxesOverview";
import NewFax from "./NewFax";
import NewFaxMobile from "./NewFaxMobile";

type FaxBoxProps = {
  section: string;
  newVisible: boolean;
  setNewVisible: React.Dispatch<React.SetStateAction<boolean>>;
  faxesSelectedIds: string[];
  setFaxesSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
  currentFaxId: string;
  currentCallerId: string;
  setCurrentFaxId: React.Dispatch<React.SetStateAction<string>>;
  setCurrentCallerId: React.Dispatch<React.SetStateAction<string>>;
  faxes: FaxInboxType[] | FaxOutboxType[];
  isPendingInbox: boolean;
  isPendingOutbox: boolean;
  errorInbox: Error | null;
  errorOutbox: Error | null;
  search: string;
};

const FaxBox = ({
  section,
  newVisible,
  setNewVisible,
  faxesSelectedIds,
  setFaxesSelectedIds,
  currentFaxId,
  currentCallerId,
  setCurrentFaxId,
  setCurrentCallerId,
  faxes,
  isPendingInbox,
  isPendingOutbox,
  errorInbox,
  errorOutbox,
  search,
}: FaxBoxProps) => {
  const isTabletOrMobile = useMediaQuery("(max-width: 1024px)");

  if (isPendingOutbox || isPendingInbox)
    return (
      <div className="fax__content-box">
        <LoadingParagraph />
      </div>
    );

  if (errorInbox || errorOutbox) {
    return (
      <div className="fax__content-box">
        <ErrorParagraph
          errorMsg={`Unable to retrieve faxes:${
            errorInbox?.message || errorOutbox?.message
          }`}
        />
      </div>
    );
  }

  return (
    <>
      <div className="fax__content-box">
        {!currentFaxId ? (
          <FaxesOverview
            faxes={faxes}
            setCurrentFaxId={setCurrentFaxId}
            setCurrentCallerId={setCurrentCallerId}
            faxesSelectedIds={faxesSelectedIds}
            setFaxesSelectedIds={setFaxesSelectedIds}
            section={section}
            search={search}
          />
        ) : (
          <FaxDetail
            setCurrentFaxId={setCurrentFaxId}
            currentFaxId={currentFaxId}
            currentCallerId={currentCallerId}
            section={section}
          />
        )}
      </div>
      {newVisible && (
        <FakeWindow
          title="NEW FAX"
          width={1000}
          height={700}
          x={(window.innerWidth - 1000) / 2}
          y={(window.innerHeight - 700) / 2}
          color={"#94bae8"}
          setPopUpVisible={setNewVisible}
        >
          {isTabletOrMobile ? (
            <NewFaxMobile setNewVisible={setNewVisible} />
          ) : (
            <NewFax setNewVisible={setNewVisible} />
          )}
        </FakeWindow>
      )}
    </>
  );
};

export default FaxBox;
