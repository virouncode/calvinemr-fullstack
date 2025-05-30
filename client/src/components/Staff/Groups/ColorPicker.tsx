import React from "react";
const colorsPalette = [
  "#6492d8",
  "#ffe119",
  "#e6194b",
  "#3cb44b",
  "#f58231",
  "#911eb4",
  "#42d4f4",
  "#f032e6",
  "#bfef45",
  "#fabed4",
  "#469990",
  "#dcbeff",
  "#9a6324",
  "#fffac8",
  "#bc0000",
  "#aaffc3",
  "#808000",
  "#ffd8b1",
  "#5959ff",
  "#808080",
];

type ColorPickerProps = {
  handleClickColor: (color: string) => void;
  choosenColor: string;
};

const ColorPicker = ({ handleClickColor, choosenColor }: ColorPickerProps) => {
  return (
    <div className="colors-palette">
      {colorsPalette.map((color) => (
        <div
          key={color}
          id={color}
          className={
            choosenColor === color
              ? "colors-palette__item--choosen"
              : "colors-palette__item"
          }
          style={{
            backgroundColor: `${color}`,
          }}
          onClick={() => handleClickColor(color)}
        ></div>
      ))}
    </div>
  );
};

export default ColorPicker;
