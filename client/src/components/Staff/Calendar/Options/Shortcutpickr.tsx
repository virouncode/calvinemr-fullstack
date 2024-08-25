// import "flatpickr/dist/themes/material_blue.css";
import React from "react";
import Flatpickr from "react-flatpickr";

type ShortcutpickrProps = {
  handleShortcutpickrChange: (selectedDates: Date[], dateStr: string) => void;
};

const Shortcutpickr = ({ handleShortcutpickrChange }: ShortcutpickrProps) => {
  return (
    <div className="calendar__shortcutpickr">
      <Flatpickr
        options={{
          inline: true,
          dateFormat: "Z",
          shorthandCurrentMonth: true,
        }}
        onChange={handleShortcutpickrChange}
      />
    </div>
  );
};

export default Shortcutpickr;
