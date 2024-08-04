import { useState } from "react";
import { useGlobalPatientsGroups } from "../../../hooks/reactquery/queries/patientsGroupsQueries";
import Button from "../../UI/Buttons/Button";
import EmptyParagraph from "../../UI/Paragraphs/EmptyParagraph";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../UI/Paragraphs/LoadingParagraph";
import FakeWindow from "../../UI/Windows/FakeWindow";
import NewMessageExternal from "../Messaging/External/NewMessageExternal";
import PatientsGroupCard from "./PatientsGroupCard";
import PatientsGroupForm from "./PatientsGroupForm";

const PatientsGlobalGroups = () => {
  const { data: groups, isPending, error } = useGlobalPatientsGroups();
  const [addGroupVisible, setAddGroupVisible] = useState(false);
  const [newMessageExternalVisible, setNewMessageExternalVisible] =
    useState(false);
  const [initialRecipients, setInitialRecipients] = useState([]);

  const handleAdd = () => {
    setAddGroupVisible(true);
  };

  if (isPending) return <LoadingParagraph />;
  if (error) return <ErrorParagraph errorMsg={error.message} />;

  return (
    <div className="patients-groups">
      <div className="patients-groups__title">
        <span style={{ marginRight: "10px" }}>Clinic groups</span>
        <Button
          onClick={handleAdd}
          label="Add new group"
          disabled={addGroupVisible}
        />
      </div>
      <div className="patients-groups__content">
        {groups && groups.length > 0 ? (
          groups.map((group) => (
            <PatientsGroupCard
              group={group}
              key={group.id}
              global={true}
              setInitialRecipients={setInitialRecipients}
              setNewMessageExternalVisible={setNewMessageExternalVisible}
            />
          ))
        ) : (
          <EmptyParagraph text="No clinic patients groups" />
        )}
      </div>
      {addGroupVisible && (
        <FakeWindow
          title={`ADD A NEW CLINIC PATIENTS GROUP`}
          width={500}
          height={670}
          x={100}
          y={(window.innerHeight - 670) / 2}
          color="#93b5e9"
          setPopUpVisible={setAddGroupVisible}
        >
          <PatientsGroupForm
            setAddGroupVisible={setAddGroupVisible}
            global={true}
          />
        </FakeWindow>
      )}
      {newMessageExternalVisible && (
        <FakeWindow
          title="NEW EXTERNAL MESSAGE"
          width={1300}
          height={630}
          x={(window.innerWidth - 1300) / 2}
          y={(window.innerHeight - 630) / 2}
          color={"#94bae8"}
          setPopUpVisible={setNewMessageExternalVisible}
        >
          <NewMessageExternal
            setNewVisible={setNewMessageExternalVisible}
            initialRecipients={initialRecipients}
          />
        </FakeWindow>
      )}
    </div>
  );
};

export default PatientsGlobalGroups;
