import React from "react";

type DurationPickerProps = {
  durationHours: string;
  durationMin: string;
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled: boolean;
  label?: string;
};

const DurationPicker = ({
  durationHours,
  durationMin,
  handleChange,
  disabled,
  label = "",
}: DurationPickerProps) => {
  return (
    <div className="durationpicker">
      {label && <div className="durationpicker__label">{label}</div>}
      <div className="durationpicker__select">
        <div className="durationpicker__hours">
          <label>Hrs</label>
          <select
            onChange={handleChange}
            value={durationHours}
            disabled={disabled}
            name="hoursDuration"
          >
            <option value="00">00</option>
            <option value="01">01</option>
            <option value="02">02</option>
            <option value="03">03</option>
            <option value="04">04</option>
            <option value="05">05</option>
            <option value="06">06</option>
            <option value="07">07</option>
            <option value="08">08</option>
            <option value="09">09</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
            <option value="13">13</option>
            <option value="14">14</option>
            <option value="15">15</option>
            <option value="16">16</option>
            <option value="17">17</option>
            <option value="18">18</option>
            <option value="19">19</option>
            <option value="20">20</option>
            <option value="21">21</option>
            <option value="22">22</option>
            <option value="23">23</option>
            <option value="24">24</option>
          </select>
        </div>
        <div className="durationpicker__mins">
          <label>Min</label>
          <select
            onChange={handleChange}
            value={durationMin}
            disabled={disabled}
            name="minutesDuration"
          >
            <option value="00">00</option>
            <option value="05">05</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
            <option value="25">25</option>
            <option value="30">30</option>
            <option value="35">35</option>
            <option value="40">40</option>
            <option value="45">45</option>
            <option value="50">50</option>
            <option value="55">55</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default DurationPicker;
