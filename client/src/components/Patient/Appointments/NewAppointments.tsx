import _ from "lodash";
import { DateTime } from "luxon";
import React, { useState } from "react";
import { toast } from "react-toastify";
import xanoPost from "../../../api/xanoCRUD/xanoPost";
import useSocketContext from "../../../hooks/context/useSocketContext";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";
import { useStaffAppointments } from "../../../hooks/reactquery/queries/appointmentsQueries";
import { useAssignedPracticianAvailability } from "../../../hooks/reactquery/queries/availabilityQueries";
import { AppointmentProposalType, UserPatientType } from "../../../types/app";
import { getAppointmentsInRange } from "../../../utils/appointments/getAppointmentsInRange";
import {
  nowTZ,
  nowTZTimestamp,
  timestampToHumanDateTimeTZ,
} from "../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../utils/names/staffIdToTitleAndName";
import { toPatientName } from "../../../utils/names/toPatientName";
import SaveButton from "../../UI/Buttons/SaveButton";
import { confirmAlert } from "../../UI/Confirm/ConfirmGlobal";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../UI/Paragraphs/LoadingParagraph";
import AppointmentsSlots from "./AppointmentsSlots";
import WeekPicker from "./WeekPicker";

const NewAppointments = () => {
  const { user } = useUserContext() as { user: UserPatientType };
  const { socket } = useSocketContext();
  const { staffInfos } = useStaffInfosContext();
  const [rangeStart, setRangeStart] = useState(
    nowTZ().plus({ days: 1 }).startOf("day").toMillis()
  ); //tomorrow midnight
  const [rangeEnd, setRangeEnd] = useState(
    nowTZ().plus({ days: 1, weeks: 1 }).startOf("day").toMillis()
  );
  const [appointmentSelected, setAppointmentSelected] =
    useState<AppointmentProposalType | null>(null);
  const [requestSent, setRequestSent] = useState(false);

  const {
    data: staffAppointmentsInRange,
    isPending,
    error,
  } = useStaffAppointments(
    user.demographics.assigned_staff_id,
    rangeStart,
    rangeEnd
  );

  const {
    data: availability,
    isPending: isPendingAvailability,
    error: errorAvailability,
  } = useAssignedPracticianAvailability(user.demographics.assigned_staff_id);

  //Take recurring events into account

  const handleClickNext = async () => {
    setRangeStart((rs) =>
      DateTime.fromMillis(rs, { zone: "America/Toronto" })
        .plus({ weeks: 1 })
        .toMillis()
    );
    setRangeEnd((re) =>
      DateTime.fromMillis(re, { zone: "America/Toronto" })
        .plus({ weeks: 1 })
        .toMillis()
    );
    setAppointmentSelected(null);
  };
  const handleClickPrevious = () => {
    setRangeStart((rs) =>
      DateTime.fromMillis(rs, { zone: "America/Toronto" })
        .minus({ weeks: 1 })
        .toMillis()
    );
    setRangeEnd((re) =>
      DateTime.fromMillis(re, { zone: "America/Toronto" })
        .minus({ weeks: 1 })
        .toMillis()
    );
    setAppointmentSelected(null);
  };

  const handleSubmit = async () => {
    if (
      await confirmAlert({
        content: `You are about to request an appointment with ${staffIdToTitleAndName(
          staffInfos,
          user.demographics.assigned_staff_id
        )}, from ${timestampToHumanDateTimeTZ(
          appointmentSelected?.start
        )} to ${timestampToHumanDateTimeTZ(
          appointmentSelected?.end
        )}, do you confirm ?`,
      })
    ) {
      //get all secretaries id
      const secretariesIds = staffInfos
        .filter(({ title }) => title === "Secretary")
        .map(({ id }) => id);

      //create the message
      try {
        for (const secretaryId of secretariesIds) {
          const message = {
            from_patient_id: user.id,
            to_staff_id: secretaryId,
            subject: "Appointment request",
            body: `Hello ${staffIdToTitleAndName(staffInfos, secretaryId)},

I would like to have an appointment with ${staffIdToTitleAndName(
              staffInfos,
              user.demographics.assigned_staff_id
            )},

From ${timestampToHumanDateTimeTZ(
              appointmentSelected?.start
            )} to ${timestampToHumanDateTimeTZ(appointmentSelected?.end)}
  
Please call me or send me a message to confirm the appointment.

Patient: ${toPatientName(user.demographics)}
Chart Nbr: ${user.demographics.ChartNumber}
Cellphone: ${
              user.demographics.PhoneNumber.find(
                ({ _phoneNumberType }) => _phoneNumberType === "C"
              )?.phoneNumber
            }`,
            read_by_patients_ids: [user.id],
            date_created: nowTZTimestamp(),
            type: "External",
          };
          const response = await xanoPost(
            "/messages_external",
            "patient",
            message
          );
          socket?.emit("message", {
            route: "MESSAGES INBOX EXTERNAL",
            action: "create",
            content: { data: response },
          });
          socket?.emit("message", {
            route: "MESSAGES WITH PATIENT",
            action: "create",
            content: { data: response },
          });
        }
        toast.success(`Appointment request sent successfully`, {
          containerId: "A",
        });
        setRequestSent(true);
        setTimeout(() => setRequestSent(false), 6000);
      } catch (err) {
        toast.error(`Couldn't send the appointment request : ${err.text}`, {
          containerId: "A",
        });
      }
    }
  };

  if (
    staffInfos.find(({ id }) => id === user.demographics.assigned_staff_id)
      ?.account_status === "Closed"
  ) {
    return (
      <div className="new-appointments">
        <div className="new-appointments__title">Request a new appointment</div>
        <div className="assigned-practicians-list">
          <label>With: </label>
          {staffIdToTitleAndName(
            staffInfos,
            user.demographics.assigned_staff_id,
            true
          )}
        </div>
        <p className="new-appointments__disclaimer">
          Your assigned practitioner is no longer working at the clinic. Please
          contact the clinic to be assigned a new practitioner
        </p>
      </div>
    );
  }

  return (
    <div className="new-appointments">
      <div className="new-appointments__title">Request a new appointment</div>
      <div className="assigned-practicians-list">
        <label>With: </label>
        {staffIdToTitleAndName(
          staffInfos,
          user.demographics.assigned_staff_id,
          true
        )}
      </div>
      <p className="new-appointments__disclaimer">
        These time slots are automatically generated based on the availability
        of your practitioner. If you require different time options, please
        contact the clinic directly.
      </p>
      {(error || errorAvailability) && (
        <ErrorParagraph
          errorMsg={error?.message || errorAvailability?.message || ""}
        />
      )}
      {isPending || isPendingAvailability ? (
        <LoadingParagraph />
      ) : (
        !error &&
        !errorAvailability &&
        availability.id && (
          <AppointmentsSlots
            availability={availability}
            appointmentsInRange={getAppointmentsInRange(
              staffAppointmentsInRange,
              rangeStart,
              rangeEnd
            )}
            practicianSelectedId={user.demographics.assigned_staff_id}
            staffInfos={staffInfos}
            rangeStart={rangeStart}
            setAppointmentSelected={setAppointmentSelected}
            appointmentSelected={appointmentSelected}
          />
        )
      )}
      <>
        <WeekPicker
          handleClickNext={handleClickNext}
          handleClickPrevious={handleClickPrevious}
          rangeStart={rangeStart}
        />
        <div className="new-appointments__submit">
          <SaveButton
            onClick={handleSubmit}
            disabled={_.isEmpty(appointmentSelected)}
            label="Submit"
          />
        </div>
      </>
      {requestSent && (
        <p className="new-appointments__confirm">
          Your request has been sent,{" "}
          <strong>
            Please wait for a secretary to confirm your appointment with{" "}
            {staffIdToTitleAndName(
              staffInfos,
              user.demographics.assigned_staff_id
            )}
          </strong>
        </p>
      )}
    </div>
  );
};

export default NewAppointments;
