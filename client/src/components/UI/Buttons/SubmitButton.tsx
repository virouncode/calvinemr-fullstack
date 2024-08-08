import React from "react";

type SubmitButtonProps = {
  label?: string;
  disabled?: boolean;
};

const SubmitButton = ({
  label = "Submit",
  disabled = false,
}: SubmitButtonProps) => {
  return (
    <button type="submit" className="save-btn" disabled={disabled}>
      {label}
    </button>
  );
};

export default SubmitButton;
