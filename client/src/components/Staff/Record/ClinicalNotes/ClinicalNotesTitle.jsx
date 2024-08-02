import useStaffInfosContext from "../../../../hooks/context/useStaffInfosContext";
import { useTopic } from "../../../../hooks/reactquery/queries/topicQueries";
import { useFetchAllPages } from "../../../../hooks/reactquery/useFetchAllPages";
import { genderCT, toCodeTableName } from "../../../../omdDatas/codesTables";
import { getNextPatientAppointments } from "../../../../utils/appointments/getNextPatientAppointments";
import {
  getAgeTZ,
  timestampToDateISOTZ,
  timestampToHumanDateTimeTZ,
} from "../../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../../utils/names/staffIdToTitleAndName";
import { toPatientName } from "../../../../utils/names/toPatientName";
import TriangleButton from "../../../UI/Buttons/TriangleButton";
import ErrorParagraph from "../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../UI/Paragraphs/LoadingParagraph";

const ClinicalNotesTitle = ({
  demographicsInfos,
  notesVisible,
  setNotesVisible,
  contentRef,
  triangleRef,
  loadingPatient,
  errPatient,
  setNewMessageVisible,
}) => {
  const { staffInfos } = useStaffInfosContext();
  const {
    data: patientAppointments,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useTopic("APPOINTMENTS", demographicsInfos.patient_id);

  useFetchAllPages(fetchNextPage, hasNextPage);

  const handleTriangleClick = (e) => {
    e.stopPropagation();
    if (!contentRef.current) return;
    e.target.classList.toggle("triangle--active");
    contentRef.current.classList.toggle("clinical-notes__content--active");
    setNotesVisible((v) => !v);
  };
  const handleTitleClick = () => {
    if (!contentRef.current) return;
    triangleRef.current.classList.toggle("triangle--active");
    contentRef.current.classList.toggle("clinical-notes__content--active");
    setNotesVisible((v) => !v);
  };

  const handleClickMail = (e) => {
    e.stopPropagation();
    setNewMessageVisible(true);
  };

  if (isPending || isFetchingNextPage)
    return (
      <div className="clinical-notes__title">
        <LoadingParagraph />
      </div>
    );
  if (error)
    return (
      <div className="clinical-notes__title">
        <ErrorParagraph errorMsg={error.message} />
      </div>
    );

  const patientNextAppointment = getNextPatientAppointments(
    patientAppointments.pages.flatMap((page) => page.items)
  )[0];

  return (
    <div className="clinical-notes__title" onClick={handleTitleClick}>
      <div>
        <TriangleButton
          handleTriangleClick={handleTriangleClick}
          className={notesVisible ? "triangle triangle--active" : "triangle"}
          color="#21201e"
          triangleRef={triangleRef}
        />
      </div>
      {errPatient && <div>{errPatient}</div>}
      {loadingPatient && <LoadingParagraph />}
      {!loadingPatient && !errPatient && demographicsInfos && (
        <span>
          {toPatientName(demographicsInfos)},{" "}
          {toCodeTableName(genderCT, demographicsInfos.Gender)},{" "}
          {getAgeTZ(demographicsInfos.DateOfBirth)}, born{" "}
          {timestampToDateISOTZ(demographicsInfos.DateOfBirth)}, Chart#:{" "}
          {demographicsInfos.ChartNumber},{" "}
          <i className="fa-regular fa-envelope fa-sm"></i>{" "}
          <span
            style={{ cursor: "pointer", textDecoration: "underline" }}
            onClick={handleClickMail}
          >
            {demographicsInfos.Email}
          </span>
          , <i className="fa-solid fa-phone fa-sm"></i>{" "}
          {
            demographicsInfos.PhoneNumber?.find(
              ({ _phoneNumberType }) => _phoneNumberType === "C"
            )?.phoneNumber
          }
          <br />
          <span>
            {" "}
            Next appointment:{" "}
            {patientNextAppointment
              ? `${timestampToHumanDateTimeTZ(
                  patientNextAppointment.start
                )} with ${staffIdToTitleAndName(
                  staffInfos,
                  patientNextAppointment.host_id
                )}`
              : "no appointment scheduled"}
          </span>
          {demographicsInfos.PersonStatusCode?.PersonStatusAsEnum === "I" && (
            <>
              {" "}
              / <span style={{ color: "red" }}> Patient Inactive</span>
            </>
          )}
          {demographicsInfos.PersonStatusCode?.PersonStatusAsEnum === "D" && (
            <>
              {" "}
              / <span style={{ color: "red" }}> Patient Deceased</span>
            </>
          )}
        </span>
      )}
    </div>
  );
};

export default ClinicalNotesTitle;
