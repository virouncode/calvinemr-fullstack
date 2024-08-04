import { useFetchAllPages } from "../../../../../hooks/reactquery/useFetchAllPages";
import { genderCT, toCodeTableName } from "../../../../../omdDatas/codesTables";
import {
  getAgeTZ,
  timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import { toPatientName } from "../../../../../utils/names/toPatientName";
import PrintButton from "../../../../UI/Buttons/PrintButton";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../../UI/Paragraphs/LoadingParagraph";
import ClinicalNoteCardPrint from "./ClinicalNoteCardPrint";

const ClinicalNotesPrint = ({
  demographicsInfos,
  clinicalNotes,
  checkedNotes,
  selectAll,
  isPending,
  error,
  fetchNextPage,
  isFetchingNextPage,
  hasNextPage,
}) => {
  useFetchAllPages(fetchNextPage, hasNextPage, selectAll);
  const handlePrint = (e) => {
    e.nativeEvent.view.print();
  };

  if (isPending)
    return (
      <div className="clinical-notes__print-page">
        <LoadingParagraph />
      </div>
    );

  if (error)
    return (
      <div className="clinical-notes__print-page">
        <ErrorParagraph errorMsg={error.message} />
      </div>
    );

  const clinicalNotesToPrint = selectAll
    ? clinicalNotes
    : clinicalNotes.filter(({ id }) => checkedNotes.includes(id));

  return (
    <div className="clinical-notes__print-page">
      <p style={{ textAlign: "center" }}>
        <PrintButton
          onClick={handlePrint}
          className="clinical-notes__print-page-btn"
        />
      </p>
      <p
        style={{
          fontSize: "0.85rem",
          fontFamily: "Arial",
          marginLeft: "5px",
        }}
      >
        <em>
          {toPatientName(demographicsInfos)},{" "}
          {toCodeTableName(genderCT, demographicsInfos.Gender)},{" "}
          {getAgeTZ(demographicsInfos.DateOfBirth)}, born{" "}
          {timestampToDateISOTZ(demographicsInfos.DateOfBirth)}, Chart Nbr:{" "}
          {demographicsInfos.ChartNumber},{" "}
          <i className="fa-regular fa-envelope fa-sm"></i>{" "}
          {demographicsInfos.Email}, <i className="fa-solid fa-phone fa-sm"></i>{" "}
          {
            demographicsInfos.PhoneNumber?.find(
              ({ _phoneNumberType }) => _phoneNumberType === "C"
            )?.phoneNumber
          }
        </em>
      </p>
      {clinicalNotesToPrint.map((clinicalNote) => (
        <ClinicalNoteCardPrint
          clinicalNote={clinicalNote}
          key={clinicalNote.id}
        />
      ))}
      {isFetchingNextPage && (
        <LoadingParagraph style={{ fontFamily: "Lato, Arial, sans-serif" }} />
      )}
    </div>
  );
};

export default ClinicalNotesPrint;
