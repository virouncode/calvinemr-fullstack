import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { xanoDelete } from "../../../api/xanoCRUD/xanoDelete";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import { xanoPost } from "../../../api/xanoCRUD/xanoPost";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import useSocketContext from "../../../hooks/context/useSocketContext";
import useUserContext from "../../../hooks/context/useUserContext";
import {
  useFaxesForFolderId,
  useFaxesInbox,
  useFaxesOutbox,
  useFaxFolders,
} from "../../../hooks/reactquery/queries/faxQueries";
import { FaxInboxType, FaxOutboxType, FiledFaxType } from "../../../types/api";
import { UserStaffType } from "../../../types/app";
import {
  getEndOfTheMonthTZ,
  getStartOfTheMonthTZ,
  nowTZTimestamp,
  timestampToDateISOTZ,
} from "../../../utils/dates/formatDates";
import CancelButton from "../../UI/Buttons/CancelButton";
import SaveButton from "../../UI/Buttons/SaveButton";
import Checkbox from "../../UI/Checkbox/Checkbox";
import { confirmAlert } from "../../UI/Confirm/ConfirmGlobal";
import FakeWindow from "../../UI/Windows/FakeWindow";
import FaxBox from "./FaxBox";
import FaxLeftBar from "./FaxLeftBar";
import FaxToolBar from "./FaxToolBar";

export const FAXES_PER_PAGE = 20;

// Type pour les messages socket
interface SocketMessage {
  action: string;
  route: string;
  content?: Record<string, unknown>;
}

const Faxes = () => {
  //Hooks
  const { socket } = useSocketContext();
  const { user } = useUserContext() as { user: UserStaffType };
  const queryClient = useQueryClient();
  const [progress, setProgress] = useState(false);
  const [newVisible, setNewVisible] = useState(false);
  const [faxesSelectedIds, setFaxesSelectedIds] = useState<string[]>([]);
  const [currentFaxId, setCurrentFaxId] = useState("");
  const [currentCallerId, setCurrentCallerId] = useState("");
  const [selectAllVisible, setSelectAllVisible] = useState(true);
  const [section, setSection] = useState<string>("Received faxes");
  const [search, setSearch] = useState("");
  const [folderFormVisible, setFolderFormVisible] = useState(false);
  const [rangeStart, setRangeStart] = useState(
    timestampToDateISOTZ(getStartOfTheMonthTZ()).split("-").join("")
  ); //start of the month
  const [rangeEnd, setRangeEnd] = useState(
    timestampToDateISOTZ(getEndOfTheMonthTZ()).split("-").join("")
  ); //start of the month
  const [all, setAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLabelId, setSelectedLabelId] = useState<number | null>(null);

  const initialRangeStart = useRef(
    timestampToDateISOTZ(getStartOfTheMonthTZ()).split("-").join("")
  );
  const initialRangeEnd = useRef(
    timestampToDateISOTZ(getEndOfTheMonthTZ()).split("-").join("")
  );
  const startIndex = (currentPage - 1) * FAXES_PER_PAGE;
  const endIndex = startIndex + FAXES_PER_PAGE;

  // Écoute des événements socket pour rafraîchir les données de fax
  useEffect(() => {
    const handleSocketMessage = (message: SocketMessage) => {
      if (message.route === "FAX DATA" && message.action === "refresh") {
        // Invalider les queries pour forcer un refetch
        queryClient.invalidateQueries({ queryKey: ["faxes inbox"] });
        queryClient.invalidateQueries({ queryKey: ["faxes outbox"] });
      }
    };

    socket?.on("message", handleSocketMessage);
    return () => {
      socket?.off("message", handleSocketMessage);
    };
  }, [socket, queryClient]);
  //Queries
  const {
    data: faxesInbox,
    isPending: isPendingInbox,
    error: errorInbox,
  } = useFaxesInbox("ALL", all, rangeStart, rangeEnd);
  const {
    data: faxesOutbox,
    isPending: isPendingOutbox,
    error: errorOutbox,
  } = useFaxesOutbox(all, rangeStart, rangeEnd);

  const { data: faxFolders, isLoading: isLoadingFaxFolders } = useFaxFolders();

  const {
    data: faxesForFolderId,
    isPending: isPendingFaxesForFolderId,
    error: errorFaxesForFolderId,
  } = useFaxesForFolderId(section);

  let faxes: FaxInboxType[] | FaxOutboxType[] = [];

  // Calculer faxes seulement si les données sont disponibles
  if (!isPendingFaxesForFolderId && !errorFaxesForFolderId) {
    if (section === "Received faxes" && faxesInbox) {
      faxes = faxesInbox;
    } else if (section === "Sent" && faxesOutbox) {
      faxes = faxesOutbox;
    } else if (faxesForFolderId && faxesInbox) {
      const fileNames = faxesForFolderId.map((item) => item.FileName);
      faxes = faxesInbox?.filter((item) => fileNames.includes(item.FileName));
    }
  }

  const numberOfFaxes = faxes.length;
  const totalPages = Math.ceil((numberOfFaxes ?? 0) / FAXES_PER_PAGE);

  const handleSelectLabel = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    if (e.target.checked) {
      setSelectedLabelId(id);
    } else {
      setSelectedLabelId(null);
    }
  };

  const handleCloseFolderForm = () => {
    setSelectedLabelId(
      section === "Received faxes" || section === "Sent"
        ? null
        : parseInt(section)
    );
    setFolderFormVisible(false);
  };

  const handleAssignLabel = async () => {
    //1) On est dans received fax
    //Mettre une modale pour prévenir que les fax vont être déplacés si ils ont déjà été classés
    //Effacer tous les faxs sélectionnés de filed fax en batch si ils existent
    //Poster tous les faxs sélectionnés dans filed fax en batch
    //2) On est dans un folder
    //a) selectedLabelId est null
    //Mettre une modale pour prévenir que les fax vont être retirés du dossier
    //Effacer les filed faxes en batch
    //b) selectedLabelId est défini
    //Mettre une modale pour prévenir que les fax vont être déplacés du dossier
    //Modifier les filed faxes en batch
    if (
      section === "Received faxes" &&
      (await confirmAlert({
        title: "Confirmation",
        content:
          "Do you really want to assign the selected faxes to the chosen label? If any of the selected faxes are already filed, they will be moved to the new label. Proceed?",
      }))
    ) {
      //On récupère tous les filed faxes parmi les faxesSelectedIds
      try {
        //On récupère tous les filed faxes parmi les faxesSelectedIds
        setProgress(true);
        const filedFaxesToDelete: FiledFaxType[] = await xanoGet(
          "/filed_faxes_for_file_names",
          "staff",
          {
            file_names: faxesSelectedIds,
          }
        );
        const filedFaxesToDeleteIds = filedFaxesToDelete.map(({ id }) => id);
        //Effacer tous les faxs sélectionnés de filed fax en batch si ils existent
        await xanoDelete("/filed_faxes_batch", "staff", {
          filed_faxes_to_delete_ids: filedFaxesToDeleteIds,
        });
        //Poster tous les faxs sélectionnés dans filed fax en batch
        const filedFaxesToPost: Partial<FiledFaxType>[] = faxesSelectedIds.map(
          (id) => ({
            FileName: id,
            fax_folder_id: selectedLabelId as number,
            date_created: nowTZTimestamp(),
            created_by_id: user.id,
          })
        );
        await xanoPost("/filed_faxes_batch", "staff", {
          filed_faxes_to_post: filedFaxesToPost,
        });
        //SOCKET
        socket?.emit("message", {
          key: ["faxes for folder id", selectedLabelId?.toString()],
        });
        //TOAST
        toast.success("Fax(es) succesfully filed", { containerId: "A" });
        setFolderFormVisible(false);
        setProgress(false);
      } catch (err) {
        setProgress(false);
        if (err instanceof Error) {
          toast.error("Error filing fax(es)", { containerId: "A" });
        }
      }
    } else {
      //2) On est dans un folder
      //a) selectedLabelId est null
      //Mettre une modale pour prévenir que les fax vont être retirés du dossier
      //Effacer les filed faxes en batch
      //b) selectedLabelId est défini
      //Mettre une modale pour prévenir que les fax vont être déplacés du dossier
      //Modifier les filed faxes en batch
      if (
        !selectedLabelId &&
        (await confirmAlert({
          title: "Confirmation",
          content:
            "Do you really want to remove the selected faxes from the folder?",
        }))
      ) {
        try {
          setProgress(true);
          //Effacer les filed faxes en batch
          const filedFaxesToDelete: FiledFaxType[] = await xanoGet(
            "/filed_faxes_for_file_names",
            "staff",
            {
              file_names: faxesSelectedIds,
            }
          );
          const filedFaxesToDeleteIds = filedFaxesToDelete.map(({ id }) => id);

          //Effacer tous les faxs sélectionnés de filed fax en batch si ils existent
          await xanoDelete("/filed_faxes_batch", "staff", {
            filed_faxes_to_delete_ids: filedFaxesToDeleteIds,
          });
          socket?.emit("message", {
            key: ["faxes for folder id", selectedLabelId?.toString()],
          });
          socket?.emit("message", {
            key: ["faxes for folder id", section],
          });
          toast.success("Fax(es) successfully removed from folder", {
            containerId: "A",
          });
          setProgress(false);
          setFolderFormVisible(false);
          setSelectedLabelId(parseInt(section));
        } catch (err) {
          setProgress(false);
          if (err instanceof Error) {
            toast.error("Error removing fax(es) from folder", {
              containerId: "A",
            });
          }
        }
      } else if (
        selectedLabelId !== parseInt(section) &&
        (await confirmAlert({
          title: "Confirmation",
          content:
            "Do you really want to move the selected faxes from this folder?",
        }))
      ) {
        //Modifier les filed faxes en batch
        try {
          setProgress(true);
          const response: FiledFaxType[] = await xanoGet(
            "/filed_faxes_for_file_names",
            "staff",
            {
              file_names: faxesSelectedIds,
            }
          );
          const filedFaxesToPut: FiledFaxType[] = response.map((filedFax) => ({
            ...filedFax,
            fax_folder_id: selectedLabelId as number,
            date_created: nowTZTimestamp(),
            created_by_id: user.id,
          }));
          await xanoPut("/filed_faxes_batch", "staff", {
            filed_faxes_to_put: filedFaxesToPut,
          });
          socket?.emit("message", {
            key: ["faxes for folder id", selectedLabelId?.toString()],
          });
          socket?.emit("message", {
            key: ["faxes for folder id", section],
          });
          toast.success("Fax(es) successfully moved to folder", {
            containerId: "A",
          });
          setProgress(false);
          setFolderFormVisible(false);
          setSelectedLabelId(parseInt(section));
        } catch (err) {
          setProgress(false);
          if (err instanceof Error) {
            toast.error("Error moving fax(es) from folder", {
              containerId: "A",
            });
          }
        }
      } else {
        setFolderFormVisible(false);
      }
    }
  };

  return (
    <div className="fax__container">
      <FaxToolBar
        newVisible={newVisible}
        setNewVisible={setNewVisible}
        section={section}
        faxesSelectedIds={faxesSelectedIds}
        setFaxesSelectedIds={setFaxesSelectedIds}
        currentFaxId={currentFaxId}
        faxes={faxes?.slice(startIndex, endIndex) ?? []}
        selectAllVisible={selectAllVisible}
        setSelectAllVisible={setSelectAllVisible}
        rangeStart={rangeStart}
        initialRangeStart={initialRangeStart}
        initialRangeEnd={initialRangeEnd}
        rangeEnd={rangeEnd}
        setRangeStart={setRangeStart}
        setRangeEnd={setRangeEnd}
        search={search}
        setSearch={setSearch}
        all={all}
        setAll={setAll}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        numberOfFaxes={numberOfFaxes}
        totalPages={totalPages}
        setFolderFormVisible={setFolderFormVisible}
      />
      <div className="fax__content">
        <FaxLeftBar
          section={section}
          setSection={setSection}
          setCurrentFaxId={setCurrentFaxId}
          setFaxesSelectedIds={setFaxesSelectedIds}
          setSelectAllVisible={setSelectAllVisible}
          faxFolders={faxFolders}
          isLoadingFaxFolders={isLoadingFaxFolders}
          setSelectedLabelId={setSelectedLabelId}
        />
        <FaxBox
          section={section}
          newVisible={newVisible}
          setNewVisible={setNewVisible}
          faxesSelectedIds={faxesSelectedIds}
          setFaxesSelectedIds={setFaxesSelectedIds}
          currentFaxId={currentFaxId}
          currentCallerId={currentCallerId}
          setCurrentFaxId={setCurrentFaxId}
          setCurrentCallerId={setCurrentCallerId}
          faxes={faxes?.slice(startIndex, endIndex) ?? []}
          isPendingInbox={isPendingInbox}
          isPendingOutbox={isPendingOutbox}
          errorInbox={errorInbox}
          errorOutbox={errorOutbox}
          search={search}
        />
        {folderFormVisible && (
          <FakeWindow
            title="ASSIGN LABEL"
            width={300}
            height={400}
            x={(window.innerWidth - 300) / 2}
            y={(window.innerHeight - 400) / 2}
            color="#8EB4FA"
            setPopUpVisible={handleCloseFolderForm}
          >
            <div className="fax__assign-label">
              {faxFolders && faxFolders.length > 0 ? (
                <ul>
                  {faxFolders.map((folder) => (
                    <li key={folder.id}>
                      <Checkbox
                        label={folder.name}
                        onChange={(e) => handleSelectLabel(e, folder.id)}
                        checked={selectedLabelId === folder.id}
                        id={`folder-${folder.id}`}
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <div>No labels available</div>
              )}
              <div className="fax__assign-label-btns">
                <SaveButton
                  onClick={handleAssignLabel}
                  disabled={
                    !selectedLabelId && section === "Received faxes" && progress
                  }
                />
                <CancelButton
                  onClick={handleCloseFolderForm}
                  disabled={progress}
                />
              </div>
            </div>
          </FakeWindow>
        )}
      </div>
    </div>
  );
};

export default Faxes;
