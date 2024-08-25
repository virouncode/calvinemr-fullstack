import React from "react";
import { InvitationTemplateType } from "../../../../../../types/api";
import InvitationTemplateRadioItem from "./InvitationTemplateRadioItem";

type InvitationTemplatesRadioProps = {
  handleTemplateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  templateSelected: string;
  templates: InvitationTemplateType[];
  label?: boolean;
};

const InvitationTemplatesRadio = ({
  handleTemplateChange,
  templateSelected,
  templates,
  label = true,
}: InvitationTemplatesRadioProps) => {
  const isTemplateSelected = (templateName: string) => {
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
