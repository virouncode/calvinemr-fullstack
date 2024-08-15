import {
  DateSelectArg,
  DatesSetArg,
  EventClickArg,
  EventContentArg,
  EventDropArg,
} from "@fullcalendar/core";
import { EventImpl } from "@fullcalendar/core/internal";
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
import { EventType, UserStaffType } from "../../../types/app";
import { getAvailableRooms } from "../../../utils/appointments/getAvailableRooms";
import {
  toLastOccurence,
  toNextOccurence,
} from "../../../utils/appointments/occurences";
import { parseToEvents } from "../../../utils/appointments/parseToEvents";
import {
  getTodayStartTZ,
  getTomorrowStartTZ,
  nowTZTimestamp,
  timestampToDateISOTZ,
  timestampToDateTimeSecondsISOTZ,
  timestampToTimeISOTZ,
} from "../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../utils/names/staffIdToTitleAndName";
import { toPatientName } from "../../../utils/names/toPatientName";
import { toRoomTitle } from "../../../utils/names/toRoomTitle";
import { confirmAlert } from "../../UI/Confirm/ConfirmGlobal";
import CloneIcon from "../../UI/Icons/CloneIcon";
import TrashIcon from "../../UI/Icons/TrashIcon";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
import CalendarDisplay from "./CalendarDisplay";
import CalendarLeftBar from "./CalendarLeftBar";
import ConfirmDialogRecurringChange from "./ConfirmDialogRecurringChange";
import ConfirmDialogRecurringDelete from "./ConfirmDialogRecurringDelete";
import CalendarOptions from "./Options/CalendarOptions";

//MY COMPONENT
const Calendar = () => {
  //================================= HOOKS ========================================//
  const { user } = useUserContext() as { user: UserStaffType };
  const { staffInfos } = useStaffInfosContext();
  const [initialDate, setInitialDate] = useState(nowTZTimestamp());
  const [selectable, setSelectable] = useState(true);
  const [timelineVisible, setTimelineVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [rangeStart, setRangeStart] = useState(getTodayStartTZ());
  const [rangeEnd, setRangeEnd] = useState(getTomorrowStartTZ());
  const [formColor, setFormColor] = useState("#93B5E9");
  const [sitesIds, setSitesIds] = useState([user.site_id]); //Sites for CalendarFilter
  const [timelineSiteId, setTimelineSiteId] = useState(user.site_id); //SelectTimelineSite
  const [editAvailabilityVisible, setEditAvailabilityVisible] = useState(false);
  const [hostsIds, setHostsIds] = useState(
    user.title === "Secretary"
      ? [
          0,
          ...(staffInfos
            .filter(({ site_id }) => site_id === user.site_id)
            .map(({ id }) => id) as number[]),
        ]
      : [user.id as number]
  );
  //Queries
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

  const events: EventType[] = useMemo(
    () =>
      parseToEvents(
        appointments?.data,
        staffInfos,
        sites,
        user.title === "Secretary",
        user.id as number
      ),
    [appointments?.data, sites, staffInfos, user.id, user.title]
  );

  const [printDayVisible, setPrintDayVisible] = useState(false);

  //Calendar Elements
  const fcRef = useRef<FullCalendar>(null); //fullcalendar
  const currentEvent = useRef<EventImpl | EventType | null>(null); //event can come from parseToEvents or from fullcalendar handlers
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
  const currentEventElt = useRef<HTMLElement | null>(null);
  const [currentView, setCurrentView] = useState("timeGrid");
  const lastCurrentId = useRef("");
  const eventCounter = useRef(0);
  const [isFirstEvent, setIsFirstEvent] = useState(false);
  const [confirmDlgRecChangeVisible, setConfirmDlgRecChangeVisible] =
    useState(false);
  const [confirmDlgRecDeleteVisible, setConfirmDlgRecDeleteVisible] =
    useState(false);

  //navigation
  const navigate = useNavigate();

  useEffect(() => {
    if (!events) return;
    if (lastCurrentId.current) {
      console.log(currentEvent);
      console.log(currentEventElt);
      console.log(lastCurrentId);

      //remove the red border from last currentEventElt
      if (currentEventElt.current)
        (currentEventElt.current as HTMLElement).style.border = "none";
      //change the currentEventElt and change the border to red
      currentEventElt.current = document.getElementsByClassName(
        `event-${lastCurrentId.current}`
      )[0] as HTMLElement;
      currentEventElt.current.style.border = "solid 1px red";
      //change the currentEvent
      currentEvent.current =
        events.find(
          ({ id }) => parseInt(id) === parseInt(lastCurrentId.current)
        ) ?? null;
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
    editAvailabilityVisible,
    setIsFirstEvent,
    setConfirmDlgRecDeleteVisible
  );
  //=============================== EVENTS HANDLERS =================================//
  const handleShortcutpickrChange = (
    selectedDates: Date[],
    dateStr: string
  ) => {
    const now = DateTime.now();
    const offsetLocal = now.offset;
    const offsetToronto = DateTime.local({ zone: "America/Toronto" }).offset;
    const midnightUTC = DateTime.fromISO(dateStr, { zone: "utc" })
      .plus({ minutes: offsetLocal })
      .startOf("day")
      .toJSDate();
    fcRef.current?.getApi().gotoDate(
      DateTime.fromJSDate(midnightUTC, { zone: "America/Toronto" })
        .minus({
          minutes: offsetToronto,
        })
        .toMillis()
    );
  };

  const handlePatientClick = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
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
    const view = info.view.type; //the view i clicked on
    const eventElt = document.getElementsByClassName(
      `event-${event.id}`
    )[0] as HTMLElement; //the element i clicked on
    //If the event event i clicked on is not the same as the current event or the start date is different (for recurring events)
    if (
      currentEvent.current &&
      (currentEvent.current.id !== event.id ||
        (typeof currentEvent.current.start !== "number" &&
          DateTime.fromJSDate(currentEvent.current.start as Date).toMillis() !==
            DateTime.fromJSDate(event.start as Date).toMillis()) ||
        (typeof currentEvent.current.start === "number" &&
          currentEvent.current.start !==
            DateTime.fromJSDate(event.start as Date).toMillis()))
    ) {
      //change current event
      (currentEventElt.current as HTMLElement).style.border = "none";
      currentEvent.current = event;
      lastCurrentId.current = event.id;
      currentEventElt.current = eventElt;
      eventElt.style.border = "solid 1px red";
      !timelineVisible && setCurrentView(view);
    } else if (currentEvent.current === null) {
      //If there was no current event
      currentEvent.current = event;
      lastCurrentId.current = event.id;
      currentEventElt.current = eventElt;
      eventElt.style.border = "solid 1px red";
      !timelineVisible && setCurrentView(view);
    }
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
      //open dialog
      setConfirmDlgRecDeleteVisible(true);
      return;
    }
    //Delete the event
    else if (
      await confirmAlert({
        content: "Do you really want to remove this event ?",
      })
    ) {
      appointmentDelete.mutate(parseInt(currentEvent.current?.id as string));
      setFormVisible(false);
      setSelectable(true);
      currentEvent.current = null;
      currentEventElt.current = null;
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
    //remove red border on current element
    if (currentEventElt.current) {
      currentEventElt.current.style.border = "none";
    }
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
    appointmentToPost.start = startDate;
    appointmentToPost.end = endDate;
    appointmentToPost.AppointmentDate = timestampToDateISOTZ(startDate);
    appointmentToPost.AppointmentTime = timestampToTimeISOTZ(startDate);
    delete appointmentToPost.rrule;
    delete appointmentToPost.exrule;
    appointmentPost.mutate(appointmentToPost, {
      onSuccess: (data) => {
        setFormVisible(false);
        setSelectable(true);
        lastCurrentId.current = data.id.toString();
      },
    });
  };
  //EVENT LAYOUT
  const renderEventContent = (info: EventContentArg) => {
    const event = info.event;
    const staffGuestsIds: { staff_infos: StaffType }[] =
      event.extendedProps.staffGuestsIds;
    const patientsGuestsIds: { patient_infos: DemographicsType }[] =
      event.extendedProps.patientsGuestsIds;
    if (
      //wEEK, MONTH, YEAR, ROOMS
      info.view.type === "timeGridWeek" ||
      info.view.type === "dayGridMonth" ||
      info.view.type === "multiMonthYear" ||
      info.view.type === "resourceTimeGridDay"
    ) {
      return (
        <div
          style={{
            fontSize: "0.7rem",
            height: "100%",
            backgroundImage:
              event.extendedProps.status === "Cancelled"
                ? `repeating-linear-gradient(
                45deg,
                ${event.backgroundColor},
                ${event.backgroundColor} 10px,
                #aaaaaa 10px,
                #aaaaaa 20px
              )`
                : undefined,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0 2px",
            }}
          >
            <p
              style={{
                padding: "0",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {event.allDay ? "All Day" : info.timeText} -{" "}
              {event.extendedProps.purpose ?? "Appointment"}
            </p>
            {(event.extendedProps.host === user.id ||
              user.title === "Secretary") && (
              <div style={{ display: "flex" }}>
                <CloneIcon
                  ml={5}
                  mr={5}
                  onClick={(e) => handleCopyEvent(e, info)}
                />
                <TrashIcon onClick={(e) => handleDeleteEvent(e, info)} />
              </div>
            )}
          </div>
          <div>
            <span>
              {patientsGuestsIds.length
                ? patientsGuestsIds.map(
                    (patient_guest) =>
                      patient_guest && (
                        <span
                          className="calendar__patient-link"
                          onClick={(e) =>
                            handlePatientClick(
                              e,
                              patient_guest.patient_infos.patient_id
                            )
                          }
                          key={patient_guest.patient_infos.patient_id}
                        >
                          <strong>
                            {toPatientName(
                              patient_guest.patient_infos
                            ).toUpperCase()}
                          </strong>
                          {" / "}
                        </span>
                      )
                  )
                : null}
              {staffGuestsIds.length
                ? staffGuestsIds.map(
                    (staff_guest, index) =>
                      staff_guest && (
                        <span key={staff_guest.staff_infos.id}>
                          <strong>
                            {staffIdToTitleAndName(
                              staffInfos,
                              staff_guest.staff_infos.id
                            ).toUpperCase()}
                          </strong>
                          {index !== staffGuestsIds.length - 1 ? " / " : ""}
                        </span>
                      )
                  )
                : null}
            </span>
          </div>
          <div>
            <strong>Host: </strong>
            {event.extendedProps.hostName}
          </div>
          <div>
            <strong>Site: </strong>
            {event.extendedProps.siteName}
          </div>
          <div>
            <strong>Room: </strong>
            {event.extendedProps.roomTitle}
          </div>
          <div>
            <strong>{event.extendedProps.status?.toUpperCase()}</strong>
          </div>
        </div>
      );
    } else if (info.view.type === "timeGrid") {
      //DAY
      return (
        <div
          style={{
            fontSize: "0.7rem",
            height: "100%",
            backgroundImage:
              event.extendedProps.status === "Cancelled"
                ? `repeating-linear-gradient(
                45deg,
                ${event.backgroundColor},
                ${event.backgroundColor} 10px,
                #aaaaaa 10px,
                #aaaaaa 20px
              )`
                : undefined,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              padding: "0 2px",
              alignItems: "center",
            }}
          >
            <span
              style={{
                width: "70px",
                textAlign: "left",
                display: "inline-block",
              }}
            >
              {event.allDay ? "All Day" : info.timeText}
            </span>
            <span style={{ marginLeft: "10px" }}>
              {patientsGuestsIds.length
                ? patientsGuestsIds.map(
                    (patient_guest) =>
                      patient_guest && (
                        <span
                          className="calendar__patient-link"
                          onClick={(e) =>
                            handlePatientClick(
                              e,
                              patient_guest.patient_infos.patient_id
                            )
                          }
                          key={patient_guest.patient_infos.patient_id}
                        >
                          <strong>
                            {toPatientName(
                              patient_guest.patient_infos
                            ).toUpperCase()}
                          </strong>
                          {" / "}
                        </span>
                      )
                  )
                : null}
              {staffGuestsIds.length
                ? staffGuestsIds.map(
                    (staff_guest) =>
                      staff_guest && (
                        <span key={staff_guest.staff_infos.id}>
                          <strong>
                            {staffIdToTitleAndName(
                              staffInfos,
                              staff_guest.staff_infos.id
                            ).toUpperCase()}
                          </strong>
                          {" / "}
                        </span>
                      )
                  )
                : null}
            </span>
            <span>
              <strong>
                {event.extendedProps.purpose?.toUpperCase() ?? "APPOINTMENT"}
              </strong>
              {" / "}
            </span>
            <strong>Host: </strong>
            {event.extendedProps.hostName} / <strong>Site:</strong>{" "}
            {event.extendedProps.siteName} / <strong>Room: </strong>
            {event.extendedProps.roomTitle} /{" "}
            <strong>{event.extendedProps.status?.toUpperCase()}</strong>
            {event.extendedProps.notes && (
              <>
                {" "}
                / <strong>Notes: </strong>
                {event.extendedProps.notes}
              </>
            )}
          </div>
          {(event.extendedProps.host === user.id ||
            user.title === "Secretary") && (
            <div>
              <CloneIcon
                ml={5}
                mr={5}
                onClick={(e) => handleCopyEvent(e, info)}
              />
              <TrashIcon onClick={(e) => handleDeleteEvent(e, info)} />
            </div>
          )}
        </div>
      );
    } else if (info.view.type === "listWeek") {
      //LIST
      return (
        <div
          style={{
            height: "100%",
            backgroundImage:
              event.extendedProps.status === "Cancelled"
                ? `repeating-linear-gradient(
          45deg,
          ${event.backgroundColor},
          ${event.backgroundColor} 10px,
          #aaaaaa 10px,
          #aaaaaa 20px
        )`
                : undefined,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p
              style={{
                padding: "0",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "clip",
              }}
            >
              <strong>
                {event.extendedProps.purpose?.toUpperCase() ?? "APPOINTMENT"}
              </strong>
            </p>
            {(event.extendedProps.host === user.id ||
              user.title === "Secretary") && (
              <div>
                <CloneIcon
                  ml={5}
                  mr={5}
                  onClick={(e) => handleCopyEvent(e, info)}
                />
                <TrashIcon onClick={(e) => handleDeleteEvent(e, info)} />
              </div>
            )}
          </div>
          <div>
            <span>
              {patientsGuestsIds.length
                ? patientsGuestsIds.map(
                    (patient_guest) =>
                      patient_guest && (
                        <span
                          className="calendar__patient-link calendar__patient-link--list"
                          onClick={(e) =>
                            handlePatientClick(
                              e,
                              patient_guest.patient_infos.patient_id
                            )
                          }
                          key={patient_guest.patient_infos.patient_id}
                        >
                          <strong>
                            {toPatientName(
                              patient_guest.patient_infos
                            ).toUpperCase()}
                          </strong>
                          {" / "}
                        </span>
                      )
                  )
                : null}
              {staffGuestsIds.length
                ? staffGuestsIds.map(
                    (staff_guest, index) =>
                      staff_guest && (
                        <span key={staff_guest.staff_infos.id}>
                          <strong>
                            {staffIdToTitleAndName(
                              staffInfos,
                              staff_guest.staff_infos.id
                            ).toUpperCase()}
                          </strong>
                          {index !== staffGuestsIds.length - 1 ? " / " : ""}
                        </span>
                      )
                  )
                : null}
            </span>
          </div>
          <div>
            <strong>Host: </strong>
            {event.extendedProps.hostName}
          </div>
          <div>
            <strong>Site: </strong>
            {event.extendedProps.siteName}
          </div>
          <div>
            <strong>Room: </strong>
            {event.extendedProps.rommTitle}
          </div>
          <div>
            <strong>{event.extendedProps.status?.toUpperCase()}</strong>
          </div>
          {event.extendedProps.notes && (
            <div>
              <strong>Notes: </strong>
              {event.extendedProps.notes}
            </div>
          )}
        </div>
      );
    }
  };
  //EVENT CLICK
  const handleEventClick = async (info: EventClickArg) => {
    if (formVisible) return;
    const eventElt = info.el;
    const event = info.event;
    const view = info.view.type;
    currentInfo.current = info;
    if (
      currentEvent.current &&
      (currentEvent.current.id !== event.id ||
        (typeof currentEvent.current.start !== "number" &&
          DateTime.fromJSDate(currentEvent.current.start as Date).toMillis() !==
            DateTime.fromJSDate(event.start as Date).toMillis()) ||
        (typeof currentEvent.current.start === "number" &&
          currentEvent.current.start !==
            DateTime.fromJSDate(event.start as Date).toMillis()))
    ) {
      //event selection change
      (currentEventElt.current as HTMLElement).style.border = "none";
      currentEvent.current = event;
      lastCurrentId.current = event.id;
      currentEventElt.current = eventElt;
      eventElt.style.border = "solid 1px red";
      !timelineVisible && setCurrentView(view);
    } else if (currentEvent.current === null) {
      //first event selection
      currentEvent.current = event;
      lastCurrentId.current = event.id;
      currentEventElt.current = eventElt;
      eventElt.style.border = "solid 1px red";
      !timelineVisible && setCurrentView(view);
    } else {
      setFormColor(event.backgroundColor);
      setFormVisible(true);
      setSelectable(false);
    }
    if (event.extendedProps.recurrence !== "Once") {
      const appointment = await xanoGet(
        `/appointments/${parseInt(info.event.id)}`,
        "staff"
      );
      if (
        DateTime.fromJSDate(info.event.start as Date, {
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
    if (currentEventElt.current) {
      currentEventElt.current.style.border = "none";
    }
    currentEvent.current = null;
    lastCurrentId.current = "";
    currentEventElt.current = null;
    !timelineVisible && setCurrentView(info.view.type);
  };
  //DATE SELECT
  const handleDateSelect = async (info: DateSelectArg) => {
    //Change event focus on calendar
    if (currentEventElt.current) currentEventElt.current.style.border = "none";

    //Event
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

    const appointmentToPost: AppointmentType = {
      host_id: user.title === "Secretary" ? 0 : (user.id as number),
      date_created: nowTZTimestamp(),
      created_by_id: user.id as number,
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
      AppointmentStatus: "Scheduled",
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
    };
    if (timelineVisible) {
      let availableRooms: string[];
      try {
        availableRooms =
          (await getAvailableRooms(
            0,
            startDate,
            endDate,
            sites as SiteType[],
            timelineSiteId
          )) ?? [];
      } catch (err) {
        toast.error(`Error: unable to get available rooms: ${err.message}`, {
          containerId: "A",
        });
        return;
      }
      if (
        info.resource?.id &&
        (info.resource?.id === "z" ||
          availableRooms.includes(info.resource?.id) ||
          (!availableRooms.includes(info.resource?.id) &&
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
    if (currentEventElt.current) {
      currentEventElt.current.style.border = "none";
    }
    initialInfo.current = info;
    setFormVisible(false);
  };
  const handleDrop = async (info: EventDropArg) => {
    const event = info.event;
    const eventElt = info.el;
    eventElt.style.border = "solid 1px red";
    currentEvent.current = event;
    lastCurrentId.current = event.id;
    currentEventElt.current = eventElt;

    if (event.extendedProps.recurrence !== "Once") {
      if (timelineVisible) {
        const newRoomId = info.newResource
          ? info.newResource.id
          : event.extendedProps.roomId;
        if (newRoomId !== "z") {
          alert("You can't occupy a room with a recurring event !");
          info.revert();
          return;
        }
      }
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

    let availableRooms: string[] | undefined = [];
    try {
      availableRooms = await getAvailableRooms(
        parseInt(event.id),
        startDate,
        endDate,
        sites as SiteType[],
        timelineVisible ? timelineSiteId : user.site_id
      );
    } catch (err) {
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
        // event.setExtendedProp("roomId", newRoomId);
        // event.setResources([newRoomId]);
        appointmentToPut.room_id = newRoomId;
        appointmentPut.mutate(appointmentToPut);
      } else {
        info.revert();
      }
    }
  };
  //RESIZE
  const handleResizeStart = (info: EventResizeStartArg) => {
    if (currentEventElt.current) {
      currentEventElt.current.style.border = "none";
    }
    initialInfo.current = info;
  };
  const handleResize = async (info: EventResizeDoneArg) => {
    const event = info.event;
    const eventElt = info.el;
    eventElt.style.border = "solid 1px red";
    currentEvent.current = event;
    lastCurrentId.current = event.id;
    currentEventElt.current = eventElt;

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

    const startDate = DateTime.fromJSDate(event.start as Date, {
      zone: "America/Toronto",
    }).toMillis();
    const endDate = DateTime.fromJSDate(event.end as Date, {
      zone: "America/Toronto",
    }).toMillis();
    //same as a drop
    let availableRooms: string[] = [];
    try {
      availableRooms = (await getAvailableRooms(
        parseInt(event.id),
        startDate,
        endDate,
        sites as SiteType[],
        timelineVisible ? timelineSiteId : user.site_id
      )) as string[];
    } catch (err) {
      toast.error(`Error: unable to get available rooms: ${err.message}`, {
        containerId: "A",
      });
      return;
    }
    if (
      event.extendedProps.roomId === "z" ||
      availableRooms.includes(event.extendedProps.roomId) ||
      (!availableRooms.includes(event.extendedProps.roomId) &&
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
  //RECURRING EVENT
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

    let availableRooms: string[] = [];
    try {
      availableRooms = (await getAvailableRooms(
        parseInt(event.id),
        startDate,
        endDate,
        sites as SiteType[],
        timelineVisible ? timelineSiteId : user.site_id
      )) as string[];
    } catch (err) {
      toast.error(`Error: unable to get availabale rooms: ${err.message}`, {
        containerId: "A",
      });
      return;
    }
    //Créer un nouvel évènement B
    const appointmentToPost: AppointmentType = {
      host_id: event.extendedProps.host,
      start: event.allDay ? startAllDay : startDate,
      end: event.allDay ? endAllDay : endDate,
      patients_guests_ids: event.extendedProps.patientsGuestsIds,
      staff_guests_ids: event.extendedProps.staffGuestsIds,
      all_day: event.allDay,
      date_created: event.extendedProps.date_created,
      created_by_id: event.extendedProps.created_by_id,
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
    //Update l’évènement d’origine A en excluant la date du nouvel évènement
    const appointmentToPut = await xanoGet(
      `/appointments/${event.id}`,
      "staff"
    );
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
        availableRooms.includes(event.extendedProps.roomId) ||
        (!availableRooms.includes(event.extendedProps.roomId) &&
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
          ? (currentInfo.current as EventDropArg).newResource?.id
          : event.extendedProps.roomId;
      if (
        newRoomId === "z" ||
        availableRooms.includes(newRoomId) ||
        (!availableRooms.includes(newRoomId) &&
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
    appointmentToPut.rrule = {
      ...(appointmentToPut.rrule as Exclude<RruleType, null>),
      dtstart: timestampToDateTimeSecondsISOTZ(
        event.allDay ? startAllDay : startDate
      ),
    };
    if (!timelineVisible) {
      if (
        event.extendedProps.roomId === "z" ||
        availableRooms.includes(event.extendedProps.roomId) ||
        (!availableRooms.includes(event.extendedProps.roomId) &&
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
        availableRooms.includes(newRoomId) ||
        (!availableRooms.includes(newRoomId) &&
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
    let availableRooms: string[] = [];
    try {
      availableRooms = (await getAvailableRooms(
        parseInt(event.id),
        startDate,
        endDate,
        sites as SiteType[],
        timelineVisible ? timelineSiteId : user.site_id
      )) as string[];
    } catch (err) {
      toast.error(`Error: unable to get availabale rooms: ${err.message}`, {
        containerId: "A",
      });
      return;
    }
    //Créer un nouvel evenement récurrent B
    const appointmentToPost: AppointmentType = {
      host_id: event.extendedProps.host,
      start: event.allDay ? startAllDay : startDate,
      end: event.allDay ? endAllDay : endDate,
      patients_guests_ids: event.extendedProps.patientsGuestsIds,
      staff_guests_ids: event.extendedProps.staffGuestsIds,
      all_day: event.allDay,
      date_created: event.extendedProps.date_created,
      created_by_id: event.extendedProps.created_by_id,
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
    //Update l’évènement d’origine A en excluant la date du nouvel évènement
    const appointmentToPut: AppointmentType = await xanoGet(
      `/appointments/${event.id}`,
      "staff"
    );
    appointmentToPut.rrule = {
      ...(appointmentToPut.rrule as Exclude<RruleType, null>),
      until: timestampToDateTimeSecondsISOTZ(startAllDay - 1000),
    };
    if (!timelineVisible) {
      if (
        event.extendedProps.roomId === "z" ||
        availableRooms.includes(event.extendedProps.roomId) ||
        (!availableRooms.includes(event.extendedProps.roomId) &&
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
        availableRooms.includes(newRoomId) ||
        (!availableRooms.includes(newRoomId) &&
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
        appointmentToPut.rrule as RruleType,
        appointmentToPut.exrule as ExruleType
      );
      appointmentToPut.start = nextOccurence[0];
      appointmentToPut.end = nextOccurence[1];
      appointmentToPut.AppointmentDate = timestampToDateISOTZ(nextOccurence[0]);
      appointmentToPut.AppointmentTime = timestampToTimeISOTZ(nextOccurence[0]);
      appointmentToPut.rrule = {
        ...(appointmentToPut.rrule as Exclude<RruleType, null>),
        dtstart: timestampToDateTimeSecondsISOTZ(nextOccurence[0]),
      };
    } else {
      appointmentToPut.exrule = appointmentToPut.exrule?.length
        ? [
            ...(appointmentToPut.exrule as Exclude<ExruleType, null>),
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
    appointmentToPut.rrule = {
      ...(appointmentToPut.rrule as Exclude<RruleType, null>),
      until: timestampToDateTimeSecondsISOTZ(
        toLastOccurence(
          startDate,
          endDate,
          appointmentToPut.rrule as RruleType,
          appointmentToPut.exrule as ExruleType
        )[0]
      ),
    };
    appointmentPut.mutate(appointmentToPut);
    currentEvent.current = null;
    lastCurrentId.current = "";
    setConfirmDlgRecDeleteVisible(false);
  };

  if (appointments.isError)
    return <ErrorParagraph errorMsg={appointments.error.message} />;

  return (
    <>
      <CalendarOptions
        editAvailabilityVisible={editAvailabilityVisible}
        setEditAvailabilityVisible={setEditAvailabilityVisible}
        isPending={appointments.isPending}
      />
      <div className="calendar">
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
          setFormColor={setFormColor}
          formColor={formColor}
          setSelectable={setSelectable}
          selectable={selectable}
          hostsIds={hostsIds}
          setHostsIds={setHostsIds}
          sitesIds={sitesIds}
          setSitesIds={setSitesIds}
          isFirstEvent={isFirstEvent}
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
