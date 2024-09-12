import React from "react";

type InvitationIntroProps = {
  intro: string;
  handleIntroChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

const InvitationIntro = ({
  intro,
  handleIntroChange,
}: InvitationIntroProps) => {
  return (
    <div className="event-form__invitation-intro">
      <label htmlFor="introduction">Introduction</label>
      <textarea
        onChange={handleIntroChange}
        value={intro}
        style={{ height: "60px" }}
        id="introduction"
      />
    </div>
  );
};

export default InvitationIntro;
