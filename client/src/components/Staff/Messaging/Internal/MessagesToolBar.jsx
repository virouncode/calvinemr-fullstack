import { toast } from "react-toastify";
import xanoGet from "../../../../api/xanoCRUD/xanoGet";
import useSocketContext from "../../../../hooks/context/useSocketContext";
import useUserContext from "../../../../hooks/context/useUserContext";
import {
  useMessagePut,
  useTodoDelete,
} from "../../../../hooks/reactquery/mutations/messagesMutations";
import { confirmAlert } from "../../../All/Confirm/ConfirmGlobal";

const MessagesToolBar = ({
  search,
  setSearch,
  newVisible,
  setNewVisible,
  messages,
  section,
  msgsSelectedIds,
  setMsgsSelectedIds,
  currentMsgId,
  setPrintVisible,
  selectAllVisible,
  setSelectAllVisible,
  newTodoVisible,
  setNewTodoVisible,
}) => {
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const messagePut = useMessagePut(user.id, section);
  const todoDelete = useTodoDelete(user.id, section);

  const handleChange = (e) => {
    setSearch(e.target.value);
  };
  const handleClickNew = (e) => {
    if (section === "To-dos") {
      setNewTodoVisible(true);
    } else {
      setNewVisible(true);
    }
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
        content: `Do you really want to delete selected ${
          section === "To-dos"
            ? "to-dos (this action is irreversible)"
            : "messages"
        }?`,
      })
    ) {
      if (section === "To-dos") {
        for (let messageId of msgsSelectedIds) {
          const message = messages.find((msg) => msg.id === messageId);
          todoDelete.mutate(messageId, {
            onSuccess: () => {
              setNewVisible(false);
              setMsgsSelectedIds([]);
              setSelectAllVisible(true);
            },
          });
          if (user.unreadTodosNbr !== 0 && !message.read) {
            const newUnreadTodosNbr = user.unreadTodosNbr - 1;
            socket.emit("message", {
              route: "USER",
              action: "update",
              content: {
                id: user.id,
                data: {
                  ...user,
                  unreadTodosNbr: newUnreadTodosNbr,
                  unreadNbr:
                    newUnreadTodosNbr +
                    user.unreadMessagesExternalNbr +
                    user.unreadMessagesNbr,
                },
              },
            });
          }
        }
      } else {
        let msgsSelected;
        try {
          msgsSelected = await xanoGet("/messages_selected", "staff", {
            messages_ids: msgsSelectedIds,
          });
        } catch (err) {
          toast.error(`Error: unable to delete message(s): ${err.message}`, {
            containerId: "A",
          });
        }
        for (let message of msgsSelected) {
          const messageToPut = {
            ...message,
            deleted_by_staff_ids: [...message.deleted_by_staff_ids, user.id],
          };
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
          if (
            user.unreadMessagesNbr !== 0 &&
            !messageToPut.read_by_staff_ids?.includes(user.id)
          ) {
            const newUnreadMessagesNbr = user.unreadMessagesNbr - 1;
            socket.emit("message", {
              route: "USER",
              action: "update",
              content: {
                id: user.id,
                data: {
                  ...user,
                  unreadMessagesNbr: newUnreadMessagesNbr,
                  unreadNbr:
                    newUnreadMessagesNbr +
                    user.unreadMessagesExternalNbr +
                    user.unreadTodosNbr,
                },
              },
            });
          }
        }
      }
    }
  };

  const handleClickUndelete = async (e) => {
    const msgsSelected = await xanoGet("/messages_selected", "staff", {
      messages_ids: msgsSelectedIds,
    });

    for (let message of msgsSelected) {
      const messageToPut = {
        ...message,
        deleted_by_staff_ids: message.deleted_by_staff_ids.filter(
          (id) => id !== user.id
        ),
      };
      delete messageToPut.patient_infos;
      messagePut.mutate(messageToPut, {
        onSuccess: () => {
          setMsgsSelectedIds([]);
          setSelectAllVisible(true);
          toast.success("Message undeleted successfully", {
            containerId: "A",
          });
          if (!messageToPut.read_by_staff_ids?.includes(user.id)) {
            socket.emit("message", {
              route: "UNREAD",
              action: "update",
              content: {
                userId: user.id,
              },
            });
          }
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
    }
  };

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
        id="search"
      />
      <div className="messages-toolbar__btns">
        <button
          onClick={handleClickNew}
          disabled={
            (section === "To-dos" && newTodoVisible) ||
            (section !== "To-dos" && newVisible)
          }
        >
          New
        </button>
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
            <button onClick={handleSelectAll} disabled={!messages}>
              Select All
            </button>
          ) : (
            <button onClick={handleUnselectAll}>Unselect All</button>
          ))}
      </div>
    </div>
  );
};

export default MessagesToolBar;
