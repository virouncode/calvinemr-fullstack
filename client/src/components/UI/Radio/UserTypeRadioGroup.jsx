import Radio from "./Radio";

const UserTypeRadioGroup = ({ type, handleTypeChange }) => {
  return (
    <>
      <div className="email-form-row-radio-item">
        <Radio
          id="staff"
          name="type"
          value="staff"
          checked={type === "staff"}
          onChange={handleTypeChange}
          label="Staff"
        />
      </div>
      <div className="email-form-row-radio-item">
        <Radio
          id="patient"
          name="type"
          value="patient"
          checked={type === "patient"}
          onChange={handleTypeChange}
          label="Patient"
        />
      </div>
      <div className="email-form-row-radio-item">
        <Radio
          id="admin"
          name="type"
          value="admin"
          checked={type === "admin"}
          onChange={handleTypeChange}
          label="Admin"
        />
      </div>
    </>
  );
};

export default UserTypeRadioGroup;
