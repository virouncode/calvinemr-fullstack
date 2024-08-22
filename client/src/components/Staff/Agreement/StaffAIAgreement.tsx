import React, { useState } from "react";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import useSocketContext from "../../../hooks/context/useSocketContext";
import useUserContext from "../../../hooks/context/useUserContext";
import { StaffType } from "../../../types/api";
import { UserStaffType } from "../../../types/app";
import Button from "../../UI/Buttons/Button";
import CancelButton from "../../UI/Buttons/CancelButton";
import Checkbox from "../../UI/Checkbox/Checkbox";
import StaffAIAgreementText from "./StaffAIAgreementText";

type StaffAIAgreementProps = {
  setStart: React.Dispatch<React.SetStateAction<boolean>>;
  setChatVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const StaffAIAgreement = ({
  setStart,
  setChatVisible,
}: StaffAIAgreementProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const { socket } = useSocketContext();
  const [agreed, setAgreed] = useState(false);

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAgreed(e.target.checked);
  };
  const handleStart = async () => {
    if (agreed) {
      const response: StaffType = await xanoGet(`/staff/${user.id}`, "staff");
      const datasToPut = response;
      datasToPut.ai_consent = true;
      const response2: StaffType = await xanoPut(
        `/staff/${user.id}`,
        "staff",
        datasToPut
      );
      socket?.emit("message", {
        route: "USER",
        action: "update",
        content: {
          id: user.id,
          data: {
            ...user,
            ai_consent: true,
          },
        },
      });
      socket?.emit("message", {
        route: "STAFF INFOS",
        action: "update",
        content: {
          id: user.id,
          data: response2,
        },
      });
      setStart(true);
    } else alert("Please agree to the terms and conditions");
  };
  const handleCancel = () => {
    setChatVisible(false);
  };
  return (
    <div className="staff-ai-agreement">
      <StaffAIAgreementText />
      <div className="staff-ai-agreement-check">
        <Checkbox
          id="agreement"
          onChange={handleCheck}
          checked={agreed}
          label="I agree to the terms and conditions outlined in this disclaimer."
        />
        <Button onClick={handleStart} label="Start" disabled={!agreed} />
        <CancelButton onClick={handleCancel} />
      </div>
    </div>
  );
};

export default StaffAIAgreement;
