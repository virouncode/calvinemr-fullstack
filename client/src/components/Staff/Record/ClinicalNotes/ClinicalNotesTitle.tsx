import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
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
import { copyTextToClipboard } from "../../../../utils/js/copyToClipboard";
import { staffIdToTitleAndName } from "../../../../utils/names/staffIdToTitleAndName";
import { toPatientName } from "../../../../utils/names/toPatientName";
import TriangleButton from "../../../UI/Buttons/TriangleButton";
import CopyIcon from "../../../UI/Icons/CopyIcon";
import EnvelopeIcon from "../../../UI/Icons/EnvelopeIcon";
import PhoneIcon from "../../../UI/Icons/PhoneIcon";
import ErrorParagraph from "../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../UI/Paragraphs/LoadingParagraph";

type ClinicalNotesTitleProps = {
  demographicsInfos: DemographicsType;
  setNewMessageVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const ClinicalNotesTitle = ({
  demographicsInfos,
  setNewMessageVisible,
}: ClinicalNotesTitleProps) => {
  //Hooks
  const { staffInfos } = useStaffInfosContext();
  const [allInfosVisible, setAllInfosVisible] = useState(true);
  const triangleRef = useRef<SVGSVGElement | null>(null);
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
    if (triangleRef.current)
      triangleRef.current.style.transform = allInfosVisible
        ? "rotate(180deg)"
        : "rotate(90deg)";
    setAllInfosVisible((v) => !v);
  };

  const handleClickMail = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setNewMessageVisible(true);
  };

  const handleCopyPhoneNumber = async (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>
  ) => {
    e.stopPropagation();
    try {
      await copyTextToClipboard(
        demographicsInfos.PhoneNumber?.find(
          ({ _phoneNumberType }) => _phoneNumberType === "C"
        )?.phoneNumber ?? ""
      );
      toast.success("Copied !", { containerId: "A" });
    } catch (err) {
      if (err instanceof Error)
        toast.error(`Unable to copy phone number: ${err.message}`, {
          containerId: "A",
        });
    }
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
      <div className="clinical-notes__header-title-infos">
        <div className="clinical-notes__header-title-infos-demographics">
          <div>
            {toPatientName(demographicsInfos)},{" "}
            {toCodeTableName(genderCT, demographicsInfos.Gender)},{" "}
            {getAgeTZ(demographicsInfos.DateOfBirth)}
          </div>
          {allInfosVisible && (
            <>
              <div>
                Born {timestampToDateISOTZ(demographicsInfos.DateOfBirth)},
                Chart#: {demographicsInfos.ChartNumber}
              </div>
              <div
                style={{ cursor: "pointer", textDecoration: "underline" }}
                onClick={handleClickMail}
              >
                <EnvelopeIcon mr={2} /> {demographicsInfos.Email}
              </div>
              <div>
                <PhoneIcon mr={2} />
                {
                  demographicsInfos.PhoneNumber?.find(
                    ({ _phoneNumberType }) => _phoneNumberType === "C"
                  )?.phoneNumber
                }
                <CopyIcon onClick={handleCopyPhoneNumber} ml={5} />
              </div>
            </>
          )}
        </div>
        {allInfosVisible && (
          <div className="clinical-notes__header-title-infos-assignedmd">
            Assigned practician:{" "}
            {staffIdToTitleAndName(
              staffInfos,
              demographicsInfos.assigned_staff_id
            )}
          </div>
        )}
        {allInfosVisible && (
          <div className="clinical-notes__header-title-infos-next">
            Next appointment:{" "}
            {patientNextAppointment
              ? `${timestampToHumanDateTimeTZ(
                  patientNextAppointment.start
                )} with ${staffIdToTitleAndName(
                  staffInfos,
                  patientNextAppointment.host_id
                )}`
              : "no appointment scheduled"}
          </div>
        )}
        {allInfosVisible && (
          <div className="clinical-notes__header-title-infos-status">
            {demographicsInfos.PersonStatusCode?.PersonStatusAsEnum === "I" && (
              <span style={{ color: "orange" }}>Patient Inactive</span>
            )}
            {demographicsInfos.PersonStatusCode?.PersonStatusAsEnum === "D" && (
              <span style={{ color: "red" }}> Patient Deceased</span>
            )}
          </div>
        )}
      </div>
      <div className="clinical-notes__header-title-triangle">
        <TriangleButton triangleRef={triangleRef} className="triangle-btn" />
      </div>
    </div>
  );
};

export default ClinicalNotesTitle;
