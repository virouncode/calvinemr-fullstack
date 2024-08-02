
import {
    dateISOToTimestampTZ,
    timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import { confirmAlert } from "../../../../All/Confirm/ConfirmGlobal";
import IvfMedsList from "../../../../UI/Lists/IvfMedsList";

const CycleEventForm = ({ formDatas, setFormDatas, item, setErrMsg }) => {
  const handleRemove = async (e) => {
    e.preventDefault();
    setErrMsg("");
    if (
      await confirmAlert({
        content: "Do you really want to remove this event ?",
      })
    ) {
      setFormDatas({
        ...formDatas,
        events: formDatas.events.filter(
          (event) => event.temp_id !== item.temp_id
        ),
      });
    }
  };
  const handleChange = (e) => {
    setErrMsg("");
    const name = e.target.name;
    let value = e.target.value;
    if (name === "date")
      value = value === "" ? null : dateISOToTimestampTZ(value);
    setFormDatas({
      ...formDatas,
      events: formDatas.events.map((event) => {
        return event.temp_id === item.temp_id
          ? { ...event, [name]: value }
          : event;
      }),
    });
  };
  const handleChangeMedName = (value, medNbr) => {
    setErrMsg("");
    setFormDatas({
      ...formDatas,
      events: formDatas.events.map((event) => {
        return event.temp_id === item.temp_id
          ? {
              ...event,
              [`med_${medNbr}`]: { ...event[`med_${medNbr}`], name: value },
            }
          : event;
      }),
    });
  };
  const handleChangeMedNotes = (e, medNbr) => {
    setErrMsg("");
    const value = e.target.value;
    setFormDatas({
      ...formDatas,
      events: formDatas.events.map((event) => {
        return event.temp_id === item.temp_id
          ? {
              ...event,
              [`med_${medNbr}`]: { ...event[`med_${medNbr}`], notes: value },
            }
          : event;
      }),
    });
  };
  return (
    <tr className="cycles-form__events-item">
      <td>
        <button onClick={handleRemove}>Remove</button>
      </td>
      <td>
        <input
          name="date"
          type="date"
          value={timestampToDateISOTZ(item.date)}
          onChange={handleChange}
          autoComplete="off"
          style={{ width: "110px" }}
        />
      </td>
      <td>
        <input
          name="day_of_cycle"
          type="text"
          value={item.day_of_cycle}
          onChange={handleChange}
          autoComplete="off"
          style={{ width: "60px" }}
        />
      </td>
      <td>
        <input
          name="endometrial_thickness"
          type="text"
          value={item.endometrial_thickness}
          onChange={handleChange}
          autoComplete="off"
          style={{ width: "60px" }}
        />
      </td>
      <td>
        <input
          name="e2"
          type="text"
          value={item.e2}
          onChange={handleChange}
          autoComplete="off"
          style={{ width: "60px" }}
        />
      </td>
      <td>
        <input
          name="lh"
          type="text"
          value={item.lh}
          onChange={handleChange}
          autoComplete="off"
          style={{ width: "60px" }}
        />
      </td>
      <td>
        <input
          name="p4"
          type="text"
          value={item.p4}
          onChange={handleChange}
          autoComplete="off"
          style={{ width: "60px" }}
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
          med_number="1"
        />
        <input
          type="text"
          value={item.med_1.notes}
          onChange={(e) => handleChangeMedNotes(e, "1")}
          autoComplete="off"
          style={{ marginTop: "5px" }}
        />
      </td>
      <td>
        <IvfMedsList
          value={item.med_2.name}
          handleChange={handleChangeMedName}
          med_number="2"
        />
        <input
          type="text"
          value={item.med_2.notes}
          onChange={(e) => handleChangeMedNotes(e, "2")}
          autoComplete="off"
          style={{ marginTop: "5px" }}
        />
      </td>
      <td>
        <IvfMedsList
          value={item.med_3.name}
          handleChange={handleChangeMedName}
          med_number="3"
        />
        <input
          type="text"
          value={item.med_3.notes}
          onChange={(e) => handleChangeMedNotes(e, "3")}
          autoComplete="off"
          style={{ marginTop: "5px" }}
        />
      </td>
      <td>
        <IvfMedsList
          value={item.med_4.name}
          handleChange={handleChangeMedName}
          med_number="4"
        />
        <input
          type="text"
          value={item.med_4.notes}
          onChange={(e) => handleChangeMedNotes(e, "4")}
          autoComplete="off"
          style={{ marginTop: "5px" }}
        />
      </td>
      <td>
        <IvfMedsList
          value={item.med_5.name}
          handleChange={handleChangeMedName}
          med_number="5"
        />
        <input
          type="text"
          value={item.med_5.notes}
          onChange={(e) => handleChangeMedNotes(e, "5")}
          autoComplete="off"
          style={{ marginTop: "5px" }}
        />
      </td>
      <td>
        <IvfMedsList
          value={item.med_6.name}
          handleChange={handleChangeMedName}
          med_number="6"
        />
        <input
          type="text"
          value={item.med_6.notes}
          onChange={(e) => handleChangeMedNotes(e, "6")}
          autoComplete="off"
          style={{ marginTop: "5px" }}
        />
      </td>
      <td>
        <IvfMedsList
          value={item.med_7.name}
          handleChange={handleChangeMedName}
          med_number="7"
        />
        <input
          type="text"
          value={item.med_7.notes}
          onChange={(e) => handleChangeMedNotes(e, "7")}
          autoComplete="off"
          style={{ marginTop: "5px" }}
        />
      </td>
    </tr>
  );
};

export default CycleEventForm;
