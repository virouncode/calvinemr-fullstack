import React from "react";
import Radio from "../../../../../UI/Radio/Radio";
import { onChange } from "react-toastify/dist/core/store";

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
    <li className="event-form__invitation-templates-radio-item">
      <Radio
        id={templateName}
        name="initation-template"
        value={templateName}
        checked={isTemplateSelected(templateName)}
        onChange={handleTemplateChange}
        label={templateName}
      />
    </li>
  );
};

export default InvitationTemplateRadioItem;
