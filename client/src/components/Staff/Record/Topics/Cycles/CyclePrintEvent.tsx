import React from "react";
import { CycleEventType } from "../../../../../types/api";

type CyclePrintEventProps = {
  event: CycleEventType;
};

const CyclePrintEvent = ({ event }: CyclePrintEventProps) => {
  return (
    <div className="cycle-print__events-content">
      <div className="cycle-print__events-item">
        <label>Date: </label>
        <span>{event.date}</span>
      </div>
      <div className="cycle-print__events-item">
        <label>Day of cycle: </label>
        <span>{event.day_of_cycle}</span>
      </div>
      <div className="cycle-print__events-item">
        <label>End: </label>
        <span>{event.endometrial_thickness}</span>
      </div>
      <div className="cycle-print__events-item">
        <label>E2: </label>
        <span>{event.e2}</span>
      </div>
      <div className="cycle-print__events-item">
        <label>LH: </label>
        <span>{event.lh}</span>
      </div>
      <div className="cycle-print__events-item">
        <label>P4: </label>
        <span>{event.p4}</span>
      </div>
      <div className="cycle-print__events-item">
        <label>Left follicles: </label>
        <span>{event.left_follicles}</span>
      </div>
      <div className="cycle-print__events-item">
        <label>Right follicles: </label>
        <span>{event.right_follicles}</span>
      </div>
      {event.med_1.name && (
        <div className="cycle-print__events-item">
          <label>Medication 1: </label>
          <span>
            {event.med_1.name} ({event.med_1.notes})
          </span>
        </div>
      )}
      {event.med_2.name && (
        <div className="cycle-print__events-item">
          <label>Medication 2: </label>
          <span>
            {event.med_2.name} ({event.med_2.notes})
          </span>
        </div>
      )}
      {event.med_3.name && (
        <div className="cycle-print__events-item">
          <label>Medication 3: </label>
          <span>
            {event.med_3.name} ({event.med_3.notes})
          </span>
        </div>
      )}
      {event.med_4.name && (
        <div className="cycle-print__events-item">
          <label>Medication 4: </label>
          <span>
            {event.med_4.name} ({event.med_4.notes})
          </span>
        </div>
      )}
      {event.med_5.name && (
        <div className="cycle-print__events-item">
          <label>Medication 5: </label>
          <span>
            {event.med_5.name} ({event.med_5.notes})
          </span>
        </div>
      )}
      {event.med_6.name && (
        <div className="cycle-print__events-item">
          <label>Medication 6: </label>
          <span>
            {event.med_6.name} ({event.med_6.notes})
          </span>
        </div>
      )}
      {event.med_7.name && (
        <div className="cycle-print__events-item">
          <label>Medication 7: </label>
          <span>
            {event.med_7.name} ({event.med_7.notes})
          </span>
        </div>
      )}
    </div>
  );
};

export default CyclePrintEvent;
