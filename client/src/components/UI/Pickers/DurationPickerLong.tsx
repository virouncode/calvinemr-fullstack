import React from "react";

const DurationPickerLong = ({
  durationYears,
  durationMonths,
  durationWeeks,
  durationDays,
  handleDurationPickerChange,
  label,
}: {
  durationYears: number;
  durationMonths: number;
  durationWeeks: number;
  durationDays: number;
  handleDurationPickerChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "Y" | "M" | "W" | "D"
  ) => void;
  label?: string;
}) => {
  return (
    <>
      {label && <label style={{ fontWeight: "bold" }}>{label}</label>}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <label
            style={{
              fontWeight: "normal",
              minWidth: "15px",
              marginRight: "5px",
              marginBottom: "0",
              display: "inline-block",
            }}
          >
            Y
          </label>
          <input
            style={{ marginRight: "10px", width: "45px" }}
            type="number"
            step="1"
            min="0"
            value={durationYears}
            onChange={(e) => handleDurationPickerChange(e, "Y")}
          />
        </div>
        <div>
          <label
            style={{
              fontWeight: "normal",
              minWidth: "15px",
              marginRight: "5px",
              marginBottom: "0",
              display: "inline-block",
            }}
          >
            M
          </label>
          <input
            style={{ marginRight: "10px", width: "45px" }}
            type="number"
            step="1"
            min="0"
            value={durationMonths}
            onChange={(e) => handleDurationPickerChange(e, "M")}
          />
        </div>
        <div>
          <label
            style={{
              fontWeight: "normal",
              minWidth: "15px",
              marginRight: "5px",
              marginBottom: "0",
              display: "inline-block",
            }}
          >
            W
          </label>
          <input
            style={{ marginRight: "10px", width: "45px" }}
            type="number"
            step="1"
            min="0"
            value={durationWeeks}
            onChange={(e) => handleDurationPickerChange(e, "W")}
          />
        </div>
        <div>
          <label
            style={{
              fontWeight: "normal",
              minWidth: "15px",
              marginRight: "5px",
              marginBottom: "0",
              display: "inline-block",
            }}
          >
            D
          </label>
          <input
            style={{ width: "45px" }}
            type="number"
            step="1"
            min="0"
            value={durationDays}
            onChange={(e) => handleDurationPickerChange(e, "D")}
          />
        </div>
      </div>
    </>
  );
};

export default DurationPickerLong;
