import React from "react";
import { CycleEventType } from "../../../../../types/api";
import { timestampToDateISOTZ } from "../../../../../utils/dates/formatDates";

type CyclePrintEventItemProps = {
  event: CycleEventType;
};

const toCycleMedCaption = (
  med: { name: string; notes: string },
  isFirst: boolean
) => {
  return med.name
    ? isFirst
      ? `${med.name} (${med.notes})`
      : `, ${med.name} (${med.notes})`
    : "";
};

const CyclePrintEventItem = ({ event }: CyclePrintEventItemProps) => {
  return (
    <tr className="cycle-print__events-item">
      <td>{timestampToDateISOTZ(event.date)}</td>
      <td>{event.day_of_cycle}</td>
      <td>{event.e2}</td>
      <td>{event.lh}</td>
      <td>{event.p4}</td>
      <td>{event.endometrial_thickness}</td>
      <td>{event.left_follicles}</td>
      <td>{event.right_follicles}</td>
      <td>
        {toCycleMedCaption(event.med_1, true)}{" "}
        {toCycleMedCaption(event.med_2, false)}{" "}
        {toCycleMedCaption(event.med_3, false)}{" "}
        {toCycleMedCaption(event.med_4, false)}{" "}
        {toCycleMedCaption(event.med_5, false)}{" "}
        {toCycleMedCaption(event.med_6, false)}{" "}
        {toCycleMedCaption(event.med_7, false)}
      </td>
    </tr>
  );
};

export default CyclePrintEventItem;
