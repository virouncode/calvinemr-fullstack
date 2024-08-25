import { DemographicsType, MessageExternalType } from "../../types/api";

export const getInboxMessagesExternal = (
  messages: MessageExternalType[],
  userType: string,
  userId: number
) => {
  //Les messages qui sont à destination de l'user et qui ne sont pas deleted
  let messagesToUserNonDeleted: MessageExternalType[] = [];

  if (userType === "staff") {
    messagesToUserNonDeleted = messages.filter(
      (message) =>
        message.to_staff_id &&
        message.to_staff_id === userId &&
        message.deleted_by_staff_id !== userId
    );
  } else {
    messagesToUserNonDeleted = messages.filter(
      (message) =>
        (message.to_patients_ids as { to_patient_infos: DemographicsType }[])
          .map(({ to_patient_infos }) => to_patient_infos.patient_id)
          .includes(userId) &&
        !(message.deleted_by_patients_ids as number[]).includes(userId)
    );
  }
  return messagesToUserNonDeleted;
};

export const getSentMessagesExternal = (
  messages: MessageExternalType[],
  userType: string,
  userId: number
) => {
  //Les messages envoyés par le user non deleted

  let messagesSentByUserNonDeleted: MessageExternalType[] = [];
  if (userType === "staff") {
    messagesSentByUserNonDeleted = messages.filter(
      (message) =>
        message.from_staff_id &&
        message.from_staff_id === userId &&
        message.deleted_by_staff_id !== userId
    );
  } else {
    messagesSentByUserNonDeleted = messages.filter(
      (message) =>
        message.from_patient_id &&
        message.from_patient_id === userId &&
        !(message.deleted_by_patients_ids as number[]).includes(userId)
    );
  }
  return messagesSentByUserNonDeleted;
};

export const getDeletedMessagesExternal = (
  messages: MessageExternalType[],
  userType: string,
  userId: number
) => {
  let messagesDeletedByUser: MessageExternalType[] = [];
  if (userType === "staff") {
    messagesDeletedByUser = messages.filter(
      (message) => message.deleted_by_staff_id === userId
    );
  } else {
    messagesDeletedByUser = messages.filter((message) =>
      (message.deleted_by_patients_ids as number[]).includes(userId)
    );
  }
  return messagesDeletedByUser;
};

export const filterAndSortExternalMessages = (
  section: string,
  messages: MessageExternalType[],
  userType: string,
  userId: number
) => {
  let newMessages: MessageExternalType[] = [];
  switch (section) {
    case "Received messages":
      newMessages = getInboxMessagesExternal(messages, userType, userId);
      break;
    case "Sent messages":
      newMessages = getSentMessagesExternal(messages, userType, userId);
      break;
    case "Deleted messages":
      newMessages = getDeletedMessagesExternal(messages, userType, userId);
      break;
    default:
      break;
  }
  return newMessages;
};
