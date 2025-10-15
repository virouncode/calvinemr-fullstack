import {
  DateSelectArg,
  DatesSetArg,
  EventClickArg,
  EventContentArg,
  EventDropArg,
  EventInput,
} from "@fullcalendar/core";
import dayGrid from "@fullcalendar/daygrid";
import interaction, {
  EventDragStartArg,
  EventResizeDoneArg,
  EventResizeStartArg,
} from "@fullcalendar/interaction";
import list from "@fullcalendar/list";
import luxonPlugin from "@fullcalendar/luxon3";
import multimonth from "@fullcalendar/multimonth";
import FullCalendar from "@fullcalendar/react";
import rrulePlugin from "@fullcalendar/rrule";
import timeGrid from "@fullcalendar/timegrid";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import useSocketContext from "../../../hooks/context/useSocketContext";
import useUserContext from "../../../hooks/context/useUserContext";
import useSaveScrollPosition from "../../../hooks/useSaveScrollPosition";
import { SettingsType } from "../../../types/api";
import { UserStaffType } from "../../../types/app";

export const calendarViews = [
  "timeGrid",
  "timeGridWeek",
  "dayGridMonth",
  "multiMonthYear",
  "listWeek",
] as const;
export type CalendarViewType = (typeof calendarViews)[number];

type CalendarViewProps = {
  initialDate: number;
  slotDuration: string;
  firstDay: number;
  fcRef: React.MutableRefObject<FullCalendar | null>;
  isSecretary: boolean;
  events: EventInput[] | undefined;
  handleDatesSet: (info: DatesSetArg) => void;
  handleDateSelect: (info: DateSelectArg) => Promise<void>;
  handleDragStart: (info: EventDragStartArg) => void;
  handleEventClick: (info: EventClickArg) => void;
  handleDrop: (info: EventDropArg) => void;
  handleResize: (info: EventResizeDoneArg) => void;
  handleResizeStart: (info: EventResizeStartArg) => void;
  renderEventContent: (info: EventContentArg) => React.JSX.Element | undefined;
  selectable: boolean;
  currentView: string;
  hostsIds: number[];
};

const CalendarView = ({
  initialDate,
  slotDuration,
  firstDay,
  fcRef,
  isSecretary,
  events,
  handleDatesSet,
  handleDateSelect,
  handleDragStart,
  handleEventClick,
  handleDrop,
  handleResize,
  handleResizeStart,
  renderEventContent,
  selectable,
  currentView,
  hostsIds,
}: CalendarViewProps) => {
  const { user } = useUserContext() as { user: UserStaffType };
  const { socket } = useSocketContext();
  const [currentAbortController, setCurrentAbortController] =
    useState<AbortController | null>(null);
  useSaveScrollPosition(currentView);

  useEffect(() => {
    if (user.settings.calendar_view) {
      const htmlElement = document.querySelector(
        `button.fc-${user.settings.calendar_view}Custom-button`
      ) as HTMLElement;
      if (htmlElement) {
        htmlElement.classList.add("fc-button-active");
      }
    }
  }, [user.settings.calendar_view]);

  const handleUpdateSettings = async (viewType: string) => {
    try {
      if (currentAbortController) {
        currentAbortController.abort();
      }
      const newAbortController = new AbortController();
      setCurrentAbortController(newAbortController);

      const datasToPut: SettingsType = {
        ...user.settings,
        calendar_view: viewType,
        timeline_visible: false,
      };
      const response: SettingsType = await xanoPut(
        `/settings/${user.settings.id}`,
        "staff",
        datasToPut,
        newAbortController
      );
      socket?.emit("message", {
        route: "USER",
        action: "update",
        content: {
          id: user.id,
          data: {
            ...user,
            settings: response,
          },
        },
      });
      setCurrentAbortController(null);
    } catch (err) {
      console.log(err);

      if (err instanceof Error && err.name !== "CanceledError") {
        toast.error(`Error: unable to save preference: ${err.message}`, {
          containerId: "A",
        });
      }
    }
    return viewType;
  };

  const toggleActiveButtonClass = (htmlElement: HTMLElement) => {
    const buttons = htmlElement.parentElement?.querySelectorAll(".fc-button");
    buttons?.forEach((button) => {
      button.classList.remove("fc-button-active");
    });
    htmlElement.classList.add("fc-button-active");
  };

  return (
    <FullCalendar
      longPressDelay={200}
      plugins={[
        dayGrid,
        timeGrid,
        list,
        multimonth,
        interaction,
        luxonPlugin,
        rrulePlugin,
      ]}
      slotEventOverlap={false}
      timeZone="America/Toronto"
      initialDate={initialDate}
      eventOrder={"start"}
      customButtons={{
        dayGridMonthCustom: {
          text: "Month",
          click: (e, htmlElement) => {
            fcRef?.current?.getApi().changeView("dayGridMonth");
            handleUpdateSettings("dayGridMonth");
            // rest of your code here
            toggleActiveButtonClass(htmlElement);
          },
        },
        timeGridWeekCustom: {
          text: "Week",
          click: (e, htmlElement) => {
            fcRef?.current?.getApi().changeView("timeGridWeek");
            // rest of your code here
            handleUpdateSettings("timeGridWeek");
            toggleActiveButtonClass(htmlElement);
          },
        },
        timeGridCustom: {
          text: "Day",
          click: (e, htmlElement) => {
            fcRef?.current?.getApi().changeView("timeGrid");
            // rest of your code here
            handleUpdateSettings("timeGrid");
            toggleActiveButtonClass(htmlElement);
          },
        },
        multiMonthYearCustom: {
          text: "Year",
          click: (e, htmlElement) => {
            fcRef?.current?.getApi().changeView("multiMonthYear");
            // rest of your code here
            handleUpdateSettings("multiMonthYear");
            toggleActiveButtonClass(htmlElement);
          },
        },
        listWeekCustom: {
          text: "List",
          click: (e, htmlElement) => {
            fcRef?.current?.getApi().changeView("listWeek");
            // rest of your code here
            handleUpdateSettings("listWeek");
            toggleActiveButtonClass(htmlElement);
          },
        },
      }}
      //===================Design=====================//
      headerToolbar={{
        start: "title",
        center:
          "timeGridCustom timeGridWeekCustom dayGridMonthCustom multiMonthYearCustom listWeekCustom",
        end: "prev today next",
      }}
      slotLabelFormat={{
        hour: "numeric",
        minute: "2-digit",
        omitZeroMinute: true,
        meridiem: "short",
      }}
      views={{
        timeGridWeek: {
          titleFormat: { year: "numeric", month: "short", day: "numeric" },
          eventMinHeight: 10,
          eventShortHeight: 30,
          dayHeaderFormat: {
            weekday: "short",
            day: "numeric",
            omitCommas: true,
          },
        },
        multiMonthYear: {
          multiMonthMaxColumns: 1, // force a single column
        },
      }}
      buttonText={{
        today: "Today",
        month: "Month",
        week: "Week",
        day: "Day",
        list: "List",
        timeGrid: "Day",
        year: "Year",
        resourceTimeline: "Timeline",
      }}
      initialView={currentView}
      slotDuration={slotDuration}
      firstDay={firstDay}
      weekNumbers={true}
      nowIndicator={true}
      eventTextColor="#3D375A"
      eventColor={isSecretary ? "#bfbfbf" : "#8fb4fb"}
      slotLabelInterval="01:00"
      navLinks={true}
      navLinkDayClick="timeGrid"
      weekText="Week"
      dayMaxEventRows={true}
      dayMaxEvents={true}
      eventDisplay="block"
      //==================== INTERACTION ====================//
      selectable={selectable}
      selectMirror={true}
      eventResizableFromStart={true}
      editable={true}
      unselectAuto={false}
      allDayMaintainDuration={true}
      ref={fcRef}
      //==================== CALLBACKS ====================//
      events={events}
      datesSet={handleDatesSet}
      eventClick={handleEventClick}
      select={handleDateSelect}
      eventDragStart={handleDragStart}
      eventDrop={handleDrop}
      eventResize={handleResize}
      eventResizeStart={handleResizeStart}
      //====================== EVENT STYLING =================//
      eventContent={renderEventContent}
      eventClassNames={function (arg) {
        return `event-${arg.event.id}`;
      }}
    />
  );
};

export default CalendarView;
