import { useMediaQuery } from "@mui/material";
import React, { useState } from "react";
import useUserContext from "../../../hooks/context/useUserContext";
import { usePatientsGroups } from "../../../hooks/reactquery/queries/patientsGroupsQueries";
import { UserStaffType } from "../../../types/app";
import Button from "../../UI/Buttons/Button";
import EmptyParagraph from "../../UI/Paragraphs/EmptyParagraph";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../UI/Paragraphs/LoadingParagraph";
import FakeWindow from "../../UI/Windows/FakeWindow";
import NewMessageExternal from "../Messaging/External/NewMessageExternal";
import NewMessageExternalMobile from "../Messaging/External/NewMessageExternalMobile";
import PatientsClinicGroupCard from "./PatientsClinicGroupCard";
import PatientsGroupForm from "./PatientsGroupForm";

const PatientsGroups = () => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const [addGroupVisible, setAddGroupVisible] = useState(false);
  const [newMessageExternalVisible, setNewMessageExternalVisible] =
    useState(false);
  const [initialRecipients, setInitialRecipients] = useState<
    {
      id: number;
      name: string;
      email: string;
      phone: string;
    }[]
  >([]);
  const isTabletOrMobile = useMediaQuery("(max-width: 1024px)");
  //Queries
  const { data: groups, isPending, error } = usePatientsGroups(user.id);

  const handleAdd = () => {
    setAddGroupVisible(true);
  };

  if (isPending) return <LoadingParagraph />;
  if (error) return <ErrorParagraph errorMsg={error.message} />;

  return (
    <>
      <div className="groups__title">
        <span style={{ marginRight: "10px" }}>My groups</span>
        <Button
          onClick={handleAdd}
          label="Add new group"
          disabled={addGroupVisible}
        />
      </div>
      <div className="groups__content">
        {groups && groups.length > 0 ? (
          groups.map((group) => (
            <PatientsClinicGroupCard
              group={group}
              key={group.id}
              setInitialRecipients={setInitialRecipients}
              setNewMessageExternalVisible={setNewMessageExternalVisible}
            />
          ))
        ) : (
          <EmptyParagraph text="You don't have any patients groups" />
        )}
      </div>
      {addGroupVisible && (
        <FakeWindow
          title={`ADD A NEW PATIENTS GROUP`}
          width={500}
          height={670}
          x={100}
          y={(window.innerHeight - 670) / 2}
          color="#8fb4fb"
          setPopUpVisible={setAddGroupVisible}
        >
          <PatientsGroupForm
            setAddGroupVisible={setAddGroupVisible}
            global={false}
          />
        </FakeWindow>
      )}
      {newMessageExternalVisible && (
        <FakeWindow
          title="NEW EXTERNAL MESSAGE"
          width={1000}
          height={630}
          x={(window.innerWidth - 1000) / 2}
          y={(window.innerHeight - 630) / 2}
          color={"#94bae8"}
          setPopUpVisible={setNewMessageExternalVisible}
        >
          {isTabletOrMobile ? (
            <NewMessageExternalMobile
              setNewVisible={setNewMessageExternalVisible}
              initialRecipients={initialRecipients}
            />
          ) : (
            <NewMessageExternal
              setNewVisible={setNewMessageExternalVisible}
              initialRecipients={initialRecipients}
            />
          )}
        </FakeWindow>
      )}
    </>
  );
};

export default PatientsGroups;
