//Libraries
import { EventInput } from "@fullcalendar/core";
import { useMediaQuery } from "@mui/material";
import _ from "lodash";
import { DateTime } from "luxon";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import xanoGet from "../../../../api/xanoCRUD/xanoGet";
import useSocketContext from "../../../../hooks/context/useSocketContext";
import useStaffInfosContext from "../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../hooks/context/useUserContext";
import {
  useAppointmentDelete,
  useAppointmentPost,
  useAppointmentPut,
} from "../../../../hooks/reactquery/mutations/appointmentsMutations";
import { useAvailableRooms } from "../../../../hooks/reactquery/queries/availableRoomsQueries";
import {
  AppointmentModeType,
  AppointmentType,
  DemographicsType,
  RruleType,
  SiteType,
  StaffType,
} from "../../../../types/api";
import { RemainingStaffType, UserStaffType } from "../../../../types/app";
import { getAvailableRooms } from "../../../../utils/appointments/getAvailableRooms";
import {
  toLastOccurence,
  toNextOccurence,
} from "../../../../utils/appointments/occurences";
import { parseToAppointment } from "../../../../utils/appointments/parseToAppointment";
import { statuses } from "../../../../utils/appointments/statuses";
import {
  nowTZTimestamp,
  timestampToDateISOTZ,
  timestampToDateTimeSecondsISOTZ,
  timestampToTimeISOTZ,
  tzComponentsToTimestamp,
} from "../../../../utils/dates/formatDates";
import {
  staffIdToFirstName,
  staffIdToLastName,
  staffIdToOHIP,
} from "../../../../utils/names/staffIdToName";
import { toRoomTitle } from "../../../../utils/names/toRoomTitle";
import { firstLetterUpper } from "../../../../utils/strings/firstLetterUpper";
import { appointmentSchema } from "../../../../validation/record/appointmentValidation";
import { confirmAlert } from "../../../UI/Confirm/ConfirmGlobal";
import ErrorParagraph from "../../../UI/Paragraphs/ErrorParagraph";
import ConfirmDialogRecurringChange from "../ConfirmDialogRecurringChange";
import ConfirmDialogRecurringDelete from "../ConfirmDialogRecurringDelete";
import EventFormAppointmentType from "./EventFormAppointmentType";
import EventFormButtons from "./EventFormButtons";
import EventFormGuests from "./EventFormGuests";
import EventFormHostRow from "./EventFormHostRow";
import EventFormInfos from "./EventFormInfos";
import EventFormNotes from "./EventFormNotes";
import EventFormRooms from "./EventFormRooms";
import EventFormStatus from "./EventFormStatus";
import EventFormTimeRow from "./EventFormTimeRow";
import Invitation from "./Invitation/Invitation";

type EventFormProps = {
  currentEvent: React.MutableRefObject<EventInput | null>;
  currentElement: React.MutableRefObject<HTMLElement | null>;
  lastCurrentId: React.MutableRefObject<string>;
  setFormVisible: React.Dispatch<React.SetStateAction<boolean>>;
  remainingStaff: RemainingStaffType[];
  setCalendarSelectable: React.Dispatch<React.SetStateAction<boolean>>;
  setFormColor: React.Dispatch<React.SetStateAction<string>>;
  hostsIds: number[];
  setHostsIds: React.Dispatch<React.SetStateAction<number[]>>;
  sites: SiteType[];
  setTimelineSiteId: React.Dispatch<React.SetStateAction<number>>;
  sitesIds: number[];
  setSitesIds: React.Dispatch<React.SetStateAction<number[]>>;
  isFirstEvent: boolean;
  setSelectable: React.Dispatch<React.SetStateAction<boolean>>;
};

//MY COMPONENT
const EventForm = ({
  currentEvent,
  currentElement,
  lastCurrentId,
  setFormVisible,
  remainingStaff,
  setCalendarSelectable,
  setFormColor,
  hostsIds,
  setHostsIds,
  sites,
  setTimelineSiteId,
  sitesIds,
  setSitesIds,
  isFirstEvent,
  setSelectable,
}: EventFormProps) => {
  //=========================== Hooks =================================//
  const { user } = useUserContext() as { user: UserStaffType };
  const { socket } = useSocketContext();
  const { staffInfos } = useStaffInfosContext();
  const [formDatas, setFormDatas] = useState<AppointmentType>(
    parseToAppointment(currentEvent.current as EventInput)
  );
  const [previousStart, setPreviousStart] = useState<number>(
    currentEvent.current?.start as number
  );
  const [previousEnd, setPreviousEnd] = useState<number>(
    currentEvent.current?.end as number
  );
  const [statusAdvice, setStatusAdvice] = useState(false);
  const [invitationVisible, setInvitationVisible] = useState(false);
  const [progress, setProgress] = useState(false);
  const [confirmDlgRecChangeVisible, setConfirmDlgRecChangeVisible] =
    useState(false);
  const [confirmDlgRecDeleteVisible, setConfirmDlgRecDeleteVisible] =
    useState(false);
  const [errMsgPost, setErrMsgPost] = useState("");

  const refDateStart = useRef<HTMLInputElement | null>(null);
  const refHoursStart = useRef<HTMLSelectElement | null>(null);
  const refMinutesStart = useRef<HTMLSelectElement | null>(null);
  const refAMPMStart = useRef<HTMLSelectElement | null>(null);
  const refDateEnd = useRef<HTMLInputElement | null>(null);
  const refHoursEnd = useRef<HTMLSelectElement | null>(null);
  const refMinutesEnd = useRef<HTMLSelectElement | null>(null);
  const refAMPMEnd = useRef<HTMLSelectElement | null>(null);
  const { data: availableRooms, isPending } = useAvailableRooms(
    formDatas.id,
    formDatas.start,
    formDatas.end,
    sites,
    formDatas.site_id
  );
  const isTabletOrMobile = useMediaQuery("(max-width: 768px)");
  //=========================== Queries =================================//
  const appointmentPost = useAppointmentPost();
  const appointmentPut = useAppointmentPut();
  const appointmentDelete = useAppointmentDelete();
  //============================ HANDLERS ==========================//
  const handlePurposeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrMsgPost("");
    const value = e.target.value;
    setFormDatas({ ...formDatas, AppointmentPurpose: value });
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setErrMsgPost("");
    const value = e.target.value;
    setFormDatas({ ...formDatas, AppointmentNotes: value });
  };

  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setErrMsgPost("");
    const value = e.target.value as AppointmentModeType | "";
    setFormDatas({ ...formDatas, appointment_type: value });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrMsgPost("");
    const value = e.target.value;
    const initialAppointment: AppointmentType = parseToAppointment(
      currentEvent.current as EventInput
    );
    const initialStatus = initialAppointment.AppointmentStatus;
    if (
      value !== initialStatus &&
      initialStatus === "Scheduled" &&
      formDatas.patients_guests_ids.length > 0
    ) {
      toast.warn(
        `You have changed the appointment's status from "Scheduled" to "${value}", please send an invitation/confirmation to the patient(s) if not already done.`,
        { containerId: "A", autoClose: 6000 }
      );
    }
    setFormDatas({ ...formDatas, AppointmentStatus: value });
  };

  const handleHostChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setErrMsgPost("");
    const value = parseInt(e.target.value);
    if (value === user.id) {
      setFormColor("#8fb4fb");
    } else {
      const host = remainingStaff.find(({ id }) => id === value);
      setFormColor(host?.color ?? "#8fb4fb");
    }
    //Update form datas
    setFormDatas({ ...formDatas, host_id: value });
  };

  const handleUntilChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) return;
    const untilDate = DateTime.fromISO(e.target.value, {
      zone: "America/Toronto",
    }).set({ hour: 23, minute: 59, second: 59 });

    setFormDatas({
      ...formDatas,
      rrule: {
        ...formDatas.rrule,
        until: timestampToDateTimeSecondsISOTZ(untilDate.toMillis()),
      },
    });
  };

  const handleRecurrenceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    let newRrule: RruleType = {
      freq: "",
      interval: 0,
      dtstart: "",
      until: "",
    };
    const value = e.target.value;

    switch (value) {
      case "Every day":
        newRrule = {
          freq: "daily",
          interval: 1,
          dtstart:
            DateTime.fromMillis(formDatas.start, {
              zone: "America/Toronto",
            }).toISO() ?? "",
          until: formDatas.rrule?.until || "",
        };
        break;
      case "Every week":
        newRrule = {
          freq: "weekly",
          interval: 1,
          dtstart:
            DateTime.fromMillis(formDatas.start, {
              zone: "America/Toronto",
            }).toISO() ?? "",
          until: formDatas.rrule?.until || "",
        };
        break;
      case "Every month":
        newRrule = {
          freq: "monthly",
          interval: 1,
          dtstart:
            DateTime.fromMillis(formDatas.start, {
              zone: "America/Toronto",
            }).toISO() ?? "",
          until: formDatas.rrule?.until || "",
        };
        break;
      case "Every year":
        newRrule = {
          freq: "yearly",
          interval: 1,
          dtstart:
            DateTime.fromMillis(formDatas.start, {
              zone: "America/Toronto",
            }).toISO() ?? "",
          until: formDatas.rrule?.until || "",
        };
        break;
      default:
        break;
    }
    setFormDatas({
      ...formDatas,
      recurrence: value,
      rrule: newRrule,
    });
  };

  const handleSiteChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setErrMsgPost("");
    const value = parseInt(e.target.value);
    setFormDatas({ ...formDatas, site_id: value, room_id: "z" });
  };

  const handleRoomChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrMsgPost("");
    const value = e.target.value;
    if (
      (isRoomOccupied(value) &&
        (await confirmAlert({
          content: `${toRoomTitle(
            sites,
            formDatas.site_id,
            value
          )} will be occupied at this time slot, choose this room anyway ?`,
        }))) ||
      !isRoomOccupied(value)
    ) {
      setFormDatas({ ...formDatas, room_id: value });
    }
  };

  const handleStartChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setErrMsgPost("");
    const name = e.target.name;
    const value = e.target.value;
    if (!value) return; //to avoid Clearing the input
    const dateStr = refDateStart.current?.value as string;
    const hoursStr = refHoursStart.current?.value as string;
    const minutesStr = refMinutesStart.current?.value as string;
    const ampmStr = (refAMPMStart.current?.value as "AM" | "PM") ?? "AM";
    let timestampStart: number = 0;
    switch (name) {
      case "date":
        timestampStart = tzComponentsToTimestamp(
          value,
          hoursStr,
          minutesStr,
          ampmStr
        ) as number;
        break;
      case "hours":
        timestampStart = tzComponentsToTimestamp(
          dateStr,
          value,
          minutesStr,
          ampmStr
        ) as number;
        break;
      case "minutes":
        timestampStart = tzComponentsToTimestamp(
          dateStr,
          hoursStr,
          value,
          ampmStr
        ) as number;
        break;
      case "ampm":
        timestampStart = tzComponentsToTimestamp(
          dateStr,
          hoursStr,
          minutesStr,
          value as "AM" | "PM"
        ) as number;
        break;
      default:
        break;
    }

    const rangeEnd =
      timestampStart > formDatas.end ? timestampStart : formDatas.end;

    let hypotheticAvailableRooms;

    try {
      hypotheticAvailableRooms = await getAvailableRooms(
        parseInt(currentEvent.current?.id as string),
        timestampStart,
        rangeEnd,
        sites,
        formDatas.site_id
      );
    } catch (err) {
      if (err instanceof Error)
        toast.error(`Error: unable to get available rooms: ${err.message}`, {
          containerId: "A",
        });
      return;
    }
    if (
      formDatas.room_id === "z" ||
      hypotheticAvailableRooms?.includes(formDatas.room_id) ||
      (!hypotheticAvailableRooms?.includes(formDatas.room_id) &&
        (await confirmAlert({
          content: `${toRoomTitle(
            sites,
            formDatas.site_id,
            formDatas.room_id
          )} will be occupied at this time slot, change start time anyway ?`,
        })))
    ) {
      if (timestampStart > formDatas.end) {
        setFormDatas({
          ...formDatas,
          start: timestampStart,
          end: timestampStart,
          Duration: 0,
        });
        setPreviousStart(timestampStart);
        setPreviousEnd(timestampStart);
      } else {
        setFormDatas({
          ...formDatas,
          start: timestampStart,
          Duration: Math.floor((formDatas.end - timestampStart) / (1000 * 60)),
        });
        setPreviousStart(timestampStart);
      }
    }
  };

  const handleEndChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setErrMsgPost("");
    const name = e.target.name;
    const value = e.target.value;
    if (!value) return;
    const dateStr = refDateEnd.current?.value as string;
    const hoursStr = refHoursEnd.current?.value as string;
    const minutesStr = refMinutesEnd.current?.value as string;
    const ampmStr = refAMPMEnd.current?.value as "AM" | "PM";
    let timestampEnd: number = 0;
    switch (name) {
      case "date":
        timestampEnd = tzComponentsToTimestamp(
          value,
          hoursStr,
          minutesStr,
          ampmStr
        ) as number;
        break;
      case "hours":
        timestampEnd = tzComponentsToTimestamp(
          dateStr,
          value,
          minutesStr,
          ampmStr
        ) as number;
        break;
      case "minutes":
        timestampEnd = tzComponentsToTimestamp(
          dateStr,
          hoursStr,
          value,
          ampmStr
        ) as number;
        break;
      case "ampm":
        timestampEnd = tzComponentsToTimestamp(
          dateStr,
          hoursStr,
          minutesStr,
          value as "AM" | "PM"
        ) as number;
        break;
      default:
        break;
    }

    let hypotheticAvailableRooms;
    try {
      hypotheticAvailableRooms = await getAvailableRooms(
        parseInt(currentEvent.current?.id as string),
        formDatas.start,
        timestampEnd,
        sites,
        formDatas.site_id
      );
    } catch (err) {
      if (err instanceof Error)
        toast.error(`Error: unable to get available rooms: ${err.message}`, {
          containerId: "A",
        });
    }
    if (
      formDatas.room_id === "z" ||
      hypotheticAvailableRooms?.includes(formDatas.room_id) ||
      (!hypotheticAvailableRooms?.includes(formDatas.room_id) &&
        (await confirmAlert({
          content: `${toRoomTitle(
            sites,
            formDatas.site_id,
            formDatas.room_id
          )} will be occupied at this time slot, change end time anyway ?`,
        })))
    ) {
      setFormDatas({
        ...formDatas,
        end: timestampEnd,
        Duration: Math.floor((timestampEnd - formDatas.start) / (1000 * 60)),
      });
      setPreviousEnd(timestampEnd);
    }
  };

  const handleCheckAllDay = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrMsgPost("");
    if (e.target.checked) {
      const startAllDay = DateTime.fromMillis(formDatas.start, {
        zone: "America/Toronto",
      })
        .set({ hour: 0, minute: 0, second: 0 })
        .toMillis();
      const endAllDay = startAllDay + 24 * 3600 * 1000;
      setFormDatas({
        ...formDatas,
        start: startAllDay,
        end: endAllDay,
        all_day: true,
        Duration: 1440,
      });
    } else {
      setFormDatas({
        ...formDatas,
        start: previousStart,
        end: previousEnd,
        all_day: false,
        Duration: Math.floor((previousEnd - previousStart) / (1000 * 60)),
      });
    }
  };

  const handleDurationChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setErrMsgPost("");
    const value = e.target.value;
    const name = e.target.name;
    let hoursInt: number = 0;
    let minInt: number = 0;
    switch (name) {
      case "hoursDuration":
        hoursInt = value === "" ? 0 : parseInt(value);
        minInt = formDatas.Duration % 60;
        break;
      case "minutesDuration":
        hoursInt = Math.floor(formDatas.Duration / 60);
        minInt = value === "" ? 0 : parseInt(value);
        break;
      default:
        return;
    }
    const rangeEnd = formDatas.start + hoursInt * 3600000 + minInt * 60000;
    let hypotheticAvailableRooms;
    try {
      hypotheticAvailableRooms = await getAvailableRooms(
        parseInt(currentEvent.current?.id as string),
        formDatas.start,
        rangeEnd,
        sites,
        formDatas.site_id
      );
    } catch (err) {
      if (err instanceof Error)
        toast.error(`Error: unable to get available rooms: ${err.message}`, {
          containerId: "A",
        });
      return;
    }
    if (
      formDatas.room_id === "z" ||
      hypotheticAvailableRooms?.includes(formDatas.room_id) ||
      (!hypotheticAvailableRooms?.includes(formDatas.room_id) &&
        (await confirmAlert({
          content: `${toRoomTitle(
            sites,
            formDatas.site_id,
            formDatas.room_id
          )} will be occupied at this time slot, change end time anyway ?`,
        })))
    ) {
      setFormDatas({
        ...formDatas,
        Duration: hoursInt * 60 + minInt,
        end: rangeEnd,
      });
    }
  };

  const handleInvitation = () => {
    setErrMsgPost("");
    setInvitationVisible(true);
  };

  const handleCancel = async () => {
    setErrMsgPost("");
    if (
      user.title !== "Secretary" &&
      currentEvent.current?.extendedProps?.host !== user.id
    ) {
      setFormVisible(false);
      setCalendarSelectable(true);
    } else if (
      await confirmAlert({
        content: "Do you really want to close (all changes will be lost) ?",
      })
    ) {
      setFormVisible(false);
      setCalendarSelectable(true);
    }
  };

  const handleDeleteEvent = async () => {
    //XANO
    const appointment: AppointmentType = await xanoGet(
      `/appointments/${formDatas.id}`,
      "staff"
    );
    //If the event is recurring
    if (appointment.recurrence !== "Once") {
      //open dialog for recurring events
      setConfirmDlgRecDeleteVisible(true);
      return;
    }
    //Delete the event
    else if (
      await confirmAlert({
        content: "Do you really want to remove this event ?",
      })
    ) {
      appointmentDelete.mutate(formDatas.id);
      const initialAppointment: AppointmentType = parseToAppointment(
        currentEvent.current as EventInput
      );
      if (
        initialAppointment.patients_guests_ids &&
        initialAppointment.patients_guests_ids.length > 0
      ) {
        const patientsIds = (
          initialAppointment.patients_guests_ids as {
            patient_infos: DemographicsType;
          }[]
        ).map(({ patient_infos }) => patient_infos.patient_id);
        for (const patientId of patientsIds) {
          socket?.emit("message", { key: ["patientRecord", patientId] });
        }
      }

      setFormVisible(false);
      setSelectable(true);
      currentEvent.current = null;
      currentElement.current = null;
      lastCurrentId.current = "";
    }
  };

  const handleCancelRecurringDelete = () => {
    setConfirmDlgRecDeleteVisible(false);
  };
  const handleDeleteThisEvent = async () => {
    const appointmentToPut: AppointmentType = await xanoGet(
      `/appointments/${formDatas.id}`,
      "staff"
    );
    if (isFirstEvent) {
      const nextOccurence = toNextOccurence(
        formDatas.start,
        formDatas.end,
        appointmentToPut.rrule,
        appointmentToPut.exrule
      );
      appointmentToPut.start = nextOccurence[0];
      appointmentToPut.end = nextOccurence[1];
      appointmentToPut.AppointmentDate = timestampToDateISOTZ(nextOccurence[0]);
      appointmentToPut.AppointmentTime = timestampToTimeISOTZ(nextOccurence[0]);
      appointmentToPut.rrule.dtstart = timestampToDateTimeSecondsISOTZ(
        nextOccurence[0]
      );
    } else {
      appointmentToPut.exrule = appointmentToPut.exrule?.length
        ? [
            ...appointmentToPut.exrule,
            {
              freq: appointmentToPut.rrule?.freq,
              interval: appointmentToPut.rrule?.interval,
              dtstart: `${timestampToDateISOTZ(
                formDatas.start
              )}T${timestampToTimeISOTZ(appointmentToPut.start)}`,
              until: `${timestampToDateISOTZ(
                formDatas.end
              )}T${timestampToTimeISOTZ(appointmentToPut.end)}`,
            },
          ]
        : [
            {
              freq: appointmentToPut.rrule?.freq,
              interval: appointmentToPut.rrule?.interval as number,
              dtstart: `${timestampToDateISOTZ(
                formDatas.start
              )}T${timestampToTimeISOTZ(appointmentToPut.start)}`,
              until: `${timestampToDateISOTZ(
                formDatas.end
              )}T${timestampToTimeISOTZ(appointmentToPut.end)}`,
            },
          ];
    }
    appointmentPut.mutate(appointmentToPut);
    currentEvent.current = null;
    lastCurrentId.current = "";
    setConfirmDlgRecDeleteVisible(false);
    setFormVisible(false);
    setSelectable(true);
  };

  const handleDeleteAllEvents = async () => {
    appointmentDelete.mutate(formDatas.id);
    const initialAppointment: AppointmentType = parseToAppointment(
      currentEvent.current as EventInput
    );
    if (
      initialAppointment.patients_guests_ids &&
      initialAppointment.patients_guests_ids.length > 0
    ) {
      const patientsIds = (
        initialAppointment.patients_guests_ids as {
          patient_infos: DemographicsType;
        }[]
      ).map(({ patient_infos }) => patient_infos.patient_id);
      for (const patientId of patientsIds) {
        socket?.emit("message", { key: ["patientRecord", patientId] });
      }
    }
    currentEvent.current = null;
    lastCurrentId.current = "";
    setConfirmDlgRecDeleteVisible(false);
    setFormVisible(false);
    setSelectable(true);
  };

  const handleDeleteAllFutureEvents = async () => {
    const appointmentToPut: AppointmentType = await xanoGet(
      `/appointments/${formDatas.id}`,
      "staff"
    );
    appointmentToPut.rrule.until = timestampToDateTimeSecondsISOTZ(
      toLastOccurence(
        formDatas.start,
        formDatas.end,
        appointmentToPut.rrule,
        appointmentToPut.exrule
      )[0]
    );
    appointmentPut.mutate(appointmentToPut);
    currentEvent.current = null;
    lastCurrentId.current = "";
    setConfirmDlgRecDeleteVisible(false);
    setFormVisible(false);
    setSelectable(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setErrMsgPost("");
    e.preventDefault();
    if (
      _.isEqual(
        formDatas,
        parseToAppointment(currentEvent.current as EventInput)
      )
    ) {
      setFormVisible(false);
      setCalendarSelectable(true);
      toast.success("Appointment saved successfully", { containerId: "A" });
      return;
    }
    if (
      parseToAppointment(currentEvent.current as EventInput).recurrence !==
      "Once"
    ) {
      setConfirmDlgRecChangeVisible(true);
      if (
        formDatas.AppointmentStatus !==
        currentEvent.current?.extendedProps?.status
      ) {
        setStatusAdvice(true);
      }
      return;
    }
    setProgress(true);
    const startAllDay = DateTime.fromMillis(formDatas.start, {
      zone: "America/Toronto",
    })
      .set({ hour: 0, minute: 0, second: 0 })
      .toMillis();
    const endAllDay = startAllDay + 24 * 3600 * 1000;

    const appointmentToPut: AppointmentType = {
      id: formDatas.id,
      host_id: formDatas.host_id,
      start: formDatas.all_day ? startAllDay : formDatas.start,
      end: formDatas.all_day ? endAllDay : formDatas.end,
      patients_guests_ids: formDatas.patients_guests_ids,
      staff_guests_ids: formDatas.staff_guests_ids,
      room_id: formDatas.room_id,
      all_day: formDatas.all_day,
      date_created: formDatas.date_created,
      created_by_id: formDatas.created_by_id,
      created_by_user_type: formDatas.created_by_user_type,
      updates: [
        ...formDatas.updates,
        { updated_by_id: user.id, date_updated: nowTZTimestamp() },
      ],
      AppointmentTime: formDatas.all_day
        ? timestampToTimeISOTZ(startAllDay)
        : timestampToTimeISOTZ(formDatas.start),
      Duration: formDatas.Duration,
      AppointmentStatus: formDatas.AppointmentStatus,
      AppointmentDate: formDatas.all_day
        ? timestampToDateISOTZ(startAllDay)
        : timestampToDateISOTZ(formDatas.start),
      Provider: {
        Name: {
          FirstName: staffIdToFirstName(staffInfos, formDatas.host_id),
          LastName: staffIdToLastName(staffInfos, formDatas.host_id),
        },
        OHIPPhysicianId: staffIdToOHIP(staffInfos, formDatas.host_id),
      },
      AppointmentPurpose: firstLetterUpper(formDatas.AppointmentPurpose),
      AppointmentNotes: firstLetterUpper(formDatas.AppointmentNotes),
      site_id: formDatas.site_id,
      recurrence: formDatas.recurrence,
      rrule: formDatas.rrule,
      exrule: formDatas.exrule,
      invitations_sent: formDatas.invitations_sent,
      appointment_type: formDatas.appointment_type,
    };
    //Validation
    try {
      await appointmentSchema.validate(appointmentToPut);
    } catch (err) {
      if (err instanceof Error) setErrMsgPost(err.message);
      return;
    }
    appointmentPut.mutate(appointmentToPut, {
      onSuccess: (data) => {
        setHostsIds([...hostsIds, data.host_id]);
        setFormVisible(false);
        setTimelineSiteId(data.site_id);
        if (!sitesIds.includes(data.site_id)) {
          setSitesIds([...sitesIds, data.site_id]);
        }
      },
      onSettled: () => {
        setCalendarSelectable(true);
        setProgress(false);
      },
    });
  };

  const handleCancelRecurringChange = () => {
    setConfirmDlgRecChangeVisible(false);
  };
  const handleChangeThisEvent = async () => {
    //post a new event B
    const startAllDay = DateTime.fromMillis(formDatas.start, {
      zone: "America/Toronto",
    })
      .set({ hour: 0, minute: 0, second: 0 })
      .toMillis();
    const endAllDay = startAllDay + 24 * 3600 * 1000;

    const appointmentToPost: Partial<AppointmentType> = {
      host_id: formDatas.host_id,
      start: formDatas.all_day ? startAllDay : formDatas.start,
      end: formDatas.all_day ? endAllDay : formDatas.end,
      patients_guests_ids: formDatas.patients_guests_ids,
      staff_guests_ids: formDatas.staff_guests_ids,
      room_id: formDatas.room_id,
      all_day: formDatas.all_day,
      date_created: formDatas.date_created,
      created_by_id: formDatas.created_by_id,
      created_by_user_type: formDatas.created_by_user_type,
      updates: [
        ...formDatas.updates,
        { updated_by_id: user.id, date_updated: nowTZTimestamp() },
      ],
      AppointmentTime: formDatas.all_day
        ? timestampToTimeISOTZ(startAllDay)
        : timestampToTimeISOTZ(formDatas.start),
      Duration: formDatas.Duration,
      AppointmentStatus: formDatas.AppointmentStatus,
      AppointmentDate: formDatas.all_day
        ? timestampToDateISOTZ(startAllDay)
        : timestampToDateISOTZ(formDatas.start),
      Provider: {
        Name: {
          FirstName: staffIdToFirstName(staffInfos, formDatas.host_id),
          LastName: staffIdToLastName(staffInfos, formDatas.host_id),
        },
        OHIPPhysicianId: staffIdToOHIP(staffInfos, formDatas.host_id),
      },
      AppointmentPurpose: firstLetterUpper(formDatas.AppointmentPurpose),
      AppointmentNotes: firstLetterUpper(formDatas.AppointmentNotes),
      site_id: formDatas.site_id,
      recurrence: "Once",
    };
    //Validation
    try {
      await appointmentSchema.validate(appointmentToPost);
    } catch (err) {
      if (err instanceof Error) setErrMsgPost(err.message);
      return;
    }
    appointmentPost.mutate(appointmentToPost);
    //Update original appointment A excluding appointment B
    const appointmentToPut: AppointmentType = await xanoGet(
      `/appointments/${formDatas.id}`,
      "staff"
    );
    if (isFirstEvent) {
      const newStart = toNextOccurence(
        appointmentToPut.start,
        appointmentToPut.end,
        appointmentToPut.rrule,
        appointmentToPut.exrule
      )[0];
      const newEnd = toNextOccurence(
        appointmentToPut.start,
        appointmentToPut.end,
        appointmentToPut.rrule,
        appointmentToPut.exrule
      )[1];
      appointmentToPut.start = newStart;
      appointmentToPut.end = newEnd;
      appointmentToPut.rrule.dtstart =
        timestampToDateTimeSecondsISOTZ(newStart);
      appointmentToPut.AppointmentTime = timestampToTimeISOTZ(newStart);
      appointmentToPut.AppointmentDate = timestampToDateISOTZ(newStart);
    }
    appointmentToPut.exrule = appointmentToPut.exrule.length
      ? [
          ...appointmentToPut.exrule,
          {
            freq: appointmentToPut.rrule.freq,
            interval: appointmentToPut.rrule.interval,
            dtstart: `${timestampToDateISOTZ(
              formDatas.all_day ? startAllDay : formDatas.start
            )}T${timestampToTimeISOTZ(appointmentToPut.start)}`,
            until: `${timestampToDateISOTZ(
              formDatas.all_day ? endAllDay : formDatas.end
            )}T${timestampToTimeISOTZ(appointmentToPut.end)}`,
          },
        ]
      : [
          {
            freq: appointmentToPut.rrule.freq,
            interval: appointmentToPut.rrule.interval,
            dtstart: `${timestampToDateISOTZ(
              formDatas.all_day ? startAllDay : formDatas.start
            )}T${timestampToTimeISOTZ(appointmentToPut.start)}`,
            until: `${timestampToDateISOTZ(
              formDatas.all_day ? endAllDay : formDatas.end
            )}T${timestampToTimeISOTZ(appointmentToPut.end)}`,
          },
        ];
    appointmentPut.mutate(appointmentToPut, {
      onSuccess: (data) => {
        setFormVisible(false);
        setTimelineSiteId(data.site_id);
        if (!sitesIds.includes(data.site_id)) {
          setSitesIds([...sitesIds, data.site_id]);
        }
        setCalendarSelectable(true);
        setProgress(false);
      },
      onError: () => {
        setCalendarSelectable(true);
        setProgress(false);
      },
    });
    setConfirmDlgRecChangeVisible(false);
    setFormVisible(false);
  };
  const handleChangeAllEvents = async () => {
    setProgress(true);
    const startAllDay = DateTime.fromMillis(formDatas.start, {
      zone: "America/Toronto",
    })
      .set({ hour: 0, minute: 0, second: 0 })
      .toMillis();
    const endAllDay = startAllDay + 24 * 3600 * 1000;

    const appointmentToPut: AppointmentType = {
      ...formDatas,
      start: formDatas.all_day ? startAllDay : formDatas.start,
      end: formDatas.all_day ? endAllDay : formDatas.end,
      updates: [
        ...formDatas.updates,
        { updated_by_id: user.id, date_updated: nowTZTimestamp() },
      ],
      AppointmentTime: formDatas.all_day
        ? timestampToTimeISOTZ(startAllDay)
        : timestampToTimeISOTZ(formDatas.start),
      AppointmentDate: formDatas.all_day
        ? timestampToDateISOTZ(startAllDay)
        : timestampToDateISOTZ(formDatas.start),
      Provider: {
        Name: {
          FirstName: staffIdToFirstName(staffInfos, formDatas.host_id),
          LastName: staffIdToLastName(staffInfos, formDatas.host_id),
        },
        OHIPPhysicianId: staffIdToOHIP(staffInfos, formDatas.host_id),
      },
      AppointmentPurpose: firstLetterUpper(formDatas.AppointmentPurpose),
      AppointmentNotes: firstLetterUpper(formDatas.AppointmentNotes),
      rrule: {
        ...formDatas.rrule,
        dtstart: timestampToDateTimeSecondsISOTZ(
          formDatas.all_day ? startAllDay : formDatas.start
        ),
      },
    };
    //Validation
    try {
      await appointmentSchema.validate(appointmentToPut);
    } catch (err) {
      if (err instanceof Error) setErrMsgPost(err.message);
      return;
    }
    appointmentPut.mutate(appointmentToPut, {
      onSuccess: (data) => {
        setHostsIds([...hostsIds, data.host_id]);
        setFormVisible(false);
        setTimelineSiteId(data.site_id);
        if (!sitesIds.includes(data.site_id)) {
          setSitesIds([...sitesIds, data.site_id]);
        }
        setProgress(false);
        setCalendarSelectable(true);
        setConfirmDlgRecChangeVisible(false);
      },
      onError: () => {
        setProgress(false);
        setCalendarSelectable(true);
      },
    });
  };

  const handleChangeAllFutureEvents = async () => {
    //post a new event B
    const startAllDay = DateTime.fromMillis(formDatas.start, {
      zone: "America/Toronto",
    })
      .set({ hour: 0, minute: 0, second: 0 })
      .toMillis();
    const endAllDay = startAllDay + 24 * 3600 * 1000;

    const appointmentToPost: Partial<AppointmentType> = {
      ...formDatas,
      start: formDatas.all_day ? startAllDay : formDatas.start,
      end: formDatas.all_day ? endAllDay : formDatas.end,
      updates: [
        ...formDatas.updates,
        { updated_by_id: user.id, date_updated: nowTZTimestamp() },
      ],
      AppointmentTime: formDatas.all_day
        ? timestampToTimeISOTZ(startAllDay)
        : timestampToTimeISOTZ(formDatas.start),
      AppointmentDate: formDatas.all_day
        ? timestampToDateISOTZ(startAllDay)
        : timestampToDateISOTZ(formDatas.start),
      Provider: {
        Name: {
          FirstName: staffIdToFirstName(staffInfos, formDatas.host_id),
          LastName: staffIdToLastName(staffInfos, formDatas.host_id),
        },
        OHIPPhysicianId: staffIdToOHIP(staffInfos, formDatas.host_id),
      },
      AppointmentPurpose: firstLetterUpper(formDatas.AppointmentPurpose),
      AppointmentNotes: firstLetterUpper(formDatas.AppointmentNotes),
      site_id: formDatas.site_id,
      recurrence: formDatas.recurrence,
      rrule: {
        ...formDatas.rrule,
        dtstart: timestampToDateTimeSecondsISOTZ(formDatas.start),
      },
      exrule: formDatas.exrule,
    };
    //Validation
    try {
      await appointmentSchema.validate(appointmentToPost);
    } catch (err) {
      if (err instanceof Error) setErrMsgPost(err.message);
      return;
    }
    appointmentPost.mutate(appointmentToPost);

    const appointmentToPut: AppointmentType = await xanoGet(
      `/appointments/${formDatas.id}`,
      "staff"
    );
    appointmentToPut.rrule = {
      ...appointmentToPut.rrule,
      until: timestampToDateTimeSecondsISOTZ(startAllDay - 1000),
    };
    appointmentPut.mutate(appointmentToPut, {
      onSuccess: (data) => {
        setTimelineSiteId(data.site_id);
        if (!sitesIds.includes(data.site_id)) {
          setSitesIds([...sitesIds, data.site_id]);
        }
        setCalendarSelectable(true);
        setConfirmDlgRecChangeVisible(false);
        setProgress(false);
        setFormVisible(false);
      },
      onError: () => {
        setCalendarSelectable(true);
        setProgress(false);
      },
    });
    setConfirmDlgRecChangeVisible(false);
  };

  //========================== FUNCTIONS ======================//
  const isRoomOccupied = (roomId: string) => {
    if (roomId === "z") {
      return false;
    }
    return availableRooms?.includes(roomId) ? false : true;
  };

  return (
    <>
      {!invitationVisible ? (
        <form
          // className={
          //   user.title === "Secretary" ||
          //   user.title === "Nurse" ||
          //   currentEvent.current?.extendedProps?.host === user.id
          //     ? "event-form"
          //     : "event-form event-form--uneditable"
          // }
          className="event-form"
          onSubmit={handleSubmit}
        >
          {errMsgPost && <ErrorParagraph errorMsg={errMsgPost} />}
          <EventFormInfos formDatas={formDatas} />
          <EventFormHostRow
            formDatas={formDatas}
            handleHostChange={handleHostChange}
            handlePurposeChange={handlePurposeChange}
            handleRecurrenceChange={handleRecurrenceChange}
            handleUntilChange={handleUntilChange}
          />
          <EventFormTimeRow
            formDatas={formDatas}
            refDateStart={refDateStart}
            refMinutesStart={refMinutesStart}
            refHoursStart={refHoursStart}
            refAMPMStart={refAMPMStart}
            refDateEnd={refDateEnd}
            refMinutesEnd={refMinutesEnd}
            refHoursEnd={refHoursEnd}
            refAMPMEnd={refAMPMEnd}
            handleStartChange={handleStartChange}
            handleEndChange={handleEndChange}
            handleDurationChange={handleDurationChange}
            handleCheckAllDay={handleCheckAllDay}
          />
          <EventFormGuests
            formDatas={formDatas}
            setFormDatas={setFormDatas}
            editable={
              user.title === "Secretary" || user.id === formDatas.host_id
            }
            hostId={formDatas.host_id}
          />
          <EventFormRooms
            formDatas={formDatas}
            sites={sites}
            handleSiteChange={handleSiteChange}
            handleRoomChange={handleRoomChange}
            isRoomOccupied={isRoomOccupied}
            isPending={isPending}
          />
          <EventFormStatus
            handleStatusChange={handleStatusChange}
            statuses={statuses}
            selectedStatus={formDatas.AppointmentStatus}
            formDatas={formDatas}
          />
          <div
            style={{
              display: "flex",
              flexDirection: isTabletOrMobile ? "column" : "row",
              justifyContent: "space-between",
              gap: "2rem",
            }}
          >
            <EventFormNotes
              formDatas={formDatas}
              handleNotesChange={handleNotesChange}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <EventFormAppointmentType
                formDatas={formDatas}
                handleModeChange={handleModeChange}
              />
            </div>
          </div>

          <EventFormButtons
            formDatas={formDatas}
            currentEvent={currentEvent}
            handleCancel={handleCancel}
            handleInvitation={handleInvitation}
            progress={progress}
            handleDeleteEvent={handleDeleteEvent}
          />
        </form>
      ) : (
        <Invitation
          setInvitationVisible={setInvitationVisible}
          hostId={formDatas.host_id}
          staffInfos={staffInfos}
          start={formDatas.start}
          end={formDatas.end}
          patientsGuestsInfos={(
            formDatas.patients_guests_ids as {
              patient_infos: DemographicsType;
            }[]
          ).map(({ patient_infos }) => patient_infos)}
          staffGuestsInfos={(
            formDatas.staff_guests_ids as { staff_infos: StaffType }[]
          ).map(({ staff_infos }) => staff_infos)}
          sites={sites}
          siteId={formDatas.site_id}
          allDay={formDatas.all_day}
          formDatas={formDatas}
          setFormDatas={setFormDatas}
        />
      )}
      {confirmDlgRecChangeVisible && (
        <ConfirmDialogRecurringChange
          handleCancel={handleCancelRecurringChange}
          handleChangeThisEvent={handleChangeThisEvent}
          handleChangeAllEvents={handleChangeAllEvents}
          handleChangeAllFutureEvents={handleChangeAllFutureEvents}
          isFirstEvent={isFirstEvent}
          statusAdvice={statusAdvice}
        />
      )}
      {confirmDlgRecDeleteVisible && (
        <ConfirmDialogRecurringDelete
          handleCancel={handleCancelRecurringDelete}
          handleDeleteThisEvent={handleDeleteThisEvent}
          handleDeleteAllEvents={handleDeleteAllEvents}
          handleDeleteAllFutureEvents={handleDeleteAllFutureEvents}
          isFirstEvent={isFirstEvent}
        />
      )}
    </>
  );
};

export default EventForm;
