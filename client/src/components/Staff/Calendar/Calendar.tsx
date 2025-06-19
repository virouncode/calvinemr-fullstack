import {
  DateSelectArg,
  DatesSetArg,
  EventClickArg,
  EventContentArg,
  EventDropArg,
  EventInput,
} from "@fullcalendar/core";
import {
  EventDragStartArg,
  EventResizeDoneArg,
  EventResizeStartArg,
} from "@fullcalendar/interaction/index.js";
import FullCalendar from "@fullcalendar/react";
import { DateTime } from "luxon";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import useSocketContext from "../../../hooks/context/useSocketContext";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";
import {
  useAppointmentsDelete,
  useAppointmentsPost,
  useAppointmentsPut,
} from "../../../hooks/reactquery/mutations/appointmentsMutations";
import { useAppointments } from "../../../hooks/reactquery/queries/appointmentsQueries";
import { useSites } from "../../../hooks/reactquery/queries/sitesQueries";
import { useSiteClosed } from "../../../hooks/socket/useSiteClosed";
import useCalendarShortcuts from "../../../hooks/useCalendarShortcuts";
import {
  AppointmentType,
  DemographicsType,
  ExruleType,
  RruleType,
  SiteType,
  StaffType,
} from "../../../types/api";
import { UserStaffType } from "../../../types/app";
import { eventImplToEventInput } from "../../../utils/appointments/eventImplToEventInput";
import { getAvailableRooms } from "../../../utils/appointments/getAvailableRooms";
import {
  toLastOccurence,
  toNextOccurence,
} from "../../../utils/appointments/occurences";
import {
  getRemainingStaff,
  parseToEvents,
} from "../../../utils/appointments/parseToEvents";
import {
  getTodayStartTZ,
  getTomorrowStartTZ,
  nowTZTimestamp,
  timestampToDateISOTZ,
  timestampToDateTimeSecondsISOTZ,
  timestampToTimeISOTZ,
} from "../../../utils/dates/formatDates";
import { toRoomTitle } from "../../../utils/names/toRoomTitle";
import { confirmAlert } from "../../UI/Confirm/ConfirmGlobal";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../UI/Paragraphs/LoadingParagraph";
import CalendarDisplay from "./CalendarDisplay";
import CalendarLeftBar from "./CalendarLeftBar";
import ConfirmDialogRecurringChange from "./ConfirmDialogRecurringChange";
import ConfirmDialogRecurringDelete from "./ConfirmDialogRecurringDelete";
import EventElement from "./EventElement";
import EventElementListWeek from "./EventElementListWeek";
import EventElementTimegrid from "./EventElementTimegrid";
import CalendarFilterMobile from "./Options/CalendarFilterMobile";
import CalendarOptions from "./Options/CalendarOptions";
import CalendarOptionsMobile from "./Options/CalendarOptionsMobile";

//MY COMPONENT
const Calendar = () => {
  //================================= Hooks ========================================//
  const { user } = useUserContext() as { user: UserStaffType };

  const { staffInfos } = useStaffInfosContext();
  const [initialDate, setInitialDate] = useState(nowTZTimestamp()); //the date when toggling between timeline and calendar
  const [selectable, setSelectable] = useState(true);
  const [timelineVisible, setTimelineVisible] = useState(
    user.settings.timeline_visible
  );
  const [formVisible, setFormVisible] = useState(false);
  const [rangeStart, setRangeStart] = useState(getTodayStartTZ());
  const [rangeEnd, setRangeEnd] = useState(getTomorrowStartTZ());
  const [formColor, setFormColor] = useState("#93B5E9");
  const [sitesIds, setSitesIds] = useState(
    user.settings.sites_ids.length ? user.settings.sites_ids : [user.site_id]
  ); //Sites for CalendarFilter
  const [timelineSiteId, setTimelineSiteId] = useState(user.site_id); //Selected Timeline Site
  const [editAvailability, setEditAvailability] = useState(false);
  const [printDayVisible, setPrintDayVisible] = useState(false);
  const [mobileCalendarOptionsVisible, setMobileCalendarOptionsVisible] =
    useState(false);
  const [mobileCalendarFilterVisible, setMobileCalendarFilterVisible] =
    useState(false);
  const [hostsIds, setHostsIds] = useState(
    user.settings.hosts_ids.length > 0
      ? user.settings.hosts_ids
      : user.title === "Secretary"
      ? [
          0, //no host yet (grey events)
          ...(staffInfos
            .filter(({ site_id }) => site_id === user.site_id)
            .map(({ id }) => id) as number[]), //all staff from the secretary site
        ]
      : [user.id]
  );
  const { socket } = useSocketContext();

  //Calendar Elements
  const fcRef = useRef<FullCalendar | null>(null);
  const currentEvent = useRef<EventInput | null>(null);
  const currentElement = useRef<HTMLElement | null>(null);
  const currentInfo = useRef<
    | EventClickArg
    | EventResizeDoneArg
    | EventContentArg
    | DateSelectArg
    | EventDropArg
    | null
  >(null); //we need union type because of all different handlers
  const initialInfo = useRef<EventResizeStartArg | EventDragStartArg | null>(
    null
  ); //we need union type because of all different handlers
  const [currentView, setCurrentView] = useState(
    user.settings.calendar_view ?? "timeGridWeek"
  );
  const lastCurrentId = useRef("");
  const eventCounter = useRef(0); //for keyboard shortcuts
  const [isFirstEvent, setIsFirstEvent] = useState(false); //for recurring events
  const [confirmDlgRecChangeVisible, setConfirmDlgRecChangeVisible] =
    useState(false);
  const [confirmDlgRecDeleteVisible, setConfirmDlgRecDeleteVisible] =
    useState(false);
  const navigate = useNavigate();
  //================================= Queries ========================================//
  const { data: sites } = useSites();
  const appointments = useAppointments(
    hostsIds,
    rangeStart,
    rangeEnd,
    timelineVisible,
    timelineSiteId,
    sitesIds,
    sites
  );
  const appointmentPost = useAppointmentsPost(
    hostsIds,
    rangeStart,
    rangeEnd,
    timelineVisible,
    timelineSiteId,
    sitesIds
  );
  const appointmentPut = useAppointmentsPut(
    hostsIds,
    rangeStart,
    rangeEnd,
    timelineVisible,
    timelineSiteId,
    sitesIds
  );
  const appointmentDelete = useAppointmentsDelete(
    hostsIds,
    rangeStart,
    rangeEnd,
    timelineVisible,
    timelineSiteId,
    sitesIds
  );

  const events: EventInput[] | undefined = useMemo(() => {
    return parseToEvents(
      appointments?.data,
      staffInfos,
      sites,
      user.title === "Secretary",
      user.id as number
    );
  }, [appointments?.data, sites, staffInfos, user.id, user.title]);

  useEffect(() => {
    if (!events) return;
    if (lastCurrentId.current) {
      //remove pink border from last currentElement
      if (currentElement.current)
        (currentElement.current as HTMLElement).style.border = "none";
      //change the currentElement and change the border to pink
      if (
        document.getElementsByClassName(`event-${lastCurrentId.current}`)[0]
      ) {
        currentElement.current = document.getElementsByClassName(
          `event-${lastCurrentId.current}`
        )[0] as HTMLElement;
        currentElement.current.style.border = "solid 1px #f53f77";
      }
      //change the currentEvent
      currentEvent.current =
        events.find(({ id }) => id === lastCurrentId.current) ?? null;
    }
  }, [events]);

  useSiteClosed(sites, user);

  useCalendarShortcuts(
    fcRef,
    currentEvent,
    lastCurrentId,
    eventCounter,
    formVisible,
    setFormVisible,
    setSelectable,
    editAvailability,
    setIsFirstEvent,
    setConfirmDlgRecDeleteVisible,
    appointmentDelete
  );

  //=============================== EVENTS HANDLERS =================================//
  const handleShortcutpickrChange = (
    selectedDates: Date[],
    dateStr: string
  ) => {
    const localOffset = DateTime.now().offset;
    const torontoMidnight = DateTime.fromISO(dateStr.slice(0, 10), {
      zone: "America/Toronto",
    });
    if (localOffset > 0) {
      fcRef.current
        ?.getApi()
        .gotoDate(torontoMidnight.plus({ days: 1 }).toJSDate());
    } else {
      fcRef.current?.getApi().gotoDate(torontoMidnight.toJSDate());
    }
  };

  const handlePatientClick = (
    e:
      | React.MouseEvent<HTMLSpanElement, MouseEvent>
      | React.TouchEvent<HTMLSpanElement>,
    id: number
  ) => {
    e.stopPropagation();
    if (formVisible) return;
    navigate(`/staff/patient-record/${id}`);
  };

  const handleDeleteEvent = async (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>,
    info: EventContentArg
  ) => {
    e.stopPropagation();
    if (formVisible) return;
    const event = info.event; //the event i clicked on
    const element = document.getElementsByClassName(
      `event-${event.id}`
    )[0] as HTMLElement;
    const view = info.view.type; //the view i clicked on

    //CALENDAR
    //If the event event i clicked on is not the same as the current event or the start date is different (for recurring events)
    if (
      currentEvent.current &&
      (currentEvent.current.id !== event.id ||
        currentEvent.current.start !==
          DateTime.fromJSDate(event.start as Date).toMillis())
    )
      //remove pink border on former current element
      (currentElement.current as HTMLElement).style.border = "none";
    //change current event
    currentEvent.current = eventImplToEventInput(event);
    currentElement.current = element;
    lastCurrentId.current = event.id;
    element.style.border = "solid 1px #f53f77";
    !timelineVisible && setCurrentView(view);
    //XANO
    //If the event is recurring
    if (event.extendedProps.recurrence !== "Once") {
      currentInfo.current = info;
      const appointment: AppointmentType = await xanoGet(
        `/appointments/${parseInt(info.event.id)}`,
        "staff"
      );
      if (
        DateTime.fromJSDate(event.start as Date, {
          zone: "America/Toronto",
        }).toMillis() === appointment.start
      ) {
        setIsFirstEvent(true);
      } else {
        setIsFirstEvent(false);
      }
      //open confirm dialog for recurring events
      setConfirmDlgRecDeleteVisible(true);
      return;
    }
    //if the event is not recurring
    else if (
      await confirmAlert({
        content: "Do you really want to remove this event ?",
      })
    ) {
      appointmentDelete.mutate(parseInt(currentEvent.current?.id as string));

      if (currentEvent.current?.extendedProps?.patientsGuestsIds) {
        const patientsIds = (
          currentEvent.current?.extendedProps?.patientsGuestsIds as {
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

  const handleCopyEvent = async (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>,
    info: EventContentArg
  ) => {
    e.stopPropagation();
    if (formVisible) return;
    const event = info.event;

    //CALENDAR
    if (currentElement.current) {
      currentElement.current.style.border = "none";
    }
    //XANO
    const startDate = DateTime.fromJSDate(event.start as Date, {
      zone: "America/Toronto",
    }).toMillis();
    const endDate = DateTime.fromJSDate(event.end as Date, {
      zone: "America/Toronto",
    }).toMillis();

    const appointmentToPost: AppointmentType = await xanoGet(
      `/appointments/${event.id}`,
      "staff"
    );
    appointmentToPost.recurrence = "Once";
    appointmentToPost.start = startDate; //we need this because it can be a recurring event copy
    appointmentToPost.end = endDate; //we need this because it can be a recurring event copy
    appointmentToPost.AppointmentDate = timestampToDateISOTZ(startDate);
    appointmentToPost.AppointmentTime = timestampToTimeISOTZ(startDate);
    appointmentToPost.rrule = { freq: "", interval: 0, dtstart: "", until: "" };
    appointmentToPost.exrule = [];
    appointmentPost.mutate(appointmentToPost, {
      onSuccess: (data) => {
        setFormVisible(false);
        setSelectable(true);
        lastCurrentId.current = data.id.toString(); //to change the current event as the new one
      },
    });
  };

  //EVENTS LAYOUT
  const renderEventContent = (info: EventContentArg) => {
    const event = info.event;
    const staffGuestsIds: { staff_infos: StaffType }[] =
      event.extendedProps.staffGuestsIds ?? []; //after handleDateSelect staffGuestsIds is undefined
    const patientsGuestsIds: { patient_infos: DemographicsType }[] =
      event.extendedProps.patientsGuestsIds ?? []; //after handleDateSelect patientsGuestsIds is undefined
    if (
      //wEEK, MONTH, YEAR, ROOMS
      info.view.type === "timeGridWeek" ||
      info.view.type === "dayGridMonth" ||
      info.view.type === "multiMonthYear" ||
      info.view.type === "resourceTimeGridDay"
    ) {
      return (
        <EventElement
          event={event}
          info={info}
          handleCopyEvent={handleCopyEvent}
          handleDeleteEvent={handleDeleteEvent}
          handlePatientClick={handlePatientClick}
          patientsGuestsIds={patientsGuestsIds}
          staffGuestsIds={staffGuestsIds}
        />
      );
    } else if (info.view.type === "timeGrid") {
      //DAY
      return (
        <EventElementTimegrid
          event={event}
          info={info}
          handleCopyEvent={handleCopyEvent}
          handleDeleteEvent={handleDeleteEvent}
          handlePatientClick={handlePatientClick}
          patientsGuestsIds={patientsGuestsIds}
          staffGuestsIds={staffGuestsIds}
        />
      );
    } else if (info.view.type === "listWeek") {
      //LIST
      return (
        <EventElementListWeek
          event={event}
          info={info}
          handleCopyEvent={handleCopyEvent}
          handleDeleteEvent={handleDeleteEvent}
          handlePatientClick={handlePatientClick}
          patientsGuestsIds={patientsGuestsIds}
          staffGuestsIds={staffGuestsIds}
        />
      );
    }
  };

  //EVENT CLICK
  const handleEventClick = async (info: EventClickArg) => {
    if (formVisible) return;
    const element = info.el;
    const event = info.event;
    const view = info.view.type;
    currentInfo.current = info;

    //CALENDAR
    //we clicked on the current event
    if (
      currentEvent.current &&
      currentEvent.current.id === event.id &&
      currentEvent.current.start ===
        DateTime.fromJSDate(event.start as Date).toMillis()
    ) {
      setFormColor(event.backgroundColor);
      setFormVisible(true);
      setSelectable(false);
    }
    //we clicked on another event
    else if (
      (currentEvent.current &&
        (currentEvent.current.id !== event.id ||
          currentEvent.current.start !==
            DateTime.fromJSDate(event.start as Date).toMillis())) ||
      currentEvent.current === null
    ) {
      if (currentEvent.current)
        (currentElement.current as HTMLElement).style.border = "none";
      currentEvent.current = eventImplToEventInput(event);
      lastCurrentId.current = event.id;
      currentElement.current = element;
      element.style.border = "solid 1px #f53f77";
      !timelineVisible && setCurrentView(view);
    }

    //XANO
    if (event.extendedProps.recurrence !== "Once") {
      const appointment = await xanoGet(
        `/appointments/${parseInt(info.event.id)}`,
        "staff"
      );
      if (
        DateTime.fromJSDate(event.start as Date, {
          zone: "America/Toronto",
        }).toMillis() === appointment.start
      ) {
        setIsFirstEvent(true);
      } else {
        setIsFirstEvent(false);
      }
    }
  };

  // DATES SET
  const handleDatesSet = (info: DatesSetArg) => {
    setRangeStart(
      DateTime.fromJSDate(info.start, { zone: "America/Toronto" }).toMillis()
    );
    setRangeEnd(
      DateTime.fromJSDate(info.end, { zone: "America/Toronto" }).toMillis()
    );
    setInitialDate(
      DateTime.fromJSDate(info.start, { zone: "America/Toronto" }).toMillis()
    );
    if (currentElement.current) {
      currentElement.current.style.border = "none";
    }
    currentEvent.current = null;
    currentElement.current = null;
    lastCurrentId.current = "";
    currentInfo.current = null;
    !timelineVisible && setCurrentView(info.view.type);
  };

  //DATE SELECT
  const handleDateSelect = async (info: DateSelectArg) => {
    //CALENDAR
    if (currentElement.current) currentElement.current.style.border = "none";

    const startDate = DateTime.fromJSDate(info.start, {
      zone: "America/Toronto",
    }).toMillis();

    const endDate = DateTime.fromJSDate(info.end, {
      zone: "America/Toronto",
    }).toMillis();

    const startAllDay = DateTime.fromMillis(startDate, {
      zone: "America/Toronto",
    })
      .set({ hour: 0, minute: 0, second: 0 })
      .toMillis();
    const endAllDay = startAllDay + 24 * 3600 * 1000;

    const appointmentToPost: Partial<AppointmentType> = {
      host_id: user.title === "Secretary" ? 0 : user.id,
      date_created: nowTZTimestamp(),
      created_by_id: user.id,
      created_by_user_type: "staff",
      start: info.allDay ? startAllDay : startDate,
      end: info.allDay ? endAllDay : endDate,
      room_id: timelineVisible ? info.resource?.id ?? "z" : "z",
      all_day: info.allDay,
      AppointmentTime: timestampToTimeISOTZ(
        info.allDay ? startAllDay : startDate
      ),
      Duration: info.allDay
        ? 1440
        : Math.floor((endDate - startDate) / (1000 * 60)),
      AppointmentStatus: "Confirmed",
      AppointmentDate: timestampToDateISOTZ(
        info.allDay ? startAllDay : startDate
      ),
      AppointmentPurpose: "Appointment",
      site_id: timelineVisible ? timelineSiteId : user.site_id,
      recurrence: "Once",
      Provider:
        user.title === "Secretary"
          ? { Name: { FirstName: "", LastName: "" }, OHIPPhysicianId: "" }
          : {
              Name: {
                FirstName: user.first_name,
                LastName: user.last_name,
              },
              OHIPPhysicianId: user.ohip_billing_nbr,
            },
      appointment_type: "",
    };

    if (timelineVisible) {
      let availableRooms;
      try {
        availableRooms = await getAvailableRooms(
          0,
          startDate,
          endDate,
          sites as SiteType[],
          timelineSiteId
        );
      } catch (err) {
        if (err instanceof Error)
          toast.error(`Error: unable to get available rooms: ${err.message}`, {
            containerId: "A",
          });
        return;
      }
      if (
        info.resource?.id &&
        (info.resource?.id === "z" ||
          availableRooms?.includes(info.resource?.id) ||
          (!availableRooms?.includes(info.resource?.id) &&
            (await confirmAlert({
              content: `${toRoomTitle(
                sites,
                timelineSiteId,
                info.resource.id
              )} will be occupied at this time slot, choose it anyway ?`,
            }))))
      ) {
        appointmentPost.mutate(appointmentToPost, {
          onSuccess: (data) => {
            lastCurrentId.current = data.id.toString();
          },
        });
      }
    } else {
      appointmentPost.mutate(appointmentToPost, {
        onSuccess: (data) => {
          lastCurrentId.current = data.id.toString();
        },
      });
    }
    if (!sitesIds.includes(user.site_id)) {
      setSitesIds([...sitesIds, user.site_id]);
    }
    fcRef.current?.getApi().unselect();
  };

  //DRAG AND DROP
  const handleDragStart = (info: EventDragStartArg) => {
    if (currentElement.current) currentElement.current.style.border = "none";
    initialInfo.current = info;
    setFormVisible(false);
  };

  const handleDrop = async (info: EventDropArg) => {
    const event = info.event;
    const element = info.el;

    //CALENDAR
    currentElement.current = element;
    currentEvent.current = eventImplToEventInput(event);
    lastCurrentId.current = event.id;
    element.style.border = "solid 1px #f53f77";

    //XANO
    //Recurring events
    if (event.extendedProps.recurrence !== "Once") {
      currentInfo.current = info;
      const appointment = await xanoGet(
        `/appointments/${parseInt(event.id)}`,
        "staff"
      );
      if (
        DateTime.fromJSDate(initialInfo.current?.event.start as Date, {
          zone: "America/Toronto",
        }).toMillis() === appointment.start
      ) {
        setIsFirstEvent(true);
      } else {
        setIsFirstEvent(false);
      }
      setConfirmDlgRecChangeVisible(true);
      return;
    }

    //Not recurring events
    const startDate = DateTime.fromJSDate(event.start as Date, {
      zone: "America/Toronto",
    }).toMillis();
    const endDate = DateTime.fromJSDate(event.end as Date, {
      zone: "America/Toronto",
    }).toMillis();

    const startAllDay = DateTime.fromMillis(startDate, {
      zone: "America/Toronto",
    })
      .set({ hour: 0, minute: 0, second: 0 })
      .toMillis();
    const endAllDay = startAllDay + 24 * 3600 * 1000;

    let availableRooms;
    try {
      availableRooms = await getAvailableRooms(
        parseInt(event.id),
        startDate,
        endDate,
        sites as SiteType[],
        timelineVisible ? timelineSiteId : user.site_id
      );
    } catch (err) {
      if (err instanceof Error)
        toast.error(`Error: unable to get availabale rooms: ${err.message}`, {
          containerId: "A",
        });
      return;
    }

    const appointmentToPut: AppointmentType = {
      id: parseInt(event.id),
      host_id: event.extendedProps.host,
      start: event.allDay ? startAllDay : startDate,
      end: event.allDay ? endAllDay : endDate,
      patients_guests_ids: event.extendedProps.patientsGuestsIds,
      staff_guests_ids: event.extendedProps.staffGuestsIds,
      all_day: event.allDay,
      date_created: event.extendedProps.date_created,
      created_by_id: event.extendedProps.created_by_id,
      created_by_user_type: event.extendedProps.created_by_user_type,
      updates: [
        ...event.extendedProps.updates,
        { updated_by_id: user.id, date_updated: nowTZTimestamp() },
      ],
      AppointmentTime: timestampToTimeISOTZ(
        DateTime.fromJSDate(event.start as Date, {
          zone: "America/Toronto",
        }).toMillis()
      ),
      Duration: event.allDay
        ? 1440
        : Math.floor((endDate - startDate) / (1000 * 60)),
      AppointmentStatus: event.extendedProps.status,
      AppointmentDate: timestampToDateISOTZ(
        DateTime.fromJSDate(event.start as Date, {
          zone: "America/Toronto",
        }).toMillis()
      ),
      Provider: {
        Name: {
          FirstName: event.extendedProps.hostFirstName,
          LastName: event.extendedProps.hostLastName,
        },
        OHIPPhysicianId: event.extendedProps.OHIP,
      },
      AppointmentPurpose: event.extendedProps.purpose,
      AppointmentNotes: event.extendedProps.notes,
      site_id: event.extendedProps.siteId,
      recurrence: event.extendedProps.recurrence,
      rrule: event.extendedProps.rrule,
      exrule: event.extendedProps.exrule,
      room_id: event.extendedProps.roomId,
      invitations_sent: event.extendedProps.invitations_sent,
      appointment_type: event.extendedProps.appointment_type,
    };

    if (!timelineVisible) {
      if (
        event.extendedProps.roomId === "z" ||
        availableRooms?.includes(event.extendedProps.roomId) ||
        (!availableRooms?.includes(event.extendedProps.roomId) &&
          (await confirmAlert({
            content: `${toRoomTitle(
              sites,
              user.site_id,
              event.extendedProps.roomId
            )} will be occupied at this time slot, change schedule anyway?`,
          })))
      ) {
        appointmentToPut.room_id = event.extendedProps.roomId;
        appointmentPut.mutate(appointmentToPut);
      } else {
        info.revert();
      }
    } else {
      const newRoomId = info.newResource
        ? info.newResource.id
        : event.extendedProps.roomId;
      if (
        newRoomId === "z" ||
        availableRooms?.includes(newRoomId) ||
        (!availableRooms?.includes(newRoomId) &&
          (await confirmAlert({
            content: `${toRoomTitle(
              sites,
              timelineSiteId,
              newRoomId
            )} will be occupied at this time slot, change schedule anyway?`,
          })))
      ) {
        appointmentToPut.room_id = newRoomId;
        appointmentPut.mutate(appointmentToPut);
      } else {
        info.revert();
      }
    }
  };

  //RESIZE
  const handleResizeStart = (info: EventResizeStartArg) => {
    if (currentElement.current) currentElement.current.style.border = "none";
    initialInfo.current = info;
    setFormVisible(false);
  };
  const handleResize = async (info: EventResizeDoneArg) => {
    const event = info.event;
    const element = info.el;

    //CALENDAR
    currentEvent.current = eventImplToEventInput(event);
    currentElement.current = element;
    lastCurrentId.current = event.id;
    element.style.border = "solid 1px #f53f77";

    //XANO
    //Recurring events
    if (event.extendedProps.recurrence !== "Once") {
      currentInfo.current = info;
      const appointment = await xanoGet(
        `/appointments/${parseInt(event.id)}`,
        "staff"
      );
      if (
        DateTime.fromJSDate(initialInfo.current?.event.start as Date, {
          zone: "America/Toronto",
        }).toMillis() === appointment.start
      ) {
        setIsFirstEvent(true);
      } else {
        setIsFirstEvent(false);
      }
      setConfirmDlgRecChangeVisible(true);
      return;
    }

    //Not recurring events
    const startDate = DateTime.fromJSDate(event.start as Date, {
      zone: "America/Toronto",
    }).toMillis();
    const endDate = DateTime.fromJSDate(event.end as Date, {
      zone: "America/Toronto",
    }).toMillis();
    //same as a drop
    let availableRooms;
    try {
      availableRooms = await getAvailableRooms(
        parseInt(event.id),
        startDate,
        endDate,
        sites as SiteType[],
        timelineVisible ? timelineSiteId : user.site_id
      );
    } catch (err) {
      if (err instanceof Error)
        toast.error(`Error: unable to get available rooms: ${err.message}`, {
          containerId: "A",
        });
      return;
    }
    if (
      event.extendedProps.roomId === "z" ||
      availableRooms?.includes(event.extendedProps.roomId) ||
      (!availableRooms?.includes(event.extendedProps.roomId) &&
        (await confirmAlert({
          content: `${toRoomTitle(
            sites,
            event.extendedProps.siteId,
            event.extendedProps.roomId
          )} will be occupied at this time slot, change schedule anyway?`,
        })))
    ) {
      const appointmentToPut: AppointmentType = {
        id: parseInt(event.id),
        host_id: event.extendedProps.host,
        start: startDate,
        end: endDate,
        patients_guests_ids: event.extendedProps.patientsGuestsIds,
        staff_guests_ids: event.extendedProps.staffGuestsIds,
        room_id: event.extendedProps.roomId,
        all_day: event.allDay,
        date_created: event.extendedProps.date_created,
        created_by_id: event.extendedProps.created_by_id,
        created_by_user_type: event.extendedProps.created_by_user_type,
        updates: [
          ...event.extendedProps.updates,
          { updated_by_id: user.id, date_updated: nowTZTimestamp() },
        ],
        AppointmentTime: timestampToTimeISOTZ(
          DateTime.fromJSDate(event.start as Date, {
            zone: "America/Toronto",
          }).toMillis()
        ),
        Duration: event.allDay
          ? 1440
          : Math.floor((endDate - startDate) / (1000 * 60)),
        AppointmentStatus: event.extendedProps.status,
        AppointmentDate: timestampToDateISOTZ(
          DateTime.fromJSDate(event.start as Date, {
            zone: "America/Toronto",
          }).toMillis()
        ),
        Provider: {
          Name: {
            FirstName: event.extendedProps.hostFirstName,
            LastName: event.extendedProps.hostLastName,
          },
          OHIPPhysicianId: event.extendedProps.OHIP,
        },
        AppointmentPurpose: event.extendedProps.purpose,
        AppointmentNotes: event.extendedProps.notes,
        site_id: event.extendedProps.siteId,
        recurrence: event.extendedProps.recurrence,
        rrule: event.extendedProps.rrule,
        exrule: event.extendedProps.exrule,
        invitations_sent: event.extendedProps.invitations_sent,
        appointment_type: event.extendedProps.appointment_type,
      };
      appointmentPut.mutate(appointmentToPut);
    } else {
      info.revert();
    }
  };

  //DAYSHEET
  const handlePrintDay = () => {
    setPrintDayVisible((v) => !v);
  };

  //RECURRING EVENTS
  const handleCancelRecurringChange = () => {
    if (
      currentInfo.current &&
      "revert" in currentInfo.current &&
      typeof currentInfo.current.revert === "function"
    )
      currentInfo.current.revert();
    setConfirmDlgRecChangeVisible(false);
  };
  const handleCancelRecurringDelete = () => {
    setConfirmDlgRecDeleteVisible(false);
  };
  const handleChangeThisEvent = async () => {
    setConfirmDlgRecChangeVisible(false);
    const event = (
      currentInfo.current as Exclude<
        | EventResizeDoneArg
        | EventClickArg
        | EventContentArg
        | DateSelectArg
        | EventDropArg,
        DateSelectArg
      >
    )?.event;
    const startDate = DateTime.fromJSDate(event.start as Date, {
      zone: "America/Toronto",
    }).toMillis();
    const endDate = DateTime.fromJSDate(event.end as Date, {
      zone: "America/Toronto",
    }).toMillis();
    const startAllDay = DateTime.fromMillis(startDate, {
      zone: "America/Toronto",
    })
      .set({ hour: 0, minute: 0, second: 0 })
      .toMillis();
    const endAllDay = startAllDay + 24 * 3600 * 1000;

    let availableRooms;
    try {
      availableRooms = await getAvailableRooms(
        parseInt(event.id),
        startDate,
        endDate,
        sites as SiteType[],
        timelineVisible ? timelineSiteId : user.site_id
      );
    } catch (err) {
      if (err instanceof Error)
        toast.error(`Error: unable to get availabale rooms: ${err.message}`, {
          containerId: "A",
        });
      return;
    }
    //Create a new appointment B
    const appointmentToPost: Partial<AppointmentType> = {
      host_id: event.extendedProps.host,
      start: event.allDay ? startAllDay : startDate,
      end: event.allDay ? endAllDay : endDate,
      patients_guests_ids: (
        event.extendedProps.patientsGuestsIds as {
          patient_infos: DemographicsType;
        }[]
      ).map(({ patient_infos }) => patient_infos.patient_id),
      staff_guests_ids: (
        event.extendedProps.staffGuestsIds as { staff_infos: StaffType }[]
      ).map(({ staff_infos }) => staff_infos.id),
      all_day: event.allDay,
      date_created: event.extendedProps.date_created,
      created_by_id: event.extendedProps.created_by_id,
      created_by_user_type: event.extendedProps.created_by_user_type,
      AppointmentTime: timestampToTimeISOTZ(
        event.allDay ? startAllDay : startDate
      ),
      Duration: event.allDay
        ? 1440
        : Math.floor((endDate - startDate) / (1000 * 60)),
      AppointmentStatus: event.extendedProps.status,
      AppointmentDate: timestampToDateISOTZ(
        event.allDay ? startAllDay : startDate
      ),
      Provider: {
        Name: {
          FirstName: event.extendedProps.hostFirstName,
          LastName: event.extendedProps.hostLastName,
        },
        OHIPPhysicianId: event.extendedProps.OHIP,
      },
      AppointmentPurpose: event.extendedProps.purpose,
      AppointmentNotes: event.extendedProps.notes,
      site_id: event.extendedProps.siteId,
      recurrence: "Once",
    };
    //Update original appointment A excluding appointment B
    const appointmentToPut: AppointmentType = await xanoGet(
      `/appointments/${event.id}`,
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
            dtstart: `${timestampToDateISOTZ(startDate)}T${timestampToTimeISOTZ(
              appointmentToPut.start
            )}`,
            until: `${timestampToDateISOTZ(endDate)}T${timestampToTimeISOTZ(
              appointmentToPut.end
            )}`,
          },
        ]
      : [
          {
            freq: appointmentToPut.rrule.freq,
            interval: appointmentToPut.rrule.interval,
            dtstart: `${timestampToDateISOTZ(startDate)}T${timestampToTimeISOTZ(
              appointmentToPut.start
            )}`,
            until: `${timestampToDateISOTZ(endDate)}T${timestampToTimeISOTZ(
              appointmentToPut.end
            )}`,
          },
        ];
    if (!timelineVisible) {
      if (
        event.extendedProps.roomId === "z" ||
        availableRooms?.includes(event.extendedProps.roomId) ||
        (!availableRooms?.includes(event.extendedProps.roomId) &&
          (await confirmAlert({
            content: `${toRoomTitle(
              sites,
              user.site_id,
              event.extendedProps.roomId
            )} will be occupied at this time slot, change anyway?`,
          })))
      ) {
        appointmentToPost.room_id = event.extendedProps.roomId;
        appointmentPost.mutate(appointmentToPost, {
          onSuccess: (data) => {
            lastCurrentId.current = data.id.toString();
          },
        });
        appointmentPut.mutate(appointmentToPut);
      } else {
        if (
          currentInfo.current &&
          "revert" in currentInfo.current &&
          typeof currentInfo.current.revert === "function"
        )
          currentInfo.current.revert();
      }
    } else {
      const newRoomId =
        currentInfo.current && "newResource" in currentInfo.current
          ? currentInfo.current.newResource?.id
          : event.extendedProps.roomId;
      if (
        newRoomId === "z" ||
        availableRooms?.includes(newRoomId) ||
        (!availableRooms?.includes(newRoomId) &&
          (await confirmAlert({
            content: `${toRoomTitle(
              sites,
              timelineSiteId,
              newRoomId
            )} will be occupied at this time slot, change schedule anyway?`,
          })))
      ) {
        appointmentToPost.room_id = newRoomId;
        appointmentPost.mutate(appointmentToPost, {
          onSuccess: (data) => {
            lastCurrentId.current = data.id.toString();
          },
        });
        appointmentPut.mutate(appointmentToPut);
      } else {
        if (
          currentInfo.current &&
          "revert" in currentInfo.current &&
          typeof currentInfo.current.revert === "function"
        )
          currentInfo.current.revert();
      }
    }
  };

  const handleChangeAllEvents = async () => {
    const event = (
      currentInfo.current as Exclude<
        | EventResizeDoneArg
        | EventClickArg
        | EventContentArg
        | DateSelectArg
        | EventDropArg,
        DateSelectArg
      >
    )?.event;
    const startDate = DateTime.fromJSDate(event.start as Date, {
      zone: "America/Toronto",
    }).toMillis();
    const endDate = DateTime.fromJSDate(event.end as Date, {
      zone: "America/Toronto",
    }).toMillis();
    const startAllDay = DateTime.fromMillis(startDate, {
      zone: "America/Toronto",
    })
      .set({ hour: 0, minute: 0, second: 0 })
      .toMillis();
    const endAllDay = startAllDay + 24 * 3600 * 1000;
    let availableRooms;
    try {
      availableRooms = await getAvailableRooms(
        parseInt(event.id),
        startDate,
        endDate,
        sites as SiteType[],
        timelineVisible ? timelineSiteId : user.site_id
      );
    } catch (err) {
      if (err instanceof Error)
        toast.error(`Error: unable to get availabale rooms: ${err.message}`, {
          containerId: "A",
        });
      return;
    }
    const appointmentToPut: AppointmentType = await xanoGet(
      `/appointments/${event.id}`,
      "staff"
    );
    appointmentToPut.start = event.allDay ? startAllDay : startDate;
    appointmentToPut.end = event.allDay ? endAllDay : endDate;
    appointmentToPut.AppointmentTime = timestampToTimeISOTZ(
      event.allDay ? startAllDay : startDate
    );
    appointmentToPut.AppointmentDate = timestampToDateISOTZ(
      event.allDay ? startAllDay : startDate
    );
    appointmentToPut.Duration = event.allDay
      ? 1440
      : Math.floor((endDate - startDate) / (1000 * 60));
    appointmentToPut.rrule.dtstart = timestampToDateTimeSecondsISOTZ(
      event.allDay ? startAllDay : startDate
    );
    if (!timelineVisible) {
      if (
        event.extendedProps.roomId === "z" ||
        availableRooms?.includes(event.extendedProps.roomId) ||
        (!availableRooms?.includes(event.extendedProps.roomId) &&
          (await confirmAlert({
            content: `${toRoomTitle(
              sites,
              user.site_id,
              event.extendedProps.roomId
            )} will be occupied at this time slot, change anyway?`,
          })))
      ) {
        appointmentPut.mutate(appointmentToPut);
        setConfirmDlgRecChangeVisible(false);
      } else {
        if (
          currentInfo.current &&
          "revert" in currentInfo.current &&
          typeof currentInfo.current.revert === "function"
        )
          currentInfo.current.revert();
        setConfirmDlgRecChangeVisible(false);
      }
    } else {
      const newRoomId =
        currentInfo.current && "newResource" in currentInfo.current
          ? (currentInfo.current as EventDropArg).newResource?.id
          : event.extendedProps.roomId;
      if (
        newRoomId === "z" ||
        availableRooms?.includes(newRoomId) ||
        (!availableRooms?.includes(newRoomId) &&
          (await confirmAlert({
            content: `${toRoomTitle(
              sites,
              timelineSiteId,
              newRoomId
            )} will be occupied at this time slot, change schedule anyway?`,
          })))
      ) {
        appointmentToPut.room_id = newRoomId;
        appointmentPut.mutate(appointmentToPut);
        setConfirmDlgRecChangeVisible(false);
      } else {
        if (
          currentInfo.current &&
          "revert" in currentInfo.current &&
          typeof currentInfo.current.revert === "function"
        )
          currentInfo.current.revert();
        setConfirmDlgRecChangeVisible(false);
      }
    }
  };
  const handleChangeAllFutureEvents = async () => {
    const event = (
      currentInfo.current as Exclude<
        | EventResizeDoneArg
        | EventClickArg
        | EventContentArg
        | DateSelectArg
        | EventDropArg,
        DateSelectArg
      >
    )?.event;
    const startDate = DateTime.fromJSDate(event.start as Date, {
      zone: "America/Toronto",
    }).toMillis();
    const endDate = DateTime.fromJSDate(event.end as Date, {
      zone: "America/Toronto",
    }).toMillis();
    const startAllDay = DateTime.fromMillis(startDate, {
      zone: "America/Toronto",
    })
      .set({ hour: 0, minute: 0, second: 0 })
      .toMillis();
    const endAllDay = startAllDay + 24 * 3600 * 1000;
    let availableRooms;
    try {
      availableRooms = await getAvailableRooms(
        parseInt(event.id),
        startDate,
        endDate,
        sites as SiteType[],
        timelineVisible ? timelineSiteId : user.site_id
      );
    } catch (err) {
      if (err instanceof Error)
        toast.error(`Error: unable to get availabale rooms: ${err.message}`, {
          containerId: "A",
        });
      return;
    }
    //Create a new recurring event B
    const appointmentToPost: Partial<AppointmentType> = {
      host_id: event.extendedProps.host,
      start: event.allDay ? startAllDay : startDate,
      end: event.allDay ? endAllDay : endDate,
      patients_guests_ids: (
        event.extendedProps.patientsGuestsIds as {
          patient_infos: DemographicsType;
        }[]
      ).map(({ patient_infos }) => patient_infos.patient_id),
      staff_guests_ids: (
        event.extendedProps.staffGuestsIds as { staff_infos: StaffType }[]
      ).map(({ staff_infos }) => staff_infos.id),
      all_day: event.allDay,
      date_created: event.extendedProps.date_created,
      created_by_id: event.extendedProps.created_by_id,
      created_by_user_type: event.extendedProps.created_by_user_type,
      AppointmentTime: timestampToTimeISOTZ(
        event.allDay ? startAllDay : startDate
      ),
      Duration: event.allDay
        ? 1440
        : Math.floor((endDate - startDate) / (1000 * 60)),
      AppointmentStatus: event.extendedProps.status,
      AppointmentDate: timestampToDateISOTZ(
        event.allDay ? startAllDay : startDate
      ),
      Provider: {
        Name: {
          FirstName: event.extendedProps.hostFirstName,
          LastName: event.extendedProps.hostLastName,
        },
        OHIPPhysicianId: event.extendedProps.OHIP,
      },
      AppointmentPurpose: event.extendedProps.purpose,
      AppointmentNotes: event.extendedProps.notes,
      site_id: event.extendedProps.siteId,
      recurrence: event.extendedProps.recurrence,
      rrule: {
        ...event.extendedProps.rrule,
        dtstart: timestampToDateTimeSecondsISOTZ(
          event.allDay ? startAllDay : startDate
        ),
      },
    };
    //Update original event A en exclude event B date
    const appointmentToPut: AppointmentType = await xanoGet(
      `/appointments/${event.id}`,
      "staff"
    );
    appointmentToPut.rrule.until = timestampToDateTimeSecondsISOTZ(
      startAllDay - 1000
    );
    if (!timelineVisible) {
      if (
        event.extendedProps.roomId === "z" ||
        availableRooms?.includes(event.extendedProps.roomId) ||
        (!availableRooms?.includes(event.extendedProps.roomId) &&
          (await confirmAlert({
            content: `${toRoomTitle(
              sites,
              user.site_id,
              event.extendedProps.roomId
            )} will be occupied at this time slot, change anyway?`,
          })))
      ) {
        appointmentToPost.room_id = event.extendedProps.roomId;
        appointmentPost.mutate(appointmentToPost, {
          onSuccess: (data) => {
            lastCurrentId.current = data.id.toString();
          },
        });
        appointmentPut.mutate(appointmentToPut);
        setConfirmDlgRecChangeVisible(false);
      } else {
        if (
          currentInfo.current &&
          "revert" in currentInfo.current &&
          typeof currentInfo.current.revert === "function"
        )
          currentInfo.current.revert();
        setConfirmDlgRecChangeVisible(false);
      }
    } else {
      const newRoomId =
        currentInfo.current && "newResource" in currentInfo.current
          ? (currentInfo.current as EventDropArg).newResource?.id
          : event.extendedProps.roomId;
      if (
        newRoomId === "z" ||
        availableRooms?.includes(newRoomId) ||
        (!availableRooms?.includes(newRoomId) &&
          (await confirmAlert({
            content: `${toRoomTitle(
              sites,
              timelineSiteId,
              newRoomId
            )} will be occupied at this time slot, change schedule anyway?`,
          })))
      ) {
        appointmentToPost.room_id = newRoomId;
        appointmentPost.mutate(appointmentToPost, {
          onSuccess: (data) => {
            lastCurrentId.current = data.id.toString();
          },
        });
        appointmentPut.mutate(appointmentToPut);
        setConfirmDlgRecChangeVisible(false);
      } else {
        if (
          currentInfo.current &&
          "revert" in currentInfo.current &&
          typeof currentInfo.current.revert === "function"
        )
          currentInfo.current.revert();
        setConfirmDlgRecChangeVisible(false);
      }
    }
  };
  const handleDeleteThisEvent = async () => {
    const event = (
      currentInfo.current as Exclude<
        | EventResizeDoneArg
        | EventClickArg
        | EventContentArg
        | DateSelectArg
        | EventDropArg,
        DateSelectArg
      >
    )?.event;
    const startDate = DateTime.fromJSDate(event.start as Date, {
      zone: "America/Toronto",
    }).toMillis();
    const endDate = DateTime.fromJSDate(event.end as Date, {
      zone: "America/Toronto",
    }).toMillis();

    const appointmentToPut: AppointmentType = await xanoGet(
      `/appointments/${event.id}`,
      "staff"
    );
    if (isFirstEvent) {
      const nextOccurence = toNextOccurence(
        startDate,
        endDate,
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
              freq: appointmentToPut.rrule?.freq as string,
              interval: appointmentToPut.rrule?.interval as number,
              dtstart: `${timestampToDateISOTZ(
                startDate
              )}T${timestampToTimeISOTZ(appointmentToPut.start)}`,
              until: `${timestampToDateISOTZ(endDate)}T${timestampToTimeISOTZ(
                appointmentToPut.end
              )}`,
            },
          ]
        : [
            {
              freq: appointmentToPut.rrule?.freq as string,
              interval: appointmentToPut.rrule?.interval as number,
              dtstart: `${timestampToDateISOTZ(
                startDate
              )}T${timestampToTimeISOTZ(appointmentToPut.start)}`,
              until: `${timestampToDateISOTZ(endDate)}T${timestampToTimeISOTZ(
                appointmentToPut.end
              )}`,
            },
          ];
    }
    appointmentPut.mutate(appointmentToPut);
    currentEvent.current = null;
    lastCurrentId.current = "";
    setConfirmDlgRecDeleteVisible(false);
  };

  const handleDeleteAllEvents = async () => {
    const event = (
      currentInfo.current as Exclude<
        | EventResizeDoneArg
        | EventClickArg
        | EventContentArg
        | DateSelectArg
        | EventDropArg,
        DateSelectArg
      >
    )?.event;
    appointmentDelete.mutate(parseInt(event.id));
    if (currentEvent.current?.extendedProps?.patientsGuestsIds) {
      const patientsIds = (
        currentEvent.current?.extendedProps?.patientsGuestsIds as {
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
  };

  const handleDeleteAllFutureEvents = async () => {
    const event = (
      currentInfo.current as Exclude<
        | EventResizeDoneArg
        | EventClickArg
        | EventContentArg
        | DateSelectArg
        | EventDropArg,
        DateSelectArg
      >
    )?.event;
    const appointmentToPut: AppointmentType = await xanoGet(
      `/appointments/${event.id}`,
      "staff"
    );
    const startDate = DateTime.fromJSDate(event.start as Date, {
      zone: "America/Toronto",
    }).toMillis();
    const endDate = DateTime.fromJSDate(event.end as Date, {
      zone: "America/Toronto",
    }).toMillis();
    appointmentToPut.rrule.until = timestampToDateTimeSecondsISOTZ(
      toLastOccurence(
        startDate,
        endDate,
        appointmentToPut.rrule as RruleType,
        appointmentToPut.exrule as ExruleType
      )[0]
    );
    appointmentPut.mutate(appointmentToPut);
    currentEvent.current = null;
    lastCurrentId.current = "";
    setConfirmDlgRecDeleteVisible(false);
  };

  if (appointments.isError)
    return <ErrorParagraph errorMsg={appointments.error.message} />;
  if (!sites) return <LoadingParagraph />;

  return (
    <>
      <CalendarOptions
        editAvailability={editAvailability}
        setEditAvailability={setEditAvailability}
        isPending={appointments.isPending}
      />
      {mobileCalendarOptionsVisible && (
        <CalendarOptionsMobile
          editAvailability={editAvailability}
          setEditAvailability={setEditAvailability}
          isPending={appointments.isPending}
          setMobileCalendarOptionsVisible={setMobileCalendarOptionsVisible}
        />
      )}
      {mobileCalendarFilterVisible && (
        <CalendarFilterMobile
          sites={sites as SiteType[]}
          sitesIds={sitesIds}
          setSitesIds={setSitesIds}
          hostsIds={hostsIds}
          setHostsIds={setHostsIds}
          setMobileCalendarFilterVisible={setMobileCalendarFilterVisible}
          remainingStaff={getRemainingStaff(user.id, staffInfos)}
        />
      )}
      <div className="calendar__layout">
        <CalendarLeftBar
          handleShortcutpickrChange={handleShortcutpickrChange}
          sites={sites as SiteType[]}
          sitesIds={sitesIds}
          setSitesIds={setSitesIds}
          hostsIds={hostsIds}
          setHostsIds={setHostsIds}
        />
        <CalendarDisplay
          timelineVisible={timelineVisible}
          setTimelineVisible={setTimelineVisible}
          timelineSiteId={timelineSiteId}
          setTimelineSiteId={setTimelineSiteId}
          events={events}
          sites={sites as SiteType[]}
          currentView={currentView}
          printDayVisible={printDayVisible}
          setPrintDayVisible={setPrintDayVisible}
          handlePrintDay={handlePrintDay}
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
          initialDate={initialDate}
          fcRef={fcRef}
          handleDatesSet={handleDatesSet}
          handleDateSelect={handleDateSelect}
          handleDragStart={handleDragStart}
          handleEventClick={handleEventClick}
          handleDrop={handleDrop}
          handleResize={handleResize}
          handleResizeStart={handleResizeStart}
          renderEventContent={renderEventContent}
          formVisible={formVisible}
          setFormVisible={setFormVisible}
          currentEvent={currentEvent}
          currentElement={currentElement}
          lastCurrentId={lastCurrentId}
          setFormColor={setFormColor}
          formColor={formColor}
          setSelectable={setSelectable}
          selectable={selectable}
          hostsIds={hostsIds}
          setHostsIds={setHostsIds}
          sitesIds={sitesIds}
          setSitesIds={setSitesIds}
          isFirstEvent={isFirstEvent}
          setMobileCalendarOptionsVisible={setMobileCalendarOptionsVisible}
          setMobileCalendarFilterVisible={setMobileCalendarFilterVisible}
        />
      </div>
      {confirmDlgRecChangeVisible && (
        <ConfirmDialogRecurringChange
          handleCancel={handleCancelRecurringChange}
          handleChangeThisEvent={handleChangeThisEvent}
          handleChangeAllEvents={handleChangeAllEvents}
          handleChangeAllFutureEvents={handleChangeAllFutureEvents}
          isFirstEvent={isFirstEvent}
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

export default Calendar;
