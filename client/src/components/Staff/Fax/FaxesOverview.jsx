import EmptyParagraph from "../../UI/Paragraphs/EmptyParagraph";
import FaxThumbnail from "./FaxThumbnail";
import FaxesOverviewToolbar from "./FaxesOverviewToolbar";

const FaxesOverview = ({
  faxes,
  setCurrentFaxId,
  setCurrentCallerId,
  faxesSelectedIds,
  setFaxesSelectedIds,
  section,
  search,
}) => {
  const emptySectionMessages = (sectionName) => {
    switch (sectionName) {
      case "Received faxes":
        return `No received faxes in this date range`;
      case "Sent":
        return `No sent faxes in this date range`;
      default:
        break;
    }
  };

  const faxesToShow =
    section === "Received faxes"
      ? faxes.filter(({ CallerID }) => ("1" + CallerID).includes(search))
      : faxes.filter(({ ToFaxNumber }) => ToFaxNumber.includes(search));

  return (
    <>
      <FaxesOverviewToolbar section={section} />
      {faxesToShow && faxesToShow.length > 0 ? (
        faxesToShow.map((item) => (
          <FaxThumbnail
            key={item.FileName}
            fax={item}
            setCurrentFaxId={setCurrentFaxId}
            setCurrentCallerId={setCurrentCallerId}
            setFaxesSelectedIds={setFaxesSelectedIds}
            faxesSelectedIds={faxesSelectedIds}
            section={section}
          />
        ))
      ) : (
        <EmptyParagraph text={emptySectionMessages(section)} />
      )}
    </>
  );
};

export default FaxesOverview;
