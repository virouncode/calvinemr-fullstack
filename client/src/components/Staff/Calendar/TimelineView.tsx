import {
  DateSelectArg,
  DatesSetArg,
  EventClickArg,
  EventContentArg,
  EventDropArg,
  EventInput,
} from "@fullcalendar/core";
import interaction, {
  EventDragStartArg,
  EventResizeDoneArg,
  EventResizeStartArg,
} from "@fullcalendar/interaction";
import luxonPlugin from "@fullcalendar/luxon3";
import FullCalendar from "@fullcalendar/react";
import resourceTimeGrid from "@fullcalendar/resource-timegrid";
import rrulePlugin from "@fullcalendar/rrule";
import React from "react";
import { toast } from "react-toastify";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import useSocketContext from "../../../hooks/context/useSocketContext";
import useUserContext from "../../../hooks/context/useUserContext";
import useSaveScrollPosition from "../../../hooks/useSaveScrollPosition";
import { SettingsType, SiteType } from "../../../types/api";
import { UserStaffType } from "../../../types/app";

type TimelineViewProps = {
  initialDate: number;
  slotDuration: string;
  firstDay: number;
  fcRef: React.MutableRefObject<FullCalendar | null>;
  events: EventInput[] | undefined;
  isSecretary: boolean;
  handleDatesSet: (info: DatesSetArg) => void;
  handleDateSelect: (info: DateSelectArg) => void;
  handleDragStart: (info: EventDragStartArg) => void;
  handleEventClick: (info: EventClickArg) => void;
  handleDrop: (info: EventDropArg) => void;
  handleResize: (info: EventResizeDoneArg) => void;
  handleResizeStart: (info: EventResizeStartArg) => void;
  renderEventContent: (info: EventContentArg) => React.JSX.Element | undefined;
  site: SiteType | undefined;
  selectable: boolean;
  hostsIds: number[];
};

const TimelineView = ({
  initialDate,
  slotDuration,
  firstDay,
  fcRef,
  events,
  isSecretary,
  handleDatesSet,
  handleEventClick,
  handleDateSelect,
  handleDragStart,
  handleDrop,
  handleResize,
  handleResizeStart,
  renderEventContent,
  site,
  selectable,
  hostsIds,
}: TimelineViewProps) => {
  const { user } = useUserContext() as { user: UserStaffType };
  const { socket } = useSocketContext();
  useSaveScrollPosition("resourceTimeGridDay");

  const handleUpdateSettings = async (viewType: string) => {
    try {
      const datasToPut: SettingsType = {
        ...user.settings,
        timeline_visible: true,
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
      plugins={[resourceTimeGrid, interaction, luxonPlugin, rrulePlugin]}
      timeZone="America/Toronto"
      initialDate={initialDate}
      slotEventOverlap={false}
      //===================Design=====================//
      headerToolbar={{
        start: "title",
        // center: "resourceTimeGridDay",
        end: "prev today next",
      }}
      slotLabelFormat={{
        hour: "numeric",
        minute: "2-digit",
        omitZeroMinute: true,
        meridiem: "short",
      }}
      buttonText={{
        today: "Today",
      }}
      resourceAreaHeaderContent="Rooms"
      resourceAreaWidth="10%"
      initialView="resourceTimeGridDay"
      slotDuration={slotDuration}
      firstDay={firstDay}
      weekNumbers={true}
      nowIndicator={true}
      eventTextColor="#3D375A"
      eventColor={isSecretary ? "#bfbfbf" : "#8fb4fb"}
      slotLabelInterval="01:00"
      navLinks={true}
      navLinkDayClick="timeGrid"
      // weekText="Week"
      aspectRatio={2}
      expandRows={true}
      eventMinWidth={5}
      //==================== INTERACTION ====================//
      selectable={selectable}
      selectMirror={true}
      eventResizableFromStart={true}
      editable={true}
      unselectAuto={false}
      allDayMaintainDuration={true}
      ref={fcRef}
      //==================== CALLBACKS ====================//
      resources={
        site?.rooms.map((room) => {
          return { id: room.id, title: room.title };
        }) ?? []
      }
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

export default TimelineView;
