import React from "react";

type InputTelExtToggleProps = {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  editVisible: boolean;
};

const InputTelExtToggle = ({
  id,
  name,
  value,
  onChange,
  editVisible,
}: InputTelExtToggleProps) => {
  return editVisible ? (
    <>
      <label htmlFor={id}>Ext</label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        name={name}
        autoComplete="off"
        id={id}
      />
    </>
  ) : (
    <>
      {value && (
        <>
          <label
            style={{
              marginLeft: "30px",
              marginRight: "10px",
              minWidth: "auto",
            }}
          >
            Ext
          </label>
          <p>{value}</p>
        </>
      )}
    </>
  );
};

export default InputTelExtToggle;
