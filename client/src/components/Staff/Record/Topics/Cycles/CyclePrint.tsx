import React from "react";
import { CycleType, DemographicsType } from "../../../../../types/api";
import PrintButton from "../../../../UI/Buttons/PrintButton";
import CyclePrintCycle from "./CyclePrintCycle";
import CyclePrintEvent from "./CyclePrintEvent";
import CyclePrintNote from "./CyclePrintNote";
import CyclePrintPatient from "./CyclePrintPatient";
import CyclePrintSperm from "./CyclePrintSperm";
import CyclePrintTests from "./CyclePrintTests";

type CyclePrintProps = {
  cycle: CycleType;
  patientInfos: DemographicsType;
  toPrint?: boolean;
};

const CyclePrint = ({
  cycle,
  patientInfos,
  toPrint = true,
}: CyclePrintProps) => {
  const handleClickPrint = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.nativeEvent.view?.print();
  };
  return (
    <div className="cycle-print" style={{ width: toPrint ? "" : "95%" }}>
      {toPrint && (
        <div className="cycle-print__btns">
          <PrintButton onClick={handleClickPrint} />
        </div>
      )}
      <div
        className="cycle-print__card"
        style={{
          border: toPrint ? "" : "solid 1px #cecdcd",
          borderRadius: toPrint ? "" : "6px",
          padding: toPrint ? "" : "10px",
        }}
      >
        <div className="cycle-print__row">
          <CyclePrintPatient patientInfos={patientInfos} />
          <CyclePrintSperm cycle={cycle} />
        </div>
        <CyclePrintCycle cycle={cycle} />
        <div className="cycle-print__row">
          <CyclePrintTests cycle={cycle} gender="Female" />
          <CyclePrintTests cycle={cycle} gender="Male" />
        </div>
        <div className="cycle-print__events">
          <div className="cycle-print__events-title">Events</div>
          {cycle.events.map((event, index) => (
            <CyclePrintEvent key={`cycle-event-${index}`} event={event} />
          ))}
        </div>
        <div className="cycle-print__notes">
          <div className="cycle-print__notes-title">Notes</div>
          {cycle.notes.map((note, index) => (
            <CyclePrintNote key={`cycle-note-${index}`} note={note} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CyclePrint;
