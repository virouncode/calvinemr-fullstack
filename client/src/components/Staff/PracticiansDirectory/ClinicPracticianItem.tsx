import React from "react";
import useSocketContext from "../../../hooks/context/useSocketContext";
import useUserContext from "../../../hooks/context/useUserContext";
import {
  provinceStateTerritoryCT,
  toCodeTableName,
} from "../../../omdDatas/codesTables";
import { SiteType, StaffType } from "../../../types/api";
import { UserStaffType } from "../../../types/app";
import SignCellMultipleTypes from "../../UI/Tables/SignCellMultipleTypes";

type ClinicPracticianItemProps = {
  item: StaffType;
  site: SiteType;
};

const ClinicPracticianItem = ({ item, site }: ClinicPracticianItemProps) => {
  //HOOKS
  const { user } = useUserContext() as { user: UserStaffType };
  const { socket } = useSocketContext();

  return (
    item && (
      <tr className="doctors__item">
        <td>{item.last_name}</td>
        <td>{item.first_name}</td>
        <td>{item.speciality}</td>
        <td>{item.licence_nbr}</td>
        <td>{item.ohip_billing_nbr}</td>
        <td>{site.address}</td>
        <td>{site.city}</td>
        <td>
          {toCodeTableName(provinceStateTerritoryCT, site.province_state)}
        </td>
        <td className="td--postal">{site.postal_code || site.zip_code}</td>
        <td>{site.phone}</td>
        <td>{site.fax}</td>
        <td>{site.email}</td>
        <SignCellMultipleTypes item={item} />
      </tr>
    )
  );
};

export default ClinicPracticianItem;
