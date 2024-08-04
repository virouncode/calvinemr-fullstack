//Libraries
import _ from "lodash";
import { DateTime } from "luxon";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";
import {
  useAppointmentPost,
  useAppointmentPut,
} from "../../../hooks/reactquery/mutations/appointmentsMutations";
import { useAvailableRooms } from "../../../hooks/reactquery/queries/availableRoomsQueries";
import { getAvailableRooms } from "../../../utils/appointments/getAvailableRooms";
import { parseToAppointment } from "../../../utils/appointments/parseToAppointment";
import { statuses } from "../../../utils/appointments/statuses";
import {
  nowTZTimestamp,
  timestampToDateISOTZ,
  timestampToDateTimeSecondsISOTZ,
  timestampToTimeISOTZ,
  tzComponentsToTimestamp,
} from "../../../utils/dates/formatDates";
import {
  staffIdToFirstName,
  staffIdToLastName,
  staffIdToOHIP,
} from "../../../utils/names/staffIdToName";
import { staffIdToTitleAndName } from "../../../utils/names/staffIdToTitleAndName";
import { toRoomTitle } from "../../../utils/names/toRoomTitle";
import { firstLetterUpper } from "../../../utils/strings/firstLetterUpper";
import { appointmentSchema } from "../../../validation/record/appointmentValidation";
import { confirmAlert } from "../../All/Confirm/ConfirmGlobal";
import Button from "../../UI/Buttons/Button";
import CancelButton from "../../UI/Buttons/CancelButton";
import CloseButton from "../../UI/Buttons/CloseButton";
import SubmitButton from "../../UI/Buttons/SubmitButton";
import LoadingParagraph from "../../UI/Paragraphs/LoadingParagraph";
import DateTimePicker from "../../UI/Pickers/DateTimePicker";
import DurationPicker from "../../UI/Pickers/DurationPicker";
import ConfirmDialogRecurringChange from "../Calendar/ConfirmDialogRecurringChange";
import EditGuests from "./Guests/EditGuests";
import HostsSelect from "./Host/HostsSelect";
import Invitation from "./Invitation/Invitation";
import RecurrenceSelect from "./RecurrenceSelect";
import RoomsRadio from "./Rooms/RoomsRadio";
import SiteSelect from "./SiteSelect";
import StatusesRadio from "./Status/StatusesRadio";

//MY COMPONENT
const EventForm = ({
  currentEvent,
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
}) => {
  //=========================== HOOKS =================================//
  const { user } = useUserContext();
  const { staffInfos } = useStaffInfosContext();
  const [formDatas, setFormDatas] = useState(
    parseToAppointment(currentEvent.current)
  );
  const [previousStart, setPreviousStart] = useState(
    currentEvent.current.start
  );
  const [previousEnd, setPreviousEnd] = useState(currentEvent.current.end);
  const [statusAdvice, setStatusAdvice] = useState(false);

  const appointmentPost = useAppointmentPost();
  const appointmentPut = useAppointmentPut(parseInt(currentEvent.current.id));

  const { data: availableRooms, isPending } = useAvailableRooms(
    formDatas.id,
    formDatas.start,
    formDatas.end,
    sites,
    formDatas.site_id
  );
  const [invitationVisible, setInvitationVisible] = useState(false);
  const [progress, setProgress] = useState(false);
  const [confirmDlgRecChangeVisible, setConfirmDlgRecChangeVisible] =
    useState(false);

  const refDateStart = useRef(null);
  const refHoursStart = useRef(null);
  const refMinutesStart = useRef(null);
  const refAMPMStart = useRef(null);
  const refDateEnd = useRef(null);
  const refHoursEnd = useRef(null);
  const refMinutesEnd = useRef(null);
  const refAMPMEnd = useRef(null);

  const [errMsgPost, setErrMsgPost] = useState("");

  //============================ HANDLERS ==========================//

  const handlePurposeChange = (e) => {
    setErrMsgPost("");
    const value = e.target.value;
    setFormDatas({ ...formDatas, AppointmentPurpose: value });
  };

  const handleNotesChange = (e) => {
    setErrMsgPost("");
    const value = e.target.value;
    setFormDatas({ ...formDatas, AppointmentNotes: value });
  };

  const handleStatusChange = (e) => {
    setErrMsgPost("");
    const value = e.target.value;
    setFormDatas({ ...formDatas, AppointmentStatus: value });
  };

  const handleHostChange = async (e) => {
    setErrMsgPost("");
    const value = parseInt(e.target.value);
    if (value === user.id) {
      setFormColor("#93B5E9");
    } else {
      const host = remainingStaff.find(({ id }) => id === value);
      setFormColor(host.color);
    }
    //Update form datas
    setFormDatas({ ...formDatas, host_id: value });
  };

  const handleUntilChange = (e) => {
    const untilDate = DateTime.fromISO(e.target.value, {
      zone: "America/Toronto",
    }).set({ hours: 23, minutes: 59, seconds: 59 });

    setFormDatas({
      ...formDatas,
      rrule: {
        ...formDatas.rrule,
        until: timestampToDateTimeSecondsISOTZ(untilDate.toMillis()),
      },
    });
  };

  const handleRecurrenceChange = (e) => {
    let newRrule = {};
    const value = e.target.value;
    switch (value) {
      case "Every day":
        newRrule = {
          freq: "daily",
          interval: 1,
          dtstart: DateTime.fromMillis(formDatas.start, {
            zone: "America/Toronto",
          }).toISO(),
          until: formDatas.rrule?.until || "",
        };
        break;
      case "Every week":
        newRrule = {
          freq: "weekly",
          interval: 1,
          dtstart: DateTime.fromMillis(formDatas.start, {
            zone: "America/Toronto",
          }).toISO(),
          until: formDatas.rrule?.until || "",
        };
        break;
      case "Every month":
        newRrule = {
          freq: "monthly",
          interval: 1,
          dtstart: DateTime.fromMillis(formDatas.start, {
            zone: "America/Toronto",
          }).toISO(),
          until: formDatas.rrule?.until || "",
        };
        break;
      case "Every year":
        newRrule = {
          freq: "yearly",
          interval: 1,
          dtstart: DateTime.fromMillis(formDatas.start, {
            zone: "America/Toronto",
          }).toISO(),
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

  const handleSiteChange = async (e) => {
    setErrMsgPost("");
    const value = parseInt(e.target.value);
    setFormDatas({ ...formDatas, site_id: value, room_id: "z" });
  };

  const handleRoomChange = async (e) => {
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

  const handleStartChange = async (e) => {
    setErrMsgPost("");
    const name = e.target.name;
    const value = e.target.value;
    if (!value) return;
    const dateStr = refDateStart.current.value;
    const hoursStr = refHoursStart.current.value;
    const minutesStr = refMinutesStart.current.value;
    const ampmStr = refAMPMStart.current.value;
    let timestampStart;
    switch (name) {
      case "date":
        timestampStart = tzComponentsToTimestamp(
          value,
          hoursStr,
          minutesStr,
          ampmStr,
          "America/Toronto",
          "en-CA"
        );
        break;
      case "hours":
        timestampStart = tzComponentsToTimestamp(
          dateStr,
          value,
          minutesStr,
          ampmStr,
          "America/Toronto",
          "en-CA"
        );
        break;
      case "minutes":
        timestampStart = tzComponentsToTimestamp(
          dateStr,
          hoursStr,
          value,
          ampmStr,
          "America/Toronto",
          "en-CA"
        );
        break;
      case "ampm":
        timestampStart = tzComponentsToTimestamp(
          dateStr,
          hoursStr,
          minutesStr,
          value,
          "America/Toronto",
          "en-CA"
        );
        break;
      default:
        break;
    }

    const rangeEnd =
      timestampStart > formDatas.end ? timestampStart : formDatas.end;
    let hypotheticAvailableRooms;

    try {
      hypotheticAvailableRooms = await getAvailableRooms(
        parseInt(currentEvent.current.id),
        timestampStart,
        rangeEnd,
        sites,
        formDatas.site_id
      );
    } catch (err) {
      toast.error(`Error: unable to get available rooms: ${err.message}`, {
        containerId: "A",
      });
      return;
    }

    if (
      formDatas.room_id === "z" ||
      hypotheticAvailableRooms.includes(formDatas.room_id) ||
      (!hypotheticAvailableRooms.includes(formDatas.room_id) &&
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

  const handleEndChange = async (e) => {
    setErrMsgPost("");
    const name = e.target.name;
    const value = e.target.value;
    if (!value) return;
    const dateStr = refDateEnd.current.value;
    const hoursStr = refHoursEnd.current.value;
    const minutesStr = refMinutesEnd.current.value;
    const ampmStr = refAMPMEnd.current.value;
    let timestampEnd;
    switch (name) {
      case "date":
        timestampEnd = tzComponentsToTimestamp(
          value,
          hoursStr,
          minutesStr,
          ampmStr,
          "America/Toronto",
          "en-CA"
        );
        break;
      case "hours":
        timestampEnd = tzComponentsToTimestamp(
          dateStr,
          value,
          minutesStr,
          ampmStr,
          "America/Toronto",
          "en-CA"
        );
        break;
      case "minutes":
        timestampEnd = tzComponentsToTimestamp(
          dateStr,
          hoursStr,
          value,
          ampmStr,
          "America/Toronto",
          "en-CA"
        );
        break;
      case "ampm":
        timestampEnd = tzComponentsToTimestamp(
          dateStr,
          hoursStr,
          minutesStr,
          value,
          "America/Toronto",
          "en-CA"
        );
        break;
      default:
        break;
    }

    let hypotheticAvailableRooms;
    try {
      hypotheticAvailableRooms = await getAvailableRooms(
        parseInt(currentEvent.current.id),
        formDatas.start,
        timestampEnd,
        sites,
        formDatas.site_id
      );
    } catch (err) {
      toast.error(`Error: unable to get available rooms: ${err.message}`, {
        containerId: "A",
      });
    }
    if (
      formDatas.room_id === "z" ||
      hypotheticAvailableRooms.includes(formDatas.room_id) ||
      (!hypotheticAvailableRooms.includes(formDatas.room_id) &&
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

  const handleCheckAllDay = (e) => {
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

  const handleDurationChange = async (e) => {
    setErrMsgPost("");
    const value = e.target.value;
    const name = e.target.name;
    let hoursInt;
    let minInt;
    switch (name) {
      case "hoursDuration":
        hoursInt = value === "" ? 0 : parseInt(value);
        minInt = parseInt(formDatas.Duration % 60);
        break;
      case "minutesDuration":
        hoursInt = parseInt(formDatas.Duration / 60);
        minInt = value === "" ? 0 : parseInt(value);
        break;
      default:
        return;
    }
    const rangeEnd = formDatas.start + hoursInt * 3600000 + minInt * 60000;
    let hypotheticAvailableRooms;
    try {
      hypotheticAvailableRooms = await getAvailableRooms(
        parseInt(currentEvent.current.id),
        formDatas.start,
        rangeEnd,
        sites,
        formDatas.site_id
      );
    } catch (err) {
      toast.error(`Error: unable to get available rooms: ${err.message}`, {
        containerId: "A",
      });
      return;
    }
    if (
      formDatas.room_id === "z" ||
      hypotheticAvailableRooms.includes(formDatas.room_id) ||
      (!hypotheticAvailableRooms.includes(formDatas.room_id) &&
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

  const handleInvitation = async (e) => {
    setErrMsgPost("");
    e.preventDefault();
    setInvitationVisible(true);
  };

  const handleCancel = async (e) => {
    setErrMsgPost("");
    e.preventDefault();
    setFormVisible(false);
    setCalendarSelectable(true);
  };

  const handleSubmit = async (e) => {
    setErrMsgPost("");
    e.preventDefault();
    if (_.isEqual(formDatas, parseToAppointment(currentEvent.current))) {
      setFormVisible(false);
      setCalendarSelectable(true);
      toast.success("Appointment saved successfully", { containerId: "A" });
      return;
    }
    if (parseToAppointment(currentEvent.current).recurrence !== "Once") {
      setConfirmDlgRecChangeVisible(true);
      if (
        formDatas.AppointmentStatus !==
        currentEvent.current.extendedProps.status
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

    const appointmentToPut = {
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
        ? timestampToDateISOTZ(startAllDay, "America/Toronto")
        : timestampToDateISOTZ(formDatas.start, "America/Toronto"),
      Provider: {
        Name: {
          FirstName: staffIdToFirstName(
            staffInfos,
            parseInt(formDatas.host_id)
          ),
          LastName: staffIdToLastName(staffInfos, parseInt(formDatas.host_id)),
        },
        OHIPPhysicianId: staffIdToOHIP(staffInfos, parseInt(formDatas.host_id)),
      },
      AppointmentPurpose: firstLetterUpper(formDatas.AppointmentPurpose),
      AppointmentNotes: firstLetterUpper(formDatas.AppointmentNotes),
      site_id: formDatas.site_id,
      recurrence: formDatas.recurrence,
      rrule: formDatas.rrule,
      exrule: formDatas.exrule,
    };
    //Validation
    try {
      await appointmentSchema.validate(appointmentToPut);
    } catch (err) {
      setErrMsgPost(err.message);
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
        setCalendarSelectable(true);
        setProgress(false);
      },
      onError: () => {
        setCalendarSelectable(true);
        setProgress(false);
      },
    });
  };

  const handleCancelRecurringChange = (e) => {
    e.preventDefault();
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

    const appointmentToPost = {
      id: -1,
      host_id: formDatas.host_id,
      start: formDatas.all_day ? startAllDay : formDatas.start,
      end: formDatas.all_day ? endAllDay : formDatas.end,
      patients_guests_ids: formDatas.patients_guests_ids,
      staff_guests_ids: formDatas.staff_guests_ids,
      room_id: formDatas.room_id,
      all_day: formDatas.all_day,
      date_created: formDatas.date_created,
      created_by_id: formDatas.created_by_id,
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
        ? timestampToDateISOTZ(startAllDay, "America/Toronto")
        : timestampToDateISOTZ(formDatas.start, "America/Toronto"),
      Provider: {
        Name: {
          FirstName: staffIdToFirstName(
            staffInfos,
            parseInt(formDatas.host_id)
          ),
          LastName: staffIdToLastName(staffInfos, parseInt(formDatas.host_id)),
        },
        OHIPPhysicianId: staffIdToOHIP(staffInfos, parseInt(formDatas.host_id)),
      },
      AppointmentPurpose: firstLetterUpper(formDatas.AppointmentPurpose),
      AppointmentNotes: firstLetterUpper(formDatas.AppointmentNotes),
      site_id: formDatas.site_id,
      recurrence: formDatas.recurrence,
      exrule: formDatas.exrule,
    };
    //Validation
    try {
      await appointmentSchema.validate(appointmentToPost);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }

    appointmentPost.mutate(appointmentToPost);
    const appointmentToPut = await xanoGet(
      `/appointments/${formDatas.id}`,
      "staff"
    );
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
  const handleChangeAllEvents = async (e) => {
    e.preventDefault();
    setProgress(true);
    const startAllDay = DateTime.fromMillis(formDatas.start, {
      zone: "America/Toronto",
    })
      .set({ hour: 0, minute: 0, second: 0 })
      .toMillis();
    const endAllDay = startAllDay + 24 * 3600 * 1000;

    const appointmentToPut = {
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
        ? timestampToDateISOTZ(startAllDay, "America/Toronto")
        : timestampToDateISOTZ(formDatas.start, "America/Toronto"),
      Provider: {
        Name: {
          FirstName: staffIdToFirstName(
            staffInfos,
            parseInt(formDatas.host_id)
          ),
          LastName: staffIdToLastName(staffInfos, parseInt(formDatas.host_id)),
        },
        OHIPPhysicianId: staffIdToOHIP(staffInfos, parseInt(formDatas.host_id)),
      },
      AppointmentPurpose: firstLetterUpper(formDatas.AppointmentPurpose),
      AppointmentNotes: firstLetterUpper(formDatas.AppointmentNotes),
      site_id: formDatas.site_id,
      recurrence: formDatas.recurrence,
      rrule: {
        ...formDatas.rrule,
        dtstart: timestampToDateTimeSecondsISOTZ(
          formDatas.all_day ? startAllDay : formDatas.start
        ),
      },
      exrule: formDatas.exrule,
    };
    //Validation
    try {
      await appointmentSchema.validate(appointmentToPut);
    } catch (err) {
      setErrMsgPost(err.message);
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

    const appointmentToPost = {
      host_id: formDatas.host_id,
      start: formDatas.all_day ? startAllDay : formDatas.start,
      end: formDatas.all_day ? endAllDay : formDatas.end,
      patients_guests_ids: formDatas.patients_guests_ids,
      staff_guests_ids: formDatas.staff_guests_ids,
      room_id: formDatas.room_id,
      all_day: formDatas.all_day,
      date_created: formDatas.date_created,
      created_by_id: formDatas.created_by_id,
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
        ? timestampToDateISOTZ(startAllDay, "America/Toronto")
        : timestampToDateISOTZ(formDatas.start, "America/Toronto"),
      Provider: {
        Name: {
          FirstName: staffIdToFirstName(
            staffInfos,
            parseInt(formDatas.host_id)
          ),
          LastName: staffIdToLastName(staffInfos, parseInt(formDatas.host_id)),
        },
        OHIPPhysicianId: staffIdToOHIP(staffInfos, parseInt(formDatas.host_id)),
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
      setErrMsgPost(err.message);
      return;
    }
    appointmentPost.mutate(appointmentToPost);
    const appointmentToPut = await xanoGet(
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
  const isRoomOccupied = (roomId) => {
    if (roomId === "z") {
      return false;
    }
    return availableRooms.includes(roomId) ? false : true;
  };

  return (
    <div className="event-form__container">
      {!invitationVisible ? (
        <form
          className={
            user.title === "Secretary" ||
            currentEvent.current.extendedProps.host === user.id
              ? "event-form"
              : "event-form event-form--uneditable"
          }
          onSubmit={handleSubmit}
        >
          {errMsgPost && (
            <div className="event-form__row">
              <p className="event-form__err">{errMsgPost}</p>
            </div>
          )}
          <div className="event-form__row">
            <div className="event-form__item">
              <label>Host </label>
              {user.title === "Secretary" ? (
                <HostsSelect
                  handleHostChange={handleHostChange}
                  hostId={formDatas.host_id}
                />
              ) : (
                <p>{staffIdToTitleAndName(staffInfos, formDatas.host_id)}</p>
              )}
            </div>
            <div className="event-form__item">
              <label htmlFor="purpose">Purpose</label>
              <input
                type="text"
                value={formDatas.AppointmentPurpose}
                onChange={handlePurposeChange}
                name="AppointmentPurpose"
                id="purpose"
                autoComplete="off"
              />
            </div>
            <div className="event-form__item">
              <RecurrenceSelect
                value={formDatas.recurrence}
                handleRecurrenceChange={handleRecurrenceChange}
              />
            </div>
            <div className="event-form__item">
              <label htmlFor="until">Until</label>
              <input
                type="date"
                value={
                  formDatas.rrule?.until
                    ? formDatas.rrule?.until.slice(0, 10)
                    : ""
                }
                id="until"
                onChange={handleUntilChange}
                disabled={formDatas.recurrence === "Once"}
                min={timestampToDateISOTZ(formDatas.start)}
              />
            </div>
          </div>
          <div className="event-form__row">
            <div className="event-form__item">
              <DateTimePicker
                value={formDatas.start}
                refDate={refDateStart}
                refHours={refHoursStart}
                refMinutes={refMinutesStart}
                refAMPM={refAMPMStart}
                timezone="America/Toronto"
                locale="en-CA"
                handleChange={handleStartChange}
                label="Start"
                // readOnlyTime,
                // readOnlyDate
              />
            </div>
            <div className="event-form__item">
              <DateTimePicker
                value={formDatas.end}
                refDate={refDateEnd}
                refHours={refHoursEnd}
                refMinutes={refMinutesEnd}
                refAMPM={refAMPMEnd}
                timezone="America/Toronto"
                locale="en-CA"
                handleChange={handleEndChange}
                label="End"
                // readOnlyTime,
                // readOnlyDate
              />
            </div>
            <div className="event-form__item">
              <DurationPicker
                durationHours={
                  formDatas.all_day
                    ? "24"
                    : parseInt(formDatas.Duration / 60)
                        .toString()
                        .padStart(2, "0")
                }
                durationMin={
                  formDatas.all_day
                    ? "00"
                    : parseInt(formDatas.Duration % 60)
                        .toString()
                        .padStart(2, "0")
                }
                disabled={formDatas.all_day}
                handleChange={handleDurationChange}
                label="Duration"
              />
            </div>
            <div className="event-form__item">
              <label htmlFor="all-day">All Day</label>
              <input
                type="checkbox"
                className="all-day-checkbox"
                checked={formDatas.all_day}
                onChange={handleCheckAllDay}
                id="all-day"
              />
            </div>
          </div>
          <div className="event-form__row event-form__row--guest">
            <EditGuests
              formDatas={formDatas}
              setFormDatas={setFormDatas}
              editable={
                user.title === "Secretary" || user.id === formDatas.host_id
              }
              hostId={formDatas.host_id}
            />
          </div>
          <div className="event-form__row event-form__row--radio">
            <div style={{ marginBottom: "5px" }}>
              <SiteSelect
                handleSiteChange={handleSiteChange}
                sites={sites}
                value={formDatas.site_id}
              />
            </div>
            {isPending ? (
              <LoadingParagraph />
            ) : (
              <RoomsRadio
                handleRoomChange={handleRoomChange}
                roomSelectedId={formDatas.room_id}
                rooms={sites
                  .find(({ id }) => id === formDatas.site_id)
                  ?.rooms.sort((a, b) => a.id.localeCompare(b.id))}
                isRoomOccupied={isRoomOccupied}
              />
            )}
          </div>
          <div className="event-form__row event-form__row--radio">
            <StatusesRadio
              handleStatusChange={handleStatusChange}
              statuses={statuses}
              selectedStatus={formDatas.AppointmentStatus}
            />
          </div>
          <div className="event-form__row">
            <div className="event-form__item">
              <label htmlFor="notes">Notes</label>
              <textarea
                value={formDatas.AppointmentNotes}
                onChange={handleNotesChange}
                name="AppointmentNotes"
                id="notes"
                autoComplete="off"
              />
            </div>
          </div>
          <div className="event-form__btns">
            {user.title === "Secretary" ||
            currentEvent.current.extendedProps.host === user.id ? (
              <>
                <SubmitButton label="Save" />
                <CancelButton onClick={handleCancel} disabled={progress} />
                <Button
                  onClick={handleInvitation}
                  disabled={
                    (!formDatas.staff_guests_ids.length &&
                      !formDatas.patients_guests_ids.length) ||
                    !formDatas.host_id ||
                    progress
                  }
                  label="Send Invitation"
                />
              </>
            ) : (
              <CloseButton onClick={handleCancel} disabled={progress} />
            )}
          </div>
        </form>
      ) : (
        <Invitation
          setInvitationVisible={setInvitationVisible}
          hostId={formDatas.host_id}
          staffInfos={staffInfos}
          start={formDatas.start}
          end={formDatas.end}
          patientsGuestsInfos={formDatas.patients_guests_ids.map(
            ({ patient_infos }) => patient_infos
          )}
          staffGuestsInfos={formDatas.staff_guests_ids.map(
            ({ staff_infos }) => staff_infos
          )}
          sites={sites}
          siteId={formDatas.site_id}
          allDay={formDatas.all_day}
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
    </div>
  );
};

export default EventForm;
