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
    <div className="event-form__invitation-templates">
      {label && (
        <label className="event-form__invitation-templates-title">
          Choose a template
        </label>
      )}
      <div className="event-form__invitation-templates-radio">
        <ul>
          {templates.map((template) => (
            <InvitationTemplateRadioItem
              key={template.name}
              templateName={template.name}
              handleTemplateChange={handleTemplateChange}
              isTemplateSelected={isTemplateSelected}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InvitationTemplatesRadio;
