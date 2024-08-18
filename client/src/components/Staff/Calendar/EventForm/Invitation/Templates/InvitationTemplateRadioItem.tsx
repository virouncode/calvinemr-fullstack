import React from "react";
import Radio from "../../../../UI/Radio/Radio";

type InvitationTemplateRadioItemProps = {
  templateName: string;
  handleTemplateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isTemplateSelected: (templateName: string) => boolean;
};

const InvitationTemplateRadioItem = ({
  templateName,
  handleTemplateChange,
  isTemplateSelected,
}: InvitationTemplateRadioItemProps) => {
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

export default InvitationTemplateRadioItem;
