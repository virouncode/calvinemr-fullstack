import _ from "lodash";
import { DateTime } from "luxon";
import React, { useState } from "react";
import { toast } from "react-toastify";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";
import { useAppointmentPost } from "../../../hooks/reactquery/mutations/appointmentsMutations";
import { useMessagesExternalPostBatch } from "../../../hooks/reactquery/mutations/messagesMutations";
import { useStaffAppointments } from "../../../hooks/reactquery/queries/appointmentsQueries";
import { useAssignedPracticianAvailability } from "../../../hooks/reactquery/queries/availabilityQueries";
import { AppointmentModeType, MessageExternalType } from "../../../types/api";
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
import { modes } from "../../UI/Lists/AppointmentModeSelect";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../UI/Paragraphs/LoadingParagraph";
import AppointmentsSlots from "./AppointmentsSlots";
import WeekPicker from "./WeekPicker";

const NewAppointments = () => {
  //Hooks
  const { user } = useUserContext() as { user: UserPatientType };
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
  const [appointmentMode, setAppointmentMode] =
    useState<AppointmentModeType>("in-person");
  const messagesExternalPost = useMessagesExternalPostBatch();

  //Queries
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
  // const messagesExternalPost = useMessagesExternalPostBatch();
  const appointmentPost = useAppointmentPost();

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
      (await confirmAlert({
        content: `You are about to request an appointment with ${staffIdToTitleAndName(
          staffInfos,
          user.demographics.assigned_staff_id
        )}, from ${timestampToHumanDateTimeTZ(
          appointmentSelected?.start
        )} to ${timestampToHumanDateTimeTZ(
          appointmentSelected?.end
        )}, do you confirm ?`,
      })) &&
      appointmentSelected
    ) {
      //get all secretaries id
      const secretariesIds = staffInfos
        .filter(({ title }) => title === "Secretary")
        .map(({ id }) => id);
      //create the message
      const messagesToPost: Partial<MessageExternalType>[] = [];
      try {
        for (const secretaryId of secretariesIds) {
          const messageToPost = {
            from_patient_id: user.id,
            to_staff_id: secretaryId,
            subject: "Appointment request",
            body: `Hello ${staffIdToTitleAndName(staffInfos, secretaryId)},

      I would like to have an appointment (${
        modes.find(({ id }) => id === appointmentMode)?.name
      }) with ${staffIdToTitleAndName(
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
          messagesToPost.push(messageToPost);
        }
        messagesExternalPost.mutate(messagesToPost);
        toast.success(`Appointment request sent successfully`, {
          containerId: "A",
        });
        setRequestSent(true);
        setTimeout(() => setRequestSent(false), 6000);
      } catch (err) {
        if (err instanceof Error)
          toast.error(
            `Couldn't send the appointment request : ${err.message}`,
            {
              containerId: "A",
            }
          );
      }
      // const assignedStaff = staffInfos.find(
      //   ({ id }) => id === user.demographics.assigned_staff_id
      // );
      // const appointmentToPost: Partial<AppointmentType> = {
      //   host_id: user.demographics.assigned_staff_id,
      //   date_created: nowTZTimestamp(),
      //   created_by_id: user.id,
      //   created_by_user_type: "patient",
      //   start: appointmentSelected.start,
      //   end: appointmentSelected.end,
      //   room_id: "z",
      //   all_day: false,
      //   AppointmentTime: timestampToTimeISOTZ(appointmentSelected.start),
      //   Duration: Math.floor(
      //     (appointmentSelected.end - appointmentSelected.start) / (1000 * 60)
      //   ),
      //   AppointmentStatus: "Scheduled",
      //   AppointmentDate: timestampToDateISOTZ(appointmentSelected.start),
      //   AppointmentPurpose: "Appointment",
      //   site_id: assignedStaff?.site_id,
      //   recurrence: "Once",
      //   Provider: {
      //     Name: {
      //       FirstName: assignedStaff?.first_name ?? "",
      //       LastName: assignedStaff?.last_name ?? "",
      //     },
      //     OHIPPhysicianId: assignedStaff?.ohip_billing_nbr ?? "",
      //   },
      //   appointment_type: appointmentMode,
      //   patients_guests_ids: [user.id],
      // };
      // appointmentPost.mutate(appointmentToPost, {
      //   onSuccess: () => {
      //     setAppointmentSelected(null);
      //     setRequestSent(true);
      //     setTimeout(() => setRequestSent(false), 6000);
      //   },
      // });
    }
  };

  const assignedStaff = staffInfos.find(
    ({ id }) => id === user.demographics.assigned_staff_id
  );
  if (assignedStaff?.account_status === "Closed") {
    return (
      <div className="patient-appointments__new">
        <div className="patient-appointments__new-title">
          Request new appointment
        </div>
        <div className="patient-appointments__new-practician">
          <label>With: </label>
          {staffIdToTitleAndName(
            staffInfos,
            user.demographics.assigned_staff_id,
            true
          )}
        </div>
        <p className="patient-appointments__new-disclaimer">
          Your assigned practitioner is no longer working at the clinic. Please
          contact the clinic to be assigned a new practitioner
        </p>
      </div>
    );
  }

  return (
    <div className="patient-appointments__new">
      <div className="patient-appointments__new-title">
        Request new appointment
      </div>
      <p className="patient-appointments__new-disclaimer">
        These time slots are automatically generated based on the availability
        of your practitioner:{" "}
        {staffIdToTitleAndName(staffInfos, user.demographics.assigned_staff_id)}
        . If you require different time options, please contact the clinic
        directly.
      </p>
      {(error || errorAvailability) && (
        <ErrorParagraph
          errorMsg={error?.message || errorAvailability?.message || ""}
        />
      )}
      <div className="patient-appointments__new-content">
        {isPending || isPendingAvailability ? (
          <div style={{ height: "100%" }}>
            <LoadingParagraph />
          </div>
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
              appointmentMode={appointmentMode}
              setAppointmentMode={setAppointmentMode}
            />
          )
        )}
      </div>
      {/*{requestSent && (
        <p className="patient-appointments__new-success">
          Your request has been sent to{" "}
          {staffIdToTitleAndName(
            staffInfos,
            user.demographics.assigned_staff_id
          )}
          .{" "}
          <strong>
            Please wait for the practician to confirm your appointment
          </strong>
        </p>
      )}*/}
      {requestSent && (
        <p className="patient-appointments__new-success">
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
      <WeekPicker
        handleClickNext={handleClickNext}
        handleClickPrevious={handleClickPrevious}
        rangeStart={rangeStart}
      />
      <div className="patient-appointments__new-btn">
        <SaveButton
          onClick={handleSubmit}
          disabled={_.isEmpty(appointmentSelected)}
          label="Submit"
        />
      </div>
    </div>
  );
};

export default NewAppointments;
