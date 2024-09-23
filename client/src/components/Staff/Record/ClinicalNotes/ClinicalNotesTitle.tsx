import React from "react";
import useStaffInfosContext from "../../../../hooks/context/useStaffInfosContext";
import { useTopic } from "../../../../hooks/reactquery/queries/topicQueries";
import { useFetchAllPages } from "../../../../hooks/reactquery/useFetchAllPages";
import { genderCT, toCodeTableName } from "../../../../omdDatas/codesTables";
import { DemographicsType } from "../../../../types/api";
import { getNextPatientAppointments } from "../../../../utils/appointments/getNextPatientAppointments";
import {
  getAgeTZ,
  timestampToDateISOTZ,
  timestampToHumanDateTimeTZ,
} from "../../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../../utils/names/staffIdToTitleAndName";
import { toPatientName } from "../../../../utils/names/toPatientName";
import TriangleButton from "../../../UI/Buttons/TriangleButton";
import EnvelopeIcon from "../../../UI/Icons/EnvelopeIcon";
import PhoneIcon from "../../../UI/Icons/PhoneIcon";
import ErrorParagraph from "../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../UI/Paragraphs/LoadingParagraph";

type ClinicalNotesTitleProps = {
  demographicsInfos: DemographicsType;
  notesVisible: boolean;
  setNotesVisible: React.Dispatch<React.SetStateAction<boolean>>;
  contentRef: React.MutableRefObject<HTMLDivElement | null>;
  triangleRef: React.MutableRefObject<SVGSVGElement | null>;
  setNewMessageVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const ClinicalNotesTitle = ({
  demographicsInfos,
  notesVisible,
  setNotesVisible,
  contentRef,
  triangleRef,
  setNewMessageVisible,
}: ClinicalNotesTitleProps) => {
  //Hooks
  const { staffInfos } = useStaffInfosContext();
  //Queries
  const {
    data: patientAppointments,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useTopic("APPOINTMENTS", demographicsInfos.patient_id);
  useFetchAllPages(fetchNextPage, hasNextPage);

  const handleTitleClick = () => {
    if (!contentRef.current) return;
    if (triangleRef.current)
      triangleRef.current.classList.toggle("triangle--active");
    contentRef.current.classList.toggle("clinical-notes__content--active");
    setNotesVisible((v) => !v);
  };

  const handleClickMail = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setNewMessageVisible(true);
  };

  if (isPending || isFetchingNextPage)
    return (
      <div className="clinical-notes__header-title">
        <LoadingParagraph />
      </div>
    );
  if (error)
    return (
      <div className="clinical-notes__header-title">
        <ErrorParagraph errorMsg={error.message} />
      </div>
    );

  const patientNextAppointment = getNextPatientAppointments(
    patientAppointments.pages.flatMap((page) => page.items)
  )[0];

  return (
    <div className="clinical-notes__header-title" onClick={handleTitleClick}>
      <div className="clinical-notes__header-title-btn">
        <TriangleButton
          className={notesVisible ? "triangle triangle--active" : "triangle"}
          color="#21201e"
          triangleRef={triangleRef}
        />
      </div>
      <div className="clinical-notes__header-title-infos">
        <span>
          {toPatientName(demographicsInfos)},{" "}
          {toCodeTableName(genderCT, demographicsInfos.Gender)},{" "}
          {getAgeTZ(demographicsInfos.DateOfBirth)}
        </span>
        <span>
          Born {timestampToDateISOTZ(demographicsInfos.DateOfBirth)}, Chart#:{" "}
          {demographicsInfos.ChartNumber}
        </span>
        <span
          style={{ cursor: "pointer", textDecoration: "underline" }}
          onClick={handleClickMail}
        >
          <EnvelopeIcon /> {demographicsInfos.Email}
        </span>
        <span>
          <PhoneIcon />{" "}
          {
            demographicsInfos.PhoneNumber?.find(
              ({ _phoneNumberType }) => _phoneNumberType === "C"
            )?.phoneNumber
          }
        </span>
        <span>
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
        <span>
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
      </div>
    </div>
  );
};

export default ClinicalNotesTitle;
