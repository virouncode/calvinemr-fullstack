const OccupationsSelect = ({ id, name, value, onChange, label }) => {
  return (
    <>
      {label && <label htmlFor="occupation">{label}</label>}
      <select value={value} onChange={onChange} name={name} id={id}>
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
