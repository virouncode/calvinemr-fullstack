import React, { useState } from "react";
import { InvitationSentType } from "../../../../../types/api";
import Input from "../../../../UI/Inputs/Input";
import InputEmail from "../../../../UI/Inputs/InputEmail";
import InputTel from "../../../../UI/Inputs/InputTel";
import FakeWindow from "../../../../UI/Windows/FakeWindow";
import InvitationsHistory from "./InvitationsHistory";

type GuestsSearchFormProps = {
  search: {
    name: string;
    email: string;
    phone: string;
    birth: string;
    chart: string;
    health: string;
  };
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  invitationsSent: InvitationSentType[];
};

const GuestsSearchForm = ({
  search,
  handleSearch,
  invitationsSent,
}: GuestsSearchFormProps) => {
  const [invitationsSentVisible, setInvitationsSentVisible] = useState(false);
  const handleShowInvitations = () => {
    setInvitationsSentVisible(true);
  };
  return (
    <div className="guests-search">
      <div className="guests-search__grid">
        <div className="guests-search__item">
          <Input
            value={search.name}
            onChange={handleSearch}
            name="name"
            id="name-search"
            label="Name"
          />
        </div>
        <div className="guests-search__item">
          <InputEmail
            value={search.email}
            onChange={handleSearch}
            name="email"
            id="email-search"
            label="Email"
          />
        </div>

        <div className="guests-search__item">
          <InputTel
            value={search.phone}
            onChange={handleSearch}
            name="phone"
            id="phone-search"
            label="Phone"
            placeholder="xxx-xxx-xxxx"
          />
        </div>
        <div className="guests-search__item">
          <Input
            value={search.birth}
            onChange={handleSearch}
            name="birth"
            id="dob-search"
            label="Date of birth"
            placeholder="yyyy-mm-dd"
          />
        </div>
        <div className="guests-search__item">
          <Input
            value={search.chart}
            onChange={handleSearch}
            name="chart"
            id="chart-search"
            label="Chart#"
          />
        </div>
        <div className="guests-search__item">
          <Input
            value={search.health}
            onChange={handleSearch}
            name="health"
            id="health-search"
            label="Health Card#"
          />
        </div>
      </div>
      <p className="guests-search__invitations" onClick={handleShowInvitations}>
        Invitations sent
      </p>
      {invitationsSentVisible && (
        <FakeWindow
          title="INVITATIONS SENT"
          width={500}
          height={500}
          x={(window.innerWidth - 500) / 2}
          y={(window.innerHeight - 500) / 2}
          color="#93b5e9"
          setPopUpVisible={setInvitationsSentVisible}
          textColor="#3d375a"
        >
          <InvitationsHistory invitationsSent={invitationsSent} />
        </FakeWindow>
      )}
    </div>
  );
};

export default GuestsSearchForm;
