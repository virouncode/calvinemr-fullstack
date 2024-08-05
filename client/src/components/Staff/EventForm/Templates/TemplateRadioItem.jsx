import Radio from "../../../UI/Radio/Radio";

const TemplateRadioItem = ({
  templateName,
  handleTemplateChange,
  isTemplateSelected,
}) => {
  return (
    <div className="invitation__radio-item">
      <Radio
        id={templateName}
        name={templateName}
        value={templateName}
        checked={isTemplateSelected(templateName)}
        onChange={handleTemplateChange}
        label={templateName}
      />
    </div>
  );
};

export default TemplateRadioItem;
