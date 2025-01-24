import React, { useState } from "react";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import { StaffType } from "../../../types/api";
import Input from "../../UI/Inputs/Input";
import EmptyLi from "../../UI/Lists/EmptyLi";

type ProviderOHIPSearchProps = {
  handleClickProviderOHIP: (item: StaffType) => void;
};

const ProviderOHIPSearch = ({
  handleClickProviderOHIP,
}: ProviderOHIPSearchProps) => {
  //Hooks
  const { staffInfos } = useStaffInfosContext();
  const [search, setSearch] = useState("");
  const clinicDoctors = staffInfos
    .filter(({ account_status }) => account_status !== "Closed")
    .filter(({ title }) => title === "Doctor");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  const filteredClinicDoctors = clinicDoctors.filter(
    (clinicDoctor) =>
      clinicDoctor.full_name?.includes(search) ||
      clinicDoctor.ohip_billing_nbr.includes(search)
  );

  return (
    <div className="refohip__container">
      <div className="refohip__search">
        <Input
          value={search}
          onChange={handleSearch}
          id="refohip-search"
          autoFocus={true}
          placeholder="Search by OHIP#, Name"
        />
      </div>
      <div className="refohip__results">
        <p className="refohip__results-title">Clinic doctors</p>
        <ul>
          <li className="refohip__results-item refohip__results-item--headers">
            <span className="refohip__results-code">OHIP#</span>
            <span className="refohip__results-name">Name</span>
          </li>
          {filteredClinicDoctors.length > 0 ? (
            filteredClinicDoctors.map((item) => (
              <li
                className="refohip__results-item"
                key={item.id}
                onClick={() => handleClickProviderOHIP(item)}
              >
                <span className="refohip__results-code">
                  {item.ohip_billing_nbr}
                </span>{" "}
                <span className="refohip__results-name">
                  Dr. {item.first_name} {item.last_name} ({item.speciality})
                </span>
              </li>
            ))
          ) : (
            <EmptyLi text="No corresponding clinic doctors" />
          )}
        </ul>
      </div>
    </div>
  );
};

export default ProviderOHIPSearch;
