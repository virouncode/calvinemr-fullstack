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
import React from "react";
import { toast } from "react-toastify";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import useSocketContext from "../../../hooks/context/useSocketContext";
import useUserContext from "../../../hooks/context/useUserContext";
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

  const handleUpdateSettings = async (viewType: string) => {
    try {
      const datasToPut: SettingsType = {
        ...user.settings,
        calendar_view: viewType,
        timeline_visible: false,
      };
      const response: SettingsType = await xanoPut(
        `/settings/${user.settings.id}`,
        "staff",
        datasToPut
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
    } catch (err) {
      if (err instanceof Error)
        toast.error(`Error: unable to save preference: ${err.message}`, {
          containerId: "A",
        });
    }
  };

  return (
    <FullCalendar
      viewDidMount={({ view }) => handleUpdateSettings(view.type)}
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
      //===================Design=====================//
      headerToolbar={{
        start: "title",
        center: "timeGrid timeGridWeek dayGridMonth multiMonthYear listWeek",
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
