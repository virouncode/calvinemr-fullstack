import React, { useState } from "react";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import { useSites } from "../../../hooks/reactquery/queries/sitesQueries";
import useDebounce from "../../../hooks/useDebounce";
import { SearchStaffType, StaffType } from "../../../types/api";
import { staffIdToTitleAndName } from "../../../utils/names/staffIdToTitleAndName";
import Button from "../../UI/Buttons/Button";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../UI/Paragraphs/LoadingParagraph";
import FakeWindow from "../../UI/Windows/FakeWindow";
import SignupStaffForm from "./SignupStaffForm";
import StaffAccountEdit from "./StaffAccountEdit";
import StaffAccountSearch from "./StaffAccountSearch";
import StaffAccountsTable from "./StaffAccountsTable";

const StaffAccounts = () => {
  //Hooks
  const { staffInfos } = useStaffInfosContext();
  const [editVisible, setEditVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState(0);
  const [search, setSearch] = useState<SearchStaffType>({
    email: "",
    name: "",
    title: "All",
    speciality: "",
    subspeciality: "",
    phone: "",
    licence_nbr: "",
    ohip_billing_nbr: "",
    site_id: -1, //All
  });
  const debouncedSearch = useDebounce(search, 300);
  //Queries
  const {
    data: sites,
    isPending: isPendingSites,
    error: errorSites,
  } = useSites();

  const handleAddNew = () => {
    if (!sites || sites.length === 0) {
      alert("Please add at least one site in Clinic Infos section first");
      return;
    }
    setAddVisible((v) => !v);
  };

  if (isPendingSites) return <LoadingParagraph />;
  if (errorSites) return <ErrorParagraph errorMsg={errorSites.message} />;

  return (
    staffInfos && (
      <>
        <StaffAccountSearch
          search={search}
          setSearch={setSearch}
          sites={sites}
        />
        <div className="staff-accounts__btn">
          <Button onClick={handleAddNew} label="New staff account" />
        </div>
        <div className="staff-accounts__count">
          <em>Number of staff: {staffInfos.length}</em>
        </div>
        <StaffAccountsTable
          search={debouncedSearch}
          setEditVisible={setEditVisible}
          setSelectedStaffId={setSelectedStaffId}
        />
        {editVisible && (
          <FakeWindow
            title={`EDIT ${staffIdToTitleAndName(
              staffInfos,
              selectedStaffId,
              false
            ).toUpperCase()} Account`}
            width={1000}
            height={750}
            x={(window.innerWidth - 1000) / 2}
            y={(window.innerHeight - 750) / 2}
            color="#94bae8"
            setPopUpVisible={setEditVisible}
          >
            <StaffAccountEdit
              infos={
                staffInfos.find(({ id }) => id === selectedStaffId) as StaffType
              }
              setEditVisible={setEditVisible}
              editVisible={editVisible}
              sites={sites}
            />
          </FakeWindow>
        )}
        {addVisible && (
          <FakeWindow
            title="ADD A NEW USER ACCOUNT"
            width={1000}
            height={750}
            x={(window.innerWidth - 1000) / 2}
            y={(window.innerHeight - 750) / 2}
            color="#94bae8"
            setPopUpVisible={setAddVisible}
          >
            <SignupStaffForm setAddVisible={setAddVisible} sites={sites} />
          </FakeWindow>
        )}
      </>
    )
  );
};

export default StaffAccounts;
