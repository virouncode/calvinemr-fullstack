import InvitationTemplateRadioItem from "./InvitationTemplateRadioItem";

const InvitationTemplatesRadio = ({
  handleTemplateChange,
  templateSelected,
  templates,
  label = true,
}) => {
  //Rooms vector with all Rooms
  const isTemplateSelected = (templateName) => {
    return templateSelected === templateName;
  };
  return (
    <div className="invitation__row">
      {label && <label>Choose a template</label>}
      <div className="invitation__radio">
        {templates.map((template) => (
          <InvitationTemplateRadioItem
            key={template.name}
            templateName={template.name}
            handleTemplateChange={handleTemplateChange}
            isTemplateSelected={isTemplateSelected}
          />
        ))}
      </div>
    </div>
  );
};

export default InvitationTemplatesRadio;
