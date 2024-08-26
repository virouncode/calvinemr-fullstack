import _ from "lodash";
import React from "react";
import { CycleEventType, CycleType } from "../../../../../types/api";
import { nowTZTimestamp } from "../../../../../utils/dates/formatDates";
import Button from "../../../../UI/Buttons/Button";
import EmptyRow from "../../../../UI/Tables/EmptyRow";
import CycleEventForm from "./CycleEventForm";

type CycleEventsProps = {
  formDatas: Partial<CycleType>;
  setFormDatas: React.Dispatch<React.SetStateAction<Partial<CycleType>>>;
  setErrMsg: React.Dispatch<React.SetStateAction<string>>;
  errMsg: string;
};

const CycleEvents = ({
  formDatas,
  setFormDatas,
  setErrMsg,
  errMsg,
}: CycleEventsProps) => {
  const handleAdd = () => {
    setErrMsg("");
    setFormDatas({
      ...formDatas,
      events: [
        ...(formDatas.events as CycleEventType[]),
        {
          temp_id: _.uniqueId(),
          date: nowTZTimestamp(),
          day_of_cycle: "",
          left_follicles: "",
          right_follicles: "",
          endometrial_thickness: "",
          med_1: { name: "", notes: "" },
          med_2: { name: "", notes: "" },
          med_3: { name: "", notes: "" },
          med_4: { name: "", notes: "" },
          med_5: { name: "", notes: "" },
          med_6: { name: "", notes: "" },
          med_7: { name: "", notes: "" },
          e2: "",
          lh: "",
          p4: "",
        },
      ],
    });
  };
  return (
    <fieldset
      className="cycles-form__events"
      style={{ border: errMsg && "solid 1px red" }}
    >
      <legend>EVENTS</legend>
      <div style={{ marginBottom: "10px" }}>
        <Button onClick={handleAdd} label="Add" />
      </div>
      <div className="cycles-form__events-table-container">
        <table className="cycles-form__events-table">
          <thead>
            <tr>
              <th>Action</th>
              <th>Date</th>
              <th>Day of cycle</th>
              <th>End</th>
              <th>E2</th>
              <th>LH</th>
              <th>P4</th>
              <th>Left follicles</th>
              <th>Right follicles</th>
              <th>Medication 1</th>
              <th>Medication 2</th>
              <th>Medication 3</th>
              <th>Medication 4</th>
              <th>Medication 5</th>
              <th>Medication 6</th>
              <th>Medication 7</th>
            </tr>
          </thead>
          <tbody>
            {(formDatas.events ?? []).length > 0 ? (
              formDatas.events?.map((item, index) => (
                <CycleEventForm
                  key={(item.temp_id as string) + index}
                  item={item}
                  formDatas={formDatas}
                  setFormDatas={setFormDatas}
                  setErrMsg={setErrMsg}
                />
              ))
            ) : (
              <EmptyRow colSpan={13} text="No events" />
            )}
          </tbody>
        </table>
      </div>
    </fieldset>
  );
};

export default CycleEvents;
