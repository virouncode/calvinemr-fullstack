import React, { useState } from "react";
import { toast } from "react-toastify";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";
import { useMessageExternalPost } from "../../../hooks/reactquery/mutations/messagesMutations";
import { AppointmentType, MessageExternalType } from "../../../types/api";
import { UserPatientType } from "../../../types/app";
import {
  nowTZTimestamp,
  timestampToHumanDateTimeTZ,
} from "../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../utils/names/staffIdToTitleAndName";
import SaveButton from "../../UI/Buttons/SaveButton";
import { confirmAlert } from "../../UI/Confirm/ConfirmGlobal";
import EmptyLi from "../../UI/Lists/EmptyLi";
import NextAppointmentItem from "./NextAppointmentItem";

type NextAppointmentsProps = {
  nextAppointments: AppointmentType[];
};

const NextAppointments = ({ nextAppointments }: NextAppointmentsProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserPatientType };
  const { staffInfos } = useStaffInfosContext();
  const [appointmentSelectedId, setAppointmentSelectedId] = useState(0);
  const [requestSent, setRequestSent] = useState(false);
  //Queries
  const messagePost = useMessageExternalPost();

  const isAppointmentSelected = (id: number) => appointmentSelectedId === id;
  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    const id = parseInt(e.target.id);
    if (checked) setAppointmentSelectedId(id);
    else setAppointmentSelectedId(0);
  };
  const handleDeleteAppointment = async () => {
    if (
      await confirmAlert({
        content: "Do you really want to cancel this appointment ?",
      })
    ) {
      try {
        //get all secretaries id
        const secretariesIds = staffInfos
          .filter(({ title }) => title === "Secretary")
          .map(({ id }) => id);
        //create the message
        //send to all secretaries
        const appointment = nextAppointments.find(
          ({ id }) => id === appointmentSelectedId
        );

        for (const secretaryId of secretariesIds) {
          const messageToPost: Partial<MessageExternalType> = {
            from_patient_id: user?.id,
            to_staff_id: secretaryId,
            subject: "Appointment cancelation",
            body: `Hello ${staffIdToTitleAndName(staffInfos, secretaryId)},

I would like to cancel my appointment with ${staffIdToTitleAndName(
              staffInfos,
              appointment?.host_id
            )},

From ${timestampToHumanDateTimeTZ(
              appointment?.start
            )} to ${timestampToHumanDateTimeTZ(appointment?.end)}

Please contact me to confirm cancelation

Patient: ${user.full_name}
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
          messagePost.mutate(messageToPost);
        }
        setRequestSent(true);
        setTimeout(() => setRequestSent(false), 6000);
        toast.success("Appointment cancelation request sent successfully", {
          containerId: "A",
        });
        setAppointmentSelectedId(0);
      } catch (err) {
        if (err instanceof Error)
          toast.error(
            `Unable to send appointment cancelation: ${err.message}`,
            {
              containerId: "A",
            }
          );
      }
    }
  };

  return (
    <div className="patient-appointments__next">
      <div className="patient-appointments__next-title">Next Appointments</div>
      <div className="patient-appointments__next-content">
        <ul>
          {nextAppointments && nextAppointments.length > 0 ? (
            nextAppointments.map((appointment) => (
              <NextAppointmentItem
                key={appointment.start}
                appointment={appointment}
                isAppointmentSelected={isAppointmentSelected}
                handleCheck={handleCheck}
              />
            ))
          ) : (
            <EmptyLi text="No next appointments" />
          )}
        </ul>
      </div>
      {requestSent && (
        <p className="patient-appointments__next-success">
          Your request has been sent,{" "}
          <strong>
            Please wait for a secretary to confirm your appointment cancelation
          </strong>
        </p>
      )}
      {!requestSent && (
        <div className="patient-appointments__next-btn">
          <SaveButton
            label="Cancel Appointment"
            onClick={handleDeleteAppointment}
            disabled={!appointmentSelectedId}
          />
        </div>
      )}
    </div>
  );
};

export default NextAppointments;
