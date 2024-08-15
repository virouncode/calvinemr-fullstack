import React from "react";

type OccupationsSelectProps = {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  label: string;
  all?: boolean;
};

const OccupationsSelect = ({
  id,
  name,
  value,
  onChange,
  label,
  all = false,
}: OccupationsSelectProps) => {
  return (
    <>
      {label && <label htmlFor={id}>{label}</label>}
      <select value={value} onChange={onChange} name={name} id={id}>
        {all && <option value="All">All</option>}
        <option value="Doctor">Doctor</option>
        <option value="Medical Student">Medical Student</option>
        <option value="Nurse">Nurse</option>
        <option value="Nursing Student">Nursing Student</option>
        <option value="Secretary">Secretary</option>
        <option value="Lab Technician">Lab Technician</option>
        <option value="Ultra Sound Technician">Ultra Sound Technician</option>
        <option value="Nutritionist">Nutritionist</option>
        <option value="Physiotherapist">Physiotherapist</option>
        <option value="Psychologist">Psychologist</option>
        <option value="Other">Other</option>
      </select>
    </>
  );
};

export default OccupationsSelect;
