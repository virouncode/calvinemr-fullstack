

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
  "#800000",
  "#aaffc3",
  "#808000",
  "#ffd8b1",
  "#000075",
  "#808080",
];

const ColorPicker = ({ handleClickColor, choosenColor }) => {
  return (
    <div className="colors-palette">
      {colorsPalette.map((color) => (
        <div
          key={color}
          id={color}
          className="colors-palette__item"
          style={{
            backgroundColor: `${color}`,
            width: color === choosenColor && "20px",
            height: color === choosenColor && "20px",
          }}
          onClick={(e) => handleClickColor(e, color)}
        ></div>
      ))}
    </div>
  );
};

export default ColorPicker;
