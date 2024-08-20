import React from "react";
import { toast } from "react-toastify";
import xanoGet from "../../../../api/xanoCRUD/xanoGet";
import useSocketContext from "../../../../hooks/context/useSocketContext";
import useUserContext from "../../../../hooks/context/useUserContext";
import { useMessageExternalPut } from "../../../../hooks/reactquery/mutations/messagesMutations";
import { DemographicsType, MessageExternalType } from "../../../../types/api";
import { UserStaffType } from "../../../../types/app";
import Button from "../../../UI/Buttons/Button";
import { confirmAlert } from "../../../UI/Confirm/ConfirmGlobal";
import Input from "../../../UI/Inputs/Input";

type MessagesExternalToolBarProps = {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setNewVisible: React.Dispatch<React.SetStateAction<boolean>>;
  messages: MessageExternalType[];
  section: string;
  msgsSelectedIds: number[];
  setMsgsSelectedIds: React.Dispatch<React.SetStateAction<number[]>>;
  currentMsgId: number;
  setPrintVisible: React.Dispatch<React.SetStateAction<boolean>>;
  selectAllVisible: boolean;
  setSelectAllVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

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
}: MessagesExternalToolBarProps) => {
  const { user } = useUserContext() as { user: UserStaffType };
  const { socket } = useSocketContext();
  const messagePut = useMessageExternalPut();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        "staff",
        {
          messages_ids: msgsSelectedIds,
        }
      );
      for (const message of msgsSelected) {
        const messageToPut: MessageExternalType = {
          ...message,
          deleted_by_staff_id: user.id,
          to_patients_ids: (
            message.to_patients_ids as { to_patient_infos: DemographicsType }[]
          ).map(({ to_patient_infos }) => to_patient_infos.patient_id),
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
        //Remove one from the unread messages nbr counter
        if (user.unreadMessagesExternalNbr !== 0 && !message.read_by_staff_id) {
          const newUnreadMessagesExternalNbr =
            user.unreadMessagesExternalNbr - 1;
          socket?.emit("message", {
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

  const handleClickUndelete = async () => {
    const msgsSelected = await xanoGet("/messages_external_selected", "staff", {
      messages_ids: msgsSelectedIds,
    });
    for (const message of msgsSelected) {
      const messageToPut = {
        ...message,
        deleted_by_staff_id: 0,
        to_patients_ids: (
          message.to_patients_ids as { to_patient_infos: DemographicsType }[]
        ).map(({ to_patient_infos }) => to_patient_infos.patient_id),
      };
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
        socket?.emit("message", {
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
        placeholder="Search in messages"
      />
      <div className="messages-toolbar__btns">
        <Button onClick={handleClickNew} label={"New"} />
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

export default MessagesExternalToolBar;
