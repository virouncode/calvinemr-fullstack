import { DateTime } from "luxon";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import useStaffInfosContext from "../../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { useAvailableRooms } from "../../../../../hooks/reactquery/queries/availableRoomsQueries";
import { getAvailableRooms } from "../../../../../utils/appointments/getAvailableRooms";
import { statuses } from "../../../../../utils/appointments/statuses";
import {
  nowTZ,
  nowTZTimestamp,
  timestampToDateISOTZ,
  timestampToDateTimeSecondsISOTZ,
  timestampToTimeISOTZ,
  tzComponentsToTimestamp,
} from "../../../../../utils/dates/formatDates";
import {
  staffIdToFirstName,
  staffIdToLastName,
  staffIdToOHIP,
} from "../../../../../utils/names/staffIdToName";
import { staffIdToTitleAndName } from "../../../../../utils/names/staffIdToTitleAndName";
import { toRoomTitle } from "../../../../../utils/names/toRoomTitle";
import { firstLetterOfFirstWordUpper } from "../../../../../utils/strings/firstLetterUpper";
import { appointmentSchema } from "../../../../../validation/record/appointmentValidation";
import CancelButton from "../../../../UI/Buttons/CancelButton";
import SaveButton from "../../../../UI/Buttons/SaveButton";
import { confirmAlert } from "../../../../UI/Confirm/ConfirmGlobal";
import Input from "../../../../UI/Inputs/Input";
import InputDate from "../../../../UI/Inputs/InputDate";
import { DateTimePicker } from "../../../../UI/Pickers/DateTimePicker";
import FormSignCell from "../../../../UI/Tables/FormSignCell";
import HostsSelect from "../../../EventForm/Host/HostsSelect";
import RecurrenceSelect from "../../../EventForm/RecurrenceSelect";
import RoomsSelect from "../../../EventForm/Rooms/RoomsSelect";
import SiteSelect from "../../../EventForm/SiteSelect";
import AllDaySelect from "./AllDaySelect";
import AppointmentStatusSelect from "./AppointmentStatusSelect";

const AppointmentForm = ({
  patientId,
  editCounter,
  setAddVisible,
  setErrMsgPost,
  errMsgPost,
  sites,
  topicPost,
}) => {
  //HOOKS
  const { user } = useUserContext();
  const { staffInfos } = useStaffInfosContext();
  const initialStart = nowTZ()
    .set({ hour: 7, minute: 0, second: 0 })
    .toMillis();
  const [formDatas, setFormDatas] = useState({
    host_id: user.title === "Secretary" ? 0 : user.id,
    start: initialStart,
    end: initialStart + 60 * 1000,
    patients_guests_ids: [patientId],
    staff_guests_ids: [],
    room: "To Be Determined",
    all_day: false,
    Duration: 60,
    AppointmentStatus: "Scheduled",
    AppointmentPurpose: "Appointment",
    AppointmentNotes: "",
    site_id: user.site_id,
    room_id: "z",
    recurrence: "Once",
    rrule: { freq: "", interval: 1, until: "", dtstart: "" },
  });
  const [previousStart, setPreviousStart] = useState(
    nowTZ().set({ hour: 7, minute: 0, second: 0 }).toMillis()
  );
  const [previousEnd, setPreviousEnd] = useState(
    nowTZ().set({ hour: 8, minute: 0, second: 0 }).toMillis()
  );
  const { data: availableRooms } = useAvailableRooms(
    0,
    formDatas.start,
    formDatas.end,
    sites,
    formDatas.site_id
  );

  const refDateStart = useRef(null);
  const refHoursStart = useRef(null);
  const refMinutesStart = useRef(null);
  const refAMPMStart = useRef(null);
  const refDateEnd = useRef(null);
  const refHoursEnd = useRef(null);
  const refMinutesEnd = useRef(null);
  const refAMPMEnd = useRef(null);
  const [progress, setProgress] = useState(false);

  //STYLE

  //HANDLERS
  const isSecretary = () => {
    return user.title === "Secretary";
  };

  const handleSiteChange = async (e) => {
    setErrMsgPost("");
    const value = parseInt(e.target.value);
    setFormDatas({ ...formDatas, site_id: value, room_id: "z" });
  };

  const handleChange = (e) => {
    setErrMsgPost("");
    const name = e.target.name;
    const value = e.target.value;
    setFormDatas({ ...formDatas, [name]: value });
  };

  const handleHostChange = async (e) => {
    setErrMsgPost("");
    const value = parseInt(e.target.value);
    setFormDatas({ ...formDatas, host_id: value });
  };

  const handleRoomChange = async (e) => {
    setErrMsgPost("");
    const name = e.target.name;
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
      setFormDatas({ ...formDatas, [name]: value });
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
        0,
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
        // endPicker.setDate(date); //Change flatpickr end
        //Update form datas
        setFormDatas({
          ...formDatas,
          start: timestampStart,
          end: timestampStart,
          Duration: 0,
          rrule: {
            ...formDatas.rrule,
            dtstart: timestampToDateTimeSecondsISOTZ(timestampStart),
          },
        });
        setPreviousStart(timestampStart);
        setPreviousEnd(timestampStart);
      } else {
        //Update form datas
        setFormDatas({
          ...formDatas,
          start: timestampStart,
          Duration: Math.floor((formDatas.end - timestampStart) / (1000 * 60)),
          rrule: {
            ...formDatas.rrule,
            dtstart: timestampToDateTimeSecondsISOTZ(timestampStart),
          },
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
        0,
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
      //Update form datas
      setFormDatas({
        ...formDatas,
        end: timestampEnd,
        Duration: Math.floor((timestampEnd - formDatas.start) / (1000 * 60)),
      });
      setPreviousEnd(timestampEnd);
    }
  };

  const handleAllDayChange = (e) => {
    setErrMsgPost("");
    let value = e.target.value;
    value = value === "true"; //cast to boolean
    if (value) {
      if (formDatas.start === null) {
        setErrMsgPost("Please choose a start date first");
        return;
      }
      const startAllDay = DateTime.fromMillis(formDatas.start, {
        zone: "America/Toronto",
      })
        .set({ hour: 0, minute: 0, second: 0 })
        .toMillis();
      const endAllDay = startAllDay + 24 * 3600 * 1000;

      setFormDatas({
        ...formDatas,
        all_day: true,
        start: startAllDay,
        end: endAllDay,
        Duration: 1440,
        rrule: {
          ...formDatas.rrule,
          dtstart: timestampToDateTimeSecondsISOTZ(startAllDay),
        },
      });
    } else {
      setFormDatas({
        ...formDatas,
        all_day: false,
        start: previousStart,
        end: previousEnd,
        Duration: Math.floor((formDatas.end - formDatas.start) / (1000 * 60)),
        rrule: {
          ...formDatas.rrule,
          dtstart: timestampToDateTimeSecondsISOTZ(previousStart),
        },
      });
    }
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
      room_id: "z",
    });
  };

  const handleCancel = (e) => {
    setErrMsgPost("");
    e.preventDefault();
    editCounter.current -= 1;
    setErrMsgPost("");
    setAddVisible(false);
  };

  const handleSubmit = async (e) => {
    setErrMsgPost("");
    e.preventDefault();
    //Formatting
    const topicToPost = {
      ...formDatas,
      AppointmentPurpose: firstLetterOfFirstWordUpper(
        formDatas.AppointmentPurpose
      ),
      AppointmentTime: timestampToTimeISOTZ(formDatas.start),
      AppointmentDate: timestampToDateISOTZ(formDatas.start),
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
      AppointmentNotes: firstLetterOfFirstWordUpper(formDatas.AppointmentNotes),
      date_created: nowTZTimestamp(),
      created_by_id: user.id,
    };
    //Validation
    try {
      await appointmentSchema.validate(topicToPost);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }
    if (formDatas.end < formDatas.start) {
      setErrMsgPost("End of appointment can't be before start !");
      return;
    }
    //Submission
    setProgress(true);
    topicPost.mutate(topicToPost, {
      onSuccess: () => {
        editCounter.current -= 1;
        setAddVisible(false);
        setProgress(false);
      },
      onError: () => {
        setProgress(false);
      },
    });
  };

  const isRoomOccupied = (roomId) => {
    if (roomId === "z") {
      return false;
    }
    return availableRooms.includes(roomId) ? false : true;
  };

  return (
    <tr
      className="appointments__form"
      style={{ border: errMsgPost && "solid 1.5px red" }}
    >
      <td>
        <div className="appointments__form-btn-container">
          <SaveButton onClick={handleSubmit} disabled={progress} />
          <CancelButton onClick={handleCancel} disabled={progress} />
        </div>
      </td>
      <td style={{ minWidth: "170px" }}>
        {isSecretary() ? (
          <HostsSelect
            staffInfos={staffInfos}
            handleHostChange={handleHostChange}
            hostId={formDatas.host_id}
          />
        ) : (
          <p>{staffIdToTitleAndName(staffInfos, user.id)}</p>
        )}
      </td>
      <td>
        <Input
          name="AppointmentPurpose"
          value={formDatas.AppointmentPurpose}
          onChange={handleChange}
        />
      </td>
      <td>
        <RecurrenceSelect
          value={formDatas.recurrence}
          handleRecurrenceChange={handleRecurrenceChange}
          label={false}
        />
      </td>
      <td>
        {formDatas.recurrence !== "Once" && (
          <InputDate
            value={
              formDatas.rrule?.until ? formDatas.rrule?.until.slice(0, 10) : ""
            }
            onChange={handleUntilChange}
          />
        )}
      </td>
      <td>
        <DateTimePicker
          value={formDatas.start}
          timezone="America/Toronto"
          locale="en-CA"
          handleChange={handleStartChange}
          refDate={refDateStart}
          refHours={refHoursStart}
          refMinutes={refMinutesStart}
          refAMPM={refAMPMStart}
          readOnlyTime={formDatas.all_day}
          // readOnlyDate
        />
      </td>
      <td>
        <DateTimePicker
          value={formDatas.end}
          timezone="America/Toronto"
          locale="en-CA"
          handleChange={handleEndChange}
          refDate={refDateEnd}
          refHours={refHoursEnd}
          refMinutes={refMinutesEnd}
          refAMPM={refAMPMEnd}
          readOnlyTime={formDatas.all_day}
          readOnlyDate={formDatas.all_day}
        />
      </td>
      <td>
        <AllDaySelect
          name="all_day"
          value={formDatas.all_day.toString()}
          onChange={handleAllDayChange}
        />
      </td>
      <td>
        <SiteSelect
          handleSiteChange={handleSiteChange}
          sites={sites}
          value={formDatas.site_id}
          label={false}
        />
      </td>
      <td>
        <RoomsSelect
          handleRoomChange={handleRoomChange}
          roomSelectedId={formDatas.room_id}
          rooms={sites
            .find(({ id }) => id === formDatas.site_id)
            ?.rooms?.sort((a, b) => a.id.localeCompare(b.id))}
          isRoomOccupied={isRoomOccupied}
          label={false}
        />
      </td>
      <td>
        <AppointmentStatusSelect
          handleChange={handleChange}
          statuses={statuses}
          selectedStatus={formDatas.AppointmentStatus}
          label={false}
        />
      </td>
      <td>
        <Input
          name="AppointmentNotes"
          value={formDatas.AppointmentNotes}
          onChange={handleChange}
        />
      </td>
      <FormSignCell />
    </tr>
  );
};

export default AppointmentForm;
