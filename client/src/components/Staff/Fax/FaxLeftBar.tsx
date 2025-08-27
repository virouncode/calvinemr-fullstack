import { default as React, useState } from "react";
import useSocketContext from "../../../hooks/context/useSocketContext";
import useUserContext from "../../../hooks/context/useUserContext";
import { FaxFolderType } from "../../../types/api";
import { UserStaffType } from "../../../types/app";
import Button from "../../UI/Buttons/Button";
import HeartIcon from "../../UI/Icons/HeartIcon";
import PenIcon from "../../UI/Icons/PenIcon";
import CircularProgressSmall from "../../UI/Progress/CircularProgressSmall";
import FakeWindow from "../../UI/Windows/FakeWindow";
import AddFaxFolderForm from "./AddFaxFolderForm";
import EditFaxFolderForm from "./EditFaxFolderForm";

type FaxLeftBarProps = {
  section: string;
  setSection: React.Dispatch<React.SetStateAction<string>>;
  setCurrentFaxId: React.Dispatch<React.SetStateAction<string>>;
  setFaxesSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectAllVisible: React.Dispatch<React.SetStateAction<boolean>>;
  faxFolders?: FaxFolderType[];
  isLoadingFaxFolders: boolean;
  setSelectedLabelId: React.Dispatch<React.SetStateAction<number | null>>;
};

const FaxLeftBar = ({
  section,
  setSection,
  setCurrentFaxId,
  setFaxesSelectedIds,
  setSelectAllVisible,
  faxFolders,
  isLoadingFaxFolders,
  setSelectedLabelId,
}: FaxLeftBarProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const { socket } = useSocketContext();
  const [addFolderVisible, setAddFolderVisible] = useState(false);
  const [editFolderVisible, setEditFolderVisible] = useState(false);
  const [folderIdToEdit, setFolderIdToEdit] = useState<number | null>(null);

  const handleClickSection = (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => {
    const name = (e.currentTarget as HTMLLIElement).id;
    setSection(name);
    setSelectedLabelId(
      name === "Received faxes" || name === "Sent" ? null : parseInt(name)
    );
    setCurrentFaxId("");
    setFaxesSelectedIds([]);
    setSelectAllVisible(true);
    if (name === "Sent") {
      socket?.emit("message", { key: ["faxes outbox"] });
    } else {
      socket?.emit("message", { key: ["faxes inbox"] });
    }
  };
  const isActiveClass = (sectionName: string) =>
    section === sectionName
      ? "fax__content-category fax__content-category--active"
      : "fax__content-category";

  const handleAddFolder = () => {
    setAddFolderVisible(true);
  };

  const handleEditFolder = (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>,
    folderId: number
  ) => {
    setEditFolderVisible(true);
    setFolderIdToEdit(folderId);
  };

  return (
    <>
      <div className="fax__content-leftbar">
        <div>
          <ul style={{ padding: "0.5rem 0" }}>
            <li
              className={isActiveClass("Received faxes")}
              id="Received faxes"
              onClick={handleClickSection}
            >
              {"Received faxes" +
                (user.unreadFaxNbr ? ` (${user.unreadFaxNbr})` : "")}
            </li>
            <li
              className={isActiveClass("Sent")}
              id="Sent"
              onClick={handleClickSection}
            >
              Sent faxes
            </li>
          </ul>
          <hr style={{ margin: "0 0.5rem" }} />
          {isLoadingFaxFolders ? (
            <CircularProgressSmall />
          ) : (
            <ul style={{ padding: "0.5rem 0" }}>
              {faxFolders &&
                faxFolders.length > 0 &&
                faxFolders
                  .sort((a, b) => a.id - b.id)
                  .map((folder) => (
                    <li
                      key={folder.id}
                      className={isActiveClass(folder.id.toString())}
                      id={folder.id.toString()}
                      onClick={handleClickSection}
                    >
                      <HeartIcon color="black" active={true} mr={5} />{" "}
                      {folder.name}
                      <PenIcon
                        ml={5}
                        onClick={(e) => handleEditFolder(e, folder.id)}
                      />
                    </li>
                  ))}
            </ul>
          )}
        </div>

        <div className="fax__content-leftbar-add">
          <Button
            label="+ New label"
            onClick={handleAddFolder}
            disabled={addFolderVisible}
          />
        </div>
      </div>
      {addFolderVisible && (
        <FakeWindow
          title="ADD LABEL"
          width={500}
          height={200}
          x={(window.innerWidth - 500) / 2}
          y={(window.innerHeight - 200) / 2}
          color="#8EB4FA"
          setPopUpVisible={setAddFolderVisible}
        >
          <AddFaxFolderForm setAddFolderVisible={setAddFolderVisible} />
        </FakeWindow>
      )}
      {editFolderVisible && (
        <FakeWindow
          title="EDIT LABEL"
          width={500}
          height={200}
          x={(window.innerWidth - 500) / 2}
          y={(window.innerHeight - 200) / 2}
          color="#8EB4FA"
          setPopUpVisible={setEditFolderVisible}
        >
          <EditFaxFolderForm
            setEditFolderVisible={setEditFolderVisible}
            faxFolder={
              faxFolders?.find(
                (folder) => folder.id === folderIdToEdit
              ) as FaxFolderType
            }
            setSection={setSection}
          />
        </FakeWindow>
      )}
    </>
  );
};

export default FaxLeftBar;
