import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../UI/Paragraphs/LoadingParagraph";
import FakeWindow from "../../UI/Windows/FakeWindow";
import FaxDetail from "./FaxDetail";

import FaxesOverview from "./FaxesOverview";
import NewFax from "./NewFax";

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
  faxesInbox,
  faxesOutbox,
  isPendingInbox,
  isPendingOutbox,
  errorInbox,
  errorOutbox,
  search,
}) => {
  if (isPendingOutbox || isPendingInbox)
    return (
      <div className="fax-content__box">
        <LoadingParagraph />
      </div>
    );

  if (errorInbox || errorOutbox) {
    return (
      <div className="fax-content__box">
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
      <div className="fax-content__box">
        {currentFaxId === 0 ? (
          <FaxesOverview
            faxes={section === "Received faxes" ? faxesInbox : faxesOutbox}
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
          width={1300}
          height={700}
          x={(window.innerWidth - 1300) / 2}
          y={(window.innerHeight - 700) / 2}
          color={"#94bae8"}
          setPopUpVisible={setNewVisible}
        >
          <NewFax setNewVisible={setNewVisible} />
        </FakeWindow>
      )}
    </>
  );
};

export default FaxBox;
