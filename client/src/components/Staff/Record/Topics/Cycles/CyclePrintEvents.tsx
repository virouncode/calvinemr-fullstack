import React from "react";
import { CycleEventType } from "../../../../../types/api";
import { default as CyclePrintEventItem } from "./CyclePrintEventItem";

type CyclePrintEventsProps = {
  events: CycleEventType[];
};

const CyclePrintEvents = ({ events }: CyclePrintEventsProps) => {
  return (
    <div className="cycle-print__events">
      <div className="cycle-print__events-title">Events</div>
      {events.length > 0 ? (
        <div className="cycle-print__events-table-container">
          <table className="cycle-print__events-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Day of cycle</th>
                <th>End</th>
                <th>E2</th>
                <th>LH</th>
                <th>P4</th>
                <th>Left follicles</th>
                <th>Right follicles</th>
                <th>Medications</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, index) => (
                <CyclePrintEventItem
                  key={`cycle-event-${index}`}
                  event={event}
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        "No events"
      )}
    </div>
  );
};

export default CyclePrintEvents;
