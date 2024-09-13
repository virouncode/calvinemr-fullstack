import React from "react";
import useUserContext from "../../../../../../hooks/context/useUserContext";
import { UserStaffType } from "../../../../../../types/app";

const LetterSign = () => {
  const { user } = useUserContext() as { user: UserStaffType };
  return (
    <div className="letter__sign">
      <label>Signature: </label>
      {user.sign?.url && (
        <div className="letter__sign-image">
          <img src={user.sign?.url} alt="doctor-sign" crossOrigin="anonymous" />
        </div>
      )}
    </div>
  );
};

export default LetterSign;
