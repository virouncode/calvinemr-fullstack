import React from "react";

type SubmitButtonProps = {
  label?: string;
  disabled?: boolean;
  mr?: number;
};

const SubmitButton = ({
  label = "Submit",
  disabled = false,
}: SubmitButtonProps) => {
  return (
    <button type="submit" className="btn save-btn" disabled={disabled}>
      {label}
    </button>
  );
};

export default SubmitButton;
