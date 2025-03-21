import React from "react";
import logo from "../../../../../../assets/img/logoLoginTest.png";
import useClinicContext from "../../../../../../hooks/context/useClinicContext";
import useStaffInfosContext from "../../../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../../../hooks/context/useUserContext";
import { SiteType } from "../../../../../../types/api";
import { UserStaffType } from "../../../../../../types/app";
import { staffIdToTitleAndName } from "../../../../../../utils/names/staffIdToTitleAndName";

type LetterHeaderProps = {
  site?: SiteType;
};

const LetterHeader = ({ site }: LetterHeaderProps) => {
  const { user } = useUserContext() as { user: UserStaffType };
  const { staffInfos } = useStaffInfosContext();
  const { clinic } = useClinicContext();
  return (
    <div className="letter__header">
      <div className="letter__doctor-infos">
        <p>{staffIdToTitleAndName(staffInfos, user.id, false, true)}</p>
        <p>
          LIC.#: {user.licence_nbr}, OHIP#: {user.ohip_billing_nbr}
        </p>
        <p>
          {clinic?.name ?? ""}, {site?.name ?? ""}
        </p>
        {site && <p>{site?.address}</p>}
        <p>
          {site?.city}, {site?.province_state}, {site?.postal_code}{" "}
        </p>
        <p>Phone: {site?.phone ?? ""}</p>
        <p>Fax: {site?.fax ?? ""}</p>
        <p>{clinic?.email ?? ""}</p>
        <p>{clinic?.website ?? ""}</p>
      </div>
      <div className="letter__logo">
        <img src={site?.logo?.url || logo} alt="letter-logo" />
      </div>
    </div>
  );
};

export default LetterHeader;
