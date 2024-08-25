import React from "react";
import useUserContext from "../../../../../../../hooks/context/useUserContext";
import { UserStaffType } from "../../../../../../../types/app";

const PrescriptionSign = () => {
  const { user } = useUserContext() as { user: UserStaffType };
  return (
    <div className="prescription__sign">
      {user.sign?.url && (
        <div className="prescription__sign-image">
          <img src={user.sign?.url} alt="doctor-sign" crossOrigin="anonymous" />
        </div>
      )}
    </div>
  );
};

export default PrescriptionSign;
