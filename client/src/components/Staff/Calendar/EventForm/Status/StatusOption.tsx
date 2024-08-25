import React from "react";

type StatusOptionProps = {
  status: string;
};

const StatusOption = ({ status }: StatusOptionProps) => {
  return <option value={status}>{status}</option>;
};

export default StatusOption;
