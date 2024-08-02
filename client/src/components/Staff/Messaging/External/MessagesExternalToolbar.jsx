import { toast } from "react-toastify";

import xanoGet from "../../../../api/xanoCRUD/xanoGet";
import useSocketContext from "../../../../hooks/context/useSocketContext";
import useUserContext from "../../../../hooks/context/useUserContext";
import { useMessageExternalPut } from "../../../../hooks/reactquery/mutations/messagesMutations";
import { confirmAlert } from "../../../All/Confirm/ConfirmGlobal";

const MessagesExternalToolBar = ({
  search,
  setSearch,
  setNewVisible,
  messages,
  section,
  msgsSelectedIds,
  setMsgsSelectedIds,
  currentMsgId,
  setPrintVisible,
  selectAllVisible,
  setSelectAllVisible,
}) => {
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const messagePut = useMessageExternalPut();

  const handleChange = (e) => {
    setSearch(e.target.value);
  };
  const handleClickNew = (e) => {
    setNewVisible(true);
  };

  const handleSelectAll = () => {
    const allMessagesIds = messages.map(({ id }) => id);
    setMsgsSelectedIds(allMessagesIds);
    setSelectAllVisible(false);
  };

  const handleUnselectAll = () => {
    setMsgsSelectedIds([]);
    setSelectAllVisible(true);
  };

  const handleDeleteSelected = async () => {
    if (
      await confirmAlert({
        content: "Do you really want to delete selected messages ?",
      })
    ) {
      const msgsSelected = await xanoGet(
        "/messages_external_selected",
        "staff",
        {
          messages_ids: msgsSelectedIds,
        }
      );
      for (let message of msgsSelected) {
        const messageToPut = {
          ...message,
          deleted_by_staff_id: user.id,
          to_patients_ids: message.to_patients_ids.map(
            ({ to_patient_infos }) => to_patient_infos.id
          ),
        };
        // delete messageToPut.to_patient_infos; //From add-on
        // delete messageToPut.from_patient_infos; //From add-on
        messagePut.mutate(messageToPut, {
          onSuccess: () => {
            setNewVisible(false);
            setMsgsSelectedIds([]);
            setSelectAllVisible(true);
            toast.success("Message deleted successfully", {
              containerId: "A",
            });
          },
          onError: (error) => {
            toast.error(
              `Error: unable to delete message(s): ${error.message}`,
              {
                containerId: "A",
              }
            );
          },
        });
        //Remove one from the unread messages nbr counter
        if (user.unreadMessagesExternalNbr !== 0 && !message.read_by_staff_id) {
          const newUnreadMessagesExternalNbr =
            user.unreadMessagesExternalNbr - 1;
          socket.emit("message", {
            route: "USER",
            action: "update",
            content: {
              id: user.id,
              data: {
                ...user,
                unreadMessagesExternalNbr: newUnreadMessagesExternalNbr,
                unreadNbr:
                  newUnreadMessagesExternalNbr + user.unreadMessagesNbr,
              },
            },
          });
        }
      }
    }
  };

  const handleClickUndelete = async (e) => {
    const msgsSelected = await xanoGet("/messages_external_selected", "staff", {
      messages_ids: msgsSelectedIds,
    });
    for (let message of msgsSelected) {
      const messageToPut = {
        ...message,
        deleted_by_staff_id: 0,
        to_patients_ids: message.to_patients_ids.map(
          ({ to_patient_infos }) => to_patient_infos.id
        ),
      };
      // delete messageToPut.to_patient_infos; //From add-on
      // delete messageToPut.from_patient_infos; //From add-on
      messagePut.mutate(messageToPut, {
        onSuccess: () => {
          setMsgsSelectedIds([]);
          setSelectAllVisible(true);
          toast.success("Message undeleted successfully", {
            containerId: "A",
          });
        },
        onError: (error) => {
          toast.error(
            `Error: unable to undelete message(s): ${error.message}`,
            {
              containerId: "A",
            }
          );
        },
      });
      if (!messageToPut.read_by_staff_id) {
        socket.emit("message", {
          route: "UNREAD EXTERNAL",
          action: "update",
          content: {
            userId: user.id,
          },
        });
      }
    }
  };

  // const handleClickSearch = (e) => {};
  const handleClickPrint = () => {
    setPrintVisible(true);
  };

  return (
    <div className="messages-toolbar">
      <p className="messages-toolbar__title">Messaging</p>
      <input
        type="text"
        placeholder="Search in messages"
        value={search}
        onChange={handleChange}
      />
      <div className="messages-toolbar__btns">
        <button onClick={handleClickNew}>New</button>
        {section === "Deleted messages" && msgsSelectedIds.length !== 0 && (
          <button onClick={handleClickUndelete}>Undelete</button>
        )}
        {currentMsgId !== 0 && (
          <button onClick={handleClickPrint}>Print</button>
        )}
        {section !== "Deleted messages" &&
          currentMsgId === 0 &&
          msgsSelectedIds.length !== 0 && (
            <button onClick={handleDeleteSelected}>Delete Selected</button>
          )}
        {currentMsgId === 0 &&
          (selectAllVisible ? (
            <button onClick={handleSelectAll}>Select All</button>
          ) : (
            <button onClick={handleUnselectAll}>Unselect All</button>
          ))}
      </div>
    </div>
  );
};

export default MessagesExternalToolBar;
