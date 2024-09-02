import React from "react";
import {
  CycleEventType,
  CycleMedNumberType,
  CycleType,
} from "../../../../../types/api";
import {
  dateISOToTimestampTZ,
  timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import Button from "../../../../UI/Buttons/Button";
import { confirmAlert } from "../../../../UI/Confirm/ConfirmGlobal";
import Input from "../../../../UI/Inputs/Input";
import InputDate from "../../../../UI/Inputs/InputDate";
import IvfMedsList from "../../../../UI/Lists/IvfMedsList";

type CycleEventFormProps = {
  formDatas: Partial<CycleType>;
  setFormDatas: React.Dispatch<React.SetStateAction<Partial<CycleType>>>;
  item: CycleEventType;
  setErrMsg: React.Dispatch<React.SetStateAction<string>>;
  index: number;
};

const CycleEventForm = ({
  formDatas,
  setFormDatas,
  item,
  setErrMsg,
  index,
}: CycleEventFormProps) => {
  const handleRemove = async () => {
    setErrMsg("");
    if (
      await confirmAlert({
        content: "Do you really want to remove this event ?",
      })
    ) {
      setFormDatas({
        ...formDatas,
        events: (formDatas.events as CycleEventType[]).filter(
          (event) => event.temp_id !== item.temp_id
        ),
      });
    }
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setErrMsg("");
    const name = e.target.name;
    let value: string | number | null = e.target.value;
    if (name === "date")
      value = value === "" ? null : dateISOToTimestampTZ(value);
    setFormDatas({
      ...formDatas,
      events: formDatas.events?.map((event) => {
        return event.temp_id === item.temp_id
          ? { ...event, [name]: value }
          : event;
      }),
    });
  };
  const handleChangeMedName = (value: string, medNbr: number) => {
    setErrMsg("");
    setFormDatas({
      ...formDatas,
      events: formDatas.events?.map((event) => {
        return event.temp_id === item.temp_id
          ? {
              ...event,
              [`med_${medNbr}`]: {
                ...event[`med_${medNbr}` as CycleMedNumberType],
                name: value,
              },
            }
          : event;
      }),
    });
  };
  const handleChangeMedNotes = (
    e: React.ChangeEvent<HTMLInputElement>,
    medNbr: number
  ) => {
    setErrMsg("");
    const value = e.target.value;
    setFormDatas({
      ...formDatas,
      events: formDatas.events?.map((event) => {
        return event.temp_id === item.temp_id
          ? {
              ...event,
              [`med_${medNbr}`]: {
                ...event[`med_${medNbr}` as CycleMedNumberType],
                notes: value,
              },
            }
          : event;
      }),
    });
  };
  return (
    <tr className="cycles-form__events-item">
      <td>
        <Button onClick={handleRemove} label="Remove" />
      </td>
      <td>
        <InputDate
          name="date"
          value={timestampToDateISOTZ(item.date)}
          onChange={handleChange}
          width={110}
        />
      </td>
      <td>
        <Input
          name="day_of_cycle"
          value={item.day_of_cycle}
          onChange={handleChange}
          width={60}
        />
      </td>
      <td>
        <Input name="e2" value={item.e2} onChange={handleChange} width={60} />
      </td>
      <td>
        <Input name="lh" value={item.lh} onChange={handleChange} width={60} />
      </td>
      <td>
        <Input name="p4" value={item.p4} onChange={handleChange} width={60} />
      </td>
      <td>
        <Input
          name="endometrial_thickness"
          value={item.endometrial_thickness}
          onChange={handleChange}
          width={60}
        />
      </td>
      <td>
        <textarea
          name="left_follicles"
          value={item.left_follicles}
          onChange={handleChange}
          autoComplete="off"
          rows={2}
          style={{ whiteSpace: "pre-wrap" }}
        />
      </td>
      <td>
        <textarea
          name="right_follicles"
          value={item.right_follicles}
          onChange={handleChange}
          autoComplete="off"
          rows={2}
          style={{ whiteSpace: "pre-wrap" }}
        />
      </td>
      <td>
        <IvfMedsList
          value={item.med_1.name}
          handleChange={handleChangeMedName}
          med_number={1}
          index={index}
        />
        <Input
          value={item.med_1.notes}
          onChange={(e) => handleChangeMedNotes(e, 1)}
          mt={5}
        />
      </td>
      <td>
        <IvfMedsList
          value={item.med_2.name}
          handleChange={handleChangeMedName}
          med_number={2}
          index={index}
        />
        <Input
          value={item.med_2.notes}
          onChange={(e) => handleChangeMedNotes(e, 2)}
          mt={5}
        />
      </td>
      <td>
        <IvfMedsList
          value={item.med_3.name}
          handleChange={handleChangeMedName}
          med_number={3}
          index={index}
        />
        <Input
          value={item.med_3.notes}
          onChange={(e) => handleChangeMedNotes(e, 3)}
          mt={5}
        />
      </td>
      <td>
        <IvfMedsList
          value={item.med_4.name}
          handleChange={handleChangeMedName}
          med_number={4}
          index={index}
        />
        <Input
          value={item.med_4.notes}
          onChange={(e) => handleChangeMedNotes(e, 4)}
          mt={5}
        />
      </td>
      <td>
        <IvfMedsList
          value={item.med_5.name}
          handleChange={handleChangeMedName}
          med_number={5}
          index={index}
        />
        <Input
          value={item.med_5.notes}
          onChange={(e) => handleChangeMedNotes(e, 5)}
          mt={5}
        />
      </td>
      <td>
        <IvfMedsList
          value={item.med_6.name}
          handleChange={handleChangeMedName}
          med_number={6}
          index={index}
        />
        <Input
          value={item.med_6.notes}
          onChange={(e) => handleChangeMedNotes(e, 6)}
          mt={5}
        />
      </td>
      <td>
        <IvfMedsList
          value={item.med_7.name}
          handleChange={handleChangeMedName}
          med_number={7}
          index={index}
        />
        <Input
          value={item.med_7.notes}
          onChange={(e) => handleChangeMedNotes(e, 7)}
          mt={5}
        />
      </td>
    </tr>
  );
};

export default CycleEventForm;
