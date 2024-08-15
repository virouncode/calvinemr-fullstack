import { EventImpl } from "@fullcalendar/core/internal";
import { useEffect } from "react";
import { EventType } from "../../types/app";

export const useUpdateCurrentEvent = (
  events: EventType[],
  lastCurrentId: React.MutableRefObject<string>,
  currentEvent: React.MutableRefObject<EventImpl | EventType | null>,
  currentEventElt: React.MutableRefObject<Element | null>
) => {
  useEffect(() => {
    if (!events) return;
    if (lastCurrentId.current) {
      //remove the red border from last currentEventElt
      if (currentEventElt.current)
        (currentEventElt.current as HTMLElement).style.border = "none";
      //change the currentEventElt and change the border to red
      currentEventElt.current = document.getElementsByClassName(
        `event-${lastCurrentId.current}`
      )[0] as HTMLElement;
      (currentEventElt.current as HTMLElement).style.border = "solid 1px red";
      //change the currentEvent
      currentEvent.current =
        events.find(
          ({ id }) => parseInt(id) === parseInt(lastCurrentId.current)
        ) ?? null;
    }
  }, [currentEvent, currentEventElt, events, lastCurrentId]);
};
