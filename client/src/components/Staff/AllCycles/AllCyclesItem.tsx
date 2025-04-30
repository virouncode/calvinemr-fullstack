import { Tooltip } from "@mui/material";
import React from "react";
import { NavLink } from "react-router-dom";
import {
  CycleEventType,
  CycleType,
  DemographicsType,
} from "../../../types/api";
import { timestampToDateISOTZ } from "../../../utils/dates/formatDates";

type AllCyclesItemProps = {
  event: CycleEventType;
  cycle: CycleType & { patient_infos: Partial<DemographicsType> };
};

const AllCyclesItem = ({ event, cycle }: AllCyclesItemProps) => {
  return (
    <tr className="allCycles__item">
      <td>{cycle.cycle_nbr}</td>
      <td>{cycle.patient_infos.ChartNumber}</td>
      <td>
        <Tooltip title="Go to EMR" placement="top-start" arrow>
          <NavLink
            to={`/staff/patient-record/${cycle.patient_infos.patient_id}`}
            className="record-link"
            // target="_blank"
          >
            {cycle.patient_infos.Names?.LegalName.LastName.Part || ""}
          </NavLink>
        </Tooltip>
      </td>
      <td>{cycle.patient_infos.Names?.LegalName.FirstName.Part}</td>
      <td>{timestampToDateISOTZ(cycle.patient_infos.DateOfBirth)}</td>
      <td>{cycle.cycle_type}</td>
      <td>{timestampToDateISOTZ(event.date)}</td>
      <td>{event.e2}</td>
      <td>{event.lh}</td>
      <td>{event.p4}</td>
      <td>{event.endometrial_thickness}</td>
      <td>{event.left_follicles}</td>
      <td>{event.right_follicles}</td>
      <td>
        {event.med_1.name +
          (event.med_1.notes ? ` (${event.med_1.notes})` : "")}
      </td>
      <td>
        {event.med_2.name +
          (event.med_2.notes ? ` (${event.med_1.notes})` : "")}
      </td>
      <td>
        {event.med_3.name +
          (event.med_3.notes ? ` (${event.med_1.notes})` : "")}
      </td>
      <td>
        {event.med_4.name +
          (event.med_4.notes ? ` (${event.med_1.notes})` : "")}
      </td>
      <td>
        {event.med_5.name +
          (event.med_5.notes ? ` (${event.med_1.notes})` : "")}
      </td>
      <td>
        {event.med_6.name +
          (event.med_6.notes ? ` (${event.med_1.notes})` : "")}
      </td>
      <td>
        {event.med_7.name +
          (event.med_7.notes ? ` (${event.med_1.notes})` : "")}
      </td>
      <td>{timestampToDateISOTZ(cycle.funded_billing_sent_at)}</td>
      <td>{timestampToDateISOTZ(cycle.funded_payment_received_at)}</td>
      <td>{timestampToDateISOTZ(cycle.non_funded_billing_sent_at)}</td>
      <td>{timestampToDateISOTZ(cycle.non_funded_payment_received_at)}</td>
    </tr>
  );
};

export default AllCyclesItem;
