import { toast } from "react-toastify";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import useSocketContext from "../../../hooks/context/useSocketContext";
import useUserContext from "../../../hooks/context/useUserContext";
import { useMessageExternalPut } from "../../../hooks/reactquery/mutations/messagesMutations";
import Button from "../../UI/Buttons/Button";
import { confirmAlert } from "../../UI/Confirm/ConfirmGlobal";
import Input from "../../UI/Inputs/Input";

const MessagesPatientToolBar = ({
  search,
  setSearch,
  setNewVisible,
  section,
  msgsSelectedIds,
  setMsgsSelectedIds,
  currentMsgId,
  messages,
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
  const handleClickNew = () => {
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
        "patient",
        {
          messages_ids: msgsSelectedIds,
        }
      );
      for (let message of msgsSelected) {
        const messageToPut = {
          ...message,
          deleted_by_patients_ids: [
            ...message.deleted_by_patients_ids,
            user.id,
          ],
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
        if (
          user.unreadNbr !== 0 &&
          !message.read_by_patients_ids.includes(user.id)
        ) {
          const newUnreadNbr = user.unreadNbr - 1;
          socket.emit("message", {
            route: "USER",
            action: "update",
            content: {
              id: user.id,
              data: {
                ...user,
                unreadNbr: newUnreadNbr,
              },
            },
          });
        }
      }
    }
  };

  const handleClickUndelete = async () => {
    const msgsSelected = await xanoGet(
      "/messages_external_selected",
      "patient",

      {
        messages_ids: msgsSelectedIds,
      }
    );
    for (let message of msgsSelected) {
      const messageToPut = {
        ...message,
        deleted_by_patients_ids: message.deleted_by_patients_ids.filter(
          (id) => id !== user.id
        ),
        to_patients_ids: message.to_patients_ids.map(
          ({ to_patient_infos }) => to_patient_infos.id
        ),
      };
      // delete messageToPut.to_patient_infos; //From Add-on
      // delete messageToPut.from_patient_infos; //From Add-on
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
      if (!message.read_by_patients_ids.includes(user.id)) {
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
      <Input
        value={search}
        onChange={handleChange}
        placeholder="Search in messages..."
      />
      <div className="messages-toolbar__btns">
        <Button onClick={handleClickNew} label="New" />
        {section === "Deleted messages" && msgsSelectedIds.length !== 0 && (
          <Button onClick={handleClickUndelete} label="Undelete" />
        )}
        {currentMsgId !== 0 && (
          <Button onClick={handleClickPrint} label="Print" />
        )}
        {section !== "Deleted messages" &&
          currentMsgId === 0 &&
          msgsSelectedIds.length !== 0 && (
            <Button onClick={handleDeleteSelected} label="Delete Selected" />
          )}
        {currentMsgId === 0 &&
          (selectAllVisible ? (
            <Button onClick={handleSelectAll} label="Select All" />
          ) : (
            <Button onClick={handleUnselectAll} label="Unselect All" />
          ))}
      </div>
    </div>
  );
};

export default MessagesPatientToolBar;
