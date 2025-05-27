import React from "react";

const modes = [
  { id: "in-person", name: "In person" },
  { id: "visio", name: "Video call" },
  { id: "phone", name: "Phone call" },
];

type AppointmentModeSelectProps = {
  handleModeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  mode: string;
  label?: string;
  allowEmpty?: boolean;
};

const AppointmentModeSelect = ({
  handleModeChange,
  mode,
  label,
  allowEmpty = false,
}: AppointmentModeSelectProps) => {
  return (
    <>
      {label && (
        <label htmlFor="mode-select" style={{ fontWeight: "bold" }}>
          {label}
        </label>
      )}
      <select value={mode} onChange={handleModeChange} id="mode-select">
        {allowEmpty ? (
          <option value="">To be determined</option>
        ) : (
          <option value="" disabled>
            Select appointment type...
          </option>
        )}
        {modes.map((mode) => (
          <option value={mode.id} key={mode.id}>
            {mode.name}
          </option>
        ))}
      </select>
    </>
  );
};

export default AppointmentModeSelect;
