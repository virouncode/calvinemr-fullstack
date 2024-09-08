import React from "react";
import CircularProgressSmallBlack from "../Progress/CircularProgressSmallBlack";

type SubmitButtonProps = {
  label?: string;
  disabled?: boolean;
  mr?: number;
  loading?: boolean;
};

const SubmitButton = ({
  label = "Submit",
  disabled = false,
  loading = false,
}: SubmitButtonProps) => {
  return (
    <button type="submit" className="btn save-btn" disabled={disabled}>
      {loading ? <CircularProgressSmallBlack /> : label}
    </button>
  );
};

export default SubmitButton;
