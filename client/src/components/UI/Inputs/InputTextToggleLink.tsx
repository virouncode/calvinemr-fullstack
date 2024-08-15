import React from "react";

type InputTextToggleLinkProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  id: string;
  editVisible: boolean;
  label: string;
  placeholder: string;
};

const InputTextToggleLink = ({
  value,
  onChange,
  name,
  id,
  editVisible,
  label,
  placeholder,
}: InputTextToggleLinkProps) => {
  return (
    <>
      {label && <label htmlFor={id}>{label}</label>}
      {editVisible ? (
        <input
          type="text"
          value={value}
          onChange={onChange}
          name={name}
          id={id}
          autoComplete="off"
          placeholder={placeholder}
        />
      ) : (
        <p>
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: "underline" }}
          >
            {value}
          </a>
        </p>
      )}
    </>
  );
};

export default InputTextToggleLink;
