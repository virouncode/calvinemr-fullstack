import React from "react";
import Radio from "./Radio";

type UserTypeRadioGroupProps = {
  type: string;
  handleTypeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const UserTypeRadioGroup = ({
  type,
  handleTypeChange,
}: UserTypeRadioGroupProps) => {
  return (
    <>
      <div className="email-form-row-radio-item">
        <Radio
          id="staff"
          name="user-type"
          value="staff"
          checked={type === "staff"}
          onChange={handleTypeChange}
          label="Staff"
        />
      </div>
      <div className="email-form-row-radio-item">
        <Radio
          id="patient"
          name="user-type"
          value="patient"
          checked={type === "patient"}
          onChange={handleTypeChange}
          label="Patient"
        />
      </div>
      <div className="email-form-row-radio-item">
        <Radio
          id="admin"
          name="user-type"
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
